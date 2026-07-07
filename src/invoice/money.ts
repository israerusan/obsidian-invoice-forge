// Currency formatting with a safe fallback when the ISO code is unknown.
export function formatMoney(amount: number, currency: string): string {
	const code = (currency || "USD").toUpperCase();
	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: code,
		}).format(amount);
	} catch {
		return `${code} ${amount.toFixed(currencyFractionDigits(currency))}`;
	}
}

// How many minor-unit digits a currency prints: 2 for USD/EUR, 0 for JPY/KRW/…,
// 3 for some (KWD/BHD). Invoice arithmetic must round to THIS scale so the stored
// amounts match what formatMoney displays — otherwise, e.g. for JPY, line items
// rounded to 2 decimals would render (whole-unit) as a sum that disagrees with
// the rounded subtotal/total. Falls back to 2 for an unknown code.
export function currencyFractionDigits(currency: string): number {
	const code = (currency || "USD").toUpperCase();
	try {
		return (
			new Intl.NumberFormat(undefined, { style: "currency", currency: code }).resolvedOptions()
				.maximumFractionDigits ?? 2
		);
	} catch {
		return 2;
	}
}

// Round to a currency's minor-unit scale, sign-aware and finite-safe. -0 is
// normalized to 0 so no amount ever renders as a stray "-$0.00".
export function roundMoney(n: number, digits: number): number {
	if (!Number.isFinite(n)) return 0;
	const factor = Math.pow(10, digits);
	const sign = n < 0 ? -1 : 1;
	const v = (sign * Math.round((Math.abs(n) + Number.EPSILON) * factor)) / factor;
	return Object.is(v, -0) ? 0 : v;
}

// Two-decimal rounding, used for non-currency quantities (e.g. summed hours).
export function round2(n: number): number {
	return roundMoney(n, 2);
}
