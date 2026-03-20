# 🎯 Teams Suggest

> **L'IA qui sait ce que tu veux dire… ou pas.**

Générateur parodique de suggestions de réponses à la sauce Microsoft Teams. Parce que ces suggestions sont un art incompris.

**🌐 Démo en ligne : [teams-suggest.douay.me](https://teams-suggest.douay.me/)**

![Capture d'écran](./screenshot.png)

## ✨ Features

- **🎭 14 ambiances** — Passif-Agressif, Hors-Sujet Total, Corporate BS, Chaotique, Trop Gentil, Crise Existentielle, Singeries, On s'fait un point ?, Meme, Flemme Cosmique, Skynet RH, Obsession Bouffe, Ghosting Pro, Mystique
- **🌍 5 langues** — Français, English, Español, Deutsch, Nederlands
- **📸 Capture d'écran** — Screenshot de la zone de suggestions, copié directement dans le presse-papier
- **📤 Partage** — Share natif (mobile) + LinkedIn, Teams, Slack, copie du lien
- **✏️ Édition** — Clique sur n'importe quelle suggestion pour écrire la tienne
- **🎉 Confettis** — Parce que pourquoi pas
- **🏆 Hall of Shame** — Galerie des pires suggestions

## 🚀 Déploiement sur Vercel

### Option 1 : One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Goose254/teams-suggest)

### Option 2 : Manuel

```bash
# Clone
git clone https://github.com/Goose254/teams-suggest.git
cd teams-suggest

# Install
pnpm install

# Dev
pnpm dev

# Lint
pnpm lint

# Build
pnpm build
```

## 🛠 Tech Stack

- **Next.js 15** — App Router
- **React 19** — UI
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **html-to-image** — Screenshot capture
- **Lucide React** — Icons

## 📁 Structure

```
teams-suggest/
├── app/
│   ├── globals.css          # Styles globaux + Tailwind
│   ├── icon.svg             # Icône originale du projet
│   ├── layout.tsx           # Root layout + SEO
│   └── page.tsx             # Page principale
├── components/
│   ├── Confetti.tsx         # Effet confettis
│   ├── TeamsMockup.tsx      # Mockup parodique du composer
│   ├── TeamsIcons.tsx       # Icônes SVG du mockup
│   └── Toast.tsx            # Notifications
├── lib/
│   ├── i18n.ts              # Traductions (FR/EN/ES/DE/NL)
│   └── suggestions.ts       # Banques de suggestions par langue/catégorie
├── eslint.config.mjs
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🤝 Contribuer

Les PR sont les bienvenues ! Surtout pour :
- Ajouter de nouvelles langues
- Ajouter de nouvelles suggestions (les plus absurdes gagnent)
- Proposer de nouvelles catégories d'ambiance

## ⚠️ Disclaimer

Teams Suggest est un **projet parodique indépendant**. Il n'est **ni affilié à, ni approuvé, ni sponsorisé par Microsoft**. Les noms « Microsoft » et « Teams » sont des marques déposées de Microsoft Corporation, citées ici uniquement à titre nominatif (on parodie bien quelque chose, il faut bien le nommer). Aucune ressemblance avec de vrais collègues nommés Kevin n'est fortuite.

## 📜 License

[MIT](./LICENSE) — Fais-en ce que tu veux, mais si ton manager te vire après avoir partagé une capture, c'est pas notre faute.
