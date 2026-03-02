// Ultra minimal test - no TypeScript, no React, no nothing
console.log('🔥🔥🔥 MINIMAL JS LOADED 🔥🔥🔥');

var root = document.getElementById('root');
console.log('Root element found:', root);

if (root) {
  root.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1 style="color: green;">✅ MINIMAL JS WORKS!</h1><p>The bundled ui.js file executed successfully.</p></div>';
  console.log('✅ Content injected!');
} else {
  console.error('❌ Root not found!');
}
