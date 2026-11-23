#!/usr/bin/env node
// Leak check: fail if any banned term appears in a tracked text file.
//
// The term list is NOT stored in this repository, because the list itself
// would be the leak. Set it in the environment (a CI secret), comma-separated:
//
//   SCRUB_TERMS="secret-project,internal-codename" node scripts/scrub.mjs
//
// Matching is case-insensitive substring. Without SCRUB_TERMS (for example in
// a fork) the check is skipped and exits 0.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const terms = (process.env.SCRUB_TERMS ?? "")
  .split(",")
  .map((t) => t.trim().toLowerCase())
  .filter(Boolean);

if (terms.length === 0) {
  console.log("scrub: SCRUB_TERMS is not set, skipping.");
  process.exit(0);
}

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

let hits = 0;
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (text.includes("\0")) continue; // binary
  text.split(/\r?\n/).forEach((line, i) => {
    const lower = line.toLowerCase();
    terms.forEach((term, n) => {
      // Print the term's index, not the term, so CI logs do not leak it.
      if (lower.includes(term)) {
        hits += 1;
        console.error(`${file}:${i + 1}: banned term #${n + 1}`);
      }
    });
  });
}

if (hits > 0) {
  console.error(`\nscrub: ${hits} hit(s). Remove them before publishing.`);
  process.exit(1);
}
console.log(`scrub: clean (${files.length} files, ${terms.length} terms).`);
