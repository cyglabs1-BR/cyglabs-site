#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Starting Netlify build script...');

// Step 1: Remove Replit plugins from package.json
console.log('📝 Removing Replit plugins from package.json...');
const packagePath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (packageJson.devDependencies) {
  delete packageJson.devDependencies['@replit/vite-plugin-cartographer'];
  delete packageJson.devDependencies['@replit/vite-plugin-runtime-error-modal'];
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Replit plugins removed from package.json');
}

// Step 2: Install dependencies (omit dev deps)
console.log('📦 Installing production dependencies...');
try {
  execSync('npm install --omit=dev --legacy-peer-deps --force', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Create stub modules for Replit plugins
console.log('🔧 Creating stub modules for Replit plugins...');

function createStubModule(packageName, version, content) {
  const moduleDir = path.join('node_modules', ...packageName.split('/'));
  fs.mkdirSync(moduleDir, { recursive: true });
  
  // Package.json for the stub
  const stubPackageJson = {
    name: packageName,
    version: version,
    type: 'module',
    exports: './index.js'
  };
  fs.writeFileSync(path.join(moduleDir, 'package.json'), JSON.stringify(stubPackageJson, null, 2));
  
  // Main module file
  fs.writeFileSync(path.join(moduleDir, 'index.js'), content);
  console.log(`✅ Created stub for ${packageName}`);
}

// Create runtime error overlay stub
createStubModule(
  '@replit/vite-plugin-runtime-error-modal', 
  '1.0.0',
  'export default function runtimeErrorOverlay() { return { name: "noop-runtime-error-overlay" }; }'
);

// Create cartographer stub  
createStubModule(
  '@replit/vite-plugin-cartographer',
  '1.1.2', 
  'export function cartographer() { return { name: "noop-cartographer" }; }'
);

// Step 4: Run the build
console.log('🏗️ Running Vite build...');
try {
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}