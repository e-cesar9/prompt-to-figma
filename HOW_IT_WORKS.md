# 🎨 How It Works

## 📖 Overview

The plugin sends structured prompts to your chosen AI provider (Claude, GPT, or DeepSeek), receives JSON responses, then **creates native Figma elements** via the Figma Plugin API.

---

## 🔄 Process Flow

### 1. 🎨 Design System Generation

**Steps:**

1. **User enters a brief** in the "🎨 Design System" tab
   - Example: *"Modern fintech app, trustworthy, blue and green"*

2. **User selects AI provider** in Settings
   - **Anthropic Claude** - Most creative, best for design
   - **OpenAI GPT** - Fast and reliable
   - **DeepSeek** - Budget-friendly with reasoning

3. **Plugin sends structured prompt to AI API**
   - Requests: colors, typography, spacing, shadows, components
   - Uses provider-specific API format

4. **AI responds with structured JSON:**
   ```json
   {
     "colors": {
       "primary": { "50": "#...", "100": "#...", ... },
       "secondary": {...},
       "neutral": {...},
       "semantic": {...}
     },
     "typography": {
       "fontFamily": "Inter",
       "scale": [
         { "name": "H1", "size": 40, "weight": 700, ... }
       ]
     },
     "spacing": [0, 4, 8, 16, 24, 32, ...],
     "borderRadius": [0, 4, 8, 12, 16, ...],
     "shadows": [...],
     "components": [...]
   }
   ```

5. **Plugin creates Figma elements:**
   - New page: "🎨 Design System"
   - Sections organized by type
   - **Colors**: Swatches for all shades (50-900)
   - **Typography**: Text samples for each style
   - **Spacing**: Visual grid
   - **Shadows**: Component examples
   - **Components**: 30+ UI elements (Button, Input, Card, Badge, Avatar, etc.)
   - **Light & Dark modes**: Complete theme variants

**Result:** Complete, production-ready design system in ~10-20 seconds! ✨

---

### 2. 💻 Code Export

**Steps:**

1. **User selects a Figma frame**

2. **Chooses export format** (React / Vue / HTML)

3. **Plugin traverses Figma node tree:**
   - Reads layer hierarchy
   - Extracts styles (colors, sizes, positions, fonts, spacing)
   - Detects auto-layout properties
   - Identifies component types

4. **AI enhances with semantic understanding** (optional)
   - Identifies button roles, input types, etc.
   - Adds accessibility attributes
   - Suggests component names

5. **Generates clean code:**
   - React: Functional components with props
   - Vue: Single-file components
   - HTML: Semantic markup + CSS

6. **User copies code to clipboard**

**Result:** Production-ready code with preserved styles! 💻

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│             Figma Desktop App               │
├─────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │  UI Layer (React - ui.tsx)             │ │
│  │  ┌──────────────────────────────────┐  │ │
│  │  │ • Input forms                    │  │ │
│  │  │ • Provider selector (3 choices)  │  │ │
│  │  │ • Generate buttons               │  │ │
│  │  │ • Settings panel                 │  │ │
│  │  └──────────────────────────────────┘  │ │
│  └────────────────────────────────────────┘ │
│              ↕️ postMessage API             │
│  ┌────────────────────────────────────────┐ │
│  │  Plugin Backend (code.ts)              │ │
│  │  ┌──────────────────────────────────┐  │ │
│  │  │ • Message handler                │  │ │
│  │  │ • AI API router (3 providers)    │  │ │
│  │  │ • Figma element creator          │  │ │
│  │  │ • Code generator                 │  │ │
│  │  └──────────────────────────────────┘  │ │
│  └────────────────────────────────────────┘ │
│              ↕️ Figma Plugin API            │
│  ┌────────────────────────────────────────┐ │
│  │  Figma Document                        │ │
│  │  • Pages, frames, layers, styles       │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              ↕️ HTTPS
┌─────────────────────────────────────────────┐
│          AI Provider APIs                   │
│  ┌───────────────────────────────────────┐  │
│  │ 🧠 Anthropic Claude API               │  │
│  │    api.anthropic.com                  │  │
│  ├───────────────────────────────────────┤  │
│  │ 🤖 OpenAI GPT API                     │  │
│  │    api.openai.com                     │  │
│  ├───────────────────────────────────────┤  │
│  │ 🚀 DeepSeek API                       │  │
│  │    api.deepseek.com                   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🔑 Provider Routing

The plugin intelligently routes requests based on your selected provider:

```typescript
// Simplified routing logic
async function callAI(prompt, apiKey, provider) {
  if (provider === 'anthropic') {
    // Call Claude Sonnet 4.5
    return fetch('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-5-20241022',
      ...
    })
  } 
  else if (provider === 'openai') {
    // Call GPT-5.2
    return fetch('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-5.2',
      ...
    })
  }
  else if (provider === 'deepseek') {
    // Call DeepSeek R1 (reasoning model)
    return fetch('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-reasoner',
      ...
    })
  }
}
```

---

## 🔐 API Keys & Security

**Why you provide your own keys:**
- Direct API calls from plugin (no middleman)
- Simple architecture, no backend needed
- You control quota and billing
- No data passes through third-party servers

**Storage:**
- Saved in `figma.clientStorage` (local to your machine)
- Persists between sessions
- Never sent anywhere except to the chosen AI provider
- **Each provider's key is stored separately**

**Switching providers:**
- Keys are cached per provider
- Switch anytime without re-entering keys
- Plugin remembers last used provider

---

## 🎯 Example Use Cases

### Use Case 1: Full Design System (Creative)

**Goal:** Beautiful, polished design system for client presentation

1. Open plugin → **⚙️ Settings**
2. Select **🧠 Anthropic Claude** (best for creative work)
3. Enter API key, Save
4. Go to **🎨 Design System** tab
5. Enter: *"SaaS B2B platform, professional, trustworthy, navy blues and teals"*
6. Click **✨ Generate Design System**
7. Wait ~10 seconds
8. **Result:** Gorgeous design system with nuanced colors and typography

**Why Claude:** Most "taste", best color palettes, highest design quality

---

### Use Case 2: Rapid Prototyping (Budget)

**Goal:** Test 10 different design directions quickly

1. Select **🚀 DeepSeek** in Settings
2. Generate system: *"Modern e-commerce, vibrant, Gen Z"*
3. Review → Iterate
4. Generate system: *"E-commerce, minimal, luxury"*
5. Repeat 8 more times
6. **Total cost:** ~$0.10 (vs $3-5 with Claude)

**Why DeepSeek:** 50x cheaper, fast enough, good quality for iteration

---

### Use Case 3: Production Code Export

**Goal:** Export polished React components for production

1. Design components in Figma
2. Select **🤖 OpenAI GPT-5.2** in Settings
3. Select frame → **💻 Export Code** → React
4. **Result:** Clean, modern React components

**Why GPT:** Best code generation, latest model optimized for coding

---

## ⚡ Performance Tips

### For Faster Generation
- Use **OpenAI GPT-5.2** (fastest)
- Keep briefs concise
- Generate during off-peak hours

### For Best Quality
- Use **Anthropic Claude Sonnet 4.5**
- Be specific in briefs (audience, mood, industry)
- Include color preferences

### For Cost Optimization
- Use **DeepSeek R1** for testing and iteration
- Switch to Claude for final polish
- Reuse generated systems as templates

---

## 💡 Pro Tips

### Design System Generation
1. **Be specific:** "Healthcare app, calming, elderly users, high contrast" beats "app design"
2. **Mention industry:** Helps AI pick appropriate patterns
3. **Specify colors:** "Blues and greens" or "Warm, earthy tones"
4. **Include mood:** "Professional", "Playful", "Trustworthy", etc.

### Code Export
1. **Name layers clearly:** AI uses layer names for semantic understanding
2. **Use auto-layout:** Generates better flexbox/grid code
3. **Group logically:** Components export cleaner when well-structured
4. **Select specific frames:** Don't export entire pages, focus on components

---

## 🐛 Troubleshooting

### API Errors

**"Please add your API key"**
→ Go to Settings, select provider, enter key, Save

**"Failed to fetch" or 401 error**
→ Verify API key is valid in provider console

**"Rate limit exceeded"**
→ Check provider dashboard for quota limits
→ Free tiers have daily limits (switch provider temporarily)

**Different providers, different results?**
→ Yes! Each AI has unique "taste" and patterns
→ Try multiple providers, pick what you like

### Generation Issues

**Takes too long (>30s)**
→ Normal for complex design systems
→ Try simpler brief or different provider
→ Check network connection

**Output not as expected**
→ Refine brief with more specifics
→ Try different provider (Claude for design, GPT for code)
→ Iterate with slight variations

**Figma crashes during generation**
→ Creating many elements is intensive
→ Close other plugins
→ Reduce brief scope (fewer components)

---

## 🚀 Next Steps

**First time using the plugin?**

1. **Start with DeepSeek** - Cheap to experiment
2. **Try all 3 providers** with same brief - Compare results
3. **Find your favorite** - Different vibes for different needs
4. **Learn the patterns** - See how pros structure design systems
5. **Iterate and refine** - Regenerate until perfect

**Ready to generate?** Load the plugin and start creating! ✨

---

## 📚 Further Reading

- **[MODELS.md](MODELS.md)** - Detailed provider comparison
- **[README.md](README.md)** - Setup and installation guide
- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/) - Deep dive into plugin development
