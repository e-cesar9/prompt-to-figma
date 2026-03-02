#!/usr/bin/env node
// Build script that inlines JS into HTML for Figma plugin
const fs = require('fs');
const path = require('path');

console.log('📦 Building with inline JS...');

// Read the bundled JS
const jsPath = path.join(__dirname, 'dist', 'ui.js');
const htmlPath = path.join(__dirname, 'dist', 'ui.html');

if (!fs.existsSync(jsPath)) {
  console.error('❌ dist/ui.js not found! Run esbuild first.');
  process.exit(1);
}

const jsContent = fs.readFileSync(jsPath, 'utf8');
console.log(`✅ Read ui.js (${Math.round(jsContent.length / 1024)}KB)`);

// Create HTML with inline JS
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DesignAI</title>
  <link rel="stylesheet" href="ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #root {
      width: 100%;
      height: 100vh;
    }
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
console.log(`✅ Wrote ${htmlPath} with inline JS`);
console.log('🎉 Build complete!');
