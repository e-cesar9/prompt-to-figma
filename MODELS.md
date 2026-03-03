# 🤖 AI Models

## Current Setup

### 🧠 Anthropic Claude Sonnet 4

- **Model:** `claude-sonnet-4-20250514`
- **Context:** 200K tokens
- **Max output:** 8192 tokens
- **Best for:** Design systems, creative generation, complex reasoning
- **API:** https://api.anthropic.com

---

## Why Claude?

**Strengths:**
- Excellent understanding of design principles
- Creative and nuanced color palettes
- High-quality component generation
- Great at following structured prompts
- Reliable JSON output

**Perfect for:**
- Design system generation
- Screen layouts
- Creative design work

---

## Configuration

The model is set in `src/code.ts`:

```typescript
model: 'claude-sonnet-4-20250514'
```

### To Change Model

Edit `src/code.ts` and update the model string:

```typescript
// For higher quality (more expensive)
model: 'claude-opus-4-20250514'

// For faster/cheaper
model: 'claude-haiku-4-20250514'
```

Then rebuild:
```bash
npm run build
```

---

## API Key

Get your Anthropic API key:
- **Console:** https://console.anthropic.com/settings/keys
- **Pricing:** https://www.anthropic.com/pricing

---

## Pricing (as of March 2026)

| Model | Input | Output |
|-------|-------|--------|
| **Sonnet 4** | $3/1M tokens | $15/1M tokens |
| **Opus 4** | $15/1M tokens | $75/1M tokens |
| **Haiku 4** | $0.25/1M tokens | $1.25/1M tokens |

**Typical cost for 1 Design System:**
- Sonnet 4: ~$0.30-0.50
- Opus 4: ~$1.50-2.00
- Haiku 4: ~$0.05-0.10

---

## Tips

1. **Start with Sonnet** - Best balance of quality and cost
2. **Use Opus** for production-ready, polished systems
3. **Use Haiku** for rapid prototyping and testing
4. Monitor usage in Anthropic Console

---

## Future Support

The plugin can support other providers (OpenAI, etc.) but currently focuses on Anthropic Claude for simplicity and quality.

To add multi-provider support, modify the API call logic in `src/code.ts`.

---

**Current recommendation: Stick with Sonnet 4** ✅
