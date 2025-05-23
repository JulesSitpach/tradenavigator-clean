const fs = require('fs');
const path = require('path');

console.log('Starting import path fix script...');

// Function to recursively find all TypeScript and JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      fileList = findFiles(filePath, fileList);
    } else if (
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) &&
      !file.endsWith('.d.ts')
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix @/ imports
  if (content.includes('@/')) {
    console.log(`Fixing @/ imports in ${filePath}`);
    content = content.replace(/@\/components/g, '../components');
    content = content.replace(/@\/providers/g, '../providers');
    content = content.replace(/@\/hooks/g, '../hooks');
    content = content.replace(/@\/lib/g, '../lib');
    content = content.replace(/@\/types/g, '../types');
    content = content.replace(/@\/styles/g, '../styles');
    modified = true;
  }
  
  // Fix relative path imports
  const pathsToFix = [
    { from: '../../../', to: '../../../' },
    { from: '../../', to: '../../' },
    { from: '../', to: '../' }
  ];
  
  for (const { from, to } of pathsToFix) {
    if (content.includes(from)) {
      // Only fix if needed
      const parts = filePath.split(path.sep);
      if (parts.includes('src') && parts.includes('components')) {
        console.log(`Fixing relative paths in ${filePath}`);
        content = content.replace(new RegExp(from + 'components/', 'g'), to + 'components/');
        content = content.replace(new RegExp(from + 'providers/', 'g'), to + 'providers/');
        content = content.replace(new RegExp(from + 'hooks/', 'g'), to + 'hooks/');
        content = content.replace(new RegExp(from + 'lib/', 'g'), to + 'lib/');
        content = content.replace(new RegExp(from + 'types/', 'g'), to + 'types/');
        content = content.replace(new RegExp(from + 'styles/', 'g'), to + 'styles/');
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

// Main execution
try {
  // Get all TypeScript and JavaScript files
  const clientDir = path.join(__dirname, 'client');
  const serverDir = path.join(__dirname, 'server');
  const sharedDir = path.join(__dirname, 'shared');
  
  let files = [];
  
  if (fs.existsSync(clientDir)) {
    files = files.concat(findFiles(clientDir));
  }
  
  if (fs.existsSync(serverDir)) {
    files = files.concat(findFiles(serverDir));
  }
  
  if (fs.existsSync(sharedDir)) {
    files = files.concat(findFiles(sharedDir));
  }
  
  // Fix imports in each file
  files.forEach(fixImportsInFile);
  
  console.log('Import path fix completed successfully!');
} catch (error) {
  console.error('Error fixing imports:', error);
  process.exit(1);
}
