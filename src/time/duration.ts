// Pure duration parsing. Returns hours (number) or null when nothing parses.
// Supported forms: "2.5h", "2h", "45m", "90m", "1h30m", "1h 30m", and ranges "09:00-11:30".

const HM_RE = /(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+)\s*m)?/i;
const RANGE_RE = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/;

export function parseTimeRange(token: string): number | null {
	const m = RANGE_RE.exec(token.trim());
	if (!m) return null;
	const [, h1, m1, h2, m2] = m;
	let start = Number(h1) * 60 + Number(m1);
	let end = Number(h2) * 60 + Number(m2);
	if (Number(m1) > 59 || Number(m2) > 59) return null;
	if (end < start) end += 24 * 60; // crosses midnight
	const minutes = end - start;
	if (minutes <= 0) return null;
	return round2(minutes / 60);
}

export function parseDuration(token: string): number | null {
	const trimmed = token.trim();
	if (!trimmed) return null;

	const range = parseTimeRange(trimmed);
	if (range !== null) return range;

	// Bare number means hours (e.g. "2" or "2.5").
	if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
		const n = Number(trimmed);
		return n > 0 ? round2(n) : null;
	}

	const m = HM_RE.exec(trimmed);
	if (!m || (m[1] === undefined && m[2] === undefined)) return null;
	const hours = m[1] !== undefined ? Number(m[1]) : 0;
	const mins = m[2] !== undefined ? Number(m[2]) : 0;
	const total = hours + mins / 60;
	return total > 0 ? round2(total) : null;
}

export function round2(n: number): number {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
