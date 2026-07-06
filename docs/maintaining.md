# Maintaining Invoice Forge

Maintainer/author notes — not needed by users of the plugin.

## Build & test

```bash
npm install
npm run build   # production bundle → main.js
npm test        # typecheck + lint (eslint-plugin-obsidianmd) + unit & license tests
```

`npm test` is the release gate. See [`docs/obsidian-release-checklist.md`](obsidian-release-checklist.md) before tagging a release.

## License minting (author only)

Pro license keys are signed offline with an Ed25519 keypair.

```bash
npm run license:keygen                         # one-time: create the signing keypair (already done)
npm run license:generate -- buyer@example.com  # mint a Pro key for a buyer
```

- The private signing key lives in `scripts/.license-private.key` and is **gitignored** — never commit or publish it.
- Only the public key ships, in `src/license/publicKey.ts`.
- Deliver keys with `scripts/customer-license-template.txt`.

## Purchase link

The single canonical purchase URL is used by `manifest.json` `fundingUrl` and `DEFAULT_SETTINGS.purchaseUrl` in `src/settings.ts`, and referenced in the README. Keep all three in sync. The public one-time price lives in `PRO_PRICE` (`src/settings.ts`) so every buyer-facing surface quotes the same number.
