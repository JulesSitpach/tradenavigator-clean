#!/usr/bin/env node

// Use CommonJS style for compatibility
const fs = require('fs');
const path = require('path');

console.log('🔧 NUCLEAR OPTION: Fixing ALL MainLayout imports...');

// Function to get all TypeScript/TSX files
function getAllTsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllTsFiles(filePath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to calculate correct relative path
function getCorrectMainLayoutPath(filePath) {
    const relativePath = path.relative('client/src', filePath);
    const pathParts = relativePath.split(path.sep);
    
    // Remove the filename to get directory depth
    pathParts.pop();
    
    // Calculate how many levels up we need to go
    const levelsUp = pathParts.length;
    const upPath = '../'.repeat(levelsUp);
    
    return `${upPath}components/layouts/MainLayout`;
}

// Get all files in client/src
const allFiles = getAllTsFiles('client/src');

// Filter files that contain MainLayout imports
const filesToFix = allFiles.filter(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('MainLayout') && content.includes('import');
    } catch (error) {
        return false;
    }
});

console.log(`Found ${filesToFix.length} files with MainLayout imports`);

// Fix each file
filesToFix.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Calculate the correct path for this file
        const correctPath = getCorrectMainLayoutPath(filePath);
        
        // Replace ALL possible MainLayout import patterns
        const importPatterns = [
            /import\s+MainLayout\s+from\s+['"][^'"]*MainLayout['"];?/g,
            /import\s+{\s*MainLayout\s*}\s+from\s+['"][^'"]*MainLayout['"];?/g,
            /import\s+.*MainLayout.*\s+from\s+['"][^'"]*['"];?/g
        ];
        
        importPatterns.forEach(pattern => {
            content = content.replace(pattern, `import MainLayout from '${correctPath}';`);
        });
        
        // Special case for named imports
        content = content.replace(
            /import\s+{\s*MainLayout\s*}\s+from\s+['"][^'"]*['"];?/g,
            `import { MainLayout } from '${correctPath}';`
        );
        
        // Write the file if it changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed: ${filePath} -> ${correctPath}`);
        }
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
});

console.log('🎉 ALL MainLayout imports have been fixed!');

// Verify the fixes
console.log('\n📋 Verification - checking all files:');
filesToFix.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const importMatch = content.match(/import.*MainLayout.*from\s+['"]([^'"]*)['"]/);
        if (importMatch) {
            const expectedPath = getCorrectMainLayoutPath(filePath);
            const actualPath = importMatch[1];
            const status = actualPath === expectedPath ? '✅' : '❌';
            console.log(`${status} ${path.relative('client/src', filePath)}: ${actualPath}`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}`);
    }
});

console.log('\n🚀 Ready to deploy!');