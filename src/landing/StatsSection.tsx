import { useRef, useEffect, useState } from 'react';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: '61', label: 'Unit Tests Passing', suffix: '' },
  { value: '10', label: 'Rust Modules', suffix: '' },
  { value: '3', label: 'Agent Types', suffix: '' },
  { value: '8', label: 'Consensus Events', suffix: '' },
  { value: '0', label: 'Central Servers', suffix: '' },
  { value: '<100', label: 'ms Finality', suffix: 'ms' },
];

function AnimatedNumber({ target, visible }: { target: string; visible: boolean }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!visible) return;
    // If target starts with '<', handle specially
    if (target.startsWith('<')) {
      setDisplay(target);
      return;
    }
    const num = parseInt(target, 10);
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(interval);
      }
      setDisplay(String(current));
    }, 30);

    return () => clearInterval(interval);
  }, [target, visible]);

  return <span className="stat-number">{display}</span>;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className={`stats-section ${visible ? 'visible' : ''}`}>
      <div className="stats-bg-line" aria-hidden="true" />
      <div className="section-header">
        <span className="section-tag">BY THE NUMBERS</span>
        <h2 className="section-title">PROJECT STATS</h2>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <AnimatedNumber target={s.value} visible={visible} />
            <span className="stat-label-text">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
