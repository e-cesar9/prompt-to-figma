# 🤖 Prompt to Figma

[![GitHub release](https://img.shields.io/github/v/release/e-cesar9/prompt-to-figma?include_prereleases)](https://github.com/e-cesar9/prompt-to-figma/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin-purple)](https://www.figma.com/community)

**AI-powered Design System Generator and Code Exporter for Figma**

Transform text descriptions into complete, production-ready design systems and export Figma designs to clean code—powered by Claude, GPT, or DeepSeek.

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

### 🤖 Multi-Provider Support
- **🧠 Anthropic Claude** - Creative, nuanced design systems
- **🤖 OpenAI GPT** - Fast, structured generation
- **🚀 DeepSeek R1** - Cost-effective with reasoning capabilities
- Switch providers on the fly in Settings

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Figma desktop app
- API key from one of:
  - [Anthropic](https://console.anthropic.com) (Claude)
  - [OpenAI](https://platform.openai.com) (GPT)
  - [DeepSeek](https://platform.deepseek.com) (DeepSeek R1)

### Installation

```bash
# Clone the repo
git clone https://github.com/e-cesar9/prompt-to-figma.git
cd prompt-to-figma

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
3. Select your AI provider (Anthropic / OpenAI / DeepSeek)
4. Paste your API key
5. Click **💾 Save Settings**

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
5. Wait ~10-20 seconds
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
prompt-to-figma/
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
├── README.md
├── HOW_IT_WORKS.md      # Architecture details
└── MODELS.md            # Provider comparison
```

---

## 🤖 AI Providers

See **[MODELS.md](MODELS.md)** for detailed comparison.

| Provider | Model | Best For | Speed | Cost |
|----------|-------|----------|-------|------|
| **Anthropic** | Claude Sonnet 4.5 | Creative design systems | ⭐⭐⭐⭐ | $$$ |
| **OpenAI** | GPT-5.2 | Fast, structured output | ⭐⭐⭐⭐⭐ | $$$ |
| **DeepSeek** | DeepSeek R1 (Reasoner) | Budget + reasoning | ⭐⭐⭐⭐ | $ |

**Quick recommendations:**
- **Start with DeepSeek** - 50x cheaper, great for testing
- **Use Claude** - Best for creative, nuanced design systems
- **Use GPT-5.2** - Fast and reliable for production

---

## 🔐 Security

### How API Keys are Stored

Your API keys are stored **locally on your machine** using Figma's `clientStorage` API. They:
- ✅ Never leave your computer (except to make API calls to your chosen provider)
- ✅ Are NOT uploaded to Figma servers
- ✅ Are NOT shared when you share Figma files
- ✅ Persist between sessions (no need to re-enter)

### Key Validation

The plugin automatically validates API key formats before making requests:
- **Anthropic:** Must start with `sk-ant-`
- **OpenAI:** Must start with `sk-`
- **DeepSeek:** Minimum length requirements

Invalid keys are rejected **before** API calls to prevent unnecessary errors.

### Error Handling

Error messages are **sanitized** to prevent leaking sensitive information:
- ❌ Raw API errors are never shown to users
- ✅ User-friendly messages guide troubleshooting
- ✅ Status codes are mapped to actionable advice

### Best Practices

⚠️ **Important Security Guidelines:**

1. **Only use on trusted devices** - Keys are stored in plaintext locally
2. **Don't share Settings screenshots** - Could expose your API key
3. **Use separate keys for testing** - Don't use production keys
4. **Monitor usage in provider dashboards** - Watch for unexpected activity
5. **Rotate keys periodically** - Especially if shared computer

### Network Security

The plugin is restricted to communicate **only** with approved domains:
- `https://api.anthropic.com`
- `https://api.openai.com`
- `https://api.deepseek.com`

No other network requests are possible (enforced by Figma's plugin security model).

---

## 🐛 Troubleshooting

### Plugin won't load
- Check `manifest.json` path is correct
- Open Figma console: **Plugins** → **Development** → **Show console**

### API errors
- Verify API key is valid in Settings
- Check provider rate limits
- Ensure network access is allowed

### Generation fails
- Simplify your brief
- Try a different provider
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
- [x] Multi-provider support (Claude, GPT, DeepSeek)
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
- [OpenAI GPT](https://openai.com) - AI generation
- [DeepSeek](https://deepseek.com) - AI generation
- [Figma Plugin API](https://figma.com/plugin-docs) - Plugin framework
- [React](https://react.dev) - UI
- [esbuild](https://esbuild.github.io) - Bundler

---

## 🚀 Get Started

```bash
git clone https://github.com/e-cesar9/prompt-to-figma.git
cd prompt-to-figma
npm install
npm run build
# Load in Figma → Create design systems in seconds! ✨
```
