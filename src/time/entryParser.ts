import { parseDuration } from "./duration";

export interface ParsedEntry {
	clientId: string | null;
	clientName: string;
	date: string; // ISO YYYY-MM-DD
	hours: number;
	rate: number | null;
	description: string;
}

export interface ParseContext {
	defaultDate: string; // ISO date used when the line carries no explicit date
	clientNames: Record<string, string>; // slug -> display name, for #client/<slug> resolution
}

const BILLABLE_RE = /(^|\s)#billable\b/i;
const CLIENT_TAG_RE = /(^|\s)#client\/([A-Za-z0-9_-]+)/;
const INLINE_FIELD_RE = /\[([a-z]+)::\s*([^\]]+)\]/gi;
const TIME_RANGE_RE = /\b\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\b/;
const DURATION_RE = /\b\d+(?:\.\d+)?h(?:\s*\d+m)?\b|\b\d+m\b/i;
const DATE_RE = /\b(\d{4}-\d{2}-\d{2})\b/;

// Parse a single markdown line into a billable entry, or null if it isn't one.
export function parseBillableLine(rawLine: string, ctx: ParseContext): ParsedEntry | null {
	const line = rawLine.replace(/^[\s>*+-]*(?:\[[ xX/-]\]\s*)?/, ""); // strip list/checkbox markers
	if (!BILLABLE_RE.test(rawLine)) return null;

	let working = line;

	// Inline fields: [client:: x] [rate:: 90] [date:: 2026-06-25] [time:: 2.5h] [hours:: 2]
	const fields: Record<string, string> = {};
	working = working.replace(INLINE_FIELD_RE, (_, key: string, value: string) => {
		fields[key.toLowerCase()] = value.trim();
		return " ";
	});

	// Client: prefer #client/<slug>, then [client:: Name].
	let clientId: string | null = null;
	let clientName = "";
	const clientTag = CLIENT_TAG_RE.exec(working);
	if (clientTag) {
		clientId = clientTag[2].toLowerCase();
		clientName = ctx.clientNames[clientId] ?? clientTag[2];
		working = working.replace(clientTag[0], " ");
	} else if (fields.client) {
		clientName = fields.client;
	}

	// Date: [date:: ...] field, else a bare ISO date on the line, else the context default.
	let date = ctx.defaultDate;
	if (fields.date && DATE_RE.test(fields.date)) {
		date = (DATE_RE.exec(fields.date) as RegExpExecArray)[1];
	} else {
		const inline = DATE_RE.exec(working);
		if (inline) {
			date = inline[1];
			working = working.replace(inline[0], " ");
		}
	}

	// Rate override.
	let rate: number | null = null;
	if (fields.rate !== undefined) {
		const r = Number(fields.rate.replace(/[^0-9.]/g, ""));
		if (!Number.isNaN(r) && r > 0) rate = r;
	}

	// Duration: time/hours field first, then a range or duration token on the line.
	let hours: number | null = null;
	const durField = fields.time ?? fields.hours ?? fields.duration;
	if (durField) {
		hours = parseDuration(durField);
	}
	if (hours === null) {
		const range = TIME_RANGE_RE.exec(working);
		if (range) {
			hours = parseDuration(range[0]);
			working = working.replace(range[0], " ");
		}
	}
	if (hours === null) {
		const dur = DURATION_RE.exec(working);
		if (dur) {
			hours = parseDuration(dur[0]);
			working = working.replace(dur[0], " ");
		}
	}
	if (hours === null || hours <= 0) return null;

	// Description: whatever's left after removing tags and tokens.
	const description = working
		.replace(/(^|\s)#billable\b/gi, " ")
		.replace(/(^|\s)#[A-Za-z0-9_\/-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!clientName) clientName = "Unassigned";

	return { clientId, clientName, date, hours, rate, description };
}
