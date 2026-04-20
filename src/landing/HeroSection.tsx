import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ── 3-D Drone model ─────────────────────────────────────── */
function DroneModel() {
  const { scene, animations } = useGLTF('/drone.glb');
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixer.current!.clipAction(clip).play();
      });
    }
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [animations, scene]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive
      object={scene}
      scale={1.8}
      position={[0, -0.6, 0]}
      rotation={[0.1, -0.6, 0]}
    />
  );
}

/* ── Floating particles ──────────────────────────────────── */
function Particles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useRef(new THREE.Object3D());
  const speeds = useRef<Float32Array>(new Float32Array(count));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      speeds.current[i] = 0.1 + Math.random() * 0.4;
      dummy.current.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      dummy.current.scale.setScalar(0.02 + Math.random() * 0.04);
      dummy.current.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      mesh.current.getMatrixAt(i, dummy.current.matrix);
      dummy.current.matrix.decompose(dummy.current.position, dummy.current.quaternion, dummy.current.scale);
      dummy.current.position.y += Math.sin(t * speeds.current[i] + i) * 0.002;
      dummy.current.position.x += Math.cos(t * speeds.current[i] * 0.5 + i) * 0.001;
      dummy.current.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#CE422B" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ── Hero Section ────────────────────────────────────────── */
interface HeroProps {
  scrollY: number;
}

export default function HeroSection({ scrollY }: HeroProps) {
  const parallax = scrollY * 0.3;

  return (
    <section id="hero" className="hero-section">
      {/* Background canvas */}
      <div className="hero-canvas-wrap">
        <Canvas
          camera={{ position: [0, 1.2, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#CE422B" />
          <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={1} color="#ff6633" />

          <Suspense fallback={null}>
            <DroneModel />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.5}
              scale={10}
              blur={2.5}
              far={4}
              color="#CE422B"
            />
            <Environment preset="night" />
          </Suspense>

          <Particles />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* Hero text content */}
      <div className="hero-content" style={{ transform: `translateY(${parallax}px)` }}>
        <div className="hero-tag">
          <span className="tag-dot" />
          BUILT WITH RUST &nbsp;×&nbsp; TASHI VERTEX BFT
        </div>

        <h1 className="hero-title">
          NEXUS<span className="hero-accent">-FLY</span>
        </h1>

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
