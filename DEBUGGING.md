# 🐛 Debugging Guide - UI Not Loading

Tu as une fenêtre vide qui reste en "Loading"? Voici comment débugger:

## 🧪 Tests progressifs

### Test 1: HTML pur (sans JS)
Vérifie si le problème vient du HTML/CSS ou du JavaScript.

```bash
npm run test:html
```

**Puis dans Figma:**
- Recharge le plugin
- Tu devrais voir 3 checkboxes vertes:
  - ✅ HTML chargé
  - ✅ CSS chargé
  - ✅ JS chargé

**Si tu vois "❌ JS non chargé"** → Le problème est le chargement JS de Figma.

---

### Test 2: JS simple (sans React)
Vérifie si React est le problème.

```bash
npm run test:simple
```

**Puis dans Figma:**
- Recharge le plugin
- Tu devrais voir: "✅ React Script Loaded!"

**Si ça marche** → Le problème est React/ReactDOM.  
**Si ça marche pas** → Le problème est le chargement général du JS.

---

### Test 3: Build complet
Rebuild tout normalement.

```bash
npm run build
```

---

## 🔍 Console Figma

**CRUCIAL:** Ouvre TOUJOURS la console:
1. Dans Figma: `Plugins` → `Development` → `Open Console`
2. Recharge le plugin
3. Regarde les messages dans la console

**Ce qu'on cherche:**
- 🔥 "Script inline exécuté!" (test 1)
- 🔥 "ui-simple.tsx loaded!" (test 2)
- ❌ Erreurs en rouge
- ⚠️ Warnings en jaune

---

## 📊 Infos à donner

Si ça marche toujours pas, envoie-moi:

```bash
# Taille des fichiers
ls -lh dist/

# Première ligne de ui.js
head -1 dist/ui.js

# Dernière ligne de ui.js  
tail -1 dist/ui.js

# Nombre de lignes
wc -l dist/ui.js
```

Et copie-colle **TOUT** ce que tu vois dans la console Figma.

---

## 🔄 Retour au build normal

Quand tu as fini de tester:

```bash
npm run build
```

Ça remet le vrai plugin en place.
