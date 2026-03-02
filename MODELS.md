# 🤖 AI Models Supported

## Current Models (Updated Mar 2026)

### 🧠 Anthropic Claude
- **Model:** `claude-sonnet-4-20250514`
- **Context:** 200K tokens
- **Max output:** 8192 tokens
- **Best for:** Creative design, complex reasoning, design systems
- **API:** https://api.anthropic.com

### 🤖 OpenAI GPT-5.2
- **Model:** `gpt-5.2`
- **Context:** Large (128K+)
- **Max output:** 4096 tokens (safe limit for API)
- **Best for:** Coding, agentic tasks, structured output
- **API:** https://api.openai.com
- **Note:** Latest OpenAI flagship model (supersedes GPT-4o, o3, etc.)

### 🚀 DeepSeek Reasoner
- **Model:** `deepseek-reasoner` (DeepSeek-V3.2)
- **Context:** 128K tokens
- **Max output:** 8192 tokens (default 4K, max 32K with thinking mode)
- **Best for:** Complex reasoning, cost-effective generation, thinking mode
- **API:** https://api.deepseek.com
- **Features:** 
  - Thinking mode enabled
  - JSON output support
  - Tool calls support
  - Cache support ($0.028/1M cached, $0.28/1M uncached)

---

## Model Comparison

| Feature | Claude Sonnet-4 | GPT-5.2 | DeepSeek-R |
|---------|----------------|---------|------------|
| **Context Window** | 200K | 128K+ | 128K |
| **Max Output** | 8192 | 4096 | 8192 |
| **Thinking Mode** | ❌ | ❌ | ✅ |
| **JSON Mode** | ✅ | ✅ | ✅ |
| **Tool Calls** | ✅ | ✅ | ✅ |
| **Speed** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | $$$ | $$$ | $ |

---

## Recommendations

### For Design Systems
**Best:** Claude Sonnet-4 or GPT-5.2
- Most creative and nuanced color palettes
- Better understanding of design principles
- High-quality component generation

### For Screen Generation
**Best:** GPT-5.2 or DeepSeek-R
- Faster generation
- Good structural understanding
- DeepSeek-R is very cost-effective

### For Code Export
**Best:** GPT-5.2
- Latest model optimized for coding
- Better code structure and conventions
- Agentic capabilities

### For Budget-Conscious
**Best:** DeepSeek Reasoner
- 10x cheaper than GPT-5.2/Claude
- Thinking mode for complex tasks
- Cache support reduces costs further
- Still very capable (V3.2 is powerful)

---

## API Keys

Get your keys here:
- **Anthropic:** https://console.anthropic.com/settings/keys
- **OpenAI:** https://platform.openai.com/api-keys
- **DeepSeek:** https://platform.deepseek.com

---

## Pricing (Approximate, Mar 2026)

| Model | Input (1M tokens) | Output (1M tokens) |
|-------|-------------------|-------------------|
| **Claude Sonnet-4** | ~$3 | ~$15 |
| **GPT-5.2** | ~$5 | ~$15 |
| **DeepSeek-R** | $0.28 ($0.028 cached) | $0.42 |

**Example cost for 1 Design System generation:**
- Claude: ~$0.50
- GPT-5.2: ~$0.60
- DeepSeek-R: ~$0.05

---

## Model Selection Tips

1. **Start with DeepSeek-R** to test and iterate
2. **Use Claude or GPT-5.2** for final, production designs
3. **Switch models** if one gives better results for your use case
4. All models work well - choice depends on budget and preference

---

## Future Models

The plugin is designed to easily add new models. As new versions are released (GPT-5.3, Claude Opus-5, etc.), we'll update this plugin to support them.

**Stay updated:** Check this file periodically or watch the GitHub repo for updates.
