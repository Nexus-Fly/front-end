import { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ArchitectureSection from './ArchitectureSection';
import StatsSection from './StatsSection';
import TechStackSection from './TechStackSection';
import SimulationSection from './SimulationSection';
import FooterSection from './FooterSection';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navSolid = scrollY > 60;

  return (
    <div className="landing-root">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className={`landing-nav ${navSolid ? 'solid' : ''}`}
      >
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            <svg viewBox="0 0 32 32" className="nav-logo-icon" aria-hidden="true">
              <path d="M16 2L4 8v8c0 7.7 5.1 14.9 12 16 6.9-1.1 12-8.3 12-16V8L16 2z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 16l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="logo-text">NEXUS<span className="logo-accent">-FLY</span></span>
          </a>

          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#hero" onClick={() => setMenuOpen(false)}>HOME</a></li>
            <li><a href="#features" onClick={() => setMenuOpen(false)}>FEATURES</a></li>
            <li><a href="#architecture" onClick={() => setMenuOpen(false)}>ARCHITECTURE</a></li>
            <li><a href="#stats" onClick={() => setMenuOpen(false)}>STATS</a></li>
            <li><a href="#simulation" onClick={() => setMenuOpen(false)}>SIMULATION</a></li>
            <li><a href="#tech" onClick={() => setMenuOpen(false)}>TECH</a></li>
          </ul>

          <a href="https://github.com/Nexus-Fly" target="_blank" rel="noopener" className="nav-cta">
            VIEW SOURCE
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* ── Degree ruler bar (mimicking image) ──────────────── */}
      <div className="degree-ruler" aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} className="degree-tick">
            {i * 30}°
          </span>
        ))}
      </div>

      {/* ── Sections ───────────────────────────────────────────── */}
      <HeroSection scrollY={scrollY} />
      <FeaturesSection />
      <ArchitectureSection />
      <StatsSection />
      <SimulationSection />
      <TechStackSection />
      <FooterSection />
    </div>
  );
}
