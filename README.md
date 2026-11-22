# Portfolio — Ismail Mifdal

Portfolio en **Angular 22**, avec un **assistant IA (OpenAI)** qui répond aux recruteurs sur mon parcours,
mes compétences et mes projets.

## Sections

Accueil · À propos · Compétences (programmation, DevSecOps, IA, agile, données, architectures, web services)
· Expériences · Formation · Projets · Contact, plus l'assistant IA flottant.

## Modifier le contenu : un seul fichier

Tout le contenu est dans **`src/app/data/profile.ts`** : identité, expériences, formation, compétences,
architectures, web services, projets et langues. Le site **et** le chatbot lisent ce fichier.

- Les textes `À compléter` s'affichent en italique sur le site. Le chatbot ne les voit pas : il répond
  « non renseigné » au lieu d'inventer.
- Pour ajouter un projet, ajoute un objet au tableau `projects`. Les champs `image`, `demo` et `featured` sont facultatifs.

**Photo de profil :** dépose `public/profile.jpg` (carrée, 600×600 px minimum). Sans elle, les initiales s'affichent.
**CV :** dépose le PDF dans `public/`, puis renseigne `links.cv` (par exemple `'cv-ismail-mifdal.pdf'`).

## Assistant IA : architecture et sécurité

```
Navigateur ──POST /api/chat──▶ Fonction Vercel (api/chat.ts) ──▶ OpenAI
                                 · clé OPENAI_API_KEY côté serveur uniquement
                                 · prompt système construit depuis profile.ts
                                 · 20 questions / 10 min par IP, 600 caractères max
                                 · rôle « system » injecté par le client : filtré
```

**La clé OpenAI ne doit jamais être dans le code Angular ni dans Git.** Dans Vercel, va dans
**Settings → Environment Variables**, puis ajoute :

| Variable | Valeur |
|---|---|
| `OPENAI_API_KEY` | ta clé `sk-…` |
| `OPENAI_MODEL` | facultatif, `gpt-4o-mini` par défaut |

Redéploie ensuite le projet. Sans clé, le site fonctionne et l'assistant affiche « pas encore configuré ».

## Développement

```bash
npm install
npm start            # http://localhost:4200 (sans l'API : l'assistant affiche une erreur propre)
npx vercel dev       # site + /api/chat en local (clé dans .env.local, jamais commitée)
npm test             # tests (Vitest)
npm run build        # dist/portfolio/browser
```

## Déploiement

Le site est déployé sur Vercel (voir `vercel.json`). Chaque push sur `main` redéploie le site.
