/**
 * This script checks if all imported files actually exist
 * It helps identify import issues before deploying
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client src directory
const srcDir = path.join(__dirname, 'client', 'src');

// Track issues
let missingFiles = 0;
let importIssues = 0;

// Function to extract imports from a file
function extractImports(filePath, content) {
  const importRegex = /import\s+(?:(?:{[^}]+}|\*\s+as\s+[^\s,]+|[^\s,{]+)(?:\s*,\s*(?:{[^}]+}|\*\s+as\s+[^\s,]+|\w+))*\s+from\s+)?(['"])([^'"]+)\1/g;
  
  let match;
  const imports = [];
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      source: match[2],
      position: match.index,
    });
  }
  return imports;
}

// Function to check if imported file exists
function resolveImport(sourceFile, importPath) {
  // Skip node_modules and absolute imports
  if (importPath.startsWith('@') || 
      !importPath.startsWith('.') || 
      importPath.includes('node_modules')) {
    return true;
  }

  const sourceDir = path.dirname(sourceFile);
  
  // Try common extensions
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];
  
  // Handle directory imports (index files)
  const isDirectory = !path.extname(importPath);
  const pathsToCheck = [];
  
  for (const ext of extensions) {
    pathsToCheck.push(path.resolve(sourceDir, `${importPath}${ext}`));
    if (isDirectory) {
      pathsToCheck.push(path.resolve(sourceDir, importPath, `index${ext}`));
    }
  }
  
  for (const pathToCheck of pathsToCheck) {
    if (fs.existsSync(pathToCheck)) {
      return true;
    }
  }
  
  return false;
}

// Function to check a file
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = extractImports(filePath, content);
    
    const issues = [];
    
    for (const importItem of imports) {
      const importExists = resolveImport(filePath, importItem.source);
      if (!importExists) {
        issues.push(importItem.source);
        importIssues++;
      }
    }
    
    if (issues.length > 0) {
      console.log(`\n⚠️ ${filePath} has missing imports:`);
      issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    return issues.length === 0;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    missingFiles++;
    return false;
  }
}

// Function to traverse directories
function checkDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      checkDirectory(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

// Main function
function main() {
  console.log('🔍 Checking for missing imports in your project...');
  
  checkDirectory(srcDir);
  
  if (importIssues === 0 && missingFiles === 0) {
    console.log('\n✅ All imports are valid! Your project should build without import errors.');
  } else {
    console.log(`\n⚠️ Found ${importIssues} import issues and ${missingFiles} missing files.`);
    console.log('Fix these issues before deploying to Netlify.');
  }
}

main();