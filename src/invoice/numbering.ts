// Invoice number templating.
// Tokens: {YYYY} {YY} {MM} {DD} {seq} {seq:N} (zero-padded to N digits).

// Cap {seq:N} padding so a mistyped template like {seq:100000000} can't allocate a
// giant string and freeze rendering. 12 digits is far past any real sequence.
const MAX_SEQ_PAD = 12;

export function formatInvoiceNumber(template: string, seq: number, date: Date): string {
	const yyyy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");

	return template
		.replace(/\{YYYY\}/g, yyyy)
		.replace(/\{YY\}/g, yyyy.slice(-2))
		.replace(/\{MM\}/g, mm)
		.replace(/\{DD\}/g, dd)
		.replace(/\{seq:(\d+)\}/g, (_, n: string) => String(seq).padStart(Math.min(Number(n), MAX_SEQ_PAD), "0"))
		.replace(/\{seq\}/g, String(seq));
}
