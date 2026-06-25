import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const pythonDir = path.join(root, "..", "python");
const script = path.join(pythonDir, "scripts", "generate_demo_pcaps.py");

const python =
  process.platform === "win32"
    ? spawnSync("py", ["-3", "--version"], { encoding: "utf8" }).status === 0
      ? "py"
      : "python"
    : "python3";

const args =
  python === "py" ? ["-3", script] : [script];

const result = spawnSync(python, args, {
  cwd: pythonDir,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
