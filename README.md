<div align="center">

# Outer Life

🪐 A 2d game about space exploration, built with WebGL, written in Typescript

![Checks](https://img.shields.io/github/workflow/status/ColinLienard/outerlife/CI) ![Latest release](https://img.shields.io/github/v/release/ColinLienard/outerlife) ![Deployment](https://img.shields.io/website?url=https%3A%2F%2Fouterlife.vercel.app)

</div>

---

## ⚒️ Tech stack

- **UI** → [Vue.js](https://vuejs.org/)
- **Framework** → [Nuxt.js](https://nuxtjs.org/)
- **Langage** → [Typescript](https://www.typescriptlang.org/)
- **Deployment** → [Vercel](https://vercel.com/)
- **Styling** → [Sass](https://sass-lang.com/)
- **Package Manager** → [pnpm](https://pnpm.io/)

## 🔎 Overview

- `__aseprite__/` → Source files for pixel art.
- `editor/` → Core files of the editor.
- `game/` → Core files of the game.
  - `components/` → Components are only data that can be attached to entities.
  - `data/` → Tilemaps.
  - `engine/` → WebGL engine.
  - `entities/` → Organisms, environments, effects... Entities just receive components.
  - `systems/` → Systems handle the logic of the entities.
  - `utils/` → ECS implementation, helper functions...
- `pages/` → Pages of the site.
- `public/` → All the sprites and sounds of the game.
- `styles/` → Global styles.
- `ui/` → Vue components.

## ⚡ Running locally

```bash
# Installation
pnpm install

# Development server
pnpm dev

# Build
pnpm generate
```

## 📄 License

[MIT](./LICENSE) © Colin Lienard
