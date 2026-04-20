import { useRef, useEffect, useState } from 'react';

interface TechItem {
  name: string;
  role: string;
  icon: JSX.Element;
}

const techStack: TechItem[] = [
  {
    name: 'Rust',
    role: 'Core language — safe, fast, zero-cost abstractions',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="16" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">R</text>
      </svg>
    ),
  },
  {
    name: 'Tokio',
    role: 'Async runtime for the live consensus event loop',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="14" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">Tk</text>
      </svg>
    ),
  },
  {
    name: 'Tashi Vertex',
    role: 'BFT consensus and event-ordering engine',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="14" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">Vx</text>
      </svg>
    ),
  },
  {
    name: 'Serde + JSON',
    role: 'Message serialization and deserialization',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="12" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">Se</text>
      </svg>
    ),
  },
  {
    name: 'TOML',
    role: 'Human-readable node configuration files',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="11" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">TL</text>
      </svg>
    ),
  },
  {
    name: 'Docker',
    role: 'Reproducible dev environment & multi-node cluster',
    icon: (
      <svg viewBox="0 0 48 48" className="tech-logo">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#CE422B" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill="#CE422B" fontSize="12" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">Dk</text>
      </svg>
    ),
  },
];

export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="tech" ref={sectionRef} className={`tech-section ${visible ? 'visible' : ''}`}>
      <div className="section-header">
        <span className="section-tag">POWERED BY</span>
        <h2 className="section-title">TECH STACK</h2>
      </div>

      <div className="tech-grid">
        {techStack.map((t, i) => (
          <div key={i} className="tech-card" style={{ animationDelay: `${i * 0.1}s` }}>
            {t.icon}
            <h4 className="tech-name">{t.name}</h4>
            <p className="tech-role">{t.role}</p>
          </div>
        ))}
      </div>

      {/* Code snippet showcase */}
      <div className="code-showcase">
        <h3 className="arch-sub-title">Quick Start — Rust</h3>
        <pre className="code-block">
          <code>{`use tashi_vertex::{Context, Engine, KeySecret, Options, Peers, Socket};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let key: KeySecret = "BASE58_SECRET_KEY".parse()?;

    let mut peers = Peers::new()?;
    peers.insert("127.0.0.1:9001", &"PEER_KEY".parse()?, Default::default())?;
    peers.insert("127.0.0.1:9000", &key.public(), Default::default())?;

    let context = Context::new()?;
    let socket = Socket::bind(&context, "127.0.0.1:9000").await?;
    let engine = Engine::start(&context, socket, Options::default(), &key, peers, false)?;

    // Send & receive consensus-ordered events
    engine.send_transaction(/* ... */)?;
    while let Some(msg) = engine.recv_message().await? {
        // Process ordered messages
    }
    Ok(())
}`}</code>
        </pre>
      </div>
    </section>
  );
}
