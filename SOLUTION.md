# 🔧 Solution: Inline JavaScript

## Problème identifié

Figma plugin sandbox **ne charge pas les fichiers JavaScript externes** via `<script src="ui.js">`.

**Tests effectués:**
- ✅ Test 1: HTML + CSS + inline JS → Fonctionne
- ❌ Test 2: HTML + CSS + `<script src="ui.js">` (bundlé) → Ne fonctionne pas
- ❌ Test 3: HTML + CSS + `<script src="ui.js">` (non-bundlé) → Ne fonctionne pas

**Conclusion:** Le JavaScript doit être **inline** dans le HTML.

---

## Solution appliquée

### Nouveau build process:

1. **esbuild** génère `dist/ui.js` (bundle React)
2. **build-inline.js** lit `ui.js` et l'injecte dans `ui.html` en `<script>inline</script>`
3. Résultat: Un seul fichier `ui.html` avec tout le JS dedans

### Avantages:
- ✅ Compatible avec le sandbox Figma
- ✅ Moins de fichiers à gérer
- ✅ Pas de problème de chemins relatifs

### Build command:
```bash
npm run build
```

Génère:
- `dist/ui.html` - HTML avec JS inline ✅
- `dist/ui.css` - CSS (chargé via `<link>`)
- `dist/code.js` - Plugin backend
- `dist/ui.js` - Intermédiaire (utilisé pour l'inline)

---

## Architecture

```
src/
├── ui.tsx          # React app
├── ui.css          # Styles
├── code.ts         # Figma plugin backend
└── ui.html         # Template (pas utilisé au final)

build-inline.js     # Script qui injecte JS dans HTML

dist/
├── ui.html         # HTML final avec JS inline ← Chargé par Figma
├── ui.css          # CSS externe
├── ui.js           # Bundle React (intermédiaire)
└── code.js         # Backend
```

---

## Pourquoi ça marche maintenant

**Avant:**
```html
<!-- ui.html -->
<script src="ui.js"></script>  ❌ Figma n'exécute pas
```

**Après:**
```html
<!-- ui.html -->
<script>
  // Tout le code React inline
  (function(){...})();
</script>  ✅ Fonctionne!
```

Le CSS reste externe car `<link rel="stylesheet">` fonctionne dans Figma.

---

## Notes techniques

- Le bundle `ui.js` fait ~500KB non-minifié
- Inline = fichier HTML plus gros, mais c'est la seule façon
- Le CSS reste séparé pour la lisibilité

---

**Status:** ✅ Problème résolu avec inline JS injection
