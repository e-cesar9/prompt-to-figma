# 🐛 Debugging Guide - UI Not Loading

Tu as une fenêtre vide qui reste en "Loading"? Voici comment débugger:

## 🧪 Tests progressifs

### Test 1: HTML pur (sans JS bundlé) ✅ OK
Vérifie si le problème vient du HTML/CSS ou du JavaScript.

```bash
npm run test:html
```

**Résultat:** ✅ Fonctionne - HTML/CSS/inline JS OK

---

### Test 2: JS bundled simple (sans React) ❌ BLOQUE
Vérifie si le bundling esbuild fonctionne.

```bash
npm run test:simple
```

**Résultat:** ❌ Affiche "Loading" - Le bundle ne s'exécute pas

---

### Test 3: JS NON-bundlé (copie directe) 🔥 TEST CRITIQUE
Vérifie si c'est esbuild qui pose problème.

```bash
npm run test:minimal
```

**Puis dans Figma:**
- Recharge le plugin
- Tu devrais voir: "✅ MINIMAL JS WORKS!"

**Si ça marche** → Le problème est esbuild  
**Si ça marche pas** → Figma ne charge aucun fichier JS externe

---

### Test 4: Build complet
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
