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
[![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)]()

</div>

---

## What is Nexus-Fly?

Nexus-Fly is a **decentralized autonomous drone-swarm delivery system** built on top of [Tashi Vertex](https://tashi.dev) — a Byzantine Fault Tolerant (BFT) consensus engine. Agents (drones, robots, e-bikes) coordinate deliveries without any central server: every order, bid, handoff, and payment is finalized through consensus-ordered events that every node processes identically.

The project was built for **The Vertex Swarm Challenge 2026** and consists of two repositories:

| Repo | Description |
|------|-------------|
| [`Nexus-Fly/front-end`](https://github.com/Nexus-Fly) | This repo — landing page & live simulation |
| `Nexus-Fly/backend` | Rust core — BFT node, domain FSMs, sim runner |

---

## Landing Page

The landing is a single-page experience designed to showcase every layer of the system. Each section tells a part of the story:

### Sections

| Section | What it shows |
|---------|--------------|
| **Hero** | Animated intro with project tagline and 3D drone model |
| **Features** | 6 core capabilities: BFT consensus, auction engine, multi-agent handoff, fault healing, safety monitor, and on-chain ledger |
| **Demo Video** | Embedded walkthrough of the full system in action |
| **Architecture** | Order lifecycle FSM (8 states), Rust module map, and the consensus event model |
| **Stats** | Key metrics: latency, fault tolerance, throughput, and delivery success rate |
| **Simulation** | Live canvas simulation — 15 drones over a London city map (Camden → Shoreditch → Relay Hub → Canary Wharf). Terminal log replays the auction + handoff + ledger settlement sequence |
| **Tech Stack** | Full dependency graph: Rust, Tokio, Tashi Vertex, React, Three.js |
| **Footer** | Links and community |

### Simulation detail

The simulation section renders an HTML5 Canvas with:
- **15 drones** — 3 named agents (D1 drone, R2 robot, E3 e-bike) + 12 ambient swarm
- **Autonomous state machine** — each drone cycles `idle → to-pickup → carrying → returning`
- **Scripted sequence** — D1/R2/E3 act out a full auction + delivery + handoff over ~32 seconds before joining the free swarm
- **London city map** — 5 districts (Camden, Relay Hub, Canary Wharf, Shoreditch, Greenwich) with River Thames
- **Peer-mesh overlay** — drones within range show consensus links
- **HUD** — live phase label, winner, battery levels, and swarm stats after the sequence

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 8, TypeScript 6 |
| UI | React 19, CSS custom properties |
| 3D | Three.js, React Three Fiber, Drei, Spline |
| Canvas | HTML5 Canvas API, requestAnimationFrame, ResizeObserver |
| Deploy | Vercel |

---

## Project Structure

```text
front-end/
├── src/
│   ├── landing/
│   │   ├── HeroSection.tsx          # Animated hero + 3D drone
│   │   ├── FeaturesSection.tsx      # Core capabilities + demo video
│   │   ├── ArchitectureSection.tsx  # FSM, module map, event model
│   │   ├── StatsSection.tsx         # Key metrics
│   │   ├── SimulationSection.tsx    # Live canvas swarm simulation
│   │   ├── TechStackSection.tsx     # Tech dependency display
│   │   ├── FooterSection.tsx        # Footer + links
│   │   ├── LandingPage.tsx          # Nav + layout composition
│   │   └── LandingPage.css          # All section styles
│   ├── model3d/                     # 3D assets and textures
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
└── vite.config.ts
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

---

## Links

- **GitHub Organization:** [github.com/Nexus-Fly](https://github.com/Nexus-Fly)
- **Tashi Vertex:** [tashi.dev](https://tashi.dev)


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
