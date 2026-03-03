# 🤖 MCP to Figma to Code

**AI-powered Design System Generator and Code Exporter for Figma**

Convert text descriptions into complete Figma design systems and export designs to clean code—powered by Claude AI.

---

## ✨ Features

### 🎨 Design System Generator
- **Input:** Brief text description ("Modern fintech app, trustworthy...")
- **Output:** Complete design system with:
  - Color palettes (primary, secondary, neutral, semantic)
  - Typography scale (h1-h6, body, captions)
  - Spacing system (4px grid)
  - Border radius values
  - Shadow styles
  - 30+ components (Button, Input, Card, Badge, Avatar, etc.)
  - Light & Dark mode support

### 💻 Code Exporter
- Export Figma frames to production-ready code:
  - ⚛️ React components
  - 🌿 Vue components
  - 📄 HTML/CSS
- Preserves styles and structure
- Auto-layout support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Figma desktop app
- Anthropic API key → [Get one here](https://console.anthropic.com)

### Installation

```bash
# Clone the repo
cd /home/james2/mcptofigmatocode

# Install dependencies
npm install

# Build plugin
npm run build
```

### Load in Figma

1. Open Figma desktop app
2. Go to: **Plugins** → **Development** → **Import plugin from manifest...**
3. Select `manifest.json` from this folder
4. Plugin ready! ✨

### Configure API Key

1. Open the plugin in Figma
2. Go to **⚙️ Settings** tab
3. Paste your Anthropic API key
4. Click **💾 Save Settings**

Keys are stored locally in Figma (secure, persistent).

---

## 🎯 Usage

### Generate Design System

1. Open plugin: **MCP to Figma to Code**
2. Go to **🎨 Design System** tab
3. Enter a brief:
   - "Modern SaaS platform, professional, trustworthy, blues"
   - "Gaming app, dark mode, neon accents, competitive"
   - "Healthcare, calm, reassuring, elderly-friendly"
4. Click **✨ Generate Design System**
5. Wait ~10 seconds
6. New page created with complete design system!

**Output includes:**
- Color swatches (all shades)
- Typography samples
- Spacing grid
- Shadow examples
- Component library (buttons, inputs, cards, badges, etc.)
- Both Light & Dark modes

### Export to Code

1. Select any frame in Figma
2. Open plugin
3. Go to **💻 Export Code** tab
4. Choose format: **React** / **Vue** / **HTML**
5. Click **💻 Export Code**
6. Copy and use! 🚀

---

## 🛠️ Development

### Build Scripts

```bash
# Build everything
npm run build

# Watch mode (auto-rebuild)
npm run dev

# Build UI only
npm run build:ui

# Build plugin code only
npm run build:code
```

### Project Structure

```
mcptofigmatocode/
├── src/
│   ├── code.ts          # Plugin backend (Figma sandbox)
│   ├── ui.tsx           # Plugin UI (React)
│   ├── ui.html          # HTML shell
│   └── ui.css           # Styles
├── dist/                # Built files (generated)
│   ├── code.js
│   ├── ui.js
│   └── ui.html
├── manifest.json        # Figma plugin manifest
├── package.json
└── README.md
```

---

## 🔧 Configuration

### API Provider

The plugin uses **Anthropic Claude** (Sonnet 4).

To change model, edit `src/code.ts`:
```typescript
model: 'claude-sonnet-4-20250514'  // Or claude-opus-4 for higher quality
```

### Custom Prompts

To customize design system generation, edit the prompt in `generateDesignSystem()` function in `src/code.ts`.

---

## 🐛 Troubleshooting

### Plugin won't load
- Check `manifest.json` path is correct
- Open Figma console: **Plugins** → **Development** → **Show console**

### API errors
- Verify API key is valid in Settings
- Check Anthropic rate limits (free tier = 50 req/day)
- Ensure network access is allowed

### Generation fails
- Simplify your brief
- Try shorter descriptions
- Check Figma console for detailed errors

### Code export broken
- Select a frame before exporting
- Complex nested structures may simplify output
- Use component sets for best results

---

## 📈 Roadmap

### Current: MVP ✅
- [x] Design system generation
- [x] Code export (React/Vue/HTML)
- [x] API key management

### Next Steps
- [ ] Screenshot analysis (upload → generate system)
- [ ] More component templates
- [ ] Figma variables support
- [ ] Better auto-layout code generation
- [ ] Tailwind CSS export

---

## 🤝 Contributing

Open for contributions! Fork, create a branch, submit a PR.

---

## 📄 License

MIT License - Free to use, modify, and distribute.

---

## 🙏 Built With

- [Anthropic Claude](https://anthropic.com) - AI generation
- [Figma Plugin API](https://figma.com/plugin-docs) - Plugin framework
- [React](https://react.dev) - UI
- [esbuild](https://esbuild.github.io) - Bundler

---

## 🚀 Get Started

```bash
cd /home/james2/mcptofigmatocode
npm install
npm run build
# Load in Figma → Create design systems in seconds! ✨
```
