import { cp, copyFile, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
for (const directory of ["assets", "css", "js", "data", "admin"]) {
  await cp(directory, `dist/${directory}`, { recursive: true });
}
for (const file of ["classic.html", "hub.html", "bug-report.html", "font-settings.json", ".nojekyll"]) {
  try { await copyFile(file, `dist/${file}`); }
  catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
