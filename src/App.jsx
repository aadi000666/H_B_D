import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff, Notebook, Palette
} from 'lucide-react';
import './index.css';

/* ─────────────────────────────────────────────
   3D PARALLAX PARTICLE BACKGROUND
 ───────────────────────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const EMOJIS = ['🌸', '✨', '💖', '🌟', '💫', '🎀', '🌺', '⭐'];
    const layers = [{ speed: 0.2, size: [10, 16], count: 12, alpha: 0.3 }, { speed: 0.5, size: [16, 22], count: 8, alpha: 0.5 }, { speed: 0.8, size: [22, 30], count: 5, alpha: 0.7 }];
    let particles = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
          size: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
          speedX: (Math.random() - 0.5) * layer.speed * 0.4, speedY: -layer.speed * 0.8,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], opacity: layer.alpha, pulse: Math.random() * Math.PI * 2,
        });
      }
    });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += 0.02;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        if (p.y < -50) { p.y = canvas.height + 50; p.x = Math.random() * canvas.width; }
        if (p.x < -50) p.x = canvas.width + 50; if (p.x > canvas.width + 50) p.x = -50;
        ctx.globalAlpha = alpha; ctx.font = `${p.size}px serif`; ctx.fillText(p.emoji, p.x, p.y);
      });
      ctx.globalAlpha = 1; animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

/* ─────────────────────────────────────────────
   VISUALIZER COMPONENT
 ───────────────────────────────────────────── */
function AudioVisualizer({ isPlaying }) {
  return (
    <div className="visualizer">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} className="bar" animate={{ height: isPlaying ? [4, 18, 6, 20, 8] : 4 }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GIFT RAIN
 ───────────────────────────────────────────── */
function GiftRain({ start }) {
  const [gifts, setGifts] = useState([]);
  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        const id = Date.now();
        setGifts(prev => [...prev, { id, left: Math.random() * 95, icon: ['🎁','🎈','🎀','🎂'][Math.floor(Math.random()*4)] }]);
        setTimeout(() => setGifts(prev => prev.filter(g => g.id !== id)), 4000);
      }, 300);
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, [start]);
  return gifts.map(g => <motion.div key={g.id} className="gift-item" style={{ left: `${g.left}%` }} initial={{ top: -50 }} animate={{ top: '110vh' }} transition={{ duration: 3, ease: 'linear' }}>{g.icon}</motion.div>);
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [showContent, setShowContent] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [giftRain, setGiftRain] = useState(false);
  const [theme, setTheme] = useState('default');
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_elite_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      images: [], audio: null,
      timeline: [ { year: '2024', text: 'Another year of being amazing!' } ],
      stickyNotes: [ { text: "Best wishes! 💖" } ]
    };
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => { localStorage.setItem('birthday_elite_data', JSON.stringify(data)); }, [data]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && audioRef.current) audioRef.current.play().catch(e => console.log(e));
    else if (audioRef.current) audioRef.current.pause();
  };

  return (
    <div className={`app-root ${theme !== 'default' ? `theme-${theme}` : ''}`} style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <GiftRain start={giftRain} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {showHearts && Array.from({ length: 12 }).map((_, i) => <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s` }}>💖</motion.div>)}
      </div>

      <audio ref={audioRef} src={data.audio} loop />

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className="candle" onClick={() => { setIsBlown(true); confetti({ particleCount: 150 }); }}><AnimatePresence>{!isBlown && <motion.div exit={{ opacity: 0, scale: 0 }} className="flame" />}</AnimatePresence></div>
            <Cake size={110} className="floating-b" color="#ff4d6d" style={{ marginTop: '10px' }} />
            <h1 className="rainbow-text" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)' }}>{data.title}</h1>
            {isBlown && <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setShowContent(true)}>Open Surprise 🎁</motion.button>}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* TOP CONTROLS */}
            <div className="audio-player">
              <AudioVisualizer isPlaying={isPlaying} />
              <button className={`music-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>{isPlaying ? <Volume2 /> : <VolumeX />}</button>
              <div className="theme-dot" style={{ background: '#ff4d6d' }} onClick={() => setTheme('default')} />
              <div className="theme-dot" style={{ background: '#c5a059' }} onClick={() => setTheme('gold')} />
              <div className="theme-dot" style={{ background: '#9b5de5' }} onClick={() => setTheme('purple')} />
            </div>

            <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.5rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', color: '#4a4e69', marginBottom: '2rem' }}>{data.message}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>{showHearts ? "Stop Hearts" : "Rain Hearts"}</button>
                <button className="btn-primary" onClick={() => { setGiftRain(true); setTimeout(()=>setGiftRain(false), 5000); }}>Gift Rain! 🎁</button>
              </div>
            </div>

            {/* GALLERY */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem' }}>Memories 📸</h3>
              {data.images.length > 0 ? (
                <div className="photo-frame" style={{ maxWidth: '400px', margin: '0 auto', aspectRatio: '3/4' }}>
                   <img src={data.images[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : <p style={{ textAlign: 'center' }}>Add your photos below!</p>}
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
              <h3>🔧 Customize Your Surpise</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Big Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Personal Message</label><textarea className="input-field" value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div><label>Upload Audio (MP3)</label><input type="file" accept="audio/*" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Upload Photos</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result }] })); r.readAsDataURL(f); }); }} /></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '5rem 0' }}><PartyPopper size={60} color="var(--primary)" /><h2 className="shimmer-text">Ready to celebrate! 🎉</h2></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
