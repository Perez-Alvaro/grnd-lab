/**
 * tests/e2e/helpers/fileScanner.js
 * Codebase inspection and static analysis helpers for test suites.
 */

import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(process.cwd());

export function resolveProjectPath(...segments) {
  return path.join(PROJECT_ROOT, ...segments);
}

export function fileExists(relativePath) {
  return fs.existsSync(resolveProjectPath(relativePath));
}

export function readFileContent(relativePath) {
  const fullPath = resolveProjectPath(relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

export function searchOccurrencesInFile(relativePath, pattern) {
  const content = readFileContent(relativePath);
  if (!content) return [];
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'gi') : pattern;
  const matches = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (regex.test(line)) {
      matches.push({ line: idx + 1, text: line.trim() });
    }
  });
  return matches;
}

export function searchOccurrencesInDirectory(dirRelativePath, pattern, { extensions = ['.js', '.jsx', '.ts', '.tsx', '.md', '.sql'], excludes = ['node_modules', '.git', 'dist', '.agents'] } = {}) {
  const dirFullPath = resolveProjectPath(dirRelativePath);
  const results = [];

  function scan(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(currentDir, entry.name);
      const rel = path.relative(PROJECT_ROOT, full);

      if (entry.isDirectory()) {
        if (!excludes.some((ex) => entry.name === ex || rel.includes(ex))) {
          scan(full);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          const occs = searchOccurrencesInFile(rel, pattern);
          if (occs.length > 0) {
            results.push({ file: rel, occurrences: occs });
          }
        }
      }
    }
  }

  scan(dirFullPath);
  return results;
}

export function extractStaticImports(relativePath) {
  const content = readFileContent(relativePath);
  if (!content) return [];
  const importRegex = /import\s+(?:(?:(?:\w+|\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+)?['"]([^'"]+)['"])/g;
  const imports = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

export function extractDynamicImports(relativePath) {
  const content = readFileContent(relativePath);
  if (!content) return [];
  const dynamicRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const imports = [];
  let match;
  while ((match = dynamicRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}
