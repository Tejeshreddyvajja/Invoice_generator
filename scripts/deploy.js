#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment build...');

const rootDir = path.join(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const frontendDistDir = path.join(frontendDir, 'dist');
const backendPublicAppDir = path.join(backendDir, 'public', 'app');

// Function to execute commands with proper error handling
function exec(command, cwd = rootDir) {
  console.log(`Executing: ${command} (in ${cwd})`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source directory does not exist: ${src}`);
    process.exit(1);
  }

  // Remove destination directory if it exists
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });

  // Copy files
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Step 1: Install dependencies
  console.log('📦 Installing dependencies...');
  exec('npm ci');
  exec('npm ci', backendDir);
  exec('npm ci', frontendDir);

  // Step 2: Build frontend
  console.log('🏗️  Building frontend...');
  exec('npm run build', frontendDir);

  // Step 3: Ensure backend public directory exists
  const backendPublicDir = path.join(backendDir, 'public');
  if (!fs.existsSync(backendPublicDir)) {
    fs.mkdirSync(backendPublicDir, { recursive: true });
  }

  // Step 4: Copy built frontend to backend public/app
  console.log('📂 Copying frontend build to backend...');
  copyDir(frontendDistDir, backendPublicAppDir);

  // Step 5: Create production .env file template if it doesn't exist
  const prodEnvPath = path.join(backendDir, '.env.production');
  if (!fs.existsSync(prodEnvPath)) {
    console.log('📝 Creating production .env template...');
    const envTemplate = `NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com`;
    fs.writeFileSync(prodEnvPath, envTemplate);
  }

  console.log('✅ Deployment build completed successfully!');
  console.log('');
  console.log('🎉 Your application is ready for deployment!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Update the .env.production file with your actual values');
  console.log('2. Deploy using one of these methods:');
  console.log('   - Docker: npm run docker:build && npm run docker:run');
  console.log('   - Docker Compose: npm run docker:compose:up');
  console.log('   - Direct: NODE_ENV=production npm start');
  console.log('');

} catch (error) {
  console.error('❌ Deployment build failed:', error.message);
  process.exit(1);
}
