import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}
let failures = 0;
for (const file of await walk("src")) {
  const text = await readFile(file, "utf8");
  if (/\p{Extended_Pictographic}/u.test(text)) {
    console.error(`Pictographic character in ${file}`);
    failures++;
  }
  if (
    /Notification\s*[.(]|requestPermission\s*\(|PushManager|pushManager|showNotification\s*\(/.test(
      text,
    )
  ) {
    console.error(`Forbidden browser API in ${file}`);
    failures++;
  }
}
for (const file of ["src/core/srsEngine.ts", "src/core/queueManager.ts"]) {
  if (
    /\bDate\b|\bsetTimeout\b|\bsetInterval\b/.test(await readFile(file, "utf8"))
  ) {
    console.error(`Time-based scheduling in ${file}`);
    failures++;
  }
}
if (failures) process.exit(1);
console.log(
  "Source constraints passed: no emoji, notification APIs, or time-based study scheduling.",
);
