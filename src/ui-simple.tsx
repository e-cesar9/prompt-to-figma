// Simplified React test - no complex logic
console.log('🔥 ui-simple.tsx loaded!');

const rootEl = document.getElementById('root');
console.log('Root element:', rootEl);

if (rootEl) {
  rootEl.innerHTML = `
    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1 style="color: #4CAF50;">✅ React Script Loaded!</h1>
      <p>If you see this, the JavaScript is executing.</p>
      <p style="color: #666; font-size: 12px;">Next step: Full React mount test</p>
    </div>
  `;
  console.log('✅ Content injected into root!');
} else {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Root element not found</div>';
}
