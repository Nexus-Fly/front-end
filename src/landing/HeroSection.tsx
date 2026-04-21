import Spline from '@splinetool/react-spline';

/* ── Hero Section ────────────────────────────────────────── */
interface HeroProps {
  scrollY: number;
}

export default function HeroSection({ scrollY }: HeroProps) {
  const parallax = scrollY * 0.3;

  return (
    <section id="hero" className="hero-section">
      {/* Spline 3D scene */}
      <div className="hero-canvas-wrap">
        <Spline scene="https://prod.spline.design/aH-9HHlbB1Gcd71w/scene.splinecode" />
      </div>

      <div className="hero-content" style={{ transform: `translateY(${parallax}px)` }}>
        <div className="hero-tag">
          <span className="tag-dot" />
          BUILT WITH RUST &nbsp;×&nbsp; TASHI VERTEX BFT
        </div>

        

        <p className="hero-subtitle">
          Decentralized swarm coordination for autonomous delivery fleets.
          <br />
          No central server. No single point of failure.
        </p>

        <div className="hero-actions">
          <a href="#features" className="btn-primary">EXPLORE FEATURES</a>
          <a href="#architecture" className="btn-outline">VIEW ARCHITECTURE</a>
        </div>
      </div>

      {/* Side stat cards – inspired by REAPER image */}
      <div
        className="hero-side-stats"
        style={{ opacity: Math.max(0, 1 - scrollY / 500) }}
      >
        <div className="side-stat-card">
          <div className="stat-header">
            <span className="stat-label">CONSENSUS</span>
            <span className="stat-badge">BFT</span>
          </div>
          <svg viewBox="0 0 80 60" className="stat-icon-svg">
            <circle cx="40" cy="30" r="22" fill="none" stroke="#CE422B" strokeWidth="2" strokeDasharray="4 3"/>
            <circle cx="25" cy="18" r="4" fill="#CE422B"/>
            <circle cx="55" cy="18" r="4" fill="#CE422B"/>
            <circle cx="40" cy="48" r="4" fill="#CE422B"/>
            <line x1="25" y1="18" x2="55" y2="18" stroke="#CE422B" strokeWidth="1.5"/>
            <line x1="55" y1="18" x2="40" y2="48" stroke="#CE422B" strokeWidth="1.5"/>
            <line x1="40" y1="48" x2="25" y2="18" stroke="#CE422B" strokeWidth="1.5"/>
          </svg>
          <span className="stat-value">&lt;100ms</span>
          <span className="stat-desc">• Finality</span>
        </div>

        <div className="side-stat-card">
          <div className="stat-header">
            <span className="stat-label">AGENTS</span>
            <span className="stat-badge force">SWARM</span>
          </div>
          <svg viewBox="0 0 80 60" className="stat-icon-svg">
            <path d="M10 50 L40 10 L70 50" fill="none" stroke="#CE422B" strokeWidth="2"/>
            <path d="M20 50 L40 20 L60 50" fill="none" stroke="#CE422B" strokeWidth="2" opacity="0.6"/>
            <path d="M30 50 L40 30 L50 50" fill="none" stroke="#CE422B" strokeWidth="2" opacity="0.3"/>
          </svg>
          <span className="stat-value">Drone · Robot · E-Bike</span>
          <span className="stat-desc">• Heterogeneous Fleet</span>
        </div>
      </div>

      {/* Right-side watermark (like the REAPER image cross icon) */}
      <div className="hero-watermark" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="watermark-svg">
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.15"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.1"/>
          <line x1="100" y1="10" x2="100" y2="190" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.12"/>
          <line x1="10" y1="100" x2="190" y2="100" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.12"/>
          <line x1="30" y1="30" x2="170" y2="170" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.08"/>
          <line x1="170" y1="30" x2="30" y2="170" stroke="var(--rust-dim)" strokeWidth="1" opacity="0.08"/>
        </svg>
      </div>

      {/* Bottom "THE SILENT VERDICT" like text block */}
      <div className="hero-verdict">
        <h3>THE AUTONOMOUS<br/>SWARM</h3>
        <p>Of the Modern Logistics.<br/>Decentralized Coordination.<br/>Redefined.</p>
      </div>
    </section>
  );
}
