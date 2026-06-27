// Currency formatting with a safe fallback when the ISO code is unknown.
export function formatMoney(amount: number, currency: string): string {
	const code = (currency || "USD").toUpperCase();
	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: code,
		}).format(amount);
	} catch {
		return `${code} ${amount.toFixed(2)}`;
	}
}

export function round2(n: number): number {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
