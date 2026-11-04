import { cp, copyFile, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
for (const directory of ["assets", "css", "js", "data"]) {
  await cp(directory, `dist/${directory}`, { recursive: true });
}
await mkdir("dist/admin", { recursive: true });
for (const file of ["index.html", "content.html", "simulators.html", "admin.css", "admin.js", "content-editor.js", "simulators-editor.js"]) {
  try { await copyFile(`admin/${file}`, `dist/admin/${file}`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
}
for (const file of ["classic.html", "hub.html", "bug-report.html", "font-settings.json", ".nojekyll"]) {
  try { await copyFile(file, `dist/${file}`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
}
