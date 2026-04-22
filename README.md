# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  <div align="center">

  <pre>
   ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗   ███████╗██╗     ██╗   ██╗
   ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝   ██╔════╝██║     ╚██╗ ██╔╝
   ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗   █████╗  ██║      ╚████╔╝ 
   ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║   ██╔══╝  ██║       ╚██╔╝  
   ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║   ██║     ███████╗   ██║   
   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝     ╚══════╝   ╚═╝   
  </pre>

  ### Nexus-Fly landing experience

  [![Vite](https://img.shields.io/badge/Vite-8.x-ffb703?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.x-007acc?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![Status](https://img.shields.io/badge/Status-Landing-blue?style=for-the-badge)]()

  </div>

  ---

  ## Overview

  Front-end for the Nexus-Fly project. It is a single-page landing experience built with React, TypeScript, and Vite, with 3D and interactive sections that describe the system and simulation.

  ## Features

  - Multi-section landing layout: hero, features, architecture, stats, simulation, tech stack, and footer.
  - 3D assets support via Three.js, React Three Fiber, and Spline.
  - Responsive navigation and scroll-driven UI.

  ## Tech Stack

  - React 19 + TypeScript
  - Vite 8
  - Three.js, React Three Fiber, Drei
  - Spline runtime and model-viewer

  ## Project Structure

  ```
  front-end/
    src/
      landing/          # Landing sections and layout
      model3d/          # 3D assets and textures
      App.tsx
      main.tsx
  ```

  ## Local Development

  Install dependencies:

  ```bash
  npm install
  ```

  Start the dev server:

  ```bash
  npm run dev
  ```

  Build for production:

  ```bash
  npm run build
  ```

  Preview the production build:

  ```bash
  npm run preview
  ```

  Lint:

  ```bash
  npm run lint
  ```
