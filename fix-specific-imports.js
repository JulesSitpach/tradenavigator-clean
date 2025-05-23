/**
 * This script fixes specific import paths that are causing issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix a specific file
function fixFile(filePath, replacements) {
  try {
    console.log(`Fixing file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;
    
    for (const [oldStr, newStr] of replacements) {
      newContent = newContent.replace(oldStr, newStr);
    }
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Fixed file: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Main function to fix specific issues
function main() {
  console.log('🔧 Fixing specific import path issues...');
  
  // Fix MainLayout.tsx
  fixFile(
    path.join(__dirname, 'client', 'src', 'components', 'layouts', 'MainLayout.tsx'),
    [
      ['import NavigationContainer from "../../components/layouts/NavigationContainer";', 'import NavigationContainer from "./NavigationContainer";']
    ]
  );
  
  // Fix NavBar.tsx
  fixFile(
    path.join(__dirname, 'client', 'src', 'components', 'layouts', 'NavBar.tsx'),
    [
      ['import SimpleLink from "../../components/SimpleLink";', 'import SimpleLink from "../SimpleLink";']
    ]
  );
  
  // Fix MainNavigation.tsx
  fixFile(
    path.join(__dirname, 'client', 'src', 'components', 'MainNavigation.tsx'),
    [
      ['import CleanLink from "./CleanLink";', 'import CleanLink from "./CleanLink";'] // No change needed if it's already correct
    ]
  );
  
  console.log('✅ All specific import issues fixed!');
}

main();