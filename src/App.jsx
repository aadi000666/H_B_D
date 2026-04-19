import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff
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
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        ctx.globalAlpha = alpha; ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
      });
      ctx.globalAlpha = 1; animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} id="particle-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

/* ─────────────────────────────────────────────
   CELEBRATION EFFECTS (Balloons, Hearts)
 ───────────────────────────────────────────── */
function CelebrationEffects({ showHearts }) {
  const [balloons, setBalloons] = useState([]);
  const colors = ['#ff4d6d', '#ff006e', '#ffb3c1', '#ffd700', '#9b5de5', '#c77dff'];

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const color = colors[Math.floor(Math.random() * colors.length)];
      setBalloons(prev => [...prev, { id, color, left: Math.random() * 90 + 5, size: Math.random() * 20 + 35, duration: Math.random() * 5 + 10 }]);
      setTimeout(() => setBalloons(prev => prev.filter(b => b.id !== id)), 15000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {balloons.map(b => (
        <motion.div key={b.id} className="balloon" style={{ left: `${b.left}%`, backgroundColor: b.color, width: b.size, height: b.size * 1.3, animationDuration: `${b.duration}s`, pointerEvents: 'auto' }}
          onClick={() => confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 } })} />
      ))}
      {showHearts && Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 2 + 3}s`, animationDelay: `${Math.random() * 5}s` }}>❤️</motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [showContent, setShowContent] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_ultimate_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      images: [], audio: null,
      timeline: [ { year: 'The Start', text: 'When our journey began...' }, { year: 'Special Moment', text: 'That magic day we spent together.' } ],
      wishes: [ "May every day bring fresh smiles!", "Keep shining brighter than any star." ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_ultimate_data', JSON.stringify(data)); }, [data]);
  const [currentPic, setCurrentPic] = useState(0);
  const audioRef = useRef(null);

  const handleBlow = () => {
    if (!isBlown) {
      setIsBlown(true);
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <CelebrationEffects showHearts={showHearts} />
      
      {/* BACKGROUND AUDIO */}
      <audio ref={audioRef} src={data.audio} loop />

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className="candle" onClick={handleBlow}>
                {!isBlown && <div className="flame" />}
            </div>
            <Cake size={110} className="floating-b" color="#ff4d6d" style={{ filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.9))', marginTop: '10px' }} />
            <h1 style={{ fontSize: 'clamp(2.5rem, 12vw, 6.5rem)', margin: '1rem 0' }}><span className="rainbow-text">{data.title}</span></h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>{isBlown ? "The candle is out! Time for the surprise!" : "Click the candle to blow it out!"}</p>
            {isBlown && (
                 <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { setShowContent(true); if(audioRef.current) audioRef.current.play().catch(e=>console.log(e)); }}>
                    <Gift size={28} style={{ marginRight: 15 }} /> Open Surprise 🎁
                 </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* HERO SECTION */}
            <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <Heart size={85} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.8rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', lineHeight: 1.8, color: '#4a4e69', maxWidth: '700px', margin: '0 auto' }}>{data.message}</p>
              
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                 <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>{showHearts ? <HeartOff size={20} /> : <Heart size={20} />} {showHearts ? "Stop Hearts" : "Rain Hearts"}</button>
              </div>
            </div>

            {/* TIMELINE SECTION */}
            <div style={{ marginBottom: '4rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem' }} className="shimmer-text">Our Journey Together 🛤️</h3>
              <div className="timeline">
                {data.timeline.map((item, i) => (
                  <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <h4 style={{ color: 'var(--primary)' }}>{item.year}</h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHOTO SECTION */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem' }} className="shimmer-text">Memories Gallery 📸</h3>
              {data.images.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="photo-frame" style={{ maxWidth: '420px', margin: '0 auto', aspectRatio: '3/4', position: 'relative' }}>
                    <AnimatePresence mode="wait"><motion.img key={currentPic} src={data.images[currentPic].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></AnimatePresence>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={() => setCurrentPic(c => (c > 0 ? c - 1 : data.images.length - 1))}>Prev</button>
                    <button className="btn-primary" onClick={() => setCurrentPic(c => (c < data.images.length - 1 ? c + 1 : 0))}>Next</button>
                  </div>
                </div>
              ) : <p style={{ textAlign: 'center' }}>Add your photos in the editor below!</p>}
            </div>

            {/* SECRET LETTER */}
            <div className="secret-letter" style={{ marginBottom: '3rem' }}>
                <h3 style={{ textAlign: 'center' }}>A Letter For You ✉️</h3>
                {data.secretLetter.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
              <h3>🔧 Personalize the Site</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Message</label><textarea className="input-field" value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div><label>Letter</label><textarea className="input-field" style={{ minHeight: '120px' }} value={data.secretLetter} onChange={e => setData({...data, secretLetter: e.target.value})} /></div>
                <div>
                   <label>Timeline Events</label>
                   {data.timeline.map((t, i) => (
                     <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input className="input-field" placeholder="Year/Title" value={t.year} onChange={e => { let n = [...data.timeline]; n[i].year = e.target.value; setData({...data, timeline: n}); }} />
                        <input className="input-field" placeholder="Description" value={t.text} onChange={e => { let n = [...data.timeline]; n[i].text = e.target.value; setData({...data, timeline: n}); }} />
                     </div>
                   ))}
                   <button className="btn-primary" onClick={() => setData({...data, timeline: [...data.timeline, { year: '', text: '' }] })}>Add Event</button>
                </div>
                <div><label>Upload Audio</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Add Images</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result, label: 'Memory', caption: '✨' }] })); r.readAsDataURL(f); }); }} /></div>
                <div className="image-preview-grid">{data.images.map((img, i) => (<div key={i} className="preview-item"><img src={img.src} /><button className="remove-btn" onClick={() => setData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))}>X</button></div>))}</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <PartyPopper size={60} color="var(--primary)" />
              <h2 className="shimmer-text">Celebrate Every Day! 🎉</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
