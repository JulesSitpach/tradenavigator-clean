/**
 * This script fixes all import path issues in the project
 * It handles common patterns like:
 * - Components trying to import UI components from incorrect paths
 * - Incorrect relative paths between directories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client src directory
const srcDir = path.join(__dirname, 'client', 'src');

// Track fixes
let fixedFiles = 0;
let fixedImports = 0;

/**
 * Fix imports in a file
 */
function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;
    let fileFixed = false;
    let importsFixed = 0;

    // Get relative info for proper path correction
    const relativePath = path.relative(srcDir, path.dirname(filePath));
    const pathParts = relativePath.split(path.sep);
    const depthFromSrc = pathParts.length;
    
    // Create correct relative path to src root
    const pathToSrc = '../'.repeat(depthFromSrc);
    
    // Common path mappings
    const fixes = [
      // Fix paths for UI components in subdirectories
      {
        pattern: /from ['"]\.\.\/components\/ui\/([^'"]+)['"]/g,
        replacement: (match, componentName) => `from "${pathToSrc}components/ui/${componentName}"`,
      },
      // Fix paths for UI components from components directory
      {
        pattern: /from ['"]\.\.\/ui\/([^'"]+)['"]/g,
        replacement: (match, componentName) => `from "${pathToSrc}components/ui/${componentName}"`,
      },
      // Fix paths for lib/api
      {
        pattern: /from ['"]\.\.\/lib\/api['"]/g,
        replacement: `from "${pathToSrc}lib/api"`,
      },
      // Fix paths for providers
      {
        pattern: /from ['"]\.\.\/providers\/([^'"]+)['"]/g,
        replacement: (match, providerName) => `from "${pathToSrc}providers/${providerName}"`,
      },
      // Fix paths for components in layouts
      {
        pattern: /from ['"]\.\.\/SimpleLink['"]/g,
        replacement: `from "${pathToSrc}components/SimpleLink"`,
      },
      {
        pattern: /from ['"]\.\.\/CleanLink['"]/g,
        replacement: `from "${pathToSrc}components/CleanLink"`,
      },
      // Fix NavigationContainer import in MainLayout
      {
        pattern: /from ['"]\.\/NavigationContainer['"]/g,
        replacement: `from "${pathToSrc}components/layouts/NavigationContainer"`,
      },
      // Special fix for components trying to import from "../components/ui"
      {
        pattern: /from ['"]\.\.\/components\/ui['"]/g,
        replacement: `from "${pathToSrc}components/ui"`,
      },
    ];

    // Apply all fixes
    for (const fix of fixes) {
      const fixedContent = newContent.replace(fix.pattern, fix.replacement);
      if (fixedContent !== newContent) {
        const matches = newContent.match(fix.pattern) || [];
        importsFixed += matches.length;
        newContent = fixedContent;
        fileFixed = true;
      }
    }

    // Save changes if needed
    if (fileFixed) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      fixedFiles++;
      fixedImports += importsFixed;
      console.log(`✅ Fixed ${importsFixed} imports in: ${path.relative(__dirname, filePath)}`);
    }

    return fileFixed;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Process all TypeScript/JavaScript files in a directory recursively
 */
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      fixImportsInFile(fullPath);
    }
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Fixing import paths in your project...');
  
  processDirectory(srcDir);
  
  console.log(`\n✅ Fixed ${fixedImports} imports in ${fixedFiles} files.`);
  console.log('Run "node check-imports.js" again to verify all issues are fixed.');
}

main();