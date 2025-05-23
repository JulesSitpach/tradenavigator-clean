/**
 * This script automatically fixes import path issues in your project.
 * It scans all TypeScript and TSX files and corrects common path problems.
 * 
 * Usage: node fix-imports-scan.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan
const srcDir = path.join(__dirname, 'client', 'src');

// Function to find all TypeScript and TSX files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix a specific file
function fixFile(filePath) {
  console.log(`Checking: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;
  
  // Get relative info for this file
  const fileDir = path.dirname(filePath);
  const relativeToSrc = path.relative(srcDir, fileDir);
  const fileDepth = relativeToSrc.split(path.sep).length;
  
  // Create a map of known components and their locations
  const componentLocations = {
    // Dashboard components
    'DashboardHeader': 'components/layouts/DashboardHeader',
    
    // UI components from ui directory
    'card': 'components/ui/card',
    'button': 'components/ui/button',
    'badge': 'components/ui/badge',
    'input': 'components/ui/input',
    'select': 'components/ui/select',
    'checkbox': 'components/ui/checkbox',
    'dialog': 'components/ui/dialog',
    'toast': 'components/ui/toast',
    'tabs': 'components/ui/tabs',
    'tooltip': 'components/ui/tooltip'
  };
  
  // Fix incorrect import paths
  // Pattern: import X from "../components/Y" -> proper relative path
  const componentImportRegex = /import\s+{[^}]+}\s+from\s+['"]\.\.\/components\/([^'"]+)['"]/g;
  content = content.replace(componentImportRegex, (match, componentPath) => {
    fixes++;
    const dots = '../'.repeat(fileDepth);
    return match.replace('../components', `${dots}components`);
  });
  
  // Pattern: import X from "../components/ui/Y" -> proper relative path
  const uiImportRegex = /import\s+{[^}]+}\s+from\s+['"]\.\.\/components\/ui\/([^'"]+)['"]/g;
  content = content.replace(uiImportRegex, (match, componentName) => {
    fixes++;
    const dots = '../'.repeat(fileDepth);
    return match.replace('../components/ui', `${dots}components/ui`);
  });
  
  // Pattern: import X from "../ui/Y" -> proper relative path 
  const shortUiImportRegex = /import\s+{[^}]+}\s+from\s+['"]\.\.\/ui\/([^'"]+)['"]/g;
  content = content.replace(shortUiImportRegex, (match, componentName) => {
    fixes++;
    const dots = '../'.repeat(fileDepth);
    return match.replace('../ui', `${dots}components/ui`);
  });
  
  // Save the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixes} imports in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Function to specifically fix the file causing the error
function fixSpecificErrorFile() {
  const filePath = path.join(srcDir, 'pages', 'cost-breakdown.tsx');
  if (fs.existsSync(filePath)) {
    console.log('🔍 Fixing specific file mentioned in the error...');
    const fixed = fixFile(filePath);
    if (fixed) {
      console.log('✅ Fixed the specific file that was causing the error!');
    } else {
      console.log('⚠️ File examined but no fixes were needed or possible automatically.');
    }
  } else {
    console.log('⚠️ Could not find the specific file mentioned in the error.');
  }
}

// Main function
function main() {
  console.log('🔍 Scanning and fixing import paths in your project...');
  
  // First fix the specific file mentioned in the error
  fixSpecificErrorFile();
  
  // Then scan all files for potential issues
  const files = findFiles(srcDir);
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Done! Fixed imports in ${fixedCount} files.`);
  console.log('\nSuggested next steps:');
  console.log('1. Commit these changes: git add . && git commit -m "Fix import paths"');
  console.log('2. Push to GitHub: git push');
  console.log('3. Trigger a new Netlify deployment');
}

main();
