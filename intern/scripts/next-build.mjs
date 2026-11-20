import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const rootDir = path.resolve(__dirname, "..");
const apiDir = path.join(rootDir, "app", "api");
const backupDir = path.join(rootDir, ".api-route-backup");
const isExport = process.env.NEXT_EXPORT === "1";

// Recover if a previous interrupted export left the backup directory behind.
if (fs.existsSync(backupDir) && !fs.existsSync(apiDir)) {
  fs.renameSync(backupDir, apiDir);
}

let moved = false;
let exitCode = 0;

try {
  if (isExport && fs.existsSync(apiDir)) {
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, backupDir);
    moved = true;
  }

  const nextBin = require.resolve("next/dist/bin/next", { paths: [rootDir] });
  const result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  exitCode = result.status ?? 1;
} finally {
  if (moved && fs.existsSync(backupDir) && !fs.existsSync(apiDir)) {
    fs.renameSync(backupDir, apiDir);
  }
}

if (exitCode !== 0) {
  process.exit(exitCode);
}
