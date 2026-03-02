# Refactor Plan - AI Semantic Detection

## Current State (e871e08)
- `exportToCode(format, apiKey, provider)` requires API key
- Breaks if no API key provided
- UI must pass apiKey explicitly

## Original State (4596e55)
- `exportToCode(format)` simple signature
- Generates divs everywhere (no semantics)
- Works without API key

## Goal
- `exportToCode(format)` simple signature (like original)
- INSIDE function: load API key from figma.clientStorage
- If API key exists → AI mode (semantic tags + streaming)
- If NO API key → Fallback mode (original simple generation)
- Zero breaking changes for UI

## Implementation

### 1. Keep original functions as fallback
```typescript
// Original simple generation (fallback)
function nodeToJSX(node: SceneNode, indent: string): string {
  // All divs, inline styles, simple
}

function generateReactCode(node: SceneNode): string {
  // Uses nodeToJSX
}
```

### 2. Add AI-powered functions
```typescript
// AI-powered semantic generation
function nodeToJSXWithSemantics(node: SceneNode, semanticMap: Map, indent: string): string {
  // Uses AI-detected tags (button, input, h1, etc.)
}

function generateReactCodeWithSemantics(node: SceneNode, semanticMap: Map): string {
  // Uses nodeToJSXWithSemantics
}
```

### 3. Smart exportToCode
```typescript
async function exportToCode(format: 'react' | 'vue' | 'html') {
  // Load API key from storage
  const apiKey = await figma.clientStorage.getAsync('designai_api_key');
  const provider = await figma.clientStorage.getAsync('designai_provider');
  
  if (apiKey && apiKey.trim()) {
    // AI MODE 🧠
    // - Extract structure
    // - Call AI for semantic tags
    // - Generate with semantics
    // - Stream line by line
  } else {
    // FALLBACK MODE ⚡
    // - Use original simple generation
    // - Return code instantly
  }
}
```

### 4. UI stays simple
```typescript
// ui.tsx - NO CHANGES
handleExportCode() {
  parent.postMessage({ 
    pluginMessage: { type: 'export-code', format: codeFormat } 
  }, '*');
}
```

## Message Handler
```typescript
else if (msg.type === 'export-code') {
  await exportToCode(msg.format); // No apiKey param!
}
```

## Benefits
- ✅ Backward compatible
- ✅ Works without API key (fallback)
- ✅ Works with API key (AI mode)
- ✅ No UI changes needed
- ✅ Transparent upgrade path
