import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
console.log(
  "Packaged dist/index.html. Both HTML entry points support direct file opening.",
);
