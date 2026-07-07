import { App, TFile } from "obsidian";
import type { Client, TimeEntry } from "../model/types";
import { lineMatchesEntry, markLineBilled, parseBillableLine, unmarkLineBilled, type ParseContext } from "./entryParser";
import { contentLines, frontmatterDate } from "./markdownRegions";
import { toISODate } from "../invoice/InvoiceBuilder";

const DAILY_NOTE_DATE_RE = /(\d{4}-\d{2}-\d{2})/;

// A #billable line that couldn't be parsed (e.g. missing/typo'd time). Surfaced
// so tagged work never silently disappears from an invoice.
export interface UnparsedLine {
	path: string;
	line: number;
	text: string;
}

// Scan every markdown note for #billable list items and return resolved time entries.
export class VaultScanner {
	constructor(private app: App) {}

	// Populated by the most recent scan(): #billable lines that looked billable
	// but didn't parse. Callers can warn the user instead of losing the work.
	lastUnparsed: UnparsedLine[] = [];

	async scan(clients: Client[]): Promise<TimeEntry[]> {
		const clientNames: Record<string, string> = {};
		for (const c of clients) clientNames[c.id] = c.name;

		const entries: TimeEntry[] = [];
		const unparsed: UnparsedLine[] = [];
		const files = this.app.vault.getMarkdownFiles();

		for (const file of files) {
			// Read the file and pre-filter on its actual content. The metadata
			// cache can be stale or absent right after an edit, so relying on it to
			// EXCLUDE files could silently miss just-added billable work. cachedRead
			// is served from Obsidian's in-memory cache, so this stays cheap; code
			// blocks / frontmatter are excluded per-line below, not here.
			const content = await this.app.vault.cachedRead(file);
			if (!/#billable/i.test(content)) continue;

			const cache = this.app.metadataCache.getFileCache(file);
			const defaultDate = this.resolveNoteDate(file, cache, content);
			const ctx: ParseContext = { defaultDate, clientNames };

			// Scan only real content lines — frontmatter and fenced code blocks are
			// excluded (pure, unit-tested in markdownRegions) so example #billable
			// lines in docs aren't billed and real work below them isn't swallowed.
			for (const { index: i, text: line } of contentLines(content)) {
				const parsed = parseBillableLine(line, ctx);
				if (!parsed) {
					// Flag a #billable line that didn't parse and isn't already invoiced.
					if (/(^|\s)#billable(?![\w/-])/i.test(line) && !/\[invoice::/i.test(line)) {
						unparsed.push({ path: file.path, line: i, text: line.trim() });
					}
					continue;
				}
				entries.push({
					clientId: parsed.clientId,
					clientName: parsed.clientName,
					date: parsed.date,
					hours: parsed.hours,
					rate: parsed.rate,
					description: parsed.description,
					sourcePath: file.path,
					line: i,
					raw: line,
				});
			}
		}
		this.lastUnparsed = unparsed;
		return entries;
	}

	private groupByPath(entries: TimeEntry[]): Map<string, TimeEntry[]> {
		const byPath = new Map<string, TimeEntry[]>();
		for (const entry of entries) {
			const group = byPath.get(entry.sourcePath) ?? [];
			group.push(entry);
			byPath.set(entry.sourcePath, group);
		}
		return byPath;
	}

	// Mark every source line billed, transactionally. Phase 1 validates that
	// every line still exists AND still matches its entry (so drift can't mark
	// the wrong line); nothing is written unless the whole set validates. Phase 2
	// applies the marks per file (each file atomic via vault.process) and rolls
	// back any files already written if a later file fails — so we never end up
	// with some entries billed and others not.
	async markBilled(entries: TimeEntry[], invoiceNumber: string): Promise<void> {
		const byPath = this.groupByPath(entries);

		// Phase 1: validate everything up front (no writes).
		for (const [path, fileEntries] of byPath) {
			const file = this.app.vault.getAbstractFileByPath(path);
			if (!(file instanceof TFile)) {
				throw new Error(`Source note no longer exists: ${path}. Nothing was billed — rescan and try again.`);
			}
			const lines = (await this.app.vault.cachedRead(file)).split(/\r?\n/);
			for (const entry of fileEntries) {
				if (entry.line >= lines.length || !lineMatchesEntry(lines[entry.line], entry.raw)) {
					throw new Error(`A billable line changed in ${path}. Nothing was billed — rescan and create the invoice again.`);
				}
			}
		}

		// Phase 2: apply, tracking written files so we can roll back on failure.
		const written: string[] = [];
		try {
			for (const [path, fileEntries] of byPath) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (!(file instanceof TFile)) throw new Error(`Source note no longer exists: ${path}`);
				await this.app.vault.process(file, (content) => {
					const lines = content.split(/\r?\n/);
					for (const entry of fileEntries) {
						// Re-verify against the freshest content before each mark.
						if (entry.line >= lines.length || !lineMatchesEntry(lines[entry.line], entry.raw)) {
							throw new Error(`A billable line changed in ${path} during billing.`);
						}
						lines[entry.line] = markLineBilled(lines[entry.line], invoiceNumber);
					}
					return lines.join("\n");
				});
				written.push(path);
			}
		} catch (error) {
			const failedRollback = await this.unmarkPaths(written, invoiceNumber);
			if (failedRollback.length) {
				throw new Error(
					`${error instanceof Error ? error.message : String(error)} (could not fully undo markers in: ${failedRollback.join(", ")} — check these notes).`
				);
			}
			throw error;
		}
	}

	// Remove an invoice's markers from the given source notes (rollback / undo).
	// Returns the paths that could NOT be cleaned so the caller can surface them.
	async unmarkBilled(entries: TimeEntry[], invoiceNumber: string): Promise<string[]> {
		return this.unmarkPaths([...this.groupByPath(entries).keys()], invoiceNumber);
	}

	private async unmarkPaths(paths: string[], invoiceNumber: string): Promise<string[]> {
		const failed: string[] = [];
		for (const path of paths) {
			const file = this.app.vault.getAbstractFileByPath(path);
			if (!(file instanceof TFile)) continue;
			try {
				await this.app.vault.process(file, (content) =>
					content
						.split(/\r?\n/)
						.map((line) => unmarkLineBilled(line, invoiceNumber))
						.join("\n")
				);
			} catch {
				// Best-effort rollback; report (don't mask) so the user can fix it.
				failed.push(path);
			}
		}
		return failed;
	}

	// Date priority: frontmatter `date` → daily-note date in filename → file mtime.
	// The frontmatter date is read from the FRESH content first (the metadataCache
	// can lag a just-saved edit and would otherwise mis-date a new note to mtime),
	// falling back to the cache for notes already parsed by Obsidian.
	private resolveNoteDate(
		file: TFile,
		cache: ReturnType<App["metadataCache"]["getFileCache"]>,
		content: string
	): string {
		const fromContent = frontmatterDate(content);
		if (fromContent) return fromContent;
		const fmDate: unknown = cache?.frontmatter?.date;
		if (typeof fmDate === "string" && DAILY_NOTE_DATE_RE.test(fmDate)) {
			return (DAILY_NOTE_DATE_RE.exec(fmDate) as RegExpExecArray)[1];
		}
		const fromName = DAILY_NOTE_DATE_RE.exec(file.basename);
		if (fromName) return fromName[1];
		return toISODate(new Date(file.stat.mtime));
	}
}
