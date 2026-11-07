import { readFileSync } from 'node:fs';

const fail = message => {
  console.error('CONTENT VALIDATION FAILED: ' + message);
  process.exitCode = 1;
};
const readJson = path => {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { fail(path + ': ' + error.message); return null; }
};
const text = (value, max = 3000) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

const content = readJson('data/hub-content.json');
if (content) {
  if (content.version !== 1) fail('hub-content.json: version must be 1');
  for (const [key, fields, limit] of [
    ['articles', ['title', 'category', 'text'], 100],
    ['glossary', ['term', 'definition'], 200],
    ['news', ['title', 'text', 'url'], 100]
  ]) {
    if (!Array.isArray(content[key]) || content[key].length > limit) {
      fail('hub-content.json: invalid ' + key + ' array');
      continue;
    }
    content[key].forEach((item, index) => {
      if (!item || typeof item !== 'object' || !fields.every(field => text(item[field]))) {
        fail('hub-content.json: invalid ' + key + '[' + index + ']');
      }
      if (key === 'news' && item && typeof item.url === 'string') {
        try { if (new URL(item.url).protocol !== 'https:') fail('news[' + index + '] must use HTTPS'); }
        catch { fail('news[' + index + '] has an invalid URL'); }
      }
    });
  }
}

const simulators = readJson('data/simulators.json');
if (simulators) {
  if (simulators.version !== 1 || !Array.isArray(simulators.scenarios) || simulators.scenarios.length > 50) {
    fail('simulators.json: invalid version or scenarios array');
  } else {
    const ids = new Set();
    simulators.scenarios.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        fail('simulators.json: scenario ' + index + ' must be an object');
        return;
      }
      if (!text(item.id, 40) || !/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) {
        fail('simulators.json: invalid or duplicate ID at scenario ' + index);
      } else ids.add(item.id);
      if (!text(item.title, 160) || !text(item.prompt, 1200) || !text(item.explanation, 1200)) {
        fail('simulators.json: missing or oversized text at scenario ' + index);
      }
      if (item.moduleTitle !== undefined && !text(item.moduleTitle, 120)) {
        fail('simulators.json: invalid moduleTitle at scenario ' + index);
      }
      if (item.moduleId !== undefined && !/^[a-z0-9-]{1,40}$/.test(item.moduleId)) {
        fail('simulators.json: invalid moduleId at scenario ' + index);
      }
      if (!Array.isArray(item.options) || item.options.length < 2 || item.options.length > 5 ||
          !item.options.every(option => text(option, 300)) ||
          !Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= item.options.length) {
        fail('simulators.json: invalid answer options at scenario ' + index);
      }
    });
  }
}

if (!process.exitCode) console.log('Content validation passed.');
