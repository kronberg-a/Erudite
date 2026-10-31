import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
// This script owns only the fixed dist directory inside this project.
if (dirname(output) !== root.replace(/[\\/]$/, ""))
  throw new Error("Invalid output directory");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "public"), output, { recursive: true });
const html = await readFile(join(root, "index.html"), "utf8");
await writeFile(join(output, "index.html"), html.replaceAll("./public/", "./"));
const shellFiles = ["index.html", "standalone/app.js", "standalone/app.css", "pwa.js", "manifest.webmanifest", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
const hash = createHash("sha256");
for (const file of shellFiles) hash.update(await readFile(join(output, file)));
const worker = await readFile(join(root, "public/sw.js"), "utf8");
hash.update(worker);
await writeFile(join(output, "sw.js"), worker.replace("__ERUDITE_SHELL_VERSION__", hash.digest("hex").slice(0, 16)));
console.log(
  "Packaged dist/index.html. Both HTML entry points support direct file opening.",
);
