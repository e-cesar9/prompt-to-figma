// Figma Plugin Backend
// This runs in the Figma plugin sandbox

figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// Store API key (for now, hardcoded - will add auth later)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

interface DesignTokens {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    neutral: Record<string, string>;
    semantic: Record<string, string>;
  };
  typography: {
    fontFamily: string;
    scale: { name: string; size: number; weight: number }[];
  };
  spacing: number[];
  borderRadius: number[];
  shadows: { name: string; x: number; y: number; blur: number; spread: number; color: string }[];
}

interface ComponentSpec {
  name: string;
  type: 'BUTTON' | 'INPUT' | 'CARD' | 'MODAL';
  props: Record<string, any>;
}

// Helper: Convert hex to RGB
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

// Helper: Create text style
function createTextStyle(name: string, fontSize: number, fontWeight: number) {
  const textNode = figma.createText();
  textNode.fontSize = fontSize;
  textNode.fontName = { family: 'Inter', style: fontWeight >= 600 ? 'Bold' : 'Regular' };
  return textNode;
}

// Generate Design System from AI
async function generateDesignSystem(brief: string) {
  figma.ui.postMessage({ type: 'loading', message: 'Asking Claude to design your system...' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `You are a senior product designer. Generate a complete design system based on this brief:

"${brief}"

Output ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "colors": {
    "primary": { "50": "#hex", "100": "#hex", ..., "900": "#hex" },
    "secondary": { "50": "#hex", ..., "900": "#hex" },
    "neutral": { "50": "#hex", ..., "900": "#hex" },
    "semantic": { "success": "#hex", "warning": "#hex", "error": "#hex" }
  },
  "typography": {
    "fontFamily": "Inter",
    "scale": [
      { "name": "h1", "size": 48, "weight": 700 },
      { "name": "h2", "size": 36, "weight": 700 },
      { "name": "h3", "size": 24, "weight": 600 },
      { "name": "body", "size": 16, "weight": 400 },
      { "name": "caption", "size": 12, "weight": 400 }
    ]
  },
  "spacing": [4, 8, 12, 16, 24, 32, 48, 64, 96],
  "borderRadius": [0, 2, 4, 8, 16, 24, 999],
  "shadows": [
    { "name": "sm", "x": 0, "y": 1, "blur": 2, "spread": 0, "color": "rgba(0,0,0,0.05)" },
    { "name": "md", "x": 0, "y": 4, "blur": 6, "spread": -1, "color": "rgba(0,0,0,0.1)" },
    { "name": "lg", "x": 0, "y": 10, "blur": 15, "spread": -3, "color": "rgba(0,0,0,0.1)" }
  ]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON from Claude response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse design tokens from AI response');
    }

    const tokens: DesignTokens = JSON.parse(jsonMatch[0]);

    // Create Figma design system
    await createFigmaDesignSystem(tokens);

    figma.ui.postMessage({ type: 'success', message: 'Design system created! ✨' });
  } catch (error: any) {
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
}

// Create Figma design system from tokens
async function createFigmaDesignSystem(tokens: DesignTokens) {
  const page = figma.createPage();
  page.name = '🎨 Design System';
  figma.currentPage = page;

  // 1. Create color styles
  const colorFrame = figma.createFrame();
  colorFrame.name = 'Colors';
  colorFrame.layoutMode = 'VERTICAL';
  colorFrame.counterAxisSizingMode = 'AUTO';
  colorFrame.primaryAxisSizingMode = 'AUTO';
  colorFrame.itemSpacing = 16;
  colorFrame.paddingLeft = colorFrame.paddingRight = colorFrame.paddingTop = colorFrame.paddingBottom = 24;
  colorFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  let yOffset = 40;

  // Primary colors
  for (const [shade, hex] of Object.entries(tokens.colors.primary)) {
    const colorBox = figma.createRectangle();
    colorBox.name = `Primary/${shade}`;
    colorBox.resize(100, 60);
    colorBox.x = 0;
    colorBox.y = yOffset;
    colorBox.fills = [{ type: 'SOLID', color: hexToRgb(hex) }];
    colorBox.cornerRadius = 8;

    const label = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    label.characters = shade;
    label.fontSize = 12;
    label.x = 10;
    label.y = yOffset + 20;

    colorFrame.appendChild(colorBox);
    colorFrame.appendChild(label);

    yOffset += 80;

    // Create paint style
    const paintStyle = figma.createPaintStyle();
    paintStyle.name = `Primary/${shade}`;
    paintStyle.paints = [{ type: 'SOLID', color: hexToRgb(hex) }];
  }

  page.appendChild(colorFrame);

  // 2. Create typography styles
  const typoFrame = figma.createFrame();
  typoFrame.name = 'Typography';
  typoFrame.layoutMode = 'VERTICAL';
  typoFrame.counterAxisSizingMode = 'AUTO';
  typoFrame.primaryAxisSizingMode = 'AUTO';
  typoFrame.itemSpacing = 16;
  typoFrame.paddingLeft = typoFrame.paddingRight = typoFrame.paddingTop = typoFrame.paddingBottom = 24;
  typoFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  typoFrame.x = 600;

  for (const style of tokens.typography.scale) {
    const textNode = figma.createText();
    await figma.loadFontAsync({
      family: tokens.typography.fontFamily,
      style: style.weight >= 600 ? 'Bold' : 'Regular',
    });
    textNode.characters = `${style.name} - ${style.size}px`;
    textNode.fontSize = style.size;
    textNode.fontName = {
      family: tokens.typography.fontFamily,
      style: style.weight >= 600 ? 'Bold' : 'Regular',
    };

    typoFrame.appendChild(textNode);

    // Create text style
    const textStyle = figma.createTextStyle();
    textStyle.name = style.name;
    textStyle.fontSize = style.size;
    textStyle.fontName = {
      family: tokens.typography.fontFamily,
      style: style.weight >= 600 ? 'Bold' : 'Regular',
    };
  }

  page.appendChild(typoFrame);

  // 3. Create basic components (Button example)
  const componentsFrame = figma.createFrame();
  componentsFrame.name = 'Components';
  componentsFrame.layoutMode = 'VERTICAL';
  componentsFrame.counterAxisSizingMode = 'AUTO';
  componentsFrame.primaryAxisSizingMode = 'AUTO';
  componentsFrame.itemSpacing = 24;
  componentsFrame.paddingLeft = componentsFrame.paddingRight = componentsFrame.paddingTop = componentsFrame.paddingBottom = 24;
  componentsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  componentsFrame.x = 0;
  componentsFrame.y = 800;

  // Create Button component
  const button = figma.createComponent();
  button.name = 'Button/Primary';
  button.resize(120, 40);
  button.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500']) }];
  button.cornerRadius = 8;
  button.layoutMode = 'HORIZONTAL';
  button.counterAxisSizingMode = 'AUTO';
  button.primaryAxisSizingMode = 'AUTO';
  button.paddingLeft = button.paddingRight = 24;
  button.paddingTop = button.paddingBottom = 12;
  button.itemSpacing = 8;
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';

  const buttonText = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  buttonText.characters = 'Button';
  buttonText.fontSize = 14;
  buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  button.appendChild(buttonText);

  componentsFrame.appendChild(button);
  page.appendChild(componentsFrame);

  figma.viewport.scrollAndZoomIntoView([colorFrame, typoFrame, componentsFrame]);
}

// Generate screen from text
async function generateScreen(prompt: string) {
  figma.ui.postMessage({ type: 'loading', message: 'Generating screen layout...' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Generate a screen layout for: "${prompt}"

Output ONLY valid JSON with this structure:
{
  "screenName": "LoginScreen",
  "width": 375,
  "height": 812,
  "elements": [
    {
      "type": "FRAME",
      "name": "Header",
      "x": 0,
      "y": 0,
      "width": 375,
      "height": 100,
      "fills": [{ "type": "SOLID", "color": { "r": 0.2, "g": 0.4, "b": 0.8 } }]
    },
    {
      "type": "TEXT",
      "name": "Title",
      "x": 24,
      "y": 50,
      "text": "Login",
      "fontSize": 32,
      "fontWeight": 700
    }
  ]
}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Could not parse screen spec');
    }

    const spec = JSON.parse(jsonMatch[0]);
    await createScreenFromSpec(spec);

    figma.ui.postMessage({ type: 'success', message: 'Screen created! 🎨' });
  } catch (error: any) {
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
}

// Create screen from spec
async function createScreenFromSpec(spec: any) {
  const frame = figma.createFrame();
  frame.name = spec.screenName;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  for (const element of spec.elements) {
    if (element.type === 'FRAME') {
      const childFrame = figma.createFrame();
      childFrame.name = element.name;
      childFrame.x = element.x;
      childFrame.y = element.y;
      childFrame.resize(element.width, element.height);
      if (element.fills) {
        childFrame.fills = element.fills;
      }
      frame.appendChild(childFrame);
    } else if (element.type === 'TEXT') {
      const textNode = figma.createText();
      textNode.name = element.name;
      textNode.x = element.x;
      textNode.y = element.y;
      textNode.characters = element.text;
      textNode.fontSize = element.fontSize || 16;
      textNode.fontName = {
        family: 'Inter',
        style: element.fontWeight >= 600 ? 'Bold' : 'Regular',
      };
      frame.appendChild(textNode);
    }
  }

  figma.viewport.scrollAndZoomIntoView([frame]);
}

// Export to code
async function exportToCode(format: 'react' | 'vue' | 'html') {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: 'Please select a frame to export' });
    return;
  }

  const node = selection[0];
  let code = '';

  if (format === 'react') {
    code = generateReactCode(node);
  } else if (format === 'vue') {
    code = generateVueCode(node);
  } else {
    code = generateHTMLCode(node);
  }

  figma.ui.postMessage({ type: 'code-generated', code, format });
}

function generateReactCode(node: SceneNode): string {
  // Simplified React code generation
  const name = node.name.replace(/\s+/g, '');

  let code = `import React from 'react';\n\n`;
  code += `export function ${name}() {\n`;
  code += `  return (\n`;
  code += `    <div style={{\n`;

  if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
    const rect = node as RectangleNode;
    code += `      width: '${rect.width}px',\n`;
    code += `      height: '${rect.height}px',\n`;

    if (rect.fills && rect.fills.length > 0) {
      const fill = rect.fills[0] as SolidPaint;
      if (fill.type === 'SOLID') {
        const r = Math.round(fill.color.r * 255);
        const g = Math.round(fill.color.g * 255);
        const b = Math.round(fill.color.b * 255);
        code += `      backgroundColor: 'rgb(${r}, ${g}, ${b})',\n`;
      }
    }
  }

  code += `    }}>\n`;
  code += `      {/* Add children here */}\n`;
  code += `    </div>\n`;
  code += `  );\n`;
  code += `}\n`;

  return code;
}

function generateVueCode(node: SceneNode): string {
  const name = node.name.replace(/\s+/g, '');
  return `<template>\n  <div class="${name.toLowerCase()}">\n    <!-- Component -->\n  </div>\n</template>\n\n<script setup>\n</script>\n\n<style scoped>\n.${name.toLowerCase()} {\n  /* Add styles */\n}\n</style>`;
}

function generateHTMLCode(node: SceneNode): string {
  return `<div>\n  <!-- ${node.name} -->\n</div>`;
}

// Message handlers
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-system') {
    await generateDesignSystem(msg.brief);
  } else if (msg.type === 'generate-screen') {
    await generateScreen(msg.prompt);
  } else if (msg.type === 'export-code') {
    await exportToCode(msg.format);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
