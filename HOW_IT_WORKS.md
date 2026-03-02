# 🎨 Comment ça marche - DesignAI Plugin

## 📖 Vue d'ensemble

Le plugin envoie des prompts à l'API IA (Claude ou GPT-4), reçoit une structure JSON, puis **crée automatiquement des composants Figma** via l'API Figma.

---

## 🔄 Flux de fonctionnement

### 1. 🎨 Générer un Design System

**Étapes:**

1. **Tu entres un brief** dans l'onglet "🎨 Design System"
   - Exemple: _"Modern fintech app, trustworthy, blue and green colors"_

2. **Le plugin envoie le brief à l'IA** (Anthropic Claude ou OpenAI GPT-4)
   - Prompt structuré demandant: couleurs, typo, spacing, shadows, composants

3. **L'IA répond avec un JSON structuré:**
   ```json
   {
     "colors": {
       "primary": { "50": "#...", "100": "#...", ... },
       "secondary": {...},
       ...
     },
     "typography": {
       "fontFamily": "Inter",
       "scale": [
         { "name": "H1", "size": 40, "weight": 700, ... }
       ]
     },
     "spacing": [0, 4, 8, 16, ...],
     "shadows": [...],
     ...
   }
   ```

4. **Le plugin crée les éléments dans Figma:**
   - Nouvelle page "🎨 Design System"
   - Sections: Colors, Typography, Spacing, Shadows, Components
   - Frames avec swatches de couleurs
   - Exemples de typo avec chaque style
   - Grille de spacing
   - Composants (boutons, inputs, cards, badges, etc.)
   - Mode Light + Dark

**Résultat:** Une page Figma complète avec tous les tokens et composants ready-to-use! ✨

---

### 2. 📱 Générer un Screen

**Étapes:**

1. **Tu entres une description** dans l'onglet "📱 Generate Screen"
   - Exemple: _"Login screen with email, password, and sign-in button"_

2. **Le plugin envoie la description à l'IA**

3. **L'IA répond avec une structure de layout:**
   ```json
   {
     "screenName": "Login",
     "width": 375,
     "height": 812,
     "elements": [
       { "type": "TEXT", "name": "Title", "x": 24, "y": 60, ... },
       { "type": "RECTANGLE", "name": "Button", "x": 24, "y": 200, ... }
     ]
   }
   ```

4. **Le plugin crée le screen dans Figma:**
   - Frame avec dimensions mobile
   - Éléments positionnés (text, rectangles, etc.)
   - Styles appliqués

**Résultat:** Un screen mockup créé automatiquement! 🎨

---

### 3. 💻 Exporter du Code

**Étapes:**

1. **Tu sélectionnes une frame dans Figma**

2. **Tu choisis le format** (React / Vue / HTML)

3. **Le plugin lit la structure Figma:**
   - Parcourt les layers
   - Extrait styles (couleurs, tailles, positions)
   - Génère du code correspondant

4. **Tu copies le code généré** 

**Résultat:** Code React/Vue/HTML basé sur ton design! 💻

---

## 🏗️ Architecture technique

```
┌─────────────────────────────────────────────┐
│             Figma Desktop App               │
├─────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │  UI (React)                            │ │
│  │  - Forms pour brief/prompts            │ │
│  │  - Boutons Generate                    │ │
│  │  - Settings pour API keys              │ │
│  └────────────────────────────────────────┘ │
│              ↕️ postMessage                 │
│  ┌────────────────────────────────────────┐ │
│  │  Backend (code.ts)                     │ │
│  │  - Reçoit les messages UI              │ │
│  │  - Fait les appels API (Claude/GPT-4)  │ │
│  │  - Crée les éléments Figma             │ │
│  │    (frames, rectangles, text, etc.)    │ │
│  └────────────────────────────────────────┘ │
│              ↕️ Figma Plugin API            │
│  ┌────────────────────────────────────────┐ │
│  │  Document Figma                        │ │
│  │  - Pages, frames, layers, styles       │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              ↕️ HTTPS
┌─────────────────────────────────────────────┐
│  API IA (Anthropic ou OpenAI)               │
│  - Reçoit brief                             │
│  - Génère JSON structuré                    │
└─────────────────────────────────────────────┘
```

---

## 🔑 Clés API

**Pourquoi tu dois les fournir:**
- Appels directs à Anthropic/OpenAI depuis le plugin
- Pas de backend intermédiaire (architecture simple)
- Tes clés = ton quota/billing

**Stockage:**
- Sauvegardées dans `figma.clientStorage` (local, persistant)
- Jamais envoyées ailleurs que vers Anthropic/OpenAI

---

## 🎯 Exemples d'utilisation

### Use case 1: Design System complet

1. Ouvre le plugin
2. Va dans "🎨 Design System"
3. Entre: _"SaaS B2B platform, professional, trustworthy, blues and grays"_
4. Clique "✨ Generate Design System"
5. Attends ~10 secondes
6. **Boom!** Nouvelle page avec:
   - Palette de couleurs complète
   - Échelle typographique
   - Spacing system
   - 30+ composants (buttons, inputs, cards, badges, avatars...)
   - Light + Dark mode

### Use case 2: Mockup rapide

1. Va dans "📱 Generate Screen"
2. Entre: _"Dashboard with 4 stat cards, main chart, activity feed"_
3. Clique "🎨 Generate Screen"
4. **Boom!** Screen créé avec layout structuré

### Use case 3: Design to Code

1. Crée un design dans Figma
2. Sélectionne la frame
3. Ouvre le plugin → "💻 Export Code"
4. Choisis React/Vue/HTML
5. Copie le code!

---

## ⚡ Pourquoi c'est puissant

- **Gain de temps:** 2 minutes vs 2 heures pour un design system
- **Cohérence:** Tout est structuré et relié
- **Itération rapide:** Change le brief, regénère
- **Learning:** Vois comment structurer un DS professionnel
- **Prototyping:** Crée des screens rapidement pour tester des idées

---

## 💡 Tips

- Sois **précis** dans tes briefs (audience, industry, mood, couleurs)
- Utilise les **exemples pré-remplis** pour t'inspirer
- Génère le **Design System d'abord**, puis les screens (cohérence)
- Tu peux **modifier** les éléments générés après (c'est du Figma natif)

---

## 🐛 Troubleshooting

**"Please add your API key"**
→ Va dans Settings, entre ta clé, Save

**"Failed to fetch"**
→ Vérifie que ta clé API est valide

**Generation prend >30s**
→ Normal pour Design System complet (beaucoup d'éléments)

**Résultat pas parfait**
→ Reformule ton brief, sois plus précis

---

**Prêt à générer des design systems en 10 secondes?** 🚀
