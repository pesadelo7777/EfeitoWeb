#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec bash "${script_dir}/sites-env.sh" -- bash "$0" "$@"
fi

worker="${SITES_PROJECT_ROOT}/dist/server/index.js"
hosting="${SITES_PROJECT_ROOT}/dist/.openai/hosting.json"
client="${SITES_PROJECT_ROOT}/dist/client"
wrangler="${SITES_PROJECT_ROOT}/wrangler.jsonc"

[[ -f "${worker}" ]] || {
  echo "Missing Sites Worker entry: dist/server/index.js" >&2
  exit 66
}
[[ -f "${hosting}" ]] || {
  echo "Missing packaged Sites manifest: dist/.openai/hosting.json" >&2
  exit 66
}
[[ -d "${client}/assets" ]] || {
  echo "Missing compiled client assets: dist/client/assets" >&2
  exit 66
}

node --input-type=module - "${worker}" "${hosting}" "${client}" "${wrangler}" <<'NODE'
import { access, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [workerPath, hostingPath, clientPath, wranglerPath] = process.argv.slice(2);
JSON.parse(await readFile(hostingPath, "utf8"));

const wrangler = JSON.parse(await readFile(wranglerPath, "utf8"));
if (wrangler.assets?.run_worker_first !== false) {
  throw new Error("wrangler.jsonc must serve matching static assets before invoking the Worker");
}

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);
if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
}

const response = await worker.default.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);
if (!response.ok) {
  throw new Error(`Worker HTML validation returned ${response.status}`);
}

const html = await response.text();
const assetPaths = new Set(
  [...html.matchAll(/(?:href|src)=["'](\/assets\/[^"']+)["']/g)].map((match) => match[1]),
);
if (assetPaths.size === 0) {
  throw new Error("Rendered HTML does not reference compiled client assets");
}
for (const assetPath of assetPaths) {
  await access(resolve(clientPath, `.${decodeURIComponent(assetPath)}`));
}
NODE

echo "Validated Worker entry, hosting manifest, asset-first routing, and rendered client assets."
