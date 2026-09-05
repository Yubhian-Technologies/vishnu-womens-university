import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './Launch.css';

type Scene = 'start' | 'ignition' | 'countdown' | 'reveal';

const COUNTDOWN_FROM = 5;
const IGNITION_MS = 1100;
const TICK_MS = 700;
const REVEAL_HOLD_MS = 2600;

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#C9A84C', '#e8c96a', '#ffffff', '#1e3a8a'];
    const particles = Array.from({ length: 140 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.6) * 14,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));

    let raf: number;
    const gravity = 0.35;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const stop = setTimeout(() => cancelAnimationFrame(raf), 4500);
    return () => { cancelAnimationFrame(raf); clearTimeout(stop); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="launch-confetti" aria-hidden="true" />;
}

export default function Launch() {
  const [scene, setScene] = useState<Scene>('start');
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Launch | Vishnu Women's University";
  }, []);

  // ignition -> countdown
  useEffect(() => {
    if (scene !== 'ignition') return;
    const id = setTimeout(() => setScene('countdown'), IGNITION_MS);
    return () => clearTimeout(id);
  }, [scene]);

  // countdown ticks 5 -> 1 -> reveal
  useEffect(() => {
    if (scene !== 'countdown') return;
    if (count <= 1) {
      const id = setTimeout(() => setScene('reveal'), TICK_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCount((c) => c - 1), TICK_MS);
    return () => clearTimeout(id);
  }, [scene, count]);

  // reveal holds, then takes the guest home
  useEffect(() => {
    if (scene !== 'reveal') return;
    const id = setTimeout(() => navigate('/'), REVEAL_HOLD_MS);
    return () => clearTimeout(id);
  }, [scene, navigate]);

  return (
    <main className="launch-page" onClick={() => scene === 'reveal' && navigate('/')}>
      <div className="launch-glow" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {scene === 'start' && (
          <motion.section
            key="start"
            className="launch-scene"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <span className="launch-crest">VWU</span>
            <div className="launch-rule" />
            <h1>Ready to see what&rsquo;s new?</h1>
            <p className="launch-sub">Tap below to open the new Vishnu Women&rsquo;s University.</p>
            <button
              type="button"
              className="launch-btn"
              onClick={(e) => { e.stopPropagation(); setScene('ignition'); }}
            >
              <span className="launch-btn-ring" aria-hidden="true" />
              Launch
            </button>
          </motion.section>
        )}

        {scene === 'ignition' && (
          <motion.section
            key="ignition"
            className="launch-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="launch-crest"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: IGNITION_MS / 1000, ease: 'easeInOut' }}
            >
              VWU
            </motion.span>
            <p className="launch-label launch-label--pulse">Initiating Launch&hellip;</p>
          </motion.section>
        )}

        {scene === 'countdown' && (
          <motion.section
            key="countdown"
            className="launch-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="launch-label">Going live in</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                className="launch-count"
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: TICK_MS / 1000, ease: 'easeOut' }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </motion.section>
        )}

        {scene === 'reveal' && (
          <motion.section
            key="reveal"
            className="launch-scene launch-scene--reveal"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Confetti />
            <h1>We&rsquo;re Live</h1>
            <p className="launch-sub">Welcome to the new Vishnu Women&rsquo;s University.</p>
            <div className="launch-progress" aria-hidden="true">
              <motion.div
                className="launch-progress-fill"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: REVEAL_HOLD_MS / 1000, ease: 'linear' }}
              />
            </div>
            <p className="launch-tap-hint">Taking you home&hellip; tap to skip</p>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
