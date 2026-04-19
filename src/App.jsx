import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff, Notebook, Palette, Mic, Play, Pause, Sun, Moon, Lock, Unlock, Waves, Video, Share2, Layers
} from 'lucide-react';
import './index.css';

/* ─────────────────────────────────────────────
   3D PARALLAX PARTICLE BACKGROUND
 ───────────────────────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
   SWIPEABLE CARD DECK
 ───────────────────────────────────────────── */
function SwipeDeck({ cards }) {
  const [deck, setDeck] = useState(cards);
  const swipeAway = (id) => setDeck(prev => prev.filter(c => c.id !== id));

  return (
    <div className="deck-container">
      <AnimatePresence>
        {deck.map((card, i) => (
          <motion.div
            key={card.id}
            className="swipe-card"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => { if (Math.abs(info.point.x) > 100) swipeAway(card.id); }}
            style={{ zIndex: deck.length - i }}
            exit={{ x: 500, opacity: 0, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
             <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{card.title}</h3>
             <p style={{ fontSize: '1.2rem', fontFamily: 'Dancing Script' }}>{card.text}</p>
             <small style={{ marginTop: '1.5rem', color: '#888' }}>Swipe to skip →</small>
          </motion.div>
        )).reverse()}
      </AnimatePresence>
      {deck.length === 0 && <p style={{ textAlign: 'center', marginTop: '150px' }}>You read all the wishes! ✨</p>}
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
  const [mood, setMood] = useState('normal');
  const [theme, setTheme] = useState('default');
  
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_masterpiece_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      images: [], audio: null,
      wishDeck: [
        { id: 1, title: 'Health', text: 'May you always stay strong and full of energy!' },
        { id: 2, title: 'Happiness', text: 'May your smile never fade from your beautiful face.' },
        { id: 3, title: 'Success', text: 'May you achieve every dream you chase, no matter how big.' }
      ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_masterpiece_data', JSON.stringify(data)); }, [data]);
  const audioRef = useRef(null);

  return (
    <div className={`app-root ${theme !== 'default' ? `theme-${theme}` : ''} mood-${mood}`} style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {showHearts && Array.from({ length: 15 }).map((_, i) => <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s` }}>💖</motion.div>)}
      </div>

      <audio ref={audioRef} src={data.audio} loop />

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className={`gift-box-wrapper ${isUnboxed ? 'open' : ''}`} onClick={() => { setIsUnboxed(true); confetti({ particleCount: 150 }); }}>
                 {!isUnboxed ? (
                    <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Gift size={120} color="var(--primary)" />
                    </motion.div>
                 ) : (
                    <div style={{ marginTop: '20px' }}>
                         <div className="candle" onClick={() => { setIsBlown(true); confetti({ particleCount: 150 }); }}><AnimatePresence>{!isBlown && <motion.div exit={{ opacity: 0, scale: 0 }} className="flame" />}</AnimatePresence></div>
                         <Cake size={110} className="floating-b" color="#ff4d6d" />
                    </div>
                 )}
            </div>
            <h1 className="rainbow-text" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)', marginTop: '20px' }}>{data.title}</h1>
            {isBlown && <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { setShowContent(true); if(audioRef.current) audioRef.current.play(); }}>Open Surprise 🎁</motion.button>}
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

            {/* MOOD SELECTOR */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
               {['normal', 'vintage', 'dreamy', 'lofi', 'bw'].map(m => (
                 <button key={m} className={`filter-btn ${mood === m ? 'active' : ''}`} onClick={() => setMood(m)}>{m.toUpperCase()}</button>
               ))}
            </div>

            {/* HERO */}
            <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.5rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', color: '#4a4e69', marginBottom: '2rem' }}>{data.message}</p>
              <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>Rain Love ❤️</button>
            </div>

            {/* SWIPE DECK */}
            <div style={{ marginBottom: '4rem' }}>
               <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '1rem' }} className="shimmer-text">Wishes For You 🃏</h3>
               <SwipeDeck cards={data.wishDeck} />
            </div>

            {/* GALLERY */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem' }}>Gallery 📸</h3>
              {data.images.length > 0 ? (
                <div className="photo-frame" style={{ maxWidth: '400px', margin: '0 auto', aspectRatio: '3/4' }}>
                   <img src={data.images[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : <p style={{ textAlign: 'center' }}>Add your photos in the editor!</p>}
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
              <h3>👑 Masterpiece Panel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Big Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Birthday Message</label><textarea className="input-field" value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div>
                  <label>Wishes Deck (Manager)</label>
                  {data.wishDeck.map((w, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                       <input className="input-field" placeholder="Topic" value={w.title} onChange={e => { let n = [...data.wishDeck]; n[idx].title = e.target.value; setData({...data, wishDeck: n}); }} />
                       <input className="input-field" placeholder="Wish Description" value={w.text} onChange={e => { let n = [...data.wishDeck]; n[idx].text = e.target.value; setData({...data, wishDeck: n}); }} />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ padding: '8px 20px' }} onClick={() => setData({...data, wishDeck: [...data.wishDeck, { id: Date.now(), title: '', text: '' }] })}>Add Card</button>
                </div>
                <div><label>Upload Audio (MP3)</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Gallery Upload</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result }] })); r.readAsDataURL(f); }); }} /></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '5rem 0' }}><PartyPopper size={60} color="var(--primary)" /><h2 className="shimmer-text">Forever Special! 🎉</h2></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
