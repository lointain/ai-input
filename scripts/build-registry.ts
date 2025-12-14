/**
 * @file build-registry.ts
 * @description Script to build the registry for the AI Input component.
 * It scans the registry directory, collects all component files, and generates
 * a JSON registry file that can be used by the documentation site or CLI.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Root directory of the registry components */
const REGISTRY_ROOT = path.resolve(__dirname, '../registry');
/** Output directory for the generated registry JSON files */
const OUTPUT_DIR = path.resolve(__dirname, '../apps/web/public/registry');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/** The name of the component to build registry for */
const componentName = 'ai-input';
const componentPath = path.join(REGISTRY_ROOT, 'default', componentName);

/**
 * Recursively gets all files in a directory.
 * 
 * @param {string} dirPath - The directory path to scan
 * @param {string[]} [arrayOfFiles] - Accumulator array for recursion
 * @returns {string[]} Array of file paths
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

/** List of all files in the component directory */
const allFiles = getAllFiles(componentPath);

/**
 * Registry item definition.
 * Contains metadata and file contents for the component.
 */
const registryItem = {
  name: componentName,
  type: "registry:component",
  title: "AI Input",
  description: "A Notion-style AI input with drag & drop, slash commands, and mentions.",
  dependencies: [
    "@tiptap/vue-3",
    "@tiptap/starter-kit",
    "@tiptap/extension-placeholder",
    "@tiptap/extension-mention",
    "lucide-vue-next",
    "tippy.js"
  ],
  registryDependencies: [
    "button",
    "badge",
    "card",
    "separator"
  ],
  files: allFiles.map(filePath => {
    const relativePath = path.relative(componentPath, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return {
      path: `ui/${componentName}/${relativePath}`, 
      type: "registry:component",
      content: content
    };
  })
};

/**
 * Write individual component registry JSON file.
 * This file contains the complete definition and source code of the component.
 */
fs.writeFileSync(
  path.join(OUTPUT_DIR, `${componentName}.json`),
  JSON.stringify(registryItem, null, 2)
);

/**
 * Write the index registry JSON file.
 * This file lists available components and their associated files.
 */
const registryIndex = [
  {
    name: componentName,
    type: "registry:component",
    files: registryItem.files.map(f => f.path)
  }
];

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'index.json'),
  JSON.stringify(registryIndex, null, 2)
);

console.log(`Build registry for ${componentName} success!`);
