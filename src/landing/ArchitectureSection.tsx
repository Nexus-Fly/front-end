import { useRef, useEffect, useState } from 'react';

const ORDER_STATES = [
  { label: 'Created', color: '#CE422B' },
  { label: 'Bidding', color: '#e06030' },
  { label: 'Assigned', color: '#d48030' },
  { label: 'Pickup', color: '#CE422B' },
  { label: 'InTransit', color: '#e06030' },
  { label: 'HandoffPending', color: '#d48030' },
  { label: 'HandedOff', color: '#CE422B' },
  { label: 'Delivered', color: '#4caf50' },
];

const MODULES = [
  {
    name: 'consensus/vertex.rs',
    desc: 'Thin wrapper over Tashi Vertex BFT Engine — send & receive consensus-ordered messages.',
    layer: 'consensus',
  },
  {
    name: 'app.rs',
    desc: 'Stateful dispatcher — routes incoming NexusMessage to domain handlers.',
    layer: 'app',
  },
  {
    name: 'domain/order.rs',
    desc: 'Pure FSM for the delivery lifecycle with strict state transition guards.',
    layer: 'domain',
  },
  {
    name: 'domain/auction.rs',
    desc: 'Deterministic bid scoring: ETA + battery + reputation. Ties broken lexicographically.',
    layer: 'domain',
  },
  {
    name: 'domain/handoff.rs',
    desc: 'Cross-agent parcel transfer validation and state transitions.',
    layer: 'domain',
  },
  {
    name: 'domain/healing.rs',
    desc: 'HeartbeatTracker — detects silent agents and flags in-flight orders for re-auction.',
    layer: 'domain',
  },
  {
    name: 'domain/safety.rs',
    desc: 'SafetyMonitor — manages geographic exclusion zones and agent proximity checks.',
    layer: 'domain',
  },
  {
    name: 'domain/ledger.rs',
    desc: 'In-memory escrow: reserve → transfer on handoff → release on delivery.',
    layer: 'domain',
  },
  {
    name: 'sim/runner.rs',
    desc: 'Local deterministic simulation of the complete MVP delivery flow.',
    layer: 'sim',
  },
  {
    name: 'codec.rs',
    desc: 'JSON serialization/deserialization of NexusMessage for Vertex transactions.',
    layer: 'core',
  },
];

const layerColors: Record<string, string> = {
  consensus: '#CE422B',
  app: '#e06030',
  domain: '#d48030',
  sim: '#b06020',
  core: '#887050',
};

export default function ArchitectureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="architecture" ref={sectionRef} className={`arch-section ${visible ? 'visible' : ''}`}>
      <div className="section-header">
        <span className="section-tag">SYSTEM DESIGN</span>
        <h2 className="section-title">ARCHITECTURE</h2>
      </div>

      {/* Order lifecycle FSM */}
      <div className="arch-fsm">
        <h3 className="arch-sub-title">Order Lifecycle FSM</h3>
        <div className="fsm-pipeline">
          {ORDER_STATES.map((s, i) => (
            <div key={i} className="fsm-step" style={{ animationDelay: `${i * 0.10}s` }}>
              <div className="fsm-step-index">{String(i + 1).padStart(2, '0')}</div>
              <div className="fsm-step-dot" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}55` }} />
              <div className="fsm-step-label">{s.label}</div>
              {i < ORDER_STATES.length - 1 && <div className="fsm-step-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* Module grid */}
      <div className="arch-modules">
        <h3 className="arch-sub-title">Module Map</h3>
        <div className="modules-grid">
          {MODULES.map((m, i) => (
            <div key={i} className="module-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="module-header">
                <span
                  className="module-dot"
                  style={{ background: layerColors[m.layer] }}
                />
                <code className="module-name">{m.name}</code>
                <span className="module-layer" style={{ color: layerColors[m.layer] }}>
                  {m.layer.toUpperCase()}
                </span>
              </div>
              <p className="module-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Event model */}
      <div className="arch-events">
        <h3 className="arch-sub-title">Consensus Event Model</h3>
        <p className="arch-principle">
          <span className="quote-mark">"</span>
          Emit intent locally. Advance state only after the consensus-ordered event is received back.
          <span className="quote-mark">"</span>
        </p>
        <div className="event-list">
          {[
            'OrderCreated', 'AuctionBid', 'AuctionWinner',
            'HandoffRequest', 'HandoffComplete', 'AgentFailure',
            'SafetyAlert', 'OrderDelivered'
          ].map((e, i) => (
            <span key={i} className="event-chip">{e}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
