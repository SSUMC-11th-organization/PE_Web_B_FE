import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createFixtureServer } from "./fixture-server.mjs";
const server = createFixtureServer();
await new Promise((resolve) => server.listen(8098, "127.0.0.1", resolve));
const child = spawn(process.execPath, [fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url)), "--host", "127.0.0.1", "--port", "5188", "--strictPort"], {
  stdio: "inherit",
  env: { ...process.env, VITE_API_BASE_URL: "http://127.0.0.1:8098/v8", VITE_TMDB_API_BASE_URL: "http://127.0.0.1:8098/tmdb", VITE_TMDB_ACCESS_TOKEN: "local-fixture-only" },
});
console.log("로컬 검증 전용: study8@example.com / Study8!Abc (공식 서버 계정이 아닙니다.)");
function close() { child.kill(); server.close(); }
process.on("SIGINT", close);
process.on("SIGTERM", close);
child.on("exit", () => server.close());
