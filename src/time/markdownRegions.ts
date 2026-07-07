// Pure markdown region filtering, split out from VaultScanner so the
// frontmatter/code-fence exclusion (the guard that keeps example #billable lines
// in docs from being billed, and keeps real work from being swallowed) can be
// unit-tested without an Obsidian vault.

export interface ContentLine {
	index: number; // 0-based line number in the original file
	text: string;
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
