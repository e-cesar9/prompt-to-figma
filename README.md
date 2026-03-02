# 🤖 DesignAI - Figma Plugin

**AI-powered Design System Generator, Screen Creator, and Code Exporter for Figma**

Generate complete design systems, create screens from text descriptions, and export Figma designs to React/Vue/HTML code—all powered by Claude AI.

---

## ✨ Features

### 1. 🎨 Design System Generator
- Input: Brief text description ("Modern fintech app, trustworthy...")
- Output: Complete design system with:
  - Color palettes (primary, secondary, neutral, semantic)
  - Typography scale (h1-h6, body, captions)
  - Spacing system (4px grid)
  - Border radius values
  - Shadow styles
  - Basic components (Button, Input, Card, etc.)

### 2. 📱 Screen Generator
- Input: Screen description ("Create a login screen with...")
- Output: Full screen layout with components
- Automatically generates frame structure

### 3. 💻 Code Exporter
- Export any Figma frame to:
  - ⚛️ React components
  - 🌿 Vue components
  - 📄 HTML/CSS
- Preserves styles and structure

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- Figma desktop app
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. **Clone & Install**
```bash
cd /home/clawd/projects/figma-designai
npm install
```

2. **Build Plugin**
```bash
npm run build
```

3. **Load in Figma**
- Open Figma desktop app
- Go to: `Plugins` → `Development` → `Import plugin from manifest...`
- Select `manifest.json` from this folder
- Plugin appears in your plugins menu!

4. **Configure API Key**
- Open the plugin in Figma
- Go to **⚙️ Settings** tab
- Choose your AI provider:
  - **🧠 Claude (Anthropic)** - Get key at [console.anthropic.com](https://console.anthropic.com)
  - **🤖 GPT-4 (OpenAI)** - Get key at [platform.openai.com](https://platform.openai.com)
- Paste your API key
- Click **💾 Save Settings**

---

## 🎯 Usage

### Generate Design System

1. Click plugin: `DesignAI - System + Screens + Code`
2. Go to **🎨 Design System** tab
3. Enter brief (e.g., "Modern e-commerce, vibrant, Gen Z")
4. Click **✨ Generate Design System**
5. Wait ~10 seconds
6. New page created with complete design system!

**Example briefs:**
- "Healthcare app, calm and reassuring, elderly users"
- "Gaming dashboard, dark mode, neon accents, competitive"
- "SaaS platform, professional, trustworthy, B2B"

### Generate Screen

1. Go to **📱 Generate Screen** tab
2. Enter description (e.g., "Login screen with email, password, sign-in button")
3. Click **🎨 Generate Screen**
4. Screen appears in your canvas!

**Example prompts:**
- "Dashboard with stats cards, chart, and activity feed"
- "Profile settings screen with avatar and form"
- "Onboarding flow with 3 slides"

### Export to Code

1. Select a frame in Figma
2. Open plugin
3. Go to **💻 Export Code** tab
4. Choose format (React/Vue/HTML)
5. Click **💻 Export Code**
6. Copy generated code!

---

## 🛠️ Development

### Scripts

```bash
# Build once
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Build UI only
npm run build:ui

# Build plugin code only
npm run build:code
```

### Project Structure

```
figma-designai/
├── src/
│   ├── code.ts          # Plugin backend (Figma sandbox)
│   ├── ui.tsx           # Plugin UI (React)
│   ├── ui.css           # Styles
│   └── ui.html          # HTML template
├── dist/                # Built files (auto-generated)
│   ├── code.js
│   ├── ui.js
│   └── ui.html
├── manifest.json        # Figma plugin manifest
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Configuration

### API Keys

The plugin supports **both Anthropic Claude and OpenAI GPT-4**.

**Configuration:**
1. Open the plugin in Figma
2. Go to **⚙️ Settings** tab
3. Select your AI provider (Anthropic or OpenAI)
4. Enter your API key
5. Click **💾 Save Settings**

Your API key is stored securely in Figma's localStorage (persists between sessions).

**Note:** For production use, consider implementing a backend API proxy to avoid exposing keys client-side.

### Customization

**Change AI model:**
Edit `src/code.ts`, line 55:
```typescript
model: 'claude-sonnet-4-20250514'  // Change to claude-opus-4 for better quality
```

**Adjust design system structure:**
Edit the prompt in `generateDesignSystem()` function

---

## 💰 Monetization (Future)

**Current:** Free MVP for personal use  
**Planned:** Backend API with usage tiers

### Pricing Structure (Ready)

```typescript
// Free tier
- 5 generations/month
- Basic components only

// Pro tier ($29/mo)
- Unlimited generations
- Full component library
- Screenshot analysis
- Priority support

// Enterprise ($199/mo)
- API access
- Custom components
- White-label
- SLA
```

**Implementation plan:**
1. Build Next.js API backend
2. Add Stripe billing
3. Implement usage tracking
4. Add auth (API keys)
5. Update plugin to call backend instead of direct Anthropic

---

## 🐛 Troubleshooting

### Plugin won't load
- Make sure manifest.json path is correct
- Check Figma console: `Plugins` → `Development` → `Show console`

### API errors
- Verify `.env` has valid Anthropic API key
- Check network access is allowed in manifest.json
- Rate limits: Anthropic free tier = 50 requests/day

### Generations fail
- Check Figma console for errors
- Ensure brief is clear and detailed
- Try shorter/simpler descriptions

### Code export broken
- Select a frame before exporting
- Complex frames may generate simplified code
- Use component sets for better results

---

## 🚀 Deployment (Publish to Figma Community)

1. **Polish plugin:**
   - Test thoroughly
   - Add more examples
   - Improve error messages

2. **Create assets:**
   - Plugin icon (128x128)
   - Cover image (1920x960)
   - Demo video

3. **Submit:**
   - Figma: `Plugins` → `Development` → `Publish`
   - Fill metadata
   - Submit for review

4. **Launch:**
   - ProductHunt post
   - Twitter/LinkedIn
   - Design communities

---

## 📈 Roadmap

### Phase 1: MVP (DONE) ✅
- [x] Design system generation
- [x] Screen generation
- [x] Code export (React/Vue/HTML)
- [x] Basic UI

### Phase 2: Polish (Week 1-2)
- [ ] Screenshot analysis (upload image → generate system)
- [ ] More component templates
- [ ] Better code generation (preserves auto-layout)
- [ ] Dark mode UI

### Phase 3: Backend (Week 3-4)
- [ ] Next.js API
- [ ] Stripe billing
- [ ] User accounts
- [ ] Usage dashboard

### Phase 4: Advanced (Month 2)
- [ ] Brand guidelines integration (upload PDF)
- [ ] Figma variables support
- [ ] Component variants
- [ ] Storybook export
- [ ] Figma to Tailwind CSS

---

## 🤝 Contributing

This is a personal project for now. If you want to contribute:
1. Fork the repo
2. Create feature branch
3. Submit PR with description

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Credits

Built with:
- [Anthropic Claude](https://anthropic.com) - AI generation
- [Figma Plugin API](https://figma.com/plugin-docs) - Plugin framework
- [React](https://react.dev) - UI framework
- [esbuild](https://esbuild.github.io) - Fast bundler

---

## 📞 Support

**Questions?** Open an issue or reach out:
- Email: your@email.com
- Twitter: @yourhandle

---

## 🎉 Try It Now!

```bash
cd /home/clawd/projects/figma-designai
npm install
npm run build
# Open Figma → Load plugin
# Start creating! ✨
```

**Have fun generating design systems in seconds!** 🚀
