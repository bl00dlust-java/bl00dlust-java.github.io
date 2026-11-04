import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";

const root = resolve("dist");
const required = [
  "index.html",
  "classic.html",
  "hub.html",
  "bug-report.html",
  "admin/dashboard.html",
  "admin/index.html",
  "admin/content.html",
  "admin/simulators.html",
  "admin/fonts.html",
  "css/styles.css",
  "css/app-sidebar.css",
  "js/app.js",
  "js/hub.js",
  "data/hub-content.json",
  "data/simulators.json",
];

const errors = [];
for (const relative of required) {
  if (!existsSync(join(root, relative))) errors.push("Missing build output: " + relative);
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const htmlFiles = walk(root).filter(file => extname(file).toLowerCase() === ".html");
const referencePattern = /\b(?:href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(referencePattern)) {
    const raw = (match[1] ?? match[2] ?? "").trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("//") ||
        /^(?:[a-z][a-z0-9+.-]*:)/i.test(raw)) continue;

    let pathname;
    try {
      pathname = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    } catch {
      errors.push("Invalid URL encoding in " + file.slice(root.length + 1) + ": " + raw);
      continue;
    }
    if (!pathname) continue;

    const target = pathname.startsWith("/")
      ? resolve(root, "." + pathname)
      : resolve(dirname(file), pathname);

    if (target !== root && !target.startsWith(root + sep)) {
      errors.push("Reference escapes dist directory in " + file.slice(root.length + 1) + ": " + raw);
      continue;
    }

    const candidates = [target, join(target, "index.html")];
    if (!candidates.some(candidate => existsSync(candidate) && statSync(candidate).isFile())) {
      errors.push("Broken local reference in " + file.slice(root.length + 1) + ": " + raw);
    }
  }
}

for (const relative of ["data/hub-content.json", "data/simulators.json"]) {
  try {
    JSON.parse(readFileSync(join(root, relative), "utf8"));
  } catch (error) {
    errors.push("Invalid JSON in build output " + relative + ": " + error.message);
  }
}

if (errors.length) {
  console.error("BUILD VALIDATION FAILED");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log("Build validation passed: " + htmlFiles.length + " HTML pages and " + required.length + " required files checked.");
}
