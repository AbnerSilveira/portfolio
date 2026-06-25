import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonDir = path.resolve(__dirname, "..", "python");
const isWin = process.platform === "win32";
const venvUvicorn = path.join(
  pythonDir,
  isWin ? ".venv/Scripts/uvicorn.exe" : ".venv/bin/uvicorn",
);

const args = [
  "src.api:app",
  "--host",
  "127.0.0.1",
  "--port",
  "8000",
  // --reload no Windows deixa o reloader preso na porta se o worker crashar.
  ...(process.env.SNIFFER_UVICORN_RELOAD === "1" ? ["--reload"] : []),
];

const result = spawnSync(venvUvicorn, args, {
  cwd: pythonDir,
  stdio: "inherit",
  shell: false,
  env: process.env,
});
process.exit(result.status ?? 1);
