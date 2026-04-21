import { useEffect, useState, useRef } from 'react';

const LOGS = [
  { time: 0, text: "[node1] INFO  order created: order-7f3a  origin: depot-north" },
  { time: 600, text: "[node1] INFO  auction open -- waiting for bids" },
  { time: 1400, text: "[node2] INFO  bid submitted -- eta: 4.2 min, battery: 87%" },
  { time: 1600, text: "[node3] INFO  bid submitted -- eta: 6.1 min, battery: 72%" },
  { time: 2400, text: "[node1] INFO  winner selected: node2 (score: 0.91)" },
  { time: 2800, text: "[node1] INFO  escrow reserved -- 250 units locked" },
  { time: 4000, text: "[node2] INFO  order picked up -- status: InTransit" },
  { time: 5500, text: "[node2] INFO  handoff request emitted -- target: node3 (battery low)" },
  { time: 6200, text: "[node3] INFO  handoff accepted -- ledger transfer: 80 units to node2" },
  { time: 7800, text: "[node3] INFO  order delivered -- order-7f3a" },
  { time: 8200, text: "[node1] INFO  ledger settled -- node3 credited 170 units (final payment)" },
  { time: 8600, text: "[node1] INFO  order-7f3a complete" }
];

export default function SimulationSection() {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!isRunning && visibleLogs.length === 0) {
            startSimulation();
          }
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isRunning, visibleLogs.length]);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleLogs]);

  const startSimulation = () => {
    setIsRunning(true);
    setVisibleLogs([]);
    
    let timeouts: number[] = [];

    LOGS.forEach(({ time, text }) => {
      const timeoutId = window.setTimeout(() => {
        setVisibleLogs(prev => [...prev, text]);
      }, time);
      timeouts.push(timeoutId);
    });

    const resetTimeout = window.setTimeout(() => {
      setIsRunning(false);
    }, LOGS[LOGS.length - 1].time + 2000);
    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  };

  const handleRestart = () => {
    if (!isRunning) {
      startSimulation();
    }
  };

  // --- Derive Map State from Logs ---
  let drone2Pos = { x: 30, y: 15 };
  let drone3Pos = { x: 65, y: 85 };
  let parcelHolder = 'none';
  let drone2Status = 'idle';
  let drone3Status = 'idle';
  let d2Bidding = false;
  let d3Bidding = false;

  const currentLogIndex = visibleLogs.length - 1;

  if (currentLogIndex >= 0) parcelHolder = 'depot'; // order created
  
  if (currentLogIndex >= 2 && currentLogIndex < 4) d2Bidding = true;
  if (currentLogIndex >= 3 && currentLogIndex < 4) d3Bidding = true;

  if (currentLogIndex >= 4) { // winner
    drone2Pos = { x: 15, y: 50 }; // moving to depot
    drone2Status = 'moving';
  }
  if (currentLogIndex >= 6) { // picked up / InTransit
    parcelHolder = 'node2';
    drone2Pos = { x: 50, y: 50 }; // drone 2 moving to destination but stops midway
  }
  if (currentLogIndex >= 7) { // handoff requested
    drone2Status = 'low-battery';
    // Drone 3 starts moving to drone 2 early to save time
    drone3Pos = { x: 50, y: 50 };
    drone3Status = 'moving';
  }
  if (currentLogIndex >= 8) { // handoff accepted / picked up by N3
    parcelHolder = 'node3';
    drone3Pos = { x: 85, y: 50 }; // Drone 3 continues to destination
    drone2Status = 'offline';
  }
  if (currentLogIndex >= 9) { // delivered
    parcelHolder = 'destination';
    drone3Status = 'idle';
  }

  return (
    <section 
      id="simulation" 
      ref={sectionRef} 
      className={`simulation-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="section-header center">
        <span className="section-tag">LIVE SIMULATION</span>
        <h2 className="section-title">Autonomous <span className="title-accent">Handoff</span></h2>
        <p className="section-desc">
          Watch a real-time visualization of the BFT consensus and decentralised order lifecycle running on our Rust backend.
        </p>
      </div>

      <div className="simulation-container">
        {/* TERMINAL UI */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-title">nexus-fly-core — zsh — 80x24</div>
            <button 
              className={`terminal-restart ${isRunning ? 'disabled' : ''}`} 
              onClick={handleRestart}
              disabled={isRunning}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>{isRunning ? 'RUNNING...' : 'RESTART'}</span>
            </button>
          </div>
          <div className="terminal-body" ref={terminalBodyRef}>
            <div className="terminal-prompt-line">
              <span className="prompt-path">~/nexus-fly</span>
              <span className="prompt-char">$</span>
              <span className="prompt-cmd">cargo run --bin mvp_demo</span>
            </div>
            <div className="terminal-logs">
              {visibleLogs.map((log, index) => {
                // Colorize the log parts for better terminal look
                const isNode1 = log.includes('[node1]');
                const isNode2 = log.includes('[node2]');
                const nodeClass = isNode1 ? 'node-1' : (isNode2 ? 'node-2' : 'node-3');
                
                return (
                  <div key={index} className="log-line">
                    <span className={`log-node ${nodeClass}`}>
                      {isNode1 ? '[node1]' : (isNode2 ? '[node2]' : '[node3]')}
                    </span>
                    <span className="log-level">INFO </span>
                    <span className="log-msg">{log.substring(13)}</span>
                  </div>
                );
              })}
              {isRunning && (
                <div className="log-line empty">
                  <span className="cursor-blink">|</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAP UI */}
        <div className="simulation-map">
          <div className="map-grid"></div>

          {/* Depot */}
          <div className={`map-node depot ${parcelHolder === 'depot' ? 'has-parcel' : ''}`} style={{ left: '15%', top: '50%' }}>
            <span className="node-icon">📦</span>
            <span className="node-label">Depot</span>
            {parcelHolder === 'depot' && <div className="parcel" />}
            {/* If auction open, show signal rings from depot */}
            {currentLogIndex >= 1 && currentLogIndex < 4 && <div className="depot-signal" />}
          </div>

          {/* Destination */}
          <div className={`map-node destination ${parcelHolder === 'destination' ? 'has-parcel' : ''}`} style={{ left: '85%', top: '50%' }}>
            <span className="node-icon">📍</span>
            <span className="node-label">Drop-off</span>
            {parcelHolder === 'destination' && <div className="parcel" />}
          </div>

          {/* Drone 2 */}
          <div className={`map-drone drone-2 ${drone2Status}`} style={{ left: `${drone2Pos.x}%`, top: `${drone2Pos.y}%` }}>
            {d2Bidding && <div className="drone-ring bidding" />}
            <span className="drone-id">N2</span>
            {parcelHolder === 'node2' && <div className="parcel" />}
          </div>

          {/* Drone 3 */}
          <div className={`map-drone drone-3 ${drone3Status}`} style={{ left: `${drone3Pos.x}%`, top: `${drone3Pos.y}%` }}>
            {d3Bidding && <div className="drone-ring bidding" />}
            <span className="drone-id">N3</span>
            {parcelHolder === 'node3' && <div className="parcel" />}
          </div>
        </div>
      </div>
    </section>
  );
}
