# 🎨 How It Works

## 📖 Overview

The plugin sends structured prompts to Claude AI, receives JSON responses, then **creates native Figma elements** via the Figma Plugin API.

---

## 🔄 Process Flow

### 1. 🎨 Design System Generation

**Steps:**

1. **User enters a brief** in the "🎨 Design System" tab
   - Example: *"Modern fintech app, trustworthy, blue and green"*

2. **Plugin sends prompt to Claude AI** (via Anthropic API)
   - Structured prompt requesting: colors, typography, spacing, shadows, components

3. **AI responds with structured JSON:**
   ```json
   {
     "colors": {
       "primary": { "50": "#...", "100": "#...", ... },
       "secondary": {...},
       "neutral": {...}
     },
     "typography": {
       "fontFamily": "Inter",
       "scale": [
         { "name": "H1", "size": 40, "weight": 700, ... }
       ]
     },
     "spacing": [0, 4, 8, 16, 24, 32, ...],
     "shadows": [...],
     "components": [...]
   }
   ```

4. **Plugin creates Figma elements:**
   - New page: "🎨 Design System"
   - Sections: Colors, Typography, Spacing, Shadows, Components
   - Color swatches (all shades)
   - Typography samples
   - Spacing grid
   - 30+ component examples
   - Light & Dark mode variants

**Result:** Complete, production-ready design system in ~10 seconds! ✨

---

### 2. 💻 Code Export

**Steps:**

1. **User selects a Figma frame**

2. **Chooses export format** (React / Vue / HTML)

3. **Plugin traverses Figma tree:**
   - Reads layer structure
   - Extracts styles (colors, sizes, positions, fonts)
   - Generates corresponding code

4. **User copies generated code**

**Result:** Clean, styled code ready to use! 💻

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│             Figma Desktop App               │
├─────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │  UI (React - ui.tsx)                   │ │
│  │  - Input forms                         │ │
│  │  - Generate buttons                    │ │
│  │  - Settings panel                      │ │
│  └────────────────────────────────────────┘ │
│              ↕️ postMessage                 │
│  ┌────────────────────────────────────────┐ │
│  │  Backend (code.ts)                     │ │
│  │  - Receives UI messages                │ │
│  │  - Calls Claude API                    │ │
│  │  - Creates Figma elements              │ │
│  │  - Generates export code               │ │
│  └────────────────────────────────────────┘ │
│              ↕️ Figma Plugin API            │
│  ┌────────────────────────────────────────┐ │
│  │  Figma Document                        │ │
│  │  - Pages, frames, layers, styles       │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              ↕️ HTTPS
┌─────────────────────────────────────────────┐
│  Anthropic Claude API                       │
│  - Receives prompts                         │
│  - Returns structured JSON                  │
└─────────────────────────────────────────────┘
```

---

## 🔑 API Keys

**Why you provide your own key:**
- Direct API calls from plugin (no backend)
- Simple architecture
- Your quota, your control

**Storage:**
- Saved in `figma.clientStorage` (local, persistent)
- Never leaves your machine (except to Anthropic)

---

## 🎯 Example Use Cases

### Use Case 1: Full Design System

1. Open plugin → **🎨 Design System** tab
2. Enter: *"SaaS B2B platform, professional, trustworthy, blues and grays"*
3. Click **✨ Generate Design System**
4. Wait ~10 seconds
5. **Boom!** New page with:
   - Complete color palette (all shades)
   - Typography scale (H1-H6, body, captions)
   - Spacing grid
   - 30+ components (buttons, inputs, cards, badges, avatars...)
   - Light + Dark mode

### Use Case 2: Design to Code

1. Design something in Figma
2. Select the frame
3. Open plugin → **💻 Export Code**
4. Choose React/Vue/HTML
5. Copy code! 🚀

---

## ⚡ Why It's Powerful

- **Speed:** 10 seconds vs 2 hours for a design system
- **Consistency:** Everything is structured and connected
- **Iteration:** Change the brief, regenerate instantly
- **Learning:** See how professional design systems are built
- **Prototyping:** Test ideas rapidly

---

## 💡 Tips

- Be **specific** in briefs (audience, industry, mood, colors)
- Start with **Design System first**, then build screens (consistency)
- **Modify after generation** - everything is native Figma (editable)
- Use **clear, concise** descriptions for best results

---

## 🐛 Troubleshooting

**"Please add your API key"**
→ Settings tab → Enter key → Save

**"Failed to fetch"**
→ Verify API key is valid in Anthropic Console

**Generation takes >30s**
→ Normal for full design systems (many elements)

**Results not perfect**
→ Refine your brief, be more specific

---

**Ready to generate design systems in seconds?** 🚀
