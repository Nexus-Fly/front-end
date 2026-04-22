import { useEffect, useState, useRef } from 'react';

const LOGS = [
  { time: 0, text: '[t=0] simulation started — 3 agent(s) online' },
  { time: 1000, text: '[t=1] order created  id=order-0' },
  {
    time: 2000,
    text: '[t=2] bids received  [drone-1(eta=1s,bat=88%), robot-2(eta=4s,bat=58%), ebike-3(eta=2s,bat=78%)]',
  },
  { time: 3000, text: '[t=3] winner chosen  winner=drone-1' },
  { time: 4000, text: '[t=4] moving toward pickup  winner=drone-1 loc=(40.7128,-74.0060)' },
  { time: 5000, text: '[t=5] pickup completed  holder=drone-1' },
  { time: 6000, text: '[t=6] in transit  holder=drone-1' },
  { time: 7000, text: '[t=7] handoff requested  from=drone-1 to=robot-2' },
  { time: 8000, text: '[t=8] handoff completed  from=drone-1 to=robot-2  fee=100' },
  { time: 9000, text: '[t=9] delivered  by=robot-2' },
  {
    time: 10000,
    text: '[t=10] ledger settled  robot-2 balance=200  reauction=["sim-reauction-1"]  safety_paused=true',
  },
  { time: 11000, text: '[t=11] simulation already complete' },
];

type DroneState = {
  x: number;
  y: number;
  status: 'idle' | 'moving' | 'handoff' | 'delivering' | 'offline';
  hasParcel: boolean;
};

type BatteryState = {
  drone1: number;
  drone2: number;
  drone3: number;
};

type MapState = {
  drone1: DroneState;
  drone2: DroneState;
  drone3: DroneState;
  parcelHolder: 'none' | 'depot' | 'drone1' | 'drone2' | 'drone3' | 'destination';
  auctionOpen: boolean;
  activeRoute: 'none' | 'depot-to-handoff' | 'handoff-to-destination' | 'complete';
  phaseLabel: string;
  winner: string;
  batteries: BatteryState;
};

const BATTERY_BY_LOG_INDEX: BatteryState[] = [
  { drone1: 89, drone2: 59, drone3: 79 },
  { drone1: 88, drone2: 58, drone3: 78 },
  { drone1: 87, drone2: 57, drone3: 77 },
  { drone1: 86, drone2: 56, drone3: 76 },
  { drone1: 85, drone2: 56, drone3: 76 },
  { drone1: 84, drone2: 55, drone3: 75 },
  { drone1: 83, drone2: 54, drone3: 74 },
  { drone1: 82, drone2: 53, drone3: 73 },
  { drone1: 81, drone2: 52, drone3: 72 },
  { drone1: 80, drone2: 51, drone3: 71 },
  { drone1: 80, drone2: 51, drone3: 71 },
  { drone1: 80, drone2: 51, drone3: 71 },
];

function getBatteries(currentLogIndex: number): BatteryState {
  if (currentLogIndex < 0) {
    return { drone1: 90, drone2: 60, drone3: 80 };
  }
  const boundedIndex = Math.min(currentLogIndex, BATTERY_BY_LOG_INDEX.length - 1);
  return BATTERY_BY_LOG_INDEX[boundedIndex];
}

const INITIAL_MAP_STATE: MapState = {
  drone1: { x: 12, y: 44, status: 'idle', hasParcel: false },
  drone2: { x: 68, y: 62, status: 'idle', hasParcel: false },
  drone3: { x: 48, y: 28, status: 'idle', hasParcel: false },
  parcelHolder: 'none',
  auctionOpen: false,
  activeRoute: 'none',
  phaseLabel: 'Booting simulation',
  winner: '-',
  batteries: { drone1: 90, drone2: 60, drone3: 80 },
};

function deriveMapState(currentLogIndex: number): MapState {
  const state: MapState = {
    drone1: { ...INITIAL_MAP_STATE.drone1 },
    drone2: { ...INITIAL_MAP_STATE.drone2 },
    drone3: { ...INITIAL_MAP_STATE.drone3 },
    parcelHolder: 'none',
    auctionOpen: false,
    activeRoute: 'none',
    phaseLabel: currentLogIndex < 0 ? 'Booting simulation' : `Phase t=${currentLogIndex}`,
    winner: currentLogIndex >= 3 ? 'drone-1' : '-',
    batteries: getBatteries(currentLogIndex),
  };

  if (currentLogIndex === 0) {
    state.phaseLabel = 'Cluster online';
  }

  if (currentLogIndex === 1) {
    state.phaseLabel = 'Order created';
  }

  if (currentLogIndex === 2) {
    state.phaseLabel = 'Auction bidding';
  }

  if (currentLogIndex === 3) {
    state.phaseLabel = 'Winner chosen';
  }

  if (currentLogIndex === 4) {
    state.phaseLabel = 'Moving to pickup';
  }

  if (currentLogIndex === 5) {
    state.phaseLabel = 'Pickup completed';
  }

  if (currentLogIndex === 6) {
    state.phaseLabel = 'In transit';
  }

  if (currentLogIndex === 7) {
    state.phaseLabel = 'Handoff requested';
  }

  if (currentLogIndex === 8) {
    state.phaseLabel = 'Handoff completed';
  }

  if (currentLogIndex === 9) {
    state.phaseLabel = 'Delivered';
  }

  if (currentLogIndex >= 10) {
    state.phaseLabel = 'Ledger settled';
  }

  if (currentLogIndex >= 1) {
    state.parcelHolder = 'depot';
  }

  if (currentLogIndex >= 1 && currentLogIndex < 3) {
    state.auctionOpen = true;
  }

  if (currentLogIndex >= 3) {
    state.drone1.status = 'moving';
  }

  if (currentLogIndex >= 4) {
    state.drone1.x = 15;
    state.drone1.y = 50;
  }

  if (currentLogIndex >= 5) {
    state.parcelHolder = 'drone1';
    state.drone1.hasParcel = true;
  }

  if (currentLogIndex >= 6) {
    state.activeRoute = 'depot-to-handoff';
    state.drone1.status = 'delivering';
    state.drone1.x = 38;
    state.drone1.y = 50;
  }

  if (currentLogIndex >= 7) {
    state.drone1.x = 50;
    state.drone1.y = 50;
    state.drone1.status = 'handoff';

    state.drone2.status = 'handoff';
    state.drone2.x = 58;
    state.drone2.y = 56;
  }

  if (currentLogIndex >= 8) {
    state.activeRoute = 'handoff-to-destination';
    state.parcelHolder = 'drone2';
    state.drone1.hasParcel = false;
    state.drone1.status = 'idle';
    state.drone1.x = 50;
    state.drone1.y = 50;

    state.drone2.hasParcel = true;
    state.drone2.status = 'delivering';
    state.drone2.x = 68;
    state.drone2.y = 52;
  }

  if (currentLogIndex >= 9) {
    state.drone2.x = 85;
    state.drone2.y = 50;
  }

  if (currentLogIndex >= 10) {
    state.activeRoute = 'complete';
  }

  if (currentLogIndex >= 11) {
    state.drone3.status = 'offline';
  }

  if (currentLogIndex >= 9) {
    state.parcelHolder = 'destination';
    state.drone2.hasParcel = false;
    state.drone2.status = 'idle';
    state.drone2.x = 85;
    state.drone2.y = 50;
  }

  return state;
}

export default function SimulationSection() {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const hasAutoStartedRef = useRef(false);

  const clearTimers = () => {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!hasAutoStartedRef.current) {
            hasAutoStartedRef.current = true;
            startSimulation();
          }
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleLogs]);

  const startSimulation = () => {
    clearTimers();
    setIsRunning(true);
    setVisibleLogs([]);

    LOGS.forEach(({ time, text }) => {
      const timeoutId = window.setTimeout(() => {
        setVisibleLogs(prev => [...prev, text]);
      }, time);
      timeoutsRef.current.push(timeoutId);
    });

    const resetTimeout = window.setTimeout(() => {
      setIsRunning(false);
    }, LOGS[LOGS.length - 1].time + 2000);
    timeoutsRef.current.push(resetTimeout);
  };

  const handleRestart = () => {
    if (!isRunning) {
      startSimulation();
    }
  };

  const currentLogIndex = visibleLogs.length - 1;
  const mapState = deriveMapState(currentLogIndex);

  const getLogLineClass = (line: string) => {
    if (line.includes('winner chosen') || line.includes('ledger settled')) {
      return 'node-1';
    }
    if (line.includes('drone-1')) {
      return 'node-1';
    }
    if (line.includes('robot-2')) {
      return 'node-2';
    }
    if (line.includes('ebike-3')) {
      return 'node-3';
    }
    return 'node-1';
  };

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
          Faithful frontend replay of the Rust `LiveSim` flow from `Codigo-Rust/src/sim/runner.rs`.
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
                const nodeClass = getLogLineClass(log);
                
                return (
                  <div key={index} className="log-line">
                    <span className={`log-node ${nodeClass}`}>[sim]</span>
                    <span className="log-msg">{log}</span>
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
          <div className={`map-link link-a ${mapState.activeRoute === 'depot-to-handoff' || mapState.activeRoute === 'complete' ? 'active' : ''}`}></div>
          <div className={`map-link link-b ${mapState.activeRoute === 'handoff-to-destination' || mapState.activeRoute === 'complete' ? 'active' : ''}`}></div>
          <div className="map-hud">
            <div className="hud-phase">{mapState.phaseLabel}</div>
            <div className="hud-grid">
              <span>winner</span>
              <strong>{mapState.winner}</strong>
              <span>D1 battery</span>
              <strong>{mapState.batteries.drone1}%</strong>
              <span>R2 battery</span>
              <strong>{mapState.batteries.drone2}%</strong>
              <span>E3 battery</span>
              <strong>{mapState.batteries.drone3}%</strong>
            </div>
          </div>

          {/* Depot */}
          <div className={`map-node depot ${mapState.parcelHolder === 'depot' ? 'has-parcel' : ''}`} style={{ left: '15%', top: '50%' }}>
            <span className="node-icon">📦</span>
            <span className="node-label">Depot</span>
            {mapState.parcelHolder === 'depot' && <div className="parcel" />}
            {/* If auction open, show signal rings from depot */}
            {mapState.auctionOpen && <div className="depot-signal" />}
          </div>

          {/* Destination */}
          <div className={`map-node destination ${mapState.parcelHolder === 'destination' ? 'has-parcel' : ''}`} style={{ left: '85%', top: '50%' }}>
            <span className="node-icon">📍</span>
            <span className="node-label">Drop-off</span>
            {mapState.parcelHolder === 'destination' && <div className="parcel" />}
          </div>

          {/* Drone 1 (winner in Rust flow) */}
          <div className={`map-drone drone-1 ${mapState.drone1.status} ${mapState.drone1.hasParcel ? 'carrying' : ''}`} style={{ left: `${mapState.drone1.x}%`, top: `${mapState.drone1.y}%` }}>
            {(mapState.drone1.status === 'moving' || mapState.drone1.status === 'delivering' || mapState.drone1.status === 'handoff') && <div className="drone-ring activity" />}
            <span className="drone-id">D1</span>
            <span className="drone-meta">{mapState.drone1.status}</span>
            {mapState.parcelHolder === 'drone1' && <div className="parcel" />}
          </div>

          {/* Robot 2 (handoff receiver in Rust flow) */}
          <div className={`map-drone drone-2 ${mapState.drone2.status} ${mapState.drone2.hasParcel ? 'carrying' : ''}`} style={{ left: `${mapState.drone2.x}%`, top: `${mapState.drone2.y}%` }}>
            {(mapState.auctionOpen || mapState.drone2.status === 'handoff' || mapState.drone2.status === 'delivering') && <div className="drone-ring bidding" />}
            <span className="drone-id">R2</span>
            <span className="drone-meta">{mapState.drone2.status}</span>
            {mapState.parcelHolder === 'drone2' && <div className="parcel" />}
          </div>

          {/* Ebike 3 */}
          <div className={`map-drone drone-3 ${mapState.drone3.status}`} style={{ left: `${mapState.drone3.x}%`, top: `${mapState.drone3.y}%` }}>
            {mapState.auctionOpen && <div className="drone-ring bidding" />}
            <span className="drone-id">E3</span>
            <span className="drone-meta">{mapState.drone3.status}</span>
            {mapState.parcelHolder === 'drone3' && <div className="parcel" />}
          </div>
        </div>
      </div>
    </section>
  );
}
