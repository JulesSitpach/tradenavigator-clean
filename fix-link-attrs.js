/**
 * This script fixes wouter Link href attributes to react-router-dom to attributes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix a file
function fixFile(filePath) {
  try {
    console.log(`Fixing file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace Link href with to
    const newContent = content.replace(/Link\s+href=/g, 'Link to=');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Fixed Link href attributes in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  const filePath = path.join(__dirname, 'client', 'src', 'components', 'MainNavigation.tsx');
  fixFile(filePath);
  console.log('Done!');
}

main();