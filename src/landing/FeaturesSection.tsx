import { useRef, useEffect, useState } from 'react';

interface FeatureCard {
  icon: JSX.Element;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <circle cx="32" cy="32" r="24" fill="none" stroke="#CE422B" strokeWidth="2" strokeDasharray="6 3" />
        <circle cx="20" cy="22" r="5" fill="#CE422B" opacity="0.8" />
        <circle cx="44" cy="22" r="5" fill="#CE422B" opacity="0.8" />
        <circle cx="32" cy="48" r="5" fill="#CE422B" opacity="0.8" />
        <line x1="20" y1="22" x2="44" y2="22" stroke="#CE422B" strokeWidth="1.5" />
        <line x1="44" y1="22" x2="32" y2="48" stroke="#CE422B" strokeWidth="1.5" />
        <line x1="32" y1="48" x2="20" y2="22" stroke="#CE422B" strokeWidth="1.5" />
      </svg>
    ),
    title: 'BFT CONSENSUS',
    badge: 'VERTEX',
    badgeClass: 'badge-rust',
    description: 'Byzantine Fault Tolerant ordering via Tashi Vertex. All nodes agree on the same event sequence — no central orchestrator needed.',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <rect x="6" y="20" width="20" height="28" rx="3" fill="none" stroke="#CE422B" strokeWidth="2" />
        <rect x="38" y="20" width="20" height="28" rx="3" fill="none" stroke="#CE422B" strokeWidth="2" />
        <path d="M26 30 h12 M26 38 h12" stroke="#CE422B" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="16" cy="30" r="3" fill="#CE422B" opacity="0.7" />
        <circle cx="48" cy="30" r="3" fill="#CE422B" opacity="0.7" />
      </svg>
    ),
    title: 'CROSS-AGENT HANDOFF',
    badge: 'P2P',
    badgeClass: 'badge-orange',
    description: 'Mid-route parcel transfers between drones, robots, and e-bikes. Validated and executed as consensus-ordered state transitions.',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <path d="M12 50 C12 50 20 14 32 14 C44 14 52 50 52 50" fill="none" stroke="#CE422B" strokeWidth="2" />
        <circle cx="32" cy="14" r="5" fill="none" stroke="#CE422B" strokeWidth="2" />
        <line x1="32" y1="19" x2="32" y2="50" stroke="#CE422B" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M22 40 h20" stroke="#CE422B" strokeWidth="2" />
        <circle cx="32" cy="14" r="2" fill="#CE422B" />
      </svg>
    ),
    title: 'DETERMINISTIC AUCTION',
    badge: 'FAIR',
    badgeClass: 'badge-rust',
    description: 'All nodes run identical auction logic on the same ordered bid set. ETA, battery, and reputation weighted — ties broken lexicographically.',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <path d="M16 32 a16 16 0 1 1 32 0 a16 16 0 1 1 -32 0" fill="none" stroke="#CE422B" strokeWidth="2" />
        <path d="M32 20 v12 l8 8" stroke="#CE422B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 16 L16 10 M48 10 l6 6 M10 48 l6 6 M48 54 l6-6" stroke="#CE422B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    title: 'SELF-HEALING',
    badge: 'AUTO',
    badgeClass: 'badge-orange',
    description: 'HeartbeatTracker detects silent agents in milliseconds. Failed deliveries are flagged and re-auctioned without human intervention.',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <path d="M32 8 L8 20 v20 L32 56 L56 40 V20 Z" fill="none" stroke="#CE422B" strokeWidth="2" />
        <path d="M8 20 L32 34 L56 20" fill="none" stroke="#CE422B" strokeWidth="1.5" opacity="0.5" />
        <line x1="32" y1="34" x2="32" y2="56" stroke="#CE422B" strokeWidth="1.5" opacity="0.5" />
        <circle cx="32" cy="34" r="3" fill="#CE422B" />
      </svg>
    ),
    title: 'SAFETY MESH',
    badge: 'ZONE',
    badgeClass: 'badge-rust',
    description: 'Geographic safety zones declared by any node. All agents check their position against active exclusion zones before proceeding.',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="feature-icon-svg">
        <rect x="12" y="16" width="40" height="32" rx="4" fill="none" stroke="#CE422B" strokeWidth="2" />
        <line x1="12" y1="28" x2="52" y2="28" stroke="#CE422B" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="3" fill="#CE422B" opacity="0.7" />
        <path d="M20 38 h6 M20 42 h10 M36 38 h8 M36 42 h6" stroke="#CE422B" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    title: 'ESCROW LEDGER',
    badge: 'PAY',
    badgeClass: 'badge-orange',
    description: 'Internal settlement layer: escrow reservation, handoff fee transfers, and final delivery payments — all fully automated.',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className={`features-section ${visible ? 'visible' : ''}`}>
      <div className="section-header">
        <span className="section-tag">CORE CAPABILITIES</span>
        <h2 className="section-title">TOP<br />FEATURES</h2>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="feature-card-header">
              <span className="feature-title">{f.title}</span>
              <span className={`feature-badge ${f.badgeClass}`}>{f.badge}</span>
            </div>
            <div className="feature-icon">{f.icon}</div>
            <p className="feature-desc">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
