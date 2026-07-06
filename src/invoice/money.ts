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
	if (!Number.isFinite(n)) return 0;
	// Sign-aware so negative half-values (e.g. a credit line) round symmetrically
	// with positives: round2(-1.005) === -1.01, matching round2(1.005) === 1.01.
	const sign = n < 0 ? -1 : 1;
	return (sign * Math.round((Math.abs(n) + Number.EPSILON) * 100)) / 100;
}
