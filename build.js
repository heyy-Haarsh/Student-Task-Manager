/**
 * build.js
 * --------
 * Jenkins build script for Student Task Manager.
 *
 * Steps executed:
 *   1. JavaScript syntax check  (node --check)
 *   2. HTML validation          (html-validate)
 *
 * Exits with code 0 on success, non-zero on any failure.
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = __dirname;

function run(label, cmd) {
  console.log(`\n──────────────────────────────────────────`);
  console.log(`▶  ${label}`);
  console.log(`   $ ${cmd}`);
  console.log(`──────────────────────────────────────────`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    console.log(`✔  ${label} — PASSED`);
  } catch (err) {
    console.error(`✘  ${label} — FAILED`);
    process.exit(1);
  }
}

console.log("\n========================================");
console.log("  Student Task Manager — Build Start");
console.log("========================================");

// Step 1: JavaScript syntax check
run("JS Syntax Check — app.js",          "node --check app.js");
run("JS Syntax Check — task-priority.js", "node --check task-priority.js");

// Step 2: HTML validation
run("HTML Validation — index.html", "npx html-validate index.html");

console.log("\n========================================");
console.log("  Build SUCCESS — all checks passed");
console.log("========================================\n");
