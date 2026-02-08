import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('Creating album zip file...');

// Create a new zip file
const zip = new AdmZip();

// Add images directory
const imagesDir = path.join(rootDir, 'images');
if (fs.existsSync(imagesDir)) {
  console.log('Adding images...');
  zip.addLocalFolder(imagesDir, 'images');
}

// Add songs directory from public
const songsDir = path.join(rootDir, 'public', 'songs');
if (fs.existsSync(songsDir)) {
  console.log('Adding songs...');
  zip.addLocalFolder(songsDir, 'songs');
}

// Write zip file to public directory so it gets copied to dist during build
const outputPath = path.join(rootDir, 'public', 'ligatures-agency-album.zip');
zip.writeZip(outputPath);

console.log(`✓ Album zip created at: ${outputPath}`);
console.log(`  File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
