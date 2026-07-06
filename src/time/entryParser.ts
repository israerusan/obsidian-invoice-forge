import { parseDuration } from "./duration";
import { isValidISODate } from "../invoice/InvoiceBuilder";

export interface ParsedEntry {
	clientId: string | null;
	clientName: string;
	date: string; // ISO YYYY-MM-DD
	hours: number;
	rate: number | null;
	description: string;
}

export const INVOICE_FIELD = "invoice";

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

	// A source-line marker is portable and prevents accidental double billing.
	if (fields[INVOICE_FIELD]) return null;

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

	// Date: [date:: ...] field, else a standalone ISO date token on the line, else
	// the context default. A date embedded in prose (an alphabetic word on BOTH
	// sides, e.g. "fixed bug 2026-01-15 regression") is NOT treated as the entry
	// date — it's a reference, and consuming it would mis-period the invoice and
	// mangle the description.
	let date = ctx.defaultDate;
	const fieldDate = fields.date ? DATE_RE.exec(fields.date) : null;
	if (fieldDate && isValidISODate(fieldDate[1])) {
		date = fieldDate[1];
	} else {
		const inline = DATE_RE.exec(working);
		if (inline && isValidISODate(inline[1]) && !isProseDate(working, inline)) {
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
		.replace(/(^|\s)#[A-Za-z0-9_/-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!clientName) clientName = "Unassigned";

	return { clientId, clientName, date, hours, rate, description };
}

// A date is "prose" (not the entry date) when a plain alphabetic WORD sits
// directly on both sides of it (e.g. "fixed bug 2026-01-15 regression"). A
// metadata date instead neighbors a token (a #tag, an h/m duration) or a line
// boundary on at least one side. The neighbor tokens are matched whole so a
// trailing "#billable"/"#client/…" tag is never mistaken for a prose word.
function isProseDate(working: string, match: RegExpExecArray): boolean {
	const before = working.slice(0, match.index).trimEnd();
	const after = working.slice(match.index + match[0].length).trimStart();
	const prevToken = before.split(/\s+/).pop() ?? "";
	const nextToken = after.split(/\s+/)[0] ?? "";
	const isPlainWord = (token: string): boolean => /^[A-Za-z]{2,}$/.test(token);
	return isPlainWord(prevToken) && isPlainWord(nextToken);
}

export function markLineBilled(rawLine: string, invoiceNumber: string): string {
	if (!BILLABLE_RE.test(rawLine) || new RegExp(`\\[${INVOICE_FIELD}::`, "i").test(rawLine)) return rawLine;
	return `${rawLine.trimEnd()} [${INVOICE_FIELD}:: ${invoiceNumber}]`;
}

// Remove a specific invoice marker from a line — used to roll back marks when
// invoice-note creation fails after entries were already marked.
export function unmarkLineBilled(rawLine: string, invoiceNumber: string): string {
	const re = new RegExp(`\\s*\\[${INVOICE_FIELD}::\\s*${escapeRegExp(invoiceNumber)}\\s*\\]`, "gi");
	return rawLine.replace(re, "");
}

// Confirm a line is byte-for-byte the exact source line captured at scan time
// (ignoring only trailing whitespace). Comparing the whole line — not just
// hours+description — means ANY post-preview change (client, date, rate, hours,
// text, or an added marker) is treated as drift, so we never mark a line the
// user has since edited. This guards against both index drift and silent
// content changes that would otherwise cause a wrong or double bill.
export function lineMatchesEntry(rawLine: string, entryRaw: string): boolean {
	return rawLine.trimEnd() === entryRaw.trimEnd();
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
