# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-03

### 🚀 Initial Release

First stable release of MCP to Figma to Code plugin.

### ✨ Features

- **Multi-Provider AI Support**
  - Anthropic Claude Sonnet 4.5
  - OpenAI GPT-5.2
  - DeepSeek R1 (Reasoner)
  - Switch providers on-the-fly

- **Design System Generation**
  - Complete design systems from text descriptions
  - WCAG AA compliant color palettes
  - Typography scale (Inter font)
  - Spacing system (8px grid)
  - Border radius values
  - Shadow styles
  - 30+ component examples
  - Light & Dark mode support

- **Code Export**
  - Export Figma frames to code
  - React components
  - Vue components
  - HTML/CSS
  - Preserves styles and structure

### 🔐 Security

- API key format validation
- Sanitized error messages
- Local-only key storage (figma.clientStorage)
- Security warnings in Settings UI
- Network whitelist (Anthropic, OpenAI, DeepSeek only)
- No optional chaining (Figma compatibility)

### 📚 Documentation

- Complete README with setup guide
- Architecture documentation (HOW_IT_WORKS.md)
- Provider comparison guide (MODELS.md)
- Security best practices
- Troubleshooting guide
- Example use cases

### 🧹 Project Cleanup

- Removed unused documentation files
- Removed obsolete .env.example
- Removed test UI files
- Clean 2.6MB repository
- Clear project structure

### 🐛 Bug Fixes

- Fixed optional chaining syntax for Figma compatibility
- Sanitized API error messages
- Added key validation before API calls

---

## Links

- **Repository**: https://github.com/e-cesar9/mcptofigmatocode
- **Issues**: https://github.com/e-cesar9/mcptofigmatocode/issues
- **Releases**: https://github.com/e-cesar9/mcptofigmatocode/releases
