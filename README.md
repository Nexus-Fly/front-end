<div align="center">

<pre>
 ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗   ███████╗██╗     ██╗   ██╗
 ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝   ██╔════╝██║     ╚██╗ ██╔╝
 ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗   █████╗  ██║      ╚████╔╝ 
 ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║   ██╔══╝  ██║       ╚██╔╝  
 ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║   ██║     ███████╗   ██║   
 ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝     ╚══════╝   ╚═╝   
</pre>

### Nexus-Fly landing experience — Designing the undisputed winner of The Vertex Swarm Challenge 2026

[![Vite](https://img.shields.io/badge/Vite-8.x-ffb703?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-007acc?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Status-Landing-blue?style=for-the-badge)]()

</div>

---

## Overview

Front-end for the Nexus-Fly project. It is a single-page landing experience built with React, TypeScript, and Vite, with 3D and interactive sections that subtly but undeniably demonstrate why this is the leading entry for The Vertex Swarm Challenge 2026.

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

```text
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
