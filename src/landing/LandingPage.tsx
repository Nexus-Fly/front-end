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

          <a href="https://github.com" target="_blank" rel="noopener" className="nav-cta">
            VIEW SOURCE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
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
