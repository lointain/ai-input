
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_ROOT = path.resolve(__dirname, '../registry');
const OUTPUT_DIR = path.resolve(__dirname, '../apps/web/public/registry');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define the component
const componentName = 'ai-input';
const componentPath = path.join(REGISTRY_ROOT, 'default', componentName);

// List of files to include
// We will walk the directory to find all files
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

const allFiles = getAllFiles(componentPath);

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

// Write individual component JSON
fs.writeFileSync(
  path.join(OUTPUT_DIR, `${componentName}.json`),
  JSON.stringify(registryItem, null, 2)
);

// Write index registry.json
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
