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
            <li>
              <a href="https://github.com/Nexus-Fly" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </a>
            </li>
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
