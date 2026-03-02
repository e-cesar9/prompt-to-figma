// Figma Plugin Backend - Complete Design System Generator
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
    scale: { name: string; size: number; weight: number; lineHeight: number }[];
  };
  spacing: number[];
  borderRadius: number[];
  shadows: { name: string; x: number; y: number; blur: number; spread: number; color: string }[];
  darkMode: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
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

function hexToRgba(hex: string, alpha: number): RGBA {
  const rgb = hexToRgb(hex);
  return { ...rgb, a: alpha };
}

// AI API call handler - supports Anthropic, OpenAI, and DeepSeek
async function callAI(prompt: string, apiKey: string, provider: 'anthropic' | 'openai' | 'deepseek'): Promise<string> {
  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20241022',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } else if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
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
  } else {
    // DeepSeek - using deepseek-chat (v3.2, 128K context)
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// Generate Design System from AI
async function generateDesignSystem(brief: string, apiKey: string, provider: 'anthropic' | 'openai') {
  figma.ui.postMessage({ type: 'loading', message: 'Generating complete design system...' });

  try {
    const prompt = `You are a senior product designer at a top design agency. Generate a COMPLETE, production-ready design system based on this brief:

"${brief}"

Output ONLY valid JSON (no markdown, no explanation, no code blocks) with this exact structure:
{
  "colors": {
    "primary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
    "secondary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
    "neutral": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
    "semantic": { "success": "#hex", "successLight": "#hex", "warning": "#hex", "warningLight": "#hex", "error": "#hex", "errorLight": "#hex", "info": "#hex", "infoLight": "#hex" }
  },
  "typography": {
    "fontFamily": "Inter",
    "scale": [
      { "name": "Display XL", "size": 72, "weight": 700, "lineHeight": 1.1 },
      { "name": "Display", "size": 56, "weight": 700, "lineHeight": 1.1 },
      { "name": "H1", "size": 40, "weight": 700, "lineHeight": 1.2 },
      { "name": "H2", "size": 32, "weight": 600, "lineHeight": 1.25 },
      { "name": "H3", "size": 24, "weight": 600, "lineHeight": 1.3 },
      { "name": "H4", "size": 20, "weight": 600, "lineHeight": 1.35 },
      { "name": "H5", "size": 18, "weight": 600, "lineHeight": 1.4 },
      { "name": "Body XL", "size": 20, "weight": 400, "lineHeight": 1.6 },
      { "name": "Body Large", "size": 18, "weight": 400, "lineHeight": 1.6 },
      { "name": "Body", "size": 16, "weight": 400, "lineHeight": 1.6 },
      { "name": "Body Small", "size": 14, "weight": 400, "lineHeight": 1.5 },
      { "name": "Caption", "size": 12, "weight": 400, "lineHeight": 1.5 },
      { "name": "Overline", "size": 11, "weight": 600, "lineHeight": 1.4 },
      { "name": "Label", "size": 14, "weight": 500, "lineHeight": 1.4 }
    ]
  },
  "spacing": [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128],
  "borderRadius": [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 9999],
  "shadows": [
    { "name": "xs", "x": 0, "y": 1, "blur": 2, "spread": 0, "color": "rgba(0,0,0,0.04)" },
    { "name": "sm", "x": 0, "y": 2, "blur": 4, "spread": -1, "color": "rgba(0,0,0,0.06)" },
    { "name": "md", "x": 0, "y": 4, "blur": 8, "spread": -2, "color": "rgba(0,0,0,0.08)" },
    { "name": "lg", "x": 0, "y": 8, "blur": 16, "spread": -4, "color": "rgba(0,0,0,0.1)" },
    { "name": "xl", "x": 0, "y": 16, "blur": 24, "spread": -6, "color": "rgba(0,0,0,0.12)" },
    { "name": "2xl", "x": 0, "y": 24, "blur": 48, "spread": -12, "color": "rgba(0,0,0,0.16)" }
  ],
  "darkMode": {
    "background": "#hex",
    "surface": "#hex",
    "surfaceElevated": "#hex",
    "text": "#hex",
    "textSecondary": "#hex",
    "border": "#hex"
  }
}

Make the colors appropriate and harmonious for the brief. Be creative but professional. Ensure good contrast ratios for accessibility.`;

    const content = await callAI(prompt, apiKey, provider);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse design tokens from AI response');
    }

    const tokens: DesignTokens = JSON.parse(jsonMatch[0]);

    // Create Figma design system
    await createFigmaDesignSystem(tokens, brief);

    figma.ui.postMessage({ type: 'success', message: 'Complete design system created! ✨' });
  } catch (error: any) {
    console.error('Error generating design system:', error);
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
}

// Create Figma design system from tokens
// Helper: Small delay for progressive creation effect
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createFigmaDesignSystem(tokens: DesignTokens, brief: string) {
  figma.ui.postMessage({ type: 'progress', message: '⏳ Loading fonts...', step: 0, total: 7 });
  
  // Load fonts first
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const page = figma.createPage();
  page.name = `🎨 Design System`;
  figma.currentPage = page;

  let xOffset = 0;
  const sectionGap = 100;

  // === 1. COLORS SECTION ===
  figma.ui.postMessage({ type: 'progress', message: '🎨 Creating color palettes...', step: 1, total: 7 });
  const colorsFrame = await createColorsSection(tokens);
  colorsFrame.x = xOffset;
  colorsFrame.y = 0;
  page.appendChild(colorsFrame);
  figma.viewport.scrollAndZoomIntoView([colorsFrame]); // Show it immediately
  await delay(300);
  xOffset += colorsFrame.width + sectionGap;

  // === 2. TYPOGRAPHY SECTION ===
  figma.ui.postMessage({ type: 'progress', message: '📝 Creating typography scale...', step: 2, total: 7 });
  const typoFrame = await createTypographySection(tokens);
  typoFrame.x = xOffset;
  typoFrame.y = 0;
  page.appendChild(typoFrame);
  await delay(300);
  xOffset += typoFrame.width + sectionGap;

  // === 3. SPACING SECTION ===
  figma.ui.postMessage({ type: 'progress', message: '📐 Creating spacing system...', step: 3, total: 7 });
  const spacingFrame = await createSpacingSection(tokens);
  spacingFrame.x = xOffset;
  spacingFrame.y = 0;
  page.appendChild(spacingFrame);
  await delay(300);
  xOffset += spacingFrame.width + sectionGap;

  // === 4. SHADOWS SECTION ===
  figma.ui.postMessage({ type: 'progress', message: '🌑 Creating shadow styles...', step: 4, total: 7 });
  const shadowsFrame = await createShadowsSection(tokens);
  shadowsFrame.x = xOffset;
  shadowsFrame.y = 0;
  page.appendChild(shadowsFrame);
  await delay(300);
  xOffset += shadowsFrame.width + sectionGap;

  // === 5. COMPONENTS SECTION (Light Mode) ===
  figma.ui.postMessage({ type: 'progress', message: '🧩 Creating light mode components...', step: 5, total: 7 });
  const componentsFrame = await createComponentsSection(tokens, false);
  componentsFrame.x = 0;
  componentsFrame.y = 900;
  page.appendChild(componentsFrame);
  await delay(500);

  // === 6. COMPONENTS SECTION (Dark Mode) ===
  figma.ui.postMessage({ type: 'progress', message: '🌙 Creating dark mode components...', step: 6, total: 7 });
  const darkComponentsFrame = await createComponentsSection(tokens, true);
  darkComponentsFrame.x = componentsFrame.width + sectionGap;
  darkComponentsFrame.y = 900;
  page.appendChild(darkComponentsFrame);
  await delay(500);

  // === 7. ICONS PLACEHOLDER ===
  figma.ui.postMessage({ type: 'progress', message: '🎯 Creating icons section...', step: 7, total: 7 });
  const iconsFrame = await createIconsSection(tokens);
  iconsFrame.x = 0;
  iconsFrame.y = 2200;
  page.appendChild(iconsFrame);
  await delay(200);

  figma.viewport.scrollAndZoomIntoView([colorsFrame]);
}

// === COLORS SECTION ===
async function createColorsSection(tokens: DesignTokens): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '🎨 Colors';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 32;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 16;

  // Title
  const title = figma.createText();
  title.characters = '🎨 Colors';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  frame.appendChild(title);

  // Create color palettes
  for (const [paletteName, palette] of Object.entries(tokens.colors)) {
    if (typeof palette !== 'object') continue;

    const paletteFrame = figma.createFrame();
    paletteFrame.name = paletteName;
    paletteFrame.layoutMode = 'VERTICAL';
    paletteFrame.primaryAxisSizingMode = 'AUTO';
    paletteFrame.counterAxisSizingMode = 'AUTO';
    paletteFrame.itemSpacing = 12;

    const paletteLabel = figma.createText();
    paletteLabel.characters = paletteName.charAt(0).toUpperCase() + paletteName.slice(1);
    paletteLabel.fontSize = 16;
    paletteLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
    paletteFrame.appendChild(paletteLabel);

    const swatchRow = figma.createFrame();
    swatchRow.name = 'Swatches';
    swatchRow.layoutMode = 'HORIZONTAL';
    swatchRow.primaryAxisSizingMode = 'AUTO';
    swatchRow.counterAxisSizingMode = 'AUTO';
    swatchRow.itemSpacing = 8;

    for (const [shade, hex] of Object.entries(palette)) {
      const swatchContainer = figma.createFrame();
      swatchContainer.layoutMode = 'VERTICAL';
      swatchContainer.primaryAxisSizingMode = 'AUTO';
      swatchContainer.counterAxisSizingMode = 'AUTO';
      swatchContainer.itemSpacing = 6;
      swatchContainer.counterAxisAlignItems = 'CENTER';

      const swatch = figma.createRectangle();
      swatch.name = `${paletteName}/${shade}`;
      swatch.resize(56, 56);
      swatch.fills = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
      swatch.cornerRadius = 8;
      swatch.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 2 },
        radius: 4,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL'
      }];

      const shadeLabel = figma.createText();
      shadeLabel.characters = shade;
      shadeLabel.fontSize = 10;
      shadeLabel.fontName = { family: 'Inter', style: 'Medium' };
      shadeLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

      swatchContainer.appendChild(swatch);
      swatchContainer.appendChild(shadeLabel);
      swatchRow.appendChild(swatchContainer);

      // Create Figma paint style
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = `${paletteName}/${shade}`;
      paintStyle.paints = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
    }

    paletteFrame.appendChild(swatchRow);
    frame.appendChild(paletteFrame);
  }

  // Dark Mode Colors
  if (tokens.darkMode) {
    const darkFrame = figma.createFrame();
    darkFrame.name = 'Dark Mode';
    darkFrame.layoutMode = 'VERTICAL';
    darkFrame.primaryAxisSizingMode = 'AUTO';
    darkFrame.counterAxisSizingMode = 'AUTO';
    darkFrame.itemSpacing = 12;

    const darkLabel = figma.createText();
    darkLabel.characters = 'Dark Mode';
    darkLabel.fontSize = 16;
    darkLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
    darkFrame.appendChild(darkLabel);

    const darkSwatchRow = figma.createFrame();
    darkSwatchRow.layoutMode = 'HORIZONTAL';
    darkSwatchRow.primaryAxisSizingMode = 'AUTO';
    darkSwatchRow.counterAxisSizingMode = 'AUTO';
    darkSwatchRow.itemSpacing = 8;

    for (const [name, hex] of Object.entries(tokens.darkMode)) {
      const swatchContainer = figma.createFrame();
      swatchContainer.layoutMode = 'VERTICAL';
      swatchContainer.primaryAxisSizingMode = 'AUTO';
      swatchContainer.counterAxisSizingMode = 'AUTO';
      swatchContainer.itemSpacing = 6;
      swatchContainer.counterAxisAlignItems = 'CENTER';

      const swatch = figma.createRectangle();
      swatch.name = `dark/${name}`;
      swatch.resize(56, 56);
      swatch.fills = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
      swatch.cornerRadius = 8;
      swatch.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      swatch.strokeWeight = 1;

      const label = figma.createText();
      label.characters = name;
      label.fontSize = 9;
      label.fontName = { family: 'Inter', style: 'Medium' };
      label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

      swatchContainer.appendChild(swatch);
      swatchContainer.appendChild(label);
      darkSwatchRow.appendChild(swatchContainer);

      // Create paint style for dark mode
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = `dark/${name}`;
      paintStyle.paints = [{ type: 'SOLID', color: hexToRgb(hex as string) }];
    }

    darkFrame.appendChild(darkSwatchRow);
    frame.appendChild(darkFrame);
  }

  return frame;
}

// === TYPOGRAPHY SECTION ===
async function createTypographySection(tokens: DesignTokens): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '📝 Typography';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 24;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 16;

  const title = figma.createText();
  title.characters = '📝 Typography';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  frame.appendChild(title);

  const fontInfo = figma.createText();
  fontInfo.characters = `Font: ${tokens.typography.fontFamily}`;
  fontInfo.fontSize = 14;
  fontInfo.fontName = { family: 'Inter', style: 'Regular' };
  fontInfo.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
  frame.appendChild(fontInfo);

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
    textNode.lineHeight = { value: style.size * (style.lineHeight || 1.5), unit: 'PIXELS' };
    textNode.fontName = {
      family: 'Inter',
      style: style.weight >= 700 ? 'Bold' : style.weight >= 600 ? 'Semi Bold' : style.weight >= 500 ? 'Medium' : 'Regular',
    };
    typoRow.appendChild(textNode);

    const sizeLabel = figma.createText();
    sizeLabel.characters = `${style.size}px • ${style.weight} • ${style.lineHeight || 1.5}`;
    sizeLabel.fontSize = 12;
    sizeLabel.fontName = { family: 'Inter', style: 'Regular' };
    sizeLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    typoRow.appendChild(sizeLabel);

    frame.appendChild(typoRow);

    // Create text style
    const textStyle = figma.createTextStyle();
    textStyle.name = style.name;
    textStyle.fontSize = style.size;
    textStyle.lineHeight = { value: style.size * (style.lineHeight || 1.5), unit: 'PIXELS' };
    textStyle.fontName = {
      family: 'Inter',
      style: style.weight >= 700 ? 'Bold' : style.weight >= 600 ? 'Semi Bold' : style.weight >= 500 ? 'Medium' : 'Regular',
    };
  }

  return frame;
}

// === SPACING SECTION ===
async function createSpacingSection(tokens: DesignTokens): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '📐 Spacing';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 24;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 16;

  const title = figma.createText();
  title.characters = '📐 Spacing';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  frame.appendChild(title);

  const spacingGrid = figma.createFrame();
  spacingGrid.layoutMode = 'HORIZONTAL';
  spacingGrid.primaryAxisSizingMode = 'AUTO';
  spacingGrid.counterAxisSizingMode = 'AUTO';
  spacingGrid.itemSpacing = 16;
  spacingGrid.counterAxisAlignItems = 'MAX';
  spacingGrid.layoutWrap = 'WRAP';
  spacingGrid.maxWidth = 600;

  for (const space of tokens.spacing) {
    if (space === 0) continue;
    
    const spacingItem = figma.createFrame();
    spacingItem.layoutMode = 'VERTICAL';
    spacingItem.primaryAxisSizingMode = 'AUTO';
    spacingItem.counterAxisSizingMode = 'AUTO';
    spacingItem.itemSpacing = 8;
    spacingItem.counterAxisAlignItems = 'CENTER';

    const spacingBox = figma.createRectangle();
    spacingBox.name = `spacing-${space}`;
    const displaySize = Math.min(space, 64);
    spacingBox.resize(displaySize, displaySize);
    spacingBox.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
    spacingBox.cornerRadius = 4;

    const label = figma.createText();
    label.characters = `${space}`;
    label.fontSize = 11;
    label.fontName = { family: 'Inter', style: 'Semi Bold' };

    spacingItem.appendChild(spacingBox);
    spacingItem.appendChild(label);
    spacingGrid.appendChild(spacingItem);
  }

  frame.appendChild(spacingGrid);

  // Border Radius
  const radiusTitle = figma.createText();
  radiusTitle.characters = 'Border Radius';
  radiusTitle.fontSize = 18;
  radiusTitle.fontName = { family: 'Inter', style: 'Semi Bold' };
  frame.appendChild(radiusTitle);

  const radiusGrid = figma.createFrame();
  radiusGrid.layoutMode = 'HORIZONTAL';
  radiusGrid.primaryAxisSizingMode = 'AUTO';
  radiusGrid.counterAxisSizingMode = 'AUTO';
  radiusGrid.itemSpacing = 12;

  for (const radius of tokens.borderRadius) {
    const radiusItem = figma.createFrame();
    radiusItem.layoutMode = 'VERTICAL';
    radiusItem.primaryAxisSizingMode = 'AUTO';
    radiusItem.counterAxisSizingMode = 'AUTO';
    radiusItem.itemSpacing = 8;
    radiusItem.counterAxisAlignItems = 'CENTER';

    const radiusBox = figma.createRectangle();
    radiusBox.resize(48, 48);
    radiusBox.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['100'] || '#DBEAFE') }];
    radiusBox.strokes = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
    radiusBox.strokeWeight = 2;
    radiusBox.cornerRadius = radius === 9999 ? 24 : radius;

    const label = figma.createText();
    label.characters = radius === 9999 ? 'full' : `${radius}`;
    label.fontSize = 10;
    label.fontName = { family: 'Inter', style: 'Medium' };

    radiusItem.appendChild(radiusBox);
    radiusItem.appendChild(label);
    radiusGrid.appendChild(radiusItem);
  }

  frame.appendChild(radiusGrid);

  return frame;
}

// === SHADOWS SECTION ===
async function createShadowsSection(tokens: DesignTokens): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '🌑 Shadows';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 24;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  frame.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  frame.cornerRadius = 16;

  const title = figma.createText();
  title.characters = '🌑 Shadows';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  frame.appendChild(title);

  const shadowGrid = figma.createFrame();
  shadowGrid.layoutMode = 'HORIZONTAL';
  shadowGrid.primaryAxisSizingMode = 'AUTO';
  shadowGrid.counterAxisSizingMode = 'AUTO';
  shadowGrid.itemSpacing = 24;

  for (const shadow of tokens.shadows) {
    const shadowItem = figma.createFrame();
    shadowItem.layoutMode = 'VERTICAL';
    shadowItem.primaryAxisSizingMode = 'AUTO';
    shadowItem.counterAxisSizingMode = 'AUTO';
    shadowItem.itemSpacing = 12;
    shadowItem.counterAxisAlignItems = 'CENTER';

    const shadowBox = figma.createRectangle();
    shadowBox.name = `shadow-${shadow.name}`;
    shadowBox.resize(80, 80);
    shadowBox.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    shadowBox.cornerRadius = 12;

    // Parse rgba color
    const rgbaMatch = shadow.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
    let shadowColor: RGBA = { r: 0, g: 0, b: 0, a: 0.1 };
    if (rgbaMatch) {
      shadowColor = {
        r: parseInt(rgbaMatch[1]) / 255,
        g: parseInt(rgbaMatch[2]) / 255,
        b: parseInt(rgbaMatch[3]) / 255,
        a: parseFloat(rgbaMatch[4] || '1')
      };
    }

    shadowBox.effects = [{
      type: 'DROP_SHADOW',
      color: shadowColor,
      offset: { x: shadow.x, y: shadow.y },
      radius: shadow.blur,
      spread: shadow.spread,
      visible: true,
      blendMode: 'NORMAL'
    }];

    const label = figma.createText();
    label.characters = shadow.name;
    label.fontSize = 12;
    label.fontName = { family: 'Inter', style: 'Semi Bold' };

    // Create effect style
    const effectStyle = figma.createEffectStyle();
    effectStyle.name = `shadow/${shadow.name}`;
    effectStyle.effects = [{
      type: 'DROP_SHADOW',
      color: shadowColor,
      offset: { x: shadow.x, y: shadow.y },
      radius: shadow.blur,
      spread: shadow.spread,
      visible: true,
      blendMode: 'NORMAL'
    }];

    shadowItem.appendChild(shadowBox);
    shadowItem.appendChild(label);
    shadowGrid.appendChild(shadowItem);
  }

  frame.appendChild(shadowGrid);

  return frame;
}

// === COMPONENTS SECTION ===
async function createComponentsSection(tokens: DesignTokens, isDarkMode: boolean): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = isDarkMode ? '🌙 Components (Dark)' : '☀️ Components (Light)';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 48;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  
  const bgColor = isDarkMode 
    ? hexToRgb((tokens.darkMode && tokens.darkMode.background) || '#0F172A')
    : { r: 1, g: 1, b: 1 };
  const textColor = isDarkMode
    ? hexToRgb((tokens.darkMode && tokens.darkMode.text) || '#F8FAFC')
    : { r: 0.1, g: 0.1, b: 0.1 };
  const textSecondaryColor = isDarkMode
    ? hexToRgb((tokens.darkMode && tokens.darkMode.textSecondary) || '#94A3B8')
    : { r: 0.5, g: 0.5, b: 0.5 };
  const surfaceColor = isDarkMode
    ? hexToRgb((tokens.darkMode && tokens.darkMode.surface) || '#1E293B')
    : { r: 1, g: 1, b: 1 };
    
  frame.fills = [{ type: 'SOLID', color: bgColor }];
  frame.cornerRadius = 16;

  const modePrefix = isDarkMode ? 'Dark/' : 'Light/';

  // Title
  const title = figma.createText();
  title.characters = isDarkMode ? '🌙 Components (Dark Mode)' : '☀️ Components (Light Mode)';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fills = [{ type: 'SOLID', color: textColor }];
  frame.appendChild(title);

  // === BUTTONS ===
  const buttonsSection = figma.createFrame();
  buttonsSection.name = 'Buttons';
  buttonsSection.layoutMode = 'VERTICAL';
  buttonsSection.primaryAxisSizingMode = 'AUTO';
  buttonsSection.counterAxisSizingMode = 'AUTO';
  buttonsSection.itemSpacing = 16;

  const buttonsLabel = figma.createText();
  buttonsLabel.characters = 'Buttons';
  buttonsLabel.fontSize = 18;
  buttonsLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  buttonsLabel.fills = [{ type: 'SOLID', color: textColor }];
  buttonsSection.appendChild(buttonsLabel);

  const buttonsRow = figma.createFrame();
  buttonsRow.layoutMode = 'HORIZONTAL';
  buttonsRow.primaryAxisSizingMode = 'AUTO';
  buttonsRow.counterAxisSizingMode = 'AUTO';
  buttonsRow.itemSpacing = 16;

  // Button Primary
  const btnPrimary = createButton(tokens, 'Primary', 'primary', false, isDarkMode);
  btnPrimary.name = `${modePrefix}Button/Primary`;
  buttonsRow.appendChild(btnPrimary);

  // Button Secondary
  const btnSecondary = createButton(tokens, 'Secondary', 'secondary', false, isDarkMode);
  btnSecondary.name = `${modePrefix}Button/Secondary`;
  buttonsRow.appendChild(btnSecondary);

  // Button Outline
  const btnOutline = createButton(tokens, 'Outline', 'outline', false, isDarkMode);
  btnOutline.name = `${modePrefix}Button/Outline`;
  buttonsRow.appendChild(btnOutline);

  // Button Ghost
  const btnGhost = createButton(tokens, 'Ghost', 'ghost', false, isDarkMode);
  btnGhost.name = `${modePrefix}Button/Ghost`;
  buttonsRow.appendChild(btnGhost);

  buttonsSection.appendChild(buttonsRow);

  // Button States Row
  const statesRow = figma.createFrame();
  statesRow.layoutMode = 'HORIZONTAL';
  statesRow.primaryAxisSizingMode = 'AUTO';
  statesRow.counterAxisSizingMode = 'AUTO';
  statesRow.itemSpacing = 16;

  const btnHover = createButton(tokens, 'Hover', 'primary', false, isDarkMode, 'hover');
  btnHover.name = `${modePrefix}Button/Primary/Hover`;
  statesRow.appendChild(btnHover);

  const btnDisabled = createButton(tokens, 'Disabled', 'primary', true, isDarkMode);
  btnDisabled.name = `${modePrefix}Button/Primary/Disabled`;
  statesRow.appendChild(btnDisabled);

  const btnSmall = createButton(tokens, 'Small', 'primary', false, isDarkMode, 'default', 'sm');
  btnSmall.name = `${modePrefix}Button/Primary/Small`;
  statesRow.appendChild(btnSmall);

  const btnLarge = createButton(tokens, 'Large', 'primary', false, isDarkMode, 'default', 'lg');
  btnLarge.name = `${modePrefix}Button/Primary/Large`;
  statesRow.appendChild(btnLarge);

  buttonsSection.appendChild(statesRow);
  frame.appendChild(buttonsSection);

  // === INPUTS ===
  const inputsSection = figma.createFrame();
  inputsSection.name = 'Inputs';
  inputsSection.layoutMode = 'VERTICAL';
  inputsSection.primaryAxisSizingMode = 'AUTO';
  inputsSection.counterAxisSizingMode = 'AUTO';
  inputsSection.itemSpacing = 16;

  const inputsLabel = figma.createText();
  inputsLabel.characters = 'Inputs';
  inputsLabel.fontSize = 18;
  inputsLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  inputsLabel.fills = [{ type: 'SOLID', color: textColor }];
  inputsSection.appendChild(inputsLabel);

  const inputsRow = figma.createFrame();
  inputsRow.layoutMode = 'HORIZONTAL';
  inputsRow.primaryAxisSizingMode = 'AUTO';
  inputsRow.counterAxisSizingMode = 'AUTO';
  inputsRow.itemSpacing = 16;

  inputsRow.appendChild(createInput(tokens, 'Default', 'default', isDarkMode));
  inputsRow.appendChild(createInput(tokens, 'Focused', 'focus', isDarkMode));
  inputsRow.appendChild(createInput(tokens, 'Error', 'error', isDarkMode));
  inputsRow.appendChild(createInput(tokens, 'Disabled', 'disabled', isDarkMode));

  inputsSection.appendChild(inputsRow);
  frame.appendChild(inputsSection);

  // === CARDS ===
  const cardsSection = figma.createFrame();
  cardsSection.name = 'Cards';
  cardsSection.layoutMode = 'VERTICAL';
  cardsSection.primaryAxisSizingMode = 'AUTO';
  cardsSection.counterAxisSizingMode = 'AUTO';
  cardsSection.itemSpacing = 16;

  const cardsLabel = figma.createText();
  cardsLabel.characters = 'Cards';
  cardsLabel.fontSize = 18;
  cardsLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  cardsLabel.fills = [{ type: 'SOLID', color: textColor }];
  cardsSection.appendChild(cardsLabel);

  const cardsRow = figma.createFrame();
  cardsRow.layoutMode = 'HORIZONTAL';
  cardsRow.primaryAxisSizingMode = 'AUTO';
  cardsRow.counterAxisSizingMode = 'AUTO';
  cardsRow.itemSpacing = 24;

  cardsRow.appendChild(createCard(tokens, 'Default Card', isDarkMode));
  cardsRow.appendChild(createCard(tokens, 'Elevated Card', isDarkMode, true));

  cardsSection.appendChild(cardsRow);
  frame.appendChild(cardsSection);

  // === BADGES ===
  const badgesSection = figma.createFrame();
  badgesSection.name = 'Badges';
  badgesSection.layoutMode = 'VERTICAL';
  badgesSection.primaryAxisSizingMode = 'AUTO';
  badgesSection.counterAxisSizingMode = 'AUTO';
  badgesSection.itemSpacing = 16;

  const badgesLabel = figma.createText();
  badgesLabel.characters = 'Badges';
  badgesLabel.fontSize = 18;
  badgesLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  badgesLabel.fills = [{ type: 'SOLID', color: textColor }];
  badgesSection.appendChild(badgesLabel);

  const badgesRow = figma.createFrame();
  badgesRow.layoutMode = 'HORIZONTAL';
  badgesRow.primaryAxisSizingMode = 'AUTO';
  badgesRow.counterAxisSizingMode = 'AUTO';
  badgesRow.itemSpacing = 12;

  badgesRow.appendChild(createBadge(tokens, 'Default', 'default', isDarkMode));
  badgesRow.appendChild(createBadge(tokens, 'Success', 'success', isDarkMode));
  badgesRow.appendChild(createBadge(tokens, 'Warning', 'warning', isDarkMode));
  badgesRow.appendChild(createBadge(tokens, 'Error', 'error', isDarkMode));
  badgesRow.appendChild(createBadge(tokens, 'Info', 'info', isDarkMode));

  badgesSection.appendChild(badgesRow);
  frame.appendChild(badgesSection);

  // === AVATARS ===
  const avatarsSection = figma.createFrame();
  avatarsSection.name = 'Avatars';
  avatarsSection.layoutMode = 'VERTICAL';
  avatarsSection.primaryAxisSizingMode = 'AUTO';
  avatarsSection.counterAxisSizingMode = 'AUTO';
  avatarsSection.itemSpacing = 16;

  const avatarsLabel = figma.createText();
  avatarsLabel.characters = 'Avatars';
  avatarsLabel.fontSize = 18;
  avatarsLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  avatarsLabel.fills = [{ type: 'SOLID', color: textColor }];
  avatarsSection.appendChild(avatarsLabel);

  const avatarsRow = figma.createFrame();
  avatarsRow.layoutMode = 'HORIZONTAL';
  avatarsRow.primaryAxisSizingMode = 'AUTO';
  avatarsRow.counterAxisSizingMode = 'AUTO';
  avatarsRow.itemSpacing = 16;

  avatarsRow.appendChild(createAvatar(tokens, 24));
  avatarsRow.appendChild(createAvatar(tokens, 32));
  avatarsRow.appendChild(createAvatar(tokens, 40));
  avatarsRow.appendChild(createAvatar(tokens, 48));
  avatarsRow.appendChild(createAvatar(tokens, 64));

  avatarsSection.appendChild(avatarsRow);
  frame.appendChild(avatarsSection);

  // === TOGGLES & CHECKBOXES ===
  const togglesSection = figma.createFrame();
  togglesSection.name = 'Toggles';
  togglesSection.layoutMode = 'VERTICAL';
  togglesSection.primaryAxisSizingMode = 'AUTO';
  togglesSection.counterAxisSizingMode = 'AUTO';
  togglesSection.itemSpacing = 16;

  const togglesLabel = figma.createText();
  togglesLabel.characters = 'Toggles & Checkboxes';
  togglesLabel.fontSize = 18;
  togglesLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  togglesLabel.fills = [{ type: 'SOLID', color: textColor }];
  togglesSection.appendChild(togglesLabel);

  const togglesRow = figma.createFrame();
  togglesRow.layoutMode = 'HORIZONTAL';
  togglesRow.primaryAxisSizingMode = 'AUTO';
  togglesRow.counterAxisSizingMode = 'AUTO';
  togglesRow.itemSpacing = 24;

  togglesRow.appendChild(createToggle(tokens, false, isDarkMode));
  togglesRow.appendChild(createToggle(tokens, true, isDarkMode));
  togglesRow.appendChild(createCheckbox(tokens, false, isDarkMode));
  togglesRow.appendChild(createCheckbox(tokens, true, isDarkMode));

  togglesSection.appendChild(togglesRow);
  frame.appendChild(togglesSection);

  // === ALERTS ===
  const alertsSection = figma.createFrame();
  alertsSection.name = 'Alerts';
  alertsSection.layoutMode = 'VERTICAL';
  alertsSection.primaryAxisSizingMode = 'AUTO';
  alertsSection.counterAxisSizingMode = 'AUTO';
  alertsSection.itemSpacing = 16;

  const alertsLabel = figma.createText();
  alertsLabel.characters = 'Alerts';
  alertsLabel.fontSize = 18;
  alertsLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
  alertsLabel.fills = [{ type: 'SOLID', color: textColor }];
  alertsSection.appendChild(alertsLabel);

  alertsSection.appendChild(createAlert(tokens, 'Success', 'success', 'Operation completed successfully.', isDarkMode));
  alertsSection.appendChild(createAlert(tokens, 'Warning', 'warning', 'Please review your changes before continuing.', isDarkMode));
  alertsSection.appendChild(createAlert(tokens, 'Error', 'error', 'An error occurred. Please try again.', isDarkMode));
  alertsSection.appendChild(createAlert(tokens, 'Info', 'info', 'This is an informational message.', isDarkMode));

  frame.appendChild(alertsSection);

  return frame;
}

// Helper: Create Button
function createButton(
  tokens: DesignTokens, 
  label: string, 
  variant: 'primary' | 'secondary' | 'outline' | 'ghost', 
  disabled: boolean,
  isDarkMode: boolean,
  state: 'default' | 'hover' = 'default',
  size: 'sm' | 'md' | 'lg' = 'md'
): ComponentNode {
  const button = figma.createComponent();
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisSizingMode = 'AUTO';
  button.counterAxisSizingMode = 'AUTO';
  
  const padding = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const paddingX = size === 'sm' ? 12 : size === 'lg' ? 28 : 20;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
  
  button.paddingLeft = button.paddingRight = paddingX;
  button.paddingTop = button.paddingBottom = padding;
  button.itemSpacing = 8;
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.cornerRadius = 8;

  const primaryColor = tokens.colors.primary['500'] || '#3B82F6';
  const primaryHover = tokens.colors.primary['600'] || '#2563EB';
  const secondaryColor = tokens.colors.secondary['500'] || '#6366F1';

  if (variant === 'primary') {
    const bgColor = disabled ? tokens.colors.neutral['300'] : (state === 'hover' ? primaryHover : primaryColor);
    button.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];
  } else if (variant === 'secondary') {
    button.fills = [{ type: 'SOLID', color: hexToRgb(secondaryColor) }];
  } else if (variant === 'outline') {
    button.fills = [];
    button.strokes = [{ type: 'SOLID', color: hexToRgb(primaryColor) }];
    button.strokeWeight = 2;
  } else {
    button.fills = [];
  }

  if (disabled) {
    button.opacity = 0.5;
  }

  const buttonText = figma.createText();
  buttonText.characters = label;
  buttonText.fontSize = fontSize;
  buttonText.fontName = { family: 'Inter', style: 'Semi Bold' };
  
  if (variant === 'primary' || variant === 'secondary') {
    buttonText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  } else {
    buttonText.fills = [{ type: 'SOLID', color: hexToRgb(primaryColor) }];
  }
  
  button.appendChild(buttonText);
  return button;
}

// Helper: Create Input
function createInput(tokens: DesignTokens, placeholder: string, state: 'default' | 'focus' | 'error' | 'disabled', isDarkMode: boolean): ComponentNode {
  const input = figma.createComponent();
  input.name = `Input/${state}`;
  input.layoutMode = 'HORIZONTAL';
  input.primaryAxisSizingMode = 'FIXED';
  input.counterAxisSizingMode = 'AUTO';
  input.resize(200, 44);
  input.paddingLeft = input.paddingRight = 16;
  input.paddingTop = input.paddingBottom = 12;
  
  const bgColor = isDarkMode 
    ? hexToRgb((tokens.darkMode && tokens.darkMode.surface) || '#1E293B')
    : { r: 1, g: 1, b: 1 };
  input.fills = [{ type: 'SOLID', color: bgColor }];
  
  let strokeColor = hexToRgb(tokens.colors.neutral['300'] || '#D1D5DB');
  if (state === 'focus') {
    strokeColor = hexToRgb(tokens.colors.primary['500'] || '#3B82F6');
  } else if (state === 'error') {
    strokeColor = hexToRgb(tokens.colors.semantic['error'] || '#EF4444');
  }
  
  input.strokes = [{ type: 'SOLID', color: strokeColor }];
  input.strokeWeight = state === 'focus' ? 2 : 1;
  input.cornerRadius = 8;

  if (state === 'disabled') {
    input.opacity = 0.5;
  }

  const inputText = figma.createText();
  inputText.characters = placeholder;
  inputText.fontSize = 14;
  inputText.fontName = { family: 'Inter', style: 'Regular' };
  inputText.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['400'] || '#9CA3AF') }];
  input.appendChild(inputText);

  return input;
}

// Helper: Create Card
function createCard(tokens: DesignTokens, title: string, isDarkMode: boolean, elevated: boolean = false): ComponentNode {
  const card = figma.createComponent();
  card.name = elevated ? 'Card/Elevated' : 'Card/Default';
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'AUTO';
  card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 24;
  card.itemSpacing = 12;
  card.cornerRadius = 16;

  const bgColor = isDarkMode 
    ? hexToRgb((tokens.darkMode && tokens.darkMode.surface) || '#1E293B')
    : { r: 1, g: 1, b: 1 };
  card.fills = [{ type: 'SOLID', color: bgColor }];

  if (elevated) {
    card.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: isDarkMode ? 0.3 : 0.1 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: -4,
      visible: true,
      blendMode: 'NORMAL'
    }];
  } else {
    card.strokes = [{ type: 'SOLID', color: hexToRgb(isDarkMode ? ((tokens.darkMode && tokens.darkMode.border) || '#334155') : (tokens.colors.neutral['200'] || '#E5E7EB')) }];
    card.strokeWeight = 1;
  }

  const textColor = isDarkMode 
    ? hexToRgb((tokens.darkMode && tokens.darkMode.text) || '#F8FAFC')
    : { r: 0.1, g: 0.1, b: 0.1 };

  const cardTitle = figma.createText();
  cardTitle.characters = title;
  cardTitle.fontSize = 18;
  cardTitle.fontName = { family: 'Inter', style: 'Semi Bold' };
  cardTitle.fills = [{ type: 'SOLID', color: textColor }];

  const cardBody = figma.createText();
  cardBody.characters = 'Card description text goes here. This component can be customized.';
  cardBody.fontSize = 14;
  cardBody.fontName = { family: 'Inter', style: 'Regular' };
  cardBody.fills = [{ type: 'SOLID', color: isDarkMode ? hexToRgb((tokens.darkMode && tokens.darkMode.textSecondary) || '#94A3B8') : { r: 0.5, g: 0.5, b: 0.5 } }];
  cardBody.resize(250, cardBody.height);
  cardBody.textAutoResize = 'HEIGHT';

  card.appendChild(cardTitle);
  card.appendChild(cardBody);

  return card;
}

// Helper: Create Badge
function createBadge(tokens: DesignTokens, label: string, variant: 'default' | 'success' | 'warning' | 'error' | 'info', isDarkMode: boolean): ComponentNode {
  const badge = figma.createComponent();
  badge.name = `Badge/${variant}`;
  badge.layoutMode = 'HORIZONTAL';
  badge.primaryAxisSizingMode = 'AUTO';
  badge.counterAxisSizingMode = 'AUTO';
  badge.paddingLeft = badge.paddingRight = 10;
  badge.paddingTop = badge.paddingBottom = 4;
  badge.cornerRadius = 9999;

  let bgColor: string;
  let textColor: string;

  switch (variant) {
    case 'success':
      bgColor = tokens.colors.semantic['successLight'] || '#DCFCE7';
      textColor = tokens.colors.semantic['success'] || '#16A34A';
      break;
    case 'warning':
      bgColor = tokens.colors.semantic['warningLight'] || '#FEF3C7';
      textColor = tokens.colors.semantic['warning'] || '#D97706';
      break;
    case 'error':
      bgColor = tokens.colors.semantic['errorLight'] || '#FEE2E2';
      textColor = tokens.colors.semantic['error'] || '#DC2626';
      break;
    case 'info':
      bgColor = tokens.colors.semantic['infoLight'] || '#DBEAFE';
      textColor = tokens.colors.semantic['info'] || '#2563EB';
      break;
    default:
      bgColor = tokens.colors.neutral['100'] || '#F3F4F6';
      textColor = tokens.colors.neutral['700'] || '#374151';
  }

  badge.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];

  const badgeText = figma.createText();
  badgeText.characters = label;
  badgeText.fontSize = 12;
  badgeText.fontName = { family: 'Inter', style: 'Medium' };
  badgeText.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];

  badge.appendChild(badgeText);
  return badge;
}

// Helper: Create Avatar
function createAvatar(tokens: DesignTokens, size: number): ComponentNode {
  const avatar = figma.createComponent();
  avatar.name = `Avatar/${size}`;
  avatar.resize(size, size);
  avatar.cornerRadius = size / 2;
  avatar.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['100'] || '#DBEAFE') }];

  const initials = figma.createText();
  initials.characters = 'AB';
  initials.fontSize = size * 0.4;
  initials.fontName = { family: 'Inter', style: 'Semi Bold' };
  initials.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['600'] || '#2563EB') }];

  avatar.layoutMode = 'HORIZONTAL';
  avatar.primaryAxisAlignItems = 'CENTER';
  avatar.counterAxisAlignItems = 'CENTER';
  avatar.appendChild(initials);

  return avatar;
}

// Helper: Create Toggle
function createToggle(tokens: DesignTokens, isOn: boolean, isDarkMode: boolean): ComponentNode {
  const toggle = figma.createComponent();
  toggle.name = `Toggle/${isOn ? 'On' : 'Off'}`;
  toggle.resize(48, 28);
  toggle.cornerRadius = 14;

  const bgColor = isOn 
    ? hexToRgb(tokens.colors.primary['500'] || '#3B82F6')
    : hexToRgb(tokens.colors.neutral['300'] || '#D1D5DB');
  toggle.fills = [{ type: 'SOLID', color: bgColor }];

  const knob = figma.createEllipse();
  knob.resize(22, 22);
  knob.x = isOn ? 23 : 3;
  knob.y = 3;
  knob.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  knob.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];

  toggle.appendChild(knob);
  return toggle;
}

// Helper: Create Checkbox
function createCheckbox(tokens: DesignTokens, isChecked: boolean, isDarkMode: boolean): ComponentNode {
  const checkbox = figma.createComponent();
  checkbox.name = `Checkbox/${isChecked ? 'Checked' : 'Unchecked'}`;
  checkbox.resize(24, 24);
  checkbox.cornerRadius = 6;

  if (isChecked) {
    checkbox.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.primary['500'] || '#3B82F6') }];
    
    // Checkmark (simplified as a line)
    const check = figma.createText();
    check.characters = '✓';
    check.fontSize = 14;
    check.fontName = { family: 'Inter', style: 'Bold' };
    check.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    checkbox.layoutMode = 'HORIZONTAL';
    checkbox.primaryAxisAlignItems = 'CENTER';
    checkbox.counterAxisAlignItems = 'CENTER';
    checkbox.appendChild(check);
  } else {
    checkbox.fills = [{ type: 'SOLID', color: isDarkMode ? hexToRgb((tokens.darkMode && tokens.darkMode.surface) || '#1E293B') : { r: 1, g: 1, b: 1 } }];
    checkbox.strokes = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['300'] || '#D1D5DB') }];
    checkbox.strokeWeight = 2;
  }

  return checkbox;
}

// Helper: Create Alert
function createAlert(tokens: DesignTokens, title: string, variant: 'success' | 'warning' | 'error' | 'info', message: string, isDarkMode: boolean): ComponentNode {
  const alert = figma.createComponent();
  alert.name = `Alert/${variant}`;
  alert.layoutMode = 'VERTICAL';
  alert.primaryAxisSizingMode = 'AUTO';
  alert.counterAxisSizingMode = 'FIXED';
  alert.resize(400, alert.height);
  alert.paddingLeft = alert.paddingRight = 16;
  alert.paddingTop = alert.paddingBottom = 12;
  alert.itemSpacing = 4;
  alert.cornerRadius = 8;

  let bgColor: string;
  let borderColor: string;
  let textColor: string;

  switch (variant) {
    case 'success':
      bgColor = tokens.colors.semantic['successLight'] || '#DCFCE7';
      borderColor = tokens.colors.semantic['success'] || '#16A34A';
      textColor = '#166534';
      break;
    case 'warning':
      bgColor = tokens.colors.semantic['warningLight'] || '#FEF3C7';
      borderColor = tokens.colors.semantic['warning'] || '#D97706';
      textColor = '#92400E';
      break;
    case 'error':
      bgColor = tokens.colors.semantic['errorLight'] || '#FEE2E2';
      borderColor = tokens.colors.semantic['error'] || '#DC2626';
      textColor = '#991B1B';
      break;
    default:
      bgColor = tokens.colors.semantic['infoLight'] || '#DBEAFE';
      borderColor = tokens.colors.semantic['info'] || '#2563EB';
      textColor = '#1E40AF';
  }

  alert.fills = [{ type: 'SOLID', color: hexToRgb(bgColor) }];
  alert.strokes = [{ type: 'SOLID', color: hexToRgb(borderColor) }];
  alert.strokeWeight = 1;
  alert.strokeAlign = 'INSIDE';

  const alertTitle = figma.createText();
  alertTitle.characters = title;
  alertTitle.fontSize = 14;
  alertTitle.fontName = { family: 'Inter', style: 'Semi Bold' };
  alertTitle.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];

  const alertMessage = figma.createText();
  alertMessage.characters = message;
  alertMessage.fontSize = 14;
  alertMessage.fontName = { family: 'Inter', style: 'Regular' };
  alertMessage.fills = [{ type: 'SOLID', color: hexToRgb(textColor) }];
  alertMessage.resize(368, alertMessage.height);
  alertMessage.textAutoResize = 'HEIGHT';

  alert.appendChild(alertTitle);
  alert.appendChild(alertMessage);

  return alert;
}

// === ICONS PLACEHOLDER SECTION ===
async function createIconsSection(tokens: DesignTokens): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = '🎯 Icons (Placeholder)';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = 24;
  frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 48;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 16;

  const title = figma.createText();
  title.characters = '🎯 Icons';
  title.fontSize = 32;
  title.fontName = { family: 'Inter', style: 'Bold' };
  frame.appendChild(title);

  const description = figma.createText();
  description.characters = 'Import your icon library here. Recommended: Lucide, Heroicons, or Phosphor Icons.\n\nTo add icons:\n1. Install an icon plugin (Iconify, Lucide, etc.)\n2. Insert icons into this frame\n3. Convert to components for reuse';
  description.fontSize = 14;
  description.fontName = { family: 'Inter', style: 'Regular' };
  description.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
  description.resize(500, description.height);
  description.textAutoResize = 'HEIGHT';
  frame.appendChild(description);

  // Placeholder icons grid
  const iconsGrid = figma.createFrame();
  iconsGrid.name = 'Icons Grid';
  iconsGrid.layoutMode = 'HORIZONTAL';
  iconsGrid.primaryAxisSizingMode = 'AUTO';
  iconsGrid.counterAxisSizingMode = 'AUTO';
  iconsGrid.itemSpacing = 16;
  iconsGrid.layoutWrap = 'WRAP';
  iconsGrid.maxWidth = 500;

  const iconNames = ['home', 'user', 'settings', 'search', 'mail', 'bell', 'heart', 'star', 'plus', 'minus', 'check', 'x'];
  
  for (const iconName of iconNames) {
    const iconPlaceholder = figma.createFrame();
    iconPlaceholder.name = `icon-${iconName}`;
    iconPlaceholder.resize(40, 40);
    iconPlaceholder.cornerRadius = 8;
    iconPlaceholder.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['100'] || '#F3F4F6') }];
    
    iconPlaceholder.layoutMode = 'HORIZONTAL';
    iconPlaceholder.primaryAxisAlignItems = 'CENTER';
    iconPlaceholder.counterAxisAlignItems = 'CENTER';

    const iconText = figma.createText();
    iconText.characters = iconName.charAt(0).toUpperCase();
    iconText.fontSize = 14;
    iconText.fontName = { family: 'Inter', style: 'Medium' };
    iconText.fills = [{ type: 'SOLID', color: hexToRgb(tokens.colors.neutral['500'] || '#6B7280') }];
    iconPlaceholder.appendChild(iconText);

    iconsGrid.appendChild(iconPlaceholder);
  }

  frame.appendChild(iconsGrid);

  return frame;
}

// Generate screen from text
async function generateScreen(prompt: string, apiKey: string, provider: 'anthropic' | 'openai') {
  figma.ui.postMessage({ type: 'loading', message: 'Generating screen layout...' });

  try {
    const aiPrompt = `Generate a detailed mobile app screen layout for: "${prompt}"

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

Be detailed and create a realistic screen layout with proper spacing, hierarchy, and modern design principles.`;

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
  figma.ui.postMessage({ type: 'progress', message: '⏳ Loading fonts...', step: 0, total: ((spec.elements && spec.elements.length) || 0) + 1 });
  
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const frame = figma.createFrame();
  frame.name = spec.screenName || 'Generated Screen';
  frame.resize(spec.width || 375, spec.height || 812);
  frame.fills = [{ type: 'SOLID', color: hexToRgb(spec.backgroundColor || '#FFFFFF') }];

  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  const totalElements = (spec.elements && spec.elements.length) || 0;
  let currentElement = 0;

  for (const element of (spec.elements || [])) {
    currentElement++;
    const elementName = element.name || element.type;
    figma.ui.postMessage({ 
      type: 'progress', 
      message: `📱 Creating ${elementName}...`, 
      step: currentElement, 
      total: totalElements 
    });
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
    
    // Delay between elements for progressive creation effect
    await delay(300);
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
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '') || 'Component';
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

export function ${name}() {
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

export default ${name};`;
}

function generateVueCode(node: SceneNode): string {
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'component';
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
  const name = node.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'component';
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
  if (msg.type === 'get-settings') {
    // Load saved settings from Figma clientStorage
    const apiKey = await figma.clientStorage.getAsync('designai_api_key') || '';
    const provider = await figma.clientStorage.getAsync('designai_provider') || 'anthropic';
    figma.ui.postMessage({ type: 'settings', apiKey, provider });
  } else if (msg.type === 'save-settings') {
    // Save settings to Figma clientStorage
    await figma.clientStorage.setAsync('designai_api_key', msg.apiKey);
    await figma.clientStorage.setAsync('designai_provider', msg.provider);
  } else if (msg.type === 'generate-system') {
    await generateDesignSystem(msg.brief, msg.apiKey, msg.provider || 'anthropic');
  } else if (msg.type === 'generate-screen') {
    await generateScreen(msg.prompt, msg.apiKey, msg.provider || 'anthropic');
  } else if (msg.type === 'export-code') {
    await exportToCode(msg.format);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
