import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonDir = path.resolve(__dirname, "..", "python");

function canImportPytest(cmd, argsPrefix) {
  const r = spawnSync(cmd, [...argsPrefix, "-c", "import pytest"], {
    cwd: pythonDir,
    encoding: "utf8",
    shell: false,
    env: process.env,
  });
  return r.status === 0;
}

/** CI: `python3` após setup-python. Windows: `py -3.11` se existir, senão `python`. */
function pythonCommand() {
  if (process.platform === "win32") {
    if (canImportPytest("py", ["-3.11"])) {
      return { cmd: "py", argsPrefix: ["-3.11"] };
    }
    return { cmd: "python", argsPrefix: [] };
  }
  if (canImportPytest("python3", [])) {
    return { cmd: "python3", argsPrefix: [] };
  }
  return { cmd: "python", argsPrefix: [] };
}

const { cmd, argsPrefix } = pythonCommand();
const result = spawnSync(cmd, [...argsPrefix, "-m", "pytest", "tests", "-q"], {
  cwd: pythonDir,
  stdio: "inherit",
  shell: false,
  env: process.env,
});
process.exit(result.status ?? 1);
