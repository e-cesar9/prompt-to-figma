# 🤖 AI Models & Providers

## Supported Providers

The plugin supports **3 AI providers**. Choose based on your needs, budget, and preferences.

---

## 🧠 Anthropic Claude

### Model: `claude-sonnet-4-5-20241022`

**Specs:**
- Context: 200K tokens
- Max output: 8192 tokens
- Response time: ~5-15 seconds

**Best For:**
- Creative design systems
- Nuanced color palettes
- High-quality component generation
- Design work that requires "taste"

**Pricing:**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens
- **~$0.30-0.50 per design system**

**Get API Key:**
- [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

---

## 🤖 OpenAI GPT

### Model: `gpt-5.2`

**Specs:**
- Context: 128K+ tokens
- Max output: 4096 tokens
- Response time: ~3-8 seconds

**Best For:**
- Fast generation
- Structured, reliable output
- Production workflows
- Code export (excellent code quality)

**Pricing:**
- Input: ~$5 / 1M tokens
- Output: ~$15 / 1M tokens
- **~$0.40-0.60 per design system**

**Get API Key:**
- [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## 🚀 DeepSeek

### Model: `deepseek-reasoner` (R1)

**Specs:**
- Context: 128K tokens
- Max output: 8192 tokens
- Response time: ~10-20 seconds (reasoning mode)
- Reasoning capabilities built-in

**Best For:**
- Budget-conscious usage (50x cheaper!)
- Testing and rapid iteration
- Complex reasoning tasks
- High volume generation

**Pricing:**
- Input: $0.55 / 1M tokens
- Output: $2.19 / 1M tokens
- Cache (input): $0.14 / 1M tokens
- **~$0.01-0.05 per design system** 💰

**Get API Key:**
- [platform.deepseek.com](https://platform.deepseek.com)

---

## 📊 Comparison

| Feature | Claude Sonnet 4.5 | GPT-5.2 | DeepSeek R1 |
|---------|-------------------|---------|-------------|
| **Context Window** | 200K | 128K+ | 128K |
| **Max Output** | 8192 | 4096 | 8192 |
| **Reasoning** | ❌ | ❌ | ✅ (built-in) |
| **Speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Quality (Design)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Quality (Code)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost per DS** | $0.30-0.50 | $0.40-0.60 | $0.01-0.05 |
| **Best Use** | Creative work | Production | Testing, budget |

---

## 🎯 Recommendations

### For Design Systems

**1st choice: Anthropic Claude Sonnet 4.5**
- Most creative and aesthetically refined
- Best understanding of design principles
- Nuanced color palette generation
- Worth the cost for polished output

**2nd choice: OpenAI GPT-5.2**
- Very reliable and fast
- Great structured output
- Good balance of quality and speed

**3rd choice: DeepSeek R1**
- 50x cheaper than Claude/GPT
- Surprisingly capable with reasoning mode
- Perfect for rapid iteration and testing
- Use for initial explorations, finalize with Claude

### For Code Export

**1st choice: OpenAI GPT-5.2**
- Newest GPT model optimized for code
- Best code structure and conventions
- Clean, production-ready output

**2nd choice: DeepSeek R1**
- Great code quality at fraction of cost
- Reasoning helps with complex layouts

**3rd choice: Claude Sonnet 4.5**
- Solid code output but focused on design

### For Budget-Conscious Work

**DeepSeek R1 all the way** 🚀
- **50x cheaper** than alternatives
- Built-in reasoning (unique advantage)
- Cache support reduces costs further
- Surprisingly high quality
- Perfect for:
  - Learning and experimentation
  - High-volume generation
  - Client demos and prototypes
  - Cost-sensitive projects

**Pro tip:** Start with DeepSeek for iteration, use Claude for final polish if budget allows.

---

## 💰 Cost Examples

**Generating 10 design systems:**

| Provider | Total Cost |
|----------|------------|
| Claude Sonnet 4.5 | ~$3.00-5.00 |
| GPT-5.2 | ~$4.00-6.00 |
| DeepSeek R1 | ~$0.10-0.50 |

**Generating 100 design systems:**

| Provider | Total Cost |
|----------|------------|
| Claude Sonnet 4.5 | ~$30-50 |
| GPT-5.2 | ~$40-60 |
| DeepSeek R1 | ~$1-5 |

---

## 🔄 Switching Providers

You can switch providers anytime in the plugin:

1. Open **⚙️ Settings** tab
2. Click the provider button (Anthropic / OpenAI / DeepSeek)
3. Enter the corresponding API key
4. Click **💾 Save Settings**

The plugin will use the selected provider for all subsequent generations.

**Each provider's key is stored separately** - you can switch back and forth freely.

---

## ⚙️ Advanced Configuration

### Change Model Versions

To use different model versions, edit `src/code.ts`:

```typescript
// For Anthropic
model: 'claude-sonnet-4-5-20241022'  // or claude-opus-4-20250514

// For OpenAI  
model: 'gpt-5.2'  // or gpt-4o

// For DeepSeek
model: 'deepseek-reasoner'  // reasoning mode (R1)
// or 'deepseek-chat' for faster, non-reasoning mode
```

Then rebuild:
```bash
npm run build
```

---

## 🆕 Latest Updates (March 2026)

- ✅ Claude Sonnet 4.5 (Oct 2024)
- ✅ GPT-5.2 (latest flagship)
- ✅ DeepSeek R1 (reasoning model)
- All models actively maintained

---

## 🚀 Quick Start Guide

**Never used AI APIs before?**

1. **Start with DeepSeek** ($5 credit on signup)
   - Cheapest to experiment with
   - Learn the plugin without burning budget
   - Great quality for learning

2. **Upgrade to Claude when ready**
   - Production-quality design systems
   - Worth it for client work

3. **Use GPT for code export**
   - Best code generation
   - Latest GPT model

**No right or wrong choice** - all three work great! Pick based on your budget and needs.
