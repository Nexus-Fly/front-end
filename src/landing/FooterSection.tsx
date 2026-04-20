export default function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-top-line" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-brand">
          <svg viewBox="0 0 32 32" className="footer-logo-icon" aria-hidden="true">
            <path d="M16 2L4 8v8c0 7.7 5.1 14.9 12 16 6.9-1.1 12-8.3 12-16V8L16 2z" fill="none" stroke="#CE422B" strokeWidth="2"/>
            <path d="M10 16l4 4 8-8" fill="none" stroke="#CE422B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="footer-logo-text">NEXUS<span className="logo-accent">-FLY</span></span>
          <p className="footer-tagline">
            Coordination infrastructure for the autonomous logistics era.
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Project</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#stats">Stats</a></li>
            <li><a href="#tech">Tech Stack</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://tashi.dev" target="_blank" rel="noopener">Tashi Vertex</a></li>
            <li><a href="https://www.rust-lang.org/" target="_blank" rel="noopener">Rust Lang</a></li>
            <li><a href="https://tokio.rs/" target="_blank" rel="noopener">Tokio</a></li>
            <li><a href="https://docs.rs/" target="_blank" rel="noopener">Docs.rs</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Community</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://discord.com" target="_blank" rel="noopener">Discord</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Built with <span style={{ color: '#CE422B' }}>Rust</span> &amp; <span style={{ color: '#CE422B' }}>Tashi Vertex</span> BFT Consensus.
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} Nexus-Fly. All rights reserved.</p>
      </div>
    </footer>
  );
}
