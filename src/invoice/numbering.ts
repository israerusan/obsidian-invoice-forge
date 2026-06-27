// Invoice number templating.
// Tokens: {YYYY} {YY} {MM} {DD} {seq} {seq:N} (zero-padded to N digits).
export function formatInvoiceNumber(template: string, seq: number, date: Date): string {
	const yyyy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");

	return template
		.replace(/\{YYYY\}/g, yyyy)
		.replace(/\{YY\}/g, yyyy.slice(-2))
		.replace(/\{MM\}/g, mm)
		.replace(/\{DD\}/g, dd)
		.replace(/\{seq:(\d+)\}/g, (_, n: string) => String(seq).padStart(Number(n), "0"))
		.replace(/\{seq\}/g, String(seq));
}
