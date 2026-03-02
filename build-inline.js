#!/usr/bin/env node
// Build script that inlines JS and CSS into HTML for Figma plugin
const fs = require('fs');
const path = require('path');

console.log('📦 Building with inline JS + CSS...');

// Read the bundled JS
const jsPath = path.join(__dirname, 'dist', 'ui.js');
const cssPath = path.join(__dirname, 'dist', 'ui.css');
const htmlPath = path.join(__dirname, 'dist', 'ui.html');

if (!fs.existsSync(jsPath)) {
  console.error('❌ dist/ui.js not found! Run esbuild first.');
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.error('❌ dist/ui.css not found! Check copy:assets.');
  process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
console.log(`✅ Read ui.js (${Math.round(jsContent.length / 1024)}KB)`);
console.log(`✅ Read ui.css (${Math.round(cssContent.length / 1024)}KB)`);

// Create HTML with inline JS and CSS
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DesignAI</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
${jsContent}
  </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`✅ Wrote ${htmlPath} with inline JS + CSS`);
console.log('🎉 Build complete!');
