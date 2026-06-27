// Author-only setup tool. Run ONCE to create the signing keypair.
// Writes the private key to scripts/.license-private.key (gitignored, NEVER commit/publish)
// and prints the public key to paste into src/license/publicKey.ts.
import fs from "fs";
import path from "path";
import nacl from "tweetnacl";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privateKeyPath = path.join(__dirname, ".license-private.key");

function toBase64(bytes) {
	return Buffer.from(bytes).toString("base64");
}

if (fs.existsSync(privateKeyPath)) {
	console.error("Refusing to overwrite existing scripts/.license-private.key");
	process.exit(1);
}

const pair = nacl.sign.keyPair();
fs.writeFileSync(privateKeyPath, toBase64(pair.secretKey), "utf8");

console.log("\nKeypair generated.\n");
console.log("Private key written to scripts/.license-private.key (keep secret, never commit).");
console.log("\nPaste this PUBLIC key into src/license/publicKey.ts:\n");
console.log(`export const LICENSE_PUBLIC_KEY = "${toBase64(pair.publicKey)}";\n`);
