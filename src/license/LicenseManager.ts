import nacl from "tweetnacl";
import { LICENSE_PUBLIC_KEY } from "./publicKey";

export interface LicensePayload {
	product: string;
	email: string;
	issued: string;
}

export class LicenseManager {
	private static readonly PRODUCT = "invoice-forge";

	static verify(licenseKey: string): { valid: boolean; email?: string; error?: string } {
		const trimmed = licenseKey.trim();
		if (!trimmed) {
			return { valid: false, error: "No license key provided." };
		}

		const parts = trimmed.split(".");
		if (parts.length !== 2) {
			return { valid: false, error: "Invalid license format." };
		}

		try {
			const payloadBytes = base64ToBytes(parts[0]);
			const signature = base64ToBytes(parts[1]);
			const publicKey = base64ToBytes(LICENSE_PUBLIC_KEY);

			if (!nacl.sign.detached.verify(payloadBytes, signature, publicKey)) {
				return { valid: false, error: "Invalid license signature." };
			}

			// Validate the SHAPE of the signed payload, not just the signature. A
			// correctly signed but malformed payload (a JSON primitive, or an object
			// missing email/issued) should not silently enable Pro with a blank email;
			// this also makes room for future versioned/expiring keys.
			const parsed: unknown = JSON.parse(new TextDecoder().decode(payloadBytes));
			if (!parsed || typeof parsed !== "object") {
				return { valid: false, error: "Malformed license payload." };
			}
			const payload = parsed as Partial<LicensePayload>;
			if (payload.product !== LicenseManager.PRODUCT) {
				return { valid: false, error: "License is for a different product." };
			}
			if (typeof payload.email !== "string" || !payload.email.trim()) {
				return { valid: false, error: "License payload is missing an email." };
			}
			if (typeof payload.issued !== "string" || !payload.issued.trim()) {
				return { valid: false, error: "License payload is missing an issue date." };
			}

			return { valid: true, email: payload.email };
		} catch {
			return { valid: false, error: "Could not parse license key." };
		}
	}
}

function base64ToBytes(value: string): Uint8Array {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
