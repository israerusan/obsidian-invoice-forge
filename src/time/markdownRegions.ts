// Pure markdown region filtering, split out from VaultScanner so the
// frontmatter/code-fence exclusion (the guard that keeps example #billable lines
// in docs from being billed, and keeps real work from being swallowed) can be
// unit-tested without an Obsidian vault.

export interface ContentLine {
	index: number; // 0-based line number in the original file
	text: string;
}

const ISO_DATE_RE = /(\d{4}-\d{2}-\d{2})/;

// Extract a `date:` value (as an ISO YYYY-MM-DD) from a note's leading YAML
// frontmatter, reading from the RAW content string. The scanner reads content
// fresh (cachedRead) but Obsidian's metadataCache can lag a just-saved edit, so
// resolving the entry date from the cache would silently mis-date (and drop) a
// brand-new note's billable lines. Returns null when there's no frontmatter date.
export function frontmatterDate(content: string): string | null {
	const lines = content.split(/\r?\n/);
	if (lines[0]?.trim() !== "---") return null;
	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim() === "---") break; // end of frontmatter
		const m = /^date\s*:\s*(.+)$/.exec(lines[i].trim());
		if (m) {
			const iso = ISO_DATE_RE.exec(m[1]);
			return iso ? iso[1] : null;
		}
	}
	return null;
}

// Return the lines that are eligible to be scanned for billable entries: every
// line EXCEPT YAML frontmatter and fenced code blocks, each paired with its
// original line index (needed to mark the exact source line later).
export function contentLines(content: string): ContentLine[] {
	const lines = content.split(/\r?\n/);

	// Frontmatter counts ONLY when line 0 is `---` AND a closing `---` exists.
	// A leading thematic-break/divider or truncated frontmatter must NOT flip us
	// into "skip forever" mode (which would silently drop every line below it);
	// Obsidian treats unterminated frontmatter as no frontmatter too.
	const hasFrontmatter = lines[0]?.trim() === "---" && lines.slice(1).some((l) => l.trim() === "---");

	const out: ContentLine[] = [];
	let inFrontmatter = false;
	// The OPEN fence's delimiter char + length. A fence closes only on a matching
	// delimiter (same char, length >= the opener), so a `~~~` line inside a ```
	// block (or vice versa) is treated as content, not a spurious close/reopen.
	let fence: { char: string; len: number } | null = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (i === 0 && hasFrontmatter && line.trim() === "---") {
			inFrontmatter = true;
			continue;
		}
		if (inFrontmatter) {
			if (line.trim() === "---") inFrontmatter = false;
			continue;
		}
		const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
		if (fence) {
			if (fenceMatch && fenceMatch[1][0] === fence.char && fenceMatch[1].length >= fence.len) {
				fence = null;
			}
			continue;
		}
		if (fenceMatch) {
			fence = { char: fenceMatch[1][0], len: fenceMatch[1].length };
			continue;
		}
		out.push({ index: i, text: line });
	}
	return out;
}
