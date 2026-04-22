import { useEffect, useState, useRef } from 'react';

const LOGS = [
  { time: 0,     text: '[t=0]  simulation started — 3 agent(s) online' },
  { time: 2000,  text: '[t=1]  order created  id=order-0  ▸ waiting for bids…' },
  { time: 4000,  text: '[t=2]  bids received  [drone-1(eta=1s,bat=88%), robot-2(eta=4s,bat=58%), ebike-3(eta=2s,bat=78%)]' },
  { time: 6000,  text: '[t=3]  auction settled  ▸ winner=drone-1  (lowest eta + highest battery)' },
  { time: 8000,  text: '[t=4]  drone-1 dispatched  ▸ flying to pickup  loc=(51.5240,-0.0770)  zone=SHOREDITCH' },
  { time: 11000, text: '[t=5]  pickup completed  ▸ parcel secured  holder=drone-1' },
  { time: 14000, text: '[t=6]  in transit  ▸ drone-1 crossing Shoreditch → Relay Hub' },
  { time: 17000, text: '[t=7]  handoff requested  ▸ drone-1 battery low, delegating to robot-2' },
  { time: 20000, text: '[t=8]  handoff completed  ▸ parcel transferred  from=drone-1 to=robot-2  fee=100' },
  { time: 23000, text: '[t=9]  robot-2 en route  ▸ last-mile delivery to Canary Wharf' },
  { time: 26000, text: '[t=10] delivered ✓  ▸ parcel at destination  by=robot-2' },
  { time: 29000, text: '[t=11] ledger settled  ▸ robot-2 balance=+200  drone-1 balance=+75  safety_paused=true' },
  { time: 32000, text: '[t=12] reauction triggered  ▸ remaining agents joining swarm pool' },
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
  drone4: number;
  drone5: number;
  drone6: number;
};

type MapState = {
  drone1: DroneState;
  drone2: DroneState;
  drone3: DroneState;
  drone4: DroneState;
  drone5: DroneState;
  drone6: DroneState;
  parcelHolder: 'none' | 'depot' | 'drone1' | 'drone2' | 'drone3' | 'destination';
  auctionOpen: boolean;
  activeRoute: 'none' | 'depot-to-handoff' | 'handoff-to-destination' | 'complete';
  phaseLabel: string;
  winner: string;
  batteries: BatteryState;
};

const BATTERY_BY_LOG_INDEX: BatteryState[] = [
  { drone1: 89, drone2: 59, drone3: 79, drone4: 69, drone5: 74, drone6: 66 },
  { drone1: 88, drone2: 58, drone3: 78, drone4: 68, drone5: 73, drone6: 65 },
  { drone1: 87, drone2: 57, drone3: 77, drone4: 67, drone5: 72, drone6: 64 },
  { drone1: 86, drone2: 56, drone3: 76, drone4: 66, drone5: 71, drone6: 63 },
  { drone1: 85, drone2: 56, drone3: 76, drone4: 66, drone5: 71, drone6: 63 },
  { drone1: 84, drone2: 55, drone3: 75, drone4: 65, drone5: 70, drone6: 62 },
  { drone1: 83, drone2: 54, drone3: 74, drone4: 64, drone5: 69, drone6: 61 },
  { drone1: 82, drone2: 53, drone3: 73, drone4: 63, drone5: 68, drone6: 60 },
  { drone1: 81, drone2: 52, drone3: 72, drone4: 62, drone5: 67, drone6: 59 },
  { drone1: 80, drone2: 51, drone3: 71, drone4: 61, drone5: 66, drone6: 58 },
  { drone1: 80, drone2: 51, drone3: 71, drone4: 61, drone5: 66, drone6: 58 },
  { drone1: 80, drone2: 51, drone3: 71, drone4: 61, drone5: 66, drone6: 58 },
  { drone1: 80, drone2: 51, drone3: 71, drone4: 61, drone5: 66, drone6: 58 },
  { drone1: 80, drone2: 51, drone3: 71, drone4: 61, drone5: 66, drone6: 58 },
];

function getBatteries(currentLogIndex: number): BatteryState {
  if (currentLogIndex < 0) {
    return { drone1: 90, drone2: 60, drone3: 80, drone4: 70, drone5: 75, drone6: 67 };
  }
  const boundedIndex = Math.min(currentLogIndex, BATTERY_BY_LOG_INDEX.length - 1);
  return BATTERY_BY_LOG_INDEX[boundedIndex];
}

const INITIAL_MAP_STATE: MapState = {
  drone1: { x: 20, y: 75, status: 'idle', hasParcel: false },
  drone2: { x: 68, y: 62, status: 'idle', hasParcel: false },
  drone3: { x: 48, y: 28, status: 'idle', hasParcel: false },
  parcelHolder: 'none',
  auctionOpen: false,
  activeRoute: 'none',
  phaseLabel: 'Booting simulation',
  winner: '-',
  batteries: { drone1: 90, drone2: 60, drone3: 80, drone4: 70, drone5: 75, drone6: 67 },
};

function deriveMapState(currentLogIndex: number): MapState {
  const state: MapState = {
    drone1: { ...INITIAL_MAP_STATE.drone1 },
    drone2: { ...INITIAL_MAP_STATE.drone2 },
    drone3: { ...INITIAL_MAP_STATE.drone3 },
    drone4: { ...INITIAL_MAP_STATE.drone4 },
    drone5: { ...INITIAL_MAP_STATE.drone5 },
    drone6: { ...INITIAL_MAP_STATE.drone6 },
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
    state.phaseLabel = 'Order created — awaiting bids';
  }

  if (currentLogIndex === 2) {
    state.phaseLabel = 'Auction bidding…';
  }

  if (currentLogIndex === 3) {
    state.phaseLabel = 'Winner: drone-1 selected';
  }

  if (currentLogIndex === 4) {
    state.phaseLabel = 'drone-1 flying to pickup';
  }

  if (currentLogIndex === 5) {
    state.phaseLabel = 'Pickup complete — parcel secured';
  }

  if (currentLogIndex === 6) {
    state.phaseLabel = 'In transit → Relay Hub';
  }

  if (currentLogIndex === 7) {
    state.phaseLabel = 'Handoff requested (battery low)';
  }

  if (currentLogIndex === 8) {
    state.phaseLabel = 'Handoff done — robot-2 carries';
  }

  if (currentLogIndex === 9) {
    state.phaseLabel = 'robot-2 → Canary Wharf';
  }

  if (currentLogIndex === 10) {
    state.phaseLabel = 'Delivered ✓';
  }

  if (currentLogIndex >= 11) {
    state.phaseLabel = 'Ledger settled — swarm free';
  }

  if (currentLogIndex >= 12) {
    state.phaseLabel = 'Swarm regrouped';
  }

  if (currentLogIndex >= 2) {
    state.parcelHolder = 'depot';
  }

  if (currentLogIndex >= 2 && currentLogIndex < 4) {
    state.auctionOpen = true;
  }

  if (currentLogIndex >= 4) {
    state.drone1.status = 'moving';
  }

  if (currentLogIndex >= 4) {
    state.drone1.x = 20;
    state.drone1.y = 75;
  }

  if (currentLogIndex >= 6) {
    state.parcelHolder = 'drone1';
    state.drone1.hasParcel = true;
  }

  if (currentLogIndex >= 7) {
    state.activeRoute = 'depot-to-handoff';
    state.drone1.status = 'delivering';
    state.drone1.x = 36;
    state.drone1.y = 52;
  }

  if (currentLogIndex >= 8) {
    state.drone1.x = 50;
    state.drone1.y = 26;
    state.drone1.status = 'handoff';

    state.drone2.status = 'handoff';
    state.drone2.x = 55;
    state.drone2.y = 26;
  }

  if (currentLogIndex >= 9) {
    state.activeRoute = 'handoff-to-destination';
    state.parcelHolder = 'drone2';
    state.drone1.hasParcel = false;
    state.drone1.status = 'idle';
    state.drone1.x = 50;
    state.drone1.y = 26;

    state.drone2.hasParcel = true;
    state.drone2.status = 'delivering';
    state.drone2.x = 68;
    state.drone2.y = 20;
  }

  if (currentLogIndex >= 10) {
    state.drone2.x = 85;
    state.drone2.y = 18;
  }

  if (currentLogIndex >= 12) {
    state.activeRoute = 'complete';
  }

  if (currentLogIndex >= 11) {
    state.drone3.status = 'offline';
  }

  if (currentLogIndex >= 10) {
    state.parcelHolder = 'destination';
    state.drone2.hasParcel = false;
    state.drone2.status = 'idle';
    state.drone2.x = 85;
    state.drone2.y = 18;
  }

  return state;
}

// â”€â”€â”€ Canvas map (London city, responsive) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type SwarmStatus = 'idle' | 'to-pickup' | 'carrying' | 'returning';

const NAMED_DRONE_DEFS = [
  { label: 'D1', color: '#FF6B00' },
  { label: 'R2', color: '#00C6FF' },
  { label: 'E3', color: '#A8FF78' },
];

const CITY_ZONES = [
  { name: 'CAMDEN',       x1: 0.03, y1: 0.02, x2: 0.34, y2: 0.47 },
  { name: 'RELAY HUB',    x1: 0.37, y1: 0.06, x2: 0.62, y2: 0.46 },
  { name: 'CANARY WHARF', x1: 0.64, y1: 0.02, x2: 0.97, y2: 0.47 },
  { name: 'SHOREDITCH',   x1: 0.03, y1: 0.54, x2: 0.37, y2: 0.97 },
  { name: 'GREENWICH',    x1: 0.59, y1: 0.54, x2: 0.97, y2: 0.97 },
];

function SwarmMapCanvas({ mapState }: { mapState: MapState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);
  const animRef = useRef<number>(0);
  const stateRef = useRef<MapState>(mapState);
  const mapCacheRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { stateRef.current = mapState; }, [mapState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    // â”€â”€ Static city map (offscreen cache) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const buildMapCache = (W: number, H: number) => {
      const off = document.createElement('canvas');
      off.width = Math.round(W * dpr); off.height = Math.round(H * dpr);
      const oc = off.getContext('2d')!;
      oc.scale(dpr, dpr);
      oc.fillStyle = '#0C0E14'; oc.fillRect(0, 0, W, H);

      for (const z of CITY_ZONES) {
        const zx1 = z.x1 * W, zy1 = z.y1 * H, zx2 = z.x2 * W, zy2 = z.y2 * H;
        const zW = zx2 - zx1, zH = zy2 - zy1;
        oc.fillStyle = '#10131c'; oc.fillRect(zx1, zy1, zW, zH);
        const sw = 5;
        const cols = Math.max(2, Math.round(zW / 46));
        const rows = Math.max(2, Math.round(zH / 38));
        const cW = zW / cols, rH = zH / rows;
        for (let ci = 0; ci < cols; ci++) {
          for (let ri = 0; ri < rows; ri++) {
            if (ri === 0) continue;
            const bx = zx1 + ci * cW + sw, by = zy1 + ri * rH + sw;
            const bw = cW - sw * 2, bh = rH - sw * 2;
            if (bw > 4 && bh > 4) {
              const v = (ci * 5 + ri * 11) % 3;
              oc.fillStyle = v === 0 ? '#090b10' : v === 1 ? '#0b0d14' : '#0a0c12';
              oc.fillRect(bx, by, bw, bh);
            }
          }
        }
        oc.strokeStyle = 'rgba(255,107,0,0.14)'; oc.lineWidth = 1;
        oc.strokeRect(zx1, zy1, zW, zH);
        oc.fillStyle = 'rgba(255,107,0,0.42)';
        oc.font = "700 8px 'JetBrains Mono', monospace";
        oc.fillText(z.name, zx1 + 8, zy1 + 13);
      }

      // River Thames
      const ry1 = H * 0.478, ry2 = H * 0.534;
      oc.beginPath();
      oc.moveTo(0, ry1 + 3);
      oc.bezierCurveTo(W * 0.18, ry1 - 8, W * 0.44, ry1 + 10, W * 0.68, ry1 + 2);
      oc.bezierCurveTo(W * 0.82, ry1 - 5, W * 0.93, ry1 + 7, W, ry1 + 3);
      oc.lineTo(W, ry2 + 3);
      oc.bezierCurveTo(W * 0.93, ry2 + 7, W * 0.82, ry2 - 4, W * 0.68, ry2 + 5);
      oc.bezierCurveTo(W * 0.44, ry2 + 11, W * 0.18, ry2 - 5, 0, ry2 + 5);
      oc.closePath();
      oc.fillStyle = 'rgba(8,24,62,0.90)'; oc.fill();
      oc.strokeStyle = 'rgba(20,60,140,0.22)'; oc.lineWidth = 1.5; oc.stroke();
      oc.fillStyle = 'rgba(35,90,200,0.28)';
      oc.font = "600 7px 'JetBrains Mono', monospace";
      oc.textAlign = 'center'; oc.fillText('RIVER THAMES', W * 0.5, H * 0.508); oc.textAlign = 'start';

      // Dot grid
      for (let gx = 16; gx < W; gx += 24)
        for (let gy = 16; gy < H; gy += 24) {
          oc.beginPath(); oc.arc(gx, gy, 0.5, 0, Math.PI * 2);
          oc.fillStyle = 'rgba(255,107,0,0.04)'; oc.fill();
        }
      mapCacheRef.current = off;
    };

    // â”€â”€ Resize sync â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const syncSize = () => {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      if (W < 10 || H < 10) return;
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildMapCache(W, H);
      }
    };
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas); syncSize();

    // â”€â”€ Unified swarm: 15 drones (0=D1, 1=R2, 2=E3, 3-14=ambient) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const rnd = (a: number, b: number) => a + (b - a) * Math.random();
    type SD = {
      id: number; x: number; y: number; tx: number; ty: number;
      speed: number; status: SwarmStatus; angle: number; rot: number; rotSpeed: number;
      battery: number; trail: { x: number; y: number }[];
      orderId: number | null; idleFor: number; idleThresh: number;
      locked: boolean; deliveredCount: number;
    };
    const sdrones: SD[] = [];
    const sorders: {
      id: number; px: number; py: number; dx: number; dy: number;
      status: 'pending' | 'assigned' | 'picked' | 'done'; droneId: number | null;
    }[] = [];
    let nextOId = 0; let totalDelivered = 0;
    const addOrder = () => sorders.push({
      id: nextOId++,
      px: rnd(0.04, 0.50), py: rnd(0.04, 0.46),
      dx: rnd(0.50, 0.96), dy: rnd(0.54, 0.96),
      status: 'pending', droneId: null,
    });

    const namedPos = [{ x: 0.20, y: 0.75 }, { x: 0.80, y: 0.20 }, { x: 0.48, y: 0.28 }];
    for (let i = 0; i < 15; i++) {
      const named = i < 3;
      sdrones.push({
        id: i,
        x: named ? namedPos[i].x : rnd(0.04, 0.96),
        y: named ? namedPos[i].y : rnd(0.05, 0.95),
        tx: rnd(0.04, 0.96), ty: rnd(0.05, 0.95),
        speed: rnd(0.0018, named ? 0.003 : 0.0034),
        status: 'idle', angle: rnd(0, Math.PI * 2),
        rot: rnd(0, Math.PI * 2), rotSpeed: rnd(0.10, 0.24),
        battery: named ? 90 : rnd(35, 98),
        trail: [], orderId: null,
        idleFor: Math.floor(rnd(0, named ? 0 : 80)),
        idleThresh: Math.floor(rnd(20, named ? 0 : 100)),
        locked: named, deliveredCount: 0,
      });
    }
    for (let i = 0; i < 8; i++) addOrder();

    // â”€â”€ Quadcopter silhouette helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const drawDrone = (
      cx: number, cy: number, rot: number, angle: number,
      bodyColor: string, rotorColor: string, sz: number
    ) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle + Math.PI / 4);
      const arm = sz * 1.2;
      for (let ai = 0; ai < 4; ai++) {
        const aa = ai * (Math.PI / 2);
        const ex = Math.cos(aa) * arm, ey = Math.sin(aa) * arm;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey);
        ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.save(); ctx.translate(ex, ey); ctx.rotate(rot * (ai % 2 === 0 ? 1 : -1));
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = rotorColor; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-sz * 0.5, 0); ctx.lineTo(sz * 0.5, 0);
        ctx.moveTo(0, -sz * 0.5); ctx.lineTo(0, sz * 0.5);
        ctx.strokeStyle = rotorColor; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, sz * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = bodyColor; ctx.fill();
      ctx.restore();
    };

    // â”€â”€ Animation loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const draw = () => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const ms = stateRef.current;
      const W = canvas.width / dpr, H = canvas.height / dpr;
      if (W < 10 || H < 10) { animRef.current = requestAnimationFrame(draw); return; }

      if (mapCacheRef.current) { ctx.drawImage(mapCacheRef.current, 0, 0, W, H); }
      else { ctx.fillStyle = '#0C0E14'; ctx.fillRect(0, 0, W, H); }

      const freed = ms.activeRoute === 'complete';
      const toX = (p: number) => p * W, toY = (p: number) => p * H;

      // â”€â”€ State machine tick â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      for (const d of sdrones) {
        d.rot += d.rotSpeed;
        if (d.locked) {
          if (freed) {
            d.locked = false; d.status = 'idle'; d.idleFor = 0;
            d.idleThresh = Math.floor(rnd(10, 40));
          } else {
            const ds = d.id === 0 ? ms.drone1 : d.id === 1 ? ms.drone2 : ms.drone3;
            const txTarget = ds.x / 100, tyTarget = ds.y / 100;
            const prevX = d.x, prevY = d.y;
            d.x += (txTarget - d.x) * 0.03;
            d.y += (tyTarget - d.y) * 0.03;
            d.rot += d.rotSpeed;
            const mx = txTarget - d.x, my = tyTarget - d.y;
            const moving = Math.abs(mx) + Math.abs(my) > 0.002;
            if (moving) {
              d.angle = Math.atan2(my, mx);
              d.trail.push({ x: prevX, y: prevY });
              if (d.trail.length > 30) d.trail.shift();
            } else {
              d.trail = [];
            }
            continue;
          }
        }
        d.idleFor++;
        if (d.status === 'idle' && d.idleFor > d.idleThresh) {
          const ord = sorders.find(o => o.status === 'pending');
          if (ord) {
            ord.status = 'assigned'; ord.droneId = d.id;
            d.status = 'to-pickup'; d.orderId = ord.id;
            d.tx = ord.px; d.ty = ord.py;
          } else {
            d.tx = rnd(0.04, 0.96); d.ty = rnd(0.05, 0.95);
            d.idleFor = 0; d.idleThresh = Math.floor(rnd(25, 90));
          }
        }
        const ddx = d.tx - d.x, ddy = d.ty - d.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist > 0.007) {
          d.angle = Math.atan2(ddy, ddx);
          d.x += (ddx / dist) * d.speed; d.y += (ddy / dist) * d.speed;
          if (d.status !== 'idle') {
            d.trail.push({ x: d.x, y: d.y });
            if (d.trail.length > 22) d.trail.shift();
          }
        } else {
          d.trail = [];
          if (d.status === 'to-pickup') {
            const ord = sorders.find(o => o.id === d.orderId);
            if (ord) { ord.status = 'picked'; d.status = 'carrying'; d.tx = ord.dx; d.ty = ord.dy; }
          } else if (d.status === 'carrying') {
            const ord = sorders.find(o => o.id === d.orderId);
            if (ord) ord.status = 'done';
            d.status = 'returning'; d.orderId = null;
            d.deliveredCount++; totalDelivered++;
            d.tx = rnd(0.03, 0.48); d.ty = rnd(0.04, 0.48);
          } else if (d.status === 'returning') {
            d.status = 'idle'; d.idleFor = 0;
            d.idleThresh = Math.floor(rnd(15, 70));
            d.battery = Math.min(100, d.battery + rnd(12, 28));
          } else {
            d.idleFor = 0; d.idleThresh = Math.floor(rnd(20, 80));
            d.tx = rnd(0.04, 0.96); d.ty = rnd(0.05, 0.95);
          }
        }
        d.battery = Math.max(18, d.battery - 0.004);
      }
      for (let oi = sorders.length - 1; oi >= 0; oi--)
        if (sorders[oi].status === 'done') sorders.splice(oi, 1);
      if (sorders.filter(o => o.status === 'pending').length < 5 && tick % 60 === 0) addOrder();

      // â”€â”€ Order markers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      for (const o of sorders) {
        const px = o.px * W, py = o.py * H, dx = o.dx * W, dy = o.dy * H;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = o.status === 'pending' ? '#FF6B00' : 'rgba(255,107,0,0.22)'; ctx.fill();
        ctx.beginPath(); ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(dx, dy);
        ctx.strokeStyle = 'rgba(255,107,0,0.05)'; ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 4]); ctx.stroke(); ctx.setLineDash([]);
      }

      // â”€â”€ Peer-mesh connections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      for (let si = 0; si < sdrones.length; si++)
        for (let sj = si + 1; sj < sdrones.length; sj++) {
          const sa = sdrones[si], sb = sdrones[sj];
          const cdx = (sa.x - sb.x) * W, cdy = (sa.y - sb.y) * H;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 110) {
            ctx.beginPath(); ctx.moveTo(sa.x * W, sa.y * H); ctx.lineTo(sb.x * W, sb.y * H);
            ctx.strokeStyle = `rgba(255,107,0,${(1 - cdist / 110) * 0.055})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }

      // â”€â”€ Trails â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      for (const d of sdrones) {
        if (d.trail.length < 2) continue;
        ctx.beginPath(); ctx.moveTo(d.trail[0].x * W, d.trail[0].y * H);
        for (let ti = 1; ti < d.trail.length; ti++) ctx.lineTo(d.trail[ti].x * W, d.trail[ti].y * H);
        ctx.strokeStyle = d.id === 0 ? 'rgba(255,107,0,0.22)'
          : d.id === 1 ? 'rgba(0,198,255,0.22)'
          : d.id === 2 ? 'rgba(168,255,120,0.22)'
          : 'rgba(255,255,255,0.07)';
        ctx.lineWidth = d.id < 3 ? 1.2 : 0.7; ctx.stroke();
      }

      // â”€â”€ Route overlay (only during active LOGS sequence) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (!freed) {
        const depotP = { x: toX(0.20), y: toY(0.75) };
        const handoffP = { x: toX(0.50), y: toY(0.26) };
        const destP = { x: toX(0.85), y: toY(0.18) };

        ctx.beginPath(); ctx.moveTo(depotP.x, depotP.y); ctx.lineTo(destP.x, destP.y);
        ctx.strokeStyle = 'rgba(255,107,0,0.04)'; ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 5]); ctx.stroke(); ctx.setLineDash([]);

        if (ms.activeRoute === 'depot-to-handoff') {
          ctx.beginPath(); ctx.moveTo(depotP.x, depotP.y); ctx.lineTo(handoffP.x, handoffP.y);
          ctx.strokeStyle = 'rgba(255,107,0,0.55)'; ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (ms.activeRoute === 'handoff-to-destination') {
          ctx.beginPath(); ctx.moveTo(handoffP.x, handoffP.y); ctx.lineTo(destP.x, destP.y);
          ctx.strokeStyle = 'rgba(0,198,255,0.55)'; ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (ms.auctionOpen) {
          const p = 0.3 + 0.2 * Math.sin(tick * 0.15);
          const p2 = 0.3 + 0.2 * Math.sin(tick * 0.15 + Math.PI);
          ctx.beginPath(); ctx.arc(depotP.x, depotP.y, 24, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,107,0,${p * 0.08})`; ctx.fill();
          ctx.strokeStyle = `rgba(255,107,0,${p * 0.7})`; ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
          ctx.beginPath(); ctx.arc(depotP.x, depotP.y, 40, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,107,0,${p2 * 0.25})`; ctx.lineWidth = 1;
          ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);
        }
        if (ms.drone1.status === 'handoff' || ms.drone2.status === 'handoff') {
          const p = 0.5 + 0.5 * Math.sin(tick * 0.12);
          ctx.beginPath(); ctx.arc(handoffP.x, handoffP.y, 14, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,107,0,${0.5 + p * 0.4})`; ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = '#FF6B00'; ctx.font = "700 8px 'JetBrains Mono',monospace";
          ctx.textAlign = 'center'; ctx.fillText('HANDOFF', handoffP.x, handoffP.y - 18); ctx.textAlign = 'start';
        }
        ctx.beginPath(); ctx.arc(depotP.x, depotP.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = ms.parcelHolder === 'depot' ? '#FF6B00' : 'rgba(255,107,0,0.35)'; ctx.fill();
        ctx.fillStyle = 'rgba(255,107,0,0.8)'; ctx.font = "700 9px 'JetBrains Mono',monospace";
        ctx.textAlign = 'center'; ctx.fillText('DEPOT', depotP.x, depotP.y - 16); ctx.textAlign = 'start';

        ctx.beginPath(); ctx.arc(destP.x, destP.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = ms.parcelHolder === 'destination' ? '#FF6B00' : 'rgba(255,255,255,0.08)'; ctx.fill();
        ctx.strokeStyle = ms.parcelHolder === 'destination' ? '#FF6B00' : 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = "700 9px 'JetBrains Mono',monospace";
        ctx.textAlign = 'center'; ctx.fillText('DROP-OFF', destP.x, destP.y - 16); ctx.textAlign = 'start';
      }

      // â”€â”€ Draw all 15 drones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      for (const d of sdrones) {
        const cx = d.x * W, cy = d.y * H;
        const isNamed = d.id < 3;
        const def = isNamed ? NAMED_DRONE_DEFS[d.id] : null;
        const carrying = d.status === 'carrying';
        const sz = isNamed ? 5.5 : 3.8;
        const bodyColor = isNamed ? def!.color
          : (carrying ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.42)');
        const rotorColor = isNamed
          ? (carrying ? def!.color : def!.color + '99')
          : (carrying ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.26)');

        if (carrying) {
          ctx.beginPath(); ctx.arc(cx, cy, isNamed ? 18 : 12, 0, Math.PI * 2);
          ctx.fillStyle = isNamed ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.03)'; ctx.fill();
          ctx.beginPath(); ctx.arc(cx, cy, isNamed ? 10 : 7, 0, Math.PI * 2);
          ctx.strokeStyle = isNamed ? '#FF6B00' : 'rgba(255,255,255,0.30)'; ctx.lineWidth = 1; ctx.stroke();
        }
        if (isNamed && (d.status === 'to-pickup' || d.status === 'carrying')) {
          const p = 0.5 + 0.5 * Math.sin(tick * 0.10 + d.id);
          ctx.beginPath(); ctx.arc(cx, cy, 17, 0, Math.PI * 2);
          ctx.strokeStyle = def!.color + Math.round(p * 80).toString(16).padStart(2, '0');
          ctx.lineWidth = 1; ctx.stroke();
        }

        drawDrone(cx, cy, d.rot, d.angle, bodyColor, rotorColor, sz);

        if (carrying) {
          ctx.beginPath(); ctx.arc(cx + sz * 1.4, cy - sz * 1.4, sz * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = isNamed ? def!.color : '#FF6B00'; ctx.fill();
          ctx.strokeStyle = '#0B0C0E'; ctx.lineWidth = 0.8; ctx.stroke();
        }

        const bw = isNamed ? 18 : 12, bh = 1.8;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(cx - bw / 2, cy + sz * 2.2, bw, bh);
        ctx.fillStyle = d.battery > 30 ? (isNamed ? def!.color : 'rgba(255,255,255,0.40)') : '#FF4D4D';
        ctx.fillRect(cx - bw / 2, cy + sz * 2.2, bw * (d.battery / 100), bh);

        if (isNamed) {
          ctx.fillStyle = def!.color; ctx.font = "700 8px 'JetBrains Mono',monospace";
          ctx.textAlign = 'center'; ctx.fillText(def!.label, cx, cy - sz * 2.4); ctx.textAlign = 'start';
        }
      }

      // â”€â”€ HUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const hudW = Math.min(165, W * 0.32), hudH = 92;
      const hudX = 10, hudY = 10;
      ctx.fillStyle = 'rgba(11,12,14,0.90)'; ctx.strokeStyle = 'rgba(255,107,0,0.18)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(hudX, hudY, hudW, hudH); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FF6B00'; ctx.font = "700 9px 'JetBrains Mono',monospace";
      ctx.fillText(freed ? 'SWARM ACTIVE' : ms.phaseLabel.toUpperCase(), hudX + 10, hudY + 18);
      ctx.font = "500 8px 'JetBrains Mono',monospace";
      if (freed) {
        ctx.fillStyle = 'rgba(245,246,248,0.38)';
        ctx.fillText(`drones        15`, hudX + 10, hudY + 34);
        ctx.fillText(`orders active  ${sorders.length}`, hudX + 10, hudY + 48);
        ctx.fillText(`in-flight  ${sdrones.filter(d => d.status === 'carrying').length}`, hudX + 10, hudY + 62);
        ctx.fillStyle = '#FF6B00';
        ctx.fillText(`delivered  ${totalDelivered}`, hudX + 10, hudY + 78);
      } else {
        ctx.fillStyle = 'rgba(245,246,248,0.38)';
        ctx.fillText(`winner  ${ms.winner}`, hudX + 10, hudY + 34);
        ctx.fillStyle = '#FF6B00'; ctx.fillText(`D1  ${ms.batteries.drone1}%`, hudX + 10, hudY + 50);
        ctx.fillStyle = '#00C6FF'; ctx.fillText(`R2  ${ms.batteries.drone2}%`, hudX + 10, hudY + 64);
        ctx.fillStyle = '#A8FF78'; ctx.fillText(`E3  ${ms.batteries.drone3}%`, hudX + 10, hudY + 78);
      }

      // â”€â”€ Legend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const lgItems = freed
        ? [{ c: '#FF6B00', l: 'D1 DRONE' }, { c: '#00C6FF', l: 'R2 ROBOT' }, { c: '#A8FF78', l: 'E3 EBIKE' }, { c: 'rgba(255,255,255,0.42)', l: 'SWARM' }, { c: '#FF6B00', l: 'ORDER' }]
        : [{ c: '#FF6B00', l: 'DRONE-1' }, { c: '#00C6FF', l: 'ROBOT-2' }, { c: '#A8FF78', l: 'EBIKE-3' }, { c: '#FF6B00', l: 'ORDER' }];
      const lgW = 92, lgH = lgItems.length * 14 + 22;
      const lgX = W - lgW - 8, lgY = H - lgH - 8;
      ctx.fillStyle = 'rgba(11,12,14,0.94)'; ctx.strokeStyle = 'rgba(255,107,0,0.14)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(lgX, lgY, lgW, lgH); ctx.fill(); ctx.stroke();
      ctx.font = "700 8px 'JetBrains Mono',monospace"; ctx.fillStyle = '#FF6B00';
      ctx.fillText('LEGEND', lgX + 10, lgY + 14);
      let lly = lgY + 28;
      for (const it of lgItems) {
        ctx.fillStyle = it.c; ctx.beginPath(); ctx.arc(lgX + 16, lly - 3, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(245,246,248,0.48)'; ctx.font = "500 8px 'JetBrains Mono',monospace";
        ctx.fillText(it.l, lgX + 26, lly); lly += 14;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
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
            <div className="terminal-title">nexus-fly-core â€” zsh â€” 80x24</div>
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

        {/* MAP CANVAS */}
        <div className="simulation-map">
          <SwarmMapCanvas mapState={mapState} />
        </div>
      </div>
    </section>
  );
}
