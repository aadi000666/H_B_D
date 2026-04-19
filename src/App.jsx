import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff, Notebook, Palette, Mic, Play, Pause, Sun, Moon, Lock, Unlock, Waves
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
   3D PHOTO CUBE
 ───────────────────────────────────────────── */
function PhotoCube({ images }) {
  if (images.length < 1) return null;
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  return (
    <div className="cube-container">
      <div className="cube">
        {faces.map((f, i) => (
          <div key={f} className={`cube-face ${f}`}>
            <img src={images[i % images.length].src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [showBottle, setShowBottle] = useState(null);
  const [unlockWord, setUnlockWord] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [theme, setTheme] = useState('default');
  
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_pinnacle_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      secretWord: "SIYA",
      unlockMessage: "You discovered the secret! You are my forever star. ✨❤️",
      images: [], audio: null, voice: null,
      timeline: [ { year: '2024', text: 'Another year of being amazing!' } ],
      stickyNotes: [ { text: "You're a star! 🌟", color: '#fef08a' } ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_pinnacle_data', JSON.stringify(data)); }, [data]);
  const audioRef = useRef(null);
  const quotes = ["Your smile is my sunshine! ☀️", "You make every day feel like a celebration! 🎉", "To the moon and back! 🌙", "Infinite love for you! 💖", "Keep shineing, queen! 👑"];

  return (
    <div className={`app-root ${theme !== 'default' ? `theme-${theme}` : ''}`} style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {showHearts && Array.from({ length: 15 }).map((_, i) => <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s` }}>💖</motion.div>)}
      </div>

      <audio ref={audioRef} src={data.audio} loop />

      {/* MESSAGE IN A BOTTLE */}
      {showContent && (
        <motion.div className="bottle-float" whileHover={{ scale: 1.2 }} onClick={() => setShowBottle(quotes[Math.floor(Math.random()*quotes.length)])}>
           <Waves size={40} color="var(--primary)" />
        </motion.div>
      )}
      <AnimatePresence>
        {showBottle && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bottle-popup" onClick={() => setShowBottle(null)}>
             <p>{showBottle}</p>
             <button className="btn-primary" style={{ marginTop: '1rem', padding: '8px 20px' }}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className={`gift-box-wrapper ${isUnboxed ? 'open' : ''}`} onClick={() => { setIsUnboxed(true); confetti({ particleCount: 150 }); }}>
                 {!isUnboxed ? (
                    <motion.div animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Gift size={120} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 20px rgba(255,77,109,0.5))' }} />
                    </motion.div>
                 ) : (
                    <div style={{ marginTop: '20px' }}>
                         <div className="candle" onClick={() => { setIsBlown(true); confetti({ particleCount: 150 }); }}><AnimatePresence>{!isBlown && <motion.div exit={{ opacity: 0, scale: 0 }} className="flame" />}</AnimatePresence></div>
                         <Cake size={110} className="floating-b" color="#ff4d6d" />
                    </div>
                 )}
            </div>
            <h1 className="rainbow-text" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)', marginTop: '20px' }}>{data.title}</h1>
            {isBlown && <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { setShowContent(true); if(audioRef.current) audioRef.current.play(); }}>Open Gift 🎁</motion.button>}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* TOP BAR */}
            <div className="audio-player">
              <div style={{ display: 'flex', gap: '8px', marginRight: '10px' }}>
                <div className="theme-dot" style={{ background: '#ff4d6d' }} onClick={() => setTheme('default')} />
                <div className="theme-dot" style={{ background: '#c5a059' }} onClick={() => setTheme('gold')} />
                <div className="theme-dot" style={{ background: '#9b5de5' }} onClick={() => setTheme('purple')} />
              </div>
              <button className="music-btn" onClick={() => { if(audioRef.current.paused) audioRef.current.play(); else audioRef.current.pause(); }}><Volume2 /></button>
            </div>

            {/* HERO */}
            <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.5rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', color: '#4a4e69', marginBottom: '2rem' }}>{data.message}</p>
              <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>Rain Love ❤️</button>
            </div>

            {/* 3D CUBE */}
            <PhotoCube images={data.images} />

            {/* SECRET UNLOCK */}
            <div className="unlock-panel">
               <h3 style={{ marginBottom: '1rem' }}><Lock size={24} style={{ marginRight: 8 }} /> Master Secret Surprise</h3>
               <p style={{ marginBottom: '1rem', color: '#666' }}>Type the secret word to unlock an extra message!</p>
               <input className="unlock-input" placeholder="Type word..." value={unlockWord} onChange={e => setUnlockWord(e.target.value)} />
               <button className="btn-primary" style={{ padding: '10px 25px' }} onClick={() => { if(unlockWord.toUpperCase() === data.secretWord.toUpperCase()) { setIsUnlocked(true); confetti({ particleCount: 200, spread: 100 }); } else alert("Wrong word! Ask the sender for the key. 😉"); }}>Check</button>
               <AnimatePresence>
                 {isUnlocked && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="magic-reveal">
                       <Sparkles color="var(--gold)" style={{ marginBottom: 10 }} />
                       <h2 className="shimmer-text">Success! Unlock Code Accepted.</h2>
                       <p style={{ fontSize: '1.5rem', fontFamily: 'Dancing Script', marginTop: '1rem' }}>{data.unlockMessage}</p>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem', marginTop: '4rem' }}>
              <h3>👑 Pinnacle Creation Panel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Big Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Secret Word (for unlock)</label><input className="input-field" value={data.secretWord} onChange={e => setData({...data, secretWord: e.target.value})} /></div>
                <div><label>Unlock Message</label><textarea className="input-field" value={data.unlockMessage} onChange={e => setData({...data, unlockMessage: e.target.value})} /></div>
                <div><label>Upload Audio</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Photos (Need 6 for Cube)</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result }] })); r.readAsDataURL(f); }); }} /></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
