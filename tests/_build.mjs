// Bundles the pure logic barrel (src/testable.ts) to an ESM file the tests import,
// so unit tests exercise the real shipped code rather than re-implementations.
import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

await esbuild.build({
	entryPoints: [path.join(root, "src/testable.ts")],
	bundle: true,
	format: "esm",
	platform: "node",
	target: "es2020",
	outfile: path.join(__dirname, ".testable.mjs"),
	logLevel: "error",
	// tweetnacl (pulled in by LicenseManager) does a dynamic `require("crypto")`;
	// in an ESM+node bundle esbuild otherwise stubs that with a throw. Re-establish
	// a working `require` so the bundle can load under `node`.
	banner: {
		js: "import { createRequire as __cr } from 'module';\nconst require = __cr(import.meta.url);",
	},
});
