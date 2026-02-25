// Figma Plugin Backend
// This runs in the Figma plugin sandbox

figma.showUI(__html__, { width: 420, height: 650, themeColors: true });

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

// AI API call handler - supports both Anthropic and OpenAI
async function callAI(prompt: string, apiKey: string, provider: 'anthropic' | 'openai'): Promise<string> {
  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } else {
    // OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// Generate Design System from AI
async function generateDesignSystem(brief: string, apiKey: string, provider: 'anthropic' | 'openai') {
  figma.ui.postMessage({ type: 'loading', message: 'Asking AI to design your system...' });

  try {
    const prompt = `You are a senior product designer. Generate a complete design system based on this brief:

"${brief}"

Output ONLY valid JSON (no markdown, no explanation, no code blocks) with this exact structure:
{
  "colors": {
    "primary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "secondary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "neutral": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "semantic": { "success": "#hex", "warning": "#hex", "error": "#hex", "info": "#hex" }
  },
  "typography": {
    "fontFamily": "Inter",
    "scale": [
      { "name": "Display", "size": 56, "weight": 700 },
      { "name": "H1", "size": 40, "weight": 700 },
      { "name": "H2", "size": 32, "weight": 600 },
      { "name": "H3", "size": 24, "weight": 600 },
      { "name": "H4", "size": 20, "weight": 600 },
      { "name": "Body Large", "size": 18, "weight": 400 },
      { "name": "Body", "size": 16, "weight": 400 },
      { "name": "Body Small", "size": 14, "weight": 400 },
      { "name": "Caption", "size": 12, "weight": 400 },
      { "name": "Overline", "size": 10, "weight": 600 }
    ]
  },
  "spacing": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  "borderRadius": [0, 2, 4, 6, 8, 12, 16, 24, 9999],
  "shadows": [
    { "name": "xs", "x": 0, "y": 1, "blur": 2, "spread": 0, "color": "rgba(0,0,0,0.05)" },
    { "name": "sm", "x": 0, "y": 2, "blur": 4, "spread": -1, "color": "rgba(0,0,0,0.06)" },
    { "name": "md", "x": 0, "y": 4, "blur": 8, "spread": -2, "color": "rgba(0,0,0,0.08)" },
    { "name": "lg", "x": 0, "y": 8, "blur": 16, "spread": -4, "color": "rgba(0,0,0,0.1)" },
    { "name": "xl", "x": 0, "y": 16, "blur": 32, "spread": -8, "color": "rgba(0,0,0,0.12)" }
  ]
}

Make the colors appropriate for the brief. Be creative but professional.`;

    const content = await callAI(prompt, apiKey, provider);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse design tokens from AI response');
    }

    const tokens: DesignTokens = JSON.parse(jsonMatch[0]);

    // Create Figma design system
    await createFigmaDesignSystem(tokens, brief);

    figma.ui.postMessage({ type: 'success', message: 'Design system created! ✨' });
  } catch (error: any) {
    console.error('Error generating design system:', error);
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
}

// Create Figma design system from tokens
async function createFigmaDesignSystem(tokens: DesignTokens, brief: string) {
  // Load fonts first
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const page = figma.createPage();
  page.name = `🎨 Design System - ${brief.slice(0, 30)}...`;
  figma.currentPage = page;

  // Main container frame
  const mainFrame = figma.createFrame();
  mainFrame.name = 'Design System';
  mainFrame.layoutMode = 'VERTICAL';
  mainFrame.primaryAxisSizingMode = 'AUTO';
  mainFrame.counterAxisSizingMode = 'AUTO';
  mainFrame.itemSpacing = 64;
  mainFrame.paddingLeft = mainFrame.paddingRight = mainFrame.paddingTop = mainFrame.paddingBottom = 48;
  mainFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];

  // Title
  const title = figma.createText();
  title.characters = '🎨 Design System';
  title.fontSize = 40;
  title.fontName = { family: 'Inter', style: 'Bold' };
  mainFrame.appendChild(title);

  const subtitle = figma.createText();
  subtitle.characters = `Generated from: "${brief}"`;
  subtitle.fontSize = 16;
  subtitle.fontName = { family: 'Inter', style: 'Regular' };
  subtitle.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  mainFrame.appendChild(subtitle);

  // === COLORS SECTION ===
  const colorsSection = createSection('🎨 Colors');
  
  // Create color palettes
  for (const [paletteName, palette] of Object.entries(tokens.colors)) {
    if (typeof palette === 'object') {
      const paletteFrame = figma.createFrame();
      paletteFrame.name = paletteName;
      paletteFrame.layoutMode = 'VERTICAL';
      paletteFrame.primaryAxisSizingMode = 'AUTO';
      paletteFrame.counterAxisSizingMode = 'AUTO';
      paletteFrame.itemSpacing = 8;

      const paletteLabel = figma.createText();
      paletteLabel.characters = paletteName.charAt(0).toUpperCase() + paletteName.slice(1);
      paletteLabel.fontSize = 14;
      paletteLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
      paletteFrame.appendChild(paletteLabel);

      const swatchRow = figma.createFrame();
      swatchRow.name = 'Swatches';
      swatchRow.layoutMode = 'HORIZONTAL';
      swatchRow.primaryAxisSizingMode = 'AUTO';
      swatchRow.counterAxisSizingMode = 'AUTO';
      swatchRow.itemSpacing = 4;

      for (const [shade, hex] of Object.entries(palette)) {
        const swatchContainer = figma.createFrame();
        swatchContainer.layoutMode = 'VERTICAL';
        swatchContainer.primaryAxisSizingMode = 'AUTO';
        swatchContainer.counterAxisSizingMode = 'AUTO';
        swatchContainer.itemSpacing = 4;

        const swatch = figma.createRectangle();
        swatch.name = `${paletteName}/${shade}`;
        swatch.resize(60, 60);
        swatch.fills = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
        swatch.cornerRadius = 8;

        const shadeLabel = figma.createText();
        shadeLabel.characters = shade;
        shadeLabel.fontSize = 10;
        shadeLabel.fontName = { family: 'Inter', style: 'Medium' };
        shadeLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];

        swatchContainer.appendChild(swatch);
        swatchContainer.appendChild(shadeLabel);
        swatchRow.appendChild(swatchContainer);

        // Create Figma paint style
        const paintStyle = figma.createPaintStyle();
        paintStyle.name = `${paletteName}/${shade}`;
        paintStyle.paints = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
      }

      paletteFrame.appendChild(swatchRow);
      colorsSection.appendChild(paletteFrame);
    }
  }

  mainFrame.appendChild(colorsSection);

  // === TYPOGRAPHY SECTION ===
  const typoSection = createSection('📝 Typography');

  for (const style of tokens.typography.scale) {
    const typoRow = figma.createFrame();
    typoRow.name = style.name;
    typoRow.layoutMode = 'HORIZONTAL';
    typoRow.primaryAxisSizingMode = 'AUTO';
    typoRow.counterAxisSizingMode = 'AUTO';
    typoRow.itemSpacing = 24;
    typoRow.counterAxisAlignItems = 'CENTER';

    const textNode = figma.createText();
    textNode.characters = style.name;
    textNode.fontSize = style.size;
    textNode.fontName = {
      family: 'Inter',
      style: style.weight >= 700 ? 'Bold' : style.weight >= 600 ? 'Semi Bold' : style.weight >= 500 ? 'Medium' : 'Regular',
    };
    typoRow.appendChild(textNode);

    const sizeLabel = figma.createText();
    sizeLabel.characters = `${style.size}px • ${style.weight}`;
    sizeLabel.fontSize = 12;
    sizeLabel.fontName = { family: 'Inter', style: 'Regular' };
    sizeLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    typoRow.appendChild(sizeLabel);

    typoSection.appendChild(typoRow);

    // Create text style
    const textStyle = figma.createTextStyle();
    textStyle.name = style.name;
    textStyle.fontSize = style.size;
    textStyle.fontName = {
      family: 'Inter',
      style: style.weight >= 700 ? 'Bold' : style.weight >= 600 ? 'Semi Bold' : style.weight >= 500 ? 'Medium' : 'Regular',
    };
  }

  mainFrame.appendChild(typoSection);

  // === SPACING SECTION ===
  const spacingSection = createSection('📐 Spacing');
  const spacingRow = figma.createFrame();
  spacingRow.layoutMode = 'HORIZONTAL';
  spacingRow.primaryAxisSizingMode = 'AUTO';
  spacingRow.counterAxisSizingMode = 'AUTO';
  spacingRow.itemSpacing = 16;
  spacingRow.counterAxisAlignItems = 'MAX';

  for (const space of tokens.spacing) {
    const spacingItem = figma.createFrame();
    spacingItem.layoutMode = 'VERTICAL';
    spacingItem.primaryAxisSizingMode = 'AUTO';
    spacingItem.counterAxisSizingMode = 'AUTO';
    spacingItem.itemSpacing = 4;
    spacingItem.counterAxisAlignItems = 'CENTER';

    const spacingBox = figma.createRectangle();
    spacingBox.name = `spacing-${space}`;
    spacingBox.resize(space, Math.min(space, 64));
    spacingBox.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
    spacingBox.cornerRadius = 4;

    const label = figma.createText();
    label.characters = `${space}`;
    label.fontSize = 10;
    label.fontName = { family: 'Inter', style: 'Medium' };

    spacingItem.appendChild(spacingBox);
    spacingItem.appendChild(label);
    spacingRow.appendChild(spacingItem);
  }

  spacingSection.appendChild(spacingRow);
  mainFrame.appendChild(spacingSection);

  // === COMPONENTS SECTION ===
  const componentsSection = createSection('🧩 Components');

  // Create Button component
  const button = figma.createComponent();
  button.name = 'Button/Primary';
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisSizingMode = 'AUTO';
  button.counterAxisSizingMode = 'AUTO';
  button.paddingLeft = button.paddingRight = 24;
  button.paddingTop = button.paddingBottom = 12;
  button.itemSpacing = 8;
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
  button.cornerRadius = 8;

  const buttonText = figma.createText();
  buttonText.characters = 'Button';
  buttonText.fontSize = 14;
  buttonText.fontName = { family: 'Inter', style: 'Semi Bold' };
  buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  button.appendChild(buttonText);

  // Create secondary button
  const buttonSecondary = figma.createComponent();
  buttonSecondary.name = 'Button/Secondary';
  buttonSecondary.layoutMode = 'HORIZONTAL';
  buttonSecondary.primaryAxisSizingMode = 'AUTO';
  buttonSecondary.counterAxisSizingMode = 'AUTO';
  buttonSecondary.paddingLeft = buttonSecondary.paddingRight = 24;
  buttonSecondary.paddingTop = buttonSecondary.paddingBottom = 12;
  buttonSecondary.itemSpacing = 8;
  buttonSecondary.primaryAxisAlignItems = 'CENTER';
  buttonSecondary.counterAxisAlignItems = 'CENTER';
  buttonSecondary.fills = [];
  buttonSecondary.strokes = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
  buttonSecondary.strokeWeight = 2;
  buttonSecondary.cornerRadius = 8;

  const buttonSecondaryText = figma.createText();
  buttonSecondaryText.characters = 'Secondary';
  buttonSecondaryText.fontSize = 14;
  buttonSecondaryText.fontName = { family: 'Inter', style: 'Semi Bold' };
  buttonSecondaryText.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
  buttonSecondary.appendChild(buttonSecondaryText);

  // Create Input component
  const input = figma.createComponent();
  input.name = 'Input/Default';
  input.layoutMode = 'HORIZONTAL';
  input.primaryAxisSizingMode = 'FIXED';
  input.counterAxisSizingMode = 'AUTO';
  input.resize(280, 48);
  input.paddingLeft = input.paddingRight = 16;
  input.paddingTop = input.paddingBottom = 12;
  input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  input.strokes = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['300'] || '#D1D5DB') }];
  input.strokeWeight = 1;
  input.cornerRadius = 8;

  const inputText = figma.createText();
  inputText.characters = 'Placeholder text';
  inputText.fontSize = 14;
  inputText.fontName = { family: 'Inter', style: 'Regular' };
  inputText.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['400'] || '#9CA3AF') }];
  input.appendChild(inputText);

  // Create Card component
  const card = figma.createComponent();
  card.name = 'Card/Default';
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'AUTO';
  card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 24;
  card.itemSpacing = 16;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 12;
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 4 },
    radius: 12,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];

  const cardTitle = figma.createText();
  cardTitle.characters = 'Card Title';
  cardTitle.fontSize = 18;
  cardTitle.fontName = { family: 'Inter', style: 'Semi Bold' };

  const cardBody = figma.createText();
  cardBody.characters = 'Card description text goes here. This is a reusable card component.';
  cardBody.fontSize = 14;
  cardBody.fontName = { family: 'Inter', style: 'Regular' };
  cardBody.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['600'] || '#4B5563') }];
  cardBody.resize(280, cardBody.height);
  cardBody.textAutoResize = 'HEIGHT';

  card.appendChild(cardTitle);
  card.appendChild(cardBody);

  // Add components to section
  const componentsRow = figma.createFrame();
  componentsRow.layoutMode = 'HORIZONTAL';
  componentsRow.primaryAxisSizingMode = 'AUTO';
  componentsRow.counterAxisSizingMode = 'AUTO';
  componentsRow.itemSpacing = 32;

  componentsRow.appendChild(button);
  componentsRow.appendChild(buttonSecondary);
  componentsSection.appendChild(componentsRow);
  componentsSection.appendChild(input);
  componentsSection.appendChild(card);

  mainFrame.appendChild(componentsSection);
  page.appendChild(mainFrame);

  figma.viewport.scrollAndZoomIntoView([mainFrame]);
}

function createSection(title: string): FrameNode {
  const section = figma.createFrame();
  section.name = title;
  section.layoutMode = 'VERTICAL';
  section.primaryAxisSizingMode = 'AUTO';
  section.counterAxisSizingMode = 'AUTO';
  section.itemSpacing = 24;

  const titleNode = figma.createText();
  titleNode.characters = title;
  titleNode.fontSize = 24;
  titleNode.fontName = { family: 'Inter', style: 'Bold' };
  section.appendChild(titleNode);

  return section;
}

// Generate screen from text
async function generateScreen(prompt: string, apiKey: string, provider: 'anthropic' | 'openai') {
  figma.ui.postMessage({ type: 'loading', message: 'Generating screen layout...' });

  try {
    const aiPrompt = `Generate a mobile app screen layout for: "${prompt}"

Output ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "screenName": "ScreenName",
  "width": 375,
  "height": 812,
  "backgroundColor": "#FFFFFF",
  "elements": [
    {
      "type": "FRAME",
      "name": "Header",
      "x": 0,
      "y": 0,
      "width": 375,
      "height": 100,
      "color": "#3B82F6",
      "cornerRadius": 0
    },
    {
      "type": "TEXT",
      "name": "Title",
      "x": 24,
      "y": 60,
      "text": "Title",
      "fontSize": 24,
      "fontWeight": 700,
      "color": "#FFFFFF"
    },
    {
      "type": "RECTANGLE",
      "name": "Button",
      "x": 24,
      "y": 200,
      "width": 327,
      "height": 48,
      "color": "#3B82F6",
      "cornerRadius": 8
    }
  ]
}

Be detailed and create a realistic screen layout. Use appropriate colors and spacing.`;

    const content = await callAI(aiPrompt, apiKey, provider);
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Could not parse screen spec');
    }

    const spec = JSON.parse(jsonMatch[0]);
    await createScreenFromSpec(spec);

    figma.ui.postMessage({ type: 'success', message: 'Screen created! 🎨' });
  } catch (error: any) {
    console.error('Error generating screen:', error);
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
}

// Create screen from spec
async function createScreenFromSpec(spec: any) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const frame = figma.createFrame();
  frame.name = spec.screenName || 'Generated Screen';
  frame.resize(spec.width || 375, spec.height || 812);
  frame.fills = [{ type: 'SOLID', color: hexToRgb(spec.backgroundColor || '#FFFFFF') }];

  for (const element of (spec.elements || [])) {
    try {
      if (element.type === 'FRAME') {
        const childFrame = figma.createFrame();
        childFrame.name = element.name || 'Frame';
        childFrame.x = element.x || 0;
        childFrame.y = element.y || 0;
        childFrame.resize(element.width || 100, element.height || 100);
        if (element.color) {
          childFrame.fills = [{ type: 'SOLID', color: hexToRgb(element.color) }];
        }
        if (element.cornerRadius) {
          childFrame.cornerRadius = element.cornerRadius;
        }
        frame.appendChild(childFrame);
      } else if (element.type === 'TEXT') {
        const textNode = figma.createText();
        textNode.name = element.name || 'Text';
        textNode.x = element.x || 0;
        textNode.y = element.y || 0;
        textNode.characters = element.text || '';
        textNode.fontSize = element.fontSize || 16;
        textNode.fontName = {
          family: 'Inter',
          style: (element.fontWeight || 400) >= 700 ? 'Bold' : (element.fontWeight || 400) >= 600 ? 'Semi Bold' : 'Regular',
        };
        if (element.color) {
          textNode.fills = [{ type: 'SOLID', color: hexToRgb(element.color) }];
        }
        frame.appendChild(textNode);
      } else if (element.type === 'RECTANGLE') {
        const rect = figma.createRectangle();
        rect.name = element.name || 'Rectangle';
        rect.x = element.x || 0;
        rect.y = element.y || 0;
        rect.resize(element.width || 100, element.height || 100);
        if (element.color) {
          rect.fills = [{ type: 'SOLID', color: hexToRgb(element.color) }];
        }
        if (element.cornerRadius) {
          rect.cornerRadius = element.cornerRadius;
        }
        frame.appendChild(rect);
      }
    } catch (e) {
      console.error('Error creating element:', element, e);
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
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '');
  let styles: string[] = [];

  if (node.type === 'FRAME' || node.type === 'RECTANGLE' || node.type === 'COMPONENT') {
    const rect = node as FrameNode;
    styles.push(`width: ${Math.round(rect.width)}px`);
    styles.push(`height: ${Math.round(rect.height)}px`);

    if (rect.fills && Array.isArray(rect.fills) && rect.fills.length > 0) {
      const fill = rect.fills[0] as SolidPaint;
      if (fill.type === 'SOLID') {
        const r = Math.round(fill.color.r * 255);
        const g = Math.round(fill.color.g * 255);
        const b = Math.round(fill.color.b * 255);
        styles.push(`backgroundColor: 'rgb(${r}, ${g}, ${b})'`);
      }
    }

    if ('cornerRadius' in rect && rect.cornerRadius && typeof rect.cornerRadius === 'number') {
      styles.push(`borderRadius: ${rect.cornerRadius}px`);
    }
  }

  return `import React from 'react';

export function ${name || 'Component'}() {
  return (
    <div
      style={{
        ${styles.join(',\n        ')}
      }}
    >
      {/* Add your content here */}
    </div>
  );
}

export default ${name || 'Component'};`;
}

function generateVueCode(node: SceneNode): string {
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `<template>
  <div class="${name}">
    <!-- Add your content here -->
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.${name} {
  /* Add your styles here */
}
</style>`;
}

function generateHTMLCode(node: SceneNode): string {
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${node.name}</title>
  <style>
    .${name} {
      /* Add your styles here */
    }
  </style>
</head>
<body>
  <div class="${name}">
    <!-- ${node.name} -->
  </div>
</body>
</html>`;
}

// Message handlers
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-system') {
    await generateDesignSystem(msg.brief, msg.apiKey, msg.provider || 'anthropic');
  } else if (msg.type === 'generate-screen') {
    await generateScreen(msg.prompt, msg.apiKey, msg.provider || 'anthropic');
  } else if (msg.type === 'export-code') {
    await exportToCode(msg.format);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
