import { App, TFile, getAllTags } from "obsidian";
import type { Client, TimeEntry } from "../model/types";
import { parseBillableLine, type ParseContext } from "./entryParser";
import { toISODate } from "../invoice/InvoiceBuilder";

const DAILY_NOTE_DATE_RE = /(\d{4}-\d{2}-\d{2})/;

// Scan every markdown note for #billable list items and return resolved time entries.
export class VaultScanner {
	constructor(private app: App) {}

	async scan(clients: Client[]): Promise<TimeEntry[]> {
		const clientNames: Record<string, string> = {};
		for (const c of clients) clientNames[c.id] = c.name;

		const entries: TimeEntry[] = [];
		const files = this.app.vault.getMarkdownFiles();

		for (const file of files) {
			// Cheap pre-filter: skip notes that don't mention the billable tag at all.
			const cache = this.app.metadataCache.getFileCache(file);
			const tags = cache ? getAllTags(cache) ?? [] : [];
			const content = await this.app.vault.cachedRead(file);
			if (!/#billable/i.test(content) && !tags.includes("#billable")) continue;

			const defaultDate = this.resolveNoteDate(file, cache);
			const ctx: ParseContext = { defaultDate, clientNames };

			const fileLines = content.split(/\r?\n/);
			for (let i = 0; i < fileLines.length; i++) {
				const parsed = parseBillableLine(fileLines[i], ctx);
				if (!parsed) continue;
				entries.push({
					clientId: parsed.clientId,
					clientName: parsed.clientName,
					date: parsed.date,
					hours: parsed.hours,
					rate: parsed.rate,
					description: parsed.description,
					sourcePath: file.path,
					line: i,
				});
			}
		}
		return entries;
	}

	// Date priority: frontmatter `date` → daily-note date in filename → file mtime.
	private resolveNoteDate(file: TFile, cache: ReturnType<App["metadataCache"]["getFileCache"]>): string {
		const fm = cache?.frontmatter as Record<string, unknown> | undefined;
		const fmDate = fm?.date;
		if (typeof fmDate === "string" && DAILY_NOTE_DATE_RE.test(fmDate)) {
			return (DAILY_NOTE_DATE_RE.exec(fmDate) as RegExpExecArray)[1];
		}
		const fromName = DAILY_NOTE_DATE_RE.exec(file.basename);
		if (fromName) return fromName[1];
		return toISODate(new Date(file.stat.mtime));
	}
}
