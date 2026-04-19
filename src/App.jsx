import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail
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

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const EMOJIS = ['🌸', '✨', '💖', '🌟', '💫', '🎀', '🌺', '⭐'];
    const layers = [
      { speed: 0.2, size: [10, 16], count: 12, alpha: 0.3 },
      { speed: 0.5, size: [16, 22], count: 8,  alpha: 0.5 },
      { speed: 0.8, size: [22, 30], count: 5,  alpha: 0.7 },
    ];

    let particles = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
          speedX: (Math.random() - 0.5) * layer.speed * 0.4,
          speedY: -layer.speed * 0.8,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          opacity: layer.alpha,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        if (p.y < -50) { p.y = canvas.height + 50; p.x = Math.random() * canvas.width; }
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        
        ctx.globalAlpha = alpha;
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} id="particle-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────
   FLOATING BALLOONS
 ───────────────────────────────────────────── */
function Balloons() {
  const colors = ['#ff4d6d', '#ff006e', '#ffb3c1', '#ffd700', '#9b5de5', '#c77dff'];
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 90 + 5;
      const sizeSize = Math.random() * 20 + 35;
      const duration = Math.random() * 5 + 10;
      setBalloons(prev => [...prev, { id, color, left, sizeSize, duration }]);
      setTimeout(() => setBalloons(prev => prev.filter(b => b.id !== id)), duration * 1000);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {balloons.map(b => (
        <motion.div key={b.id} className="balloon" onClick={() => confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 }, colors: ['#ff4d6d'] })}
          style={{ left: `${b.left}%`, backgroundColor: b.color, width: b.sizeSize, height: b.sizeSize * 1.3, animationDuration: `${b.duration}s`, pointerEvents: 'auto' }}
          whileHover={{ scale: 1.2, rotate: 5 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUNTDOWN TIMER
 ───────────────────────────────────────────── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('April 28, 2026 00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-grid">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="countdown-box">
          <span>{value}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FIREWORKS UTILITY
 ───────────────────────────────────────────── */
const fireFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

/* ─────────────────────────────────────────────
   AUDIO CONTROLLER
 ───────────────────────────────────────────── */
function AudioController({ audioSrc, setAudioSrc }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioSrc && isPlaying) audioRef.current.play().catch(e => console.log(e));
    else if (audioRef.current) audioRef.current.pause();
  }, [isPlaying, audioSrc]);

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSrc} loop />
      <button className={`music-btn ${isPlaying ? 'playing' : ''}`} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      <label className="music-btn" style={{ cursor: 'pointer' }}>
        <input type="file" accept="audio/*" onChange={e => {
          const reader = new FileReader();
          reader.onloadend = () => { setAudioSrc(reader.result); setIsPlaying(true); };
          reader.readAsDataURL(e.target.files[0]);
        }} style={{ display: 'none' }} />
        <Music size={20} />
      </label>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [showContent, setShowContent] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_mega_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy, beautiful smiles, and unforgettable memories.",
      secretLetter: "To the most special person in my life,\n\nI want to tell you that you are truly amazing. Your smile lights up my world, and your kindness inspires me every single day. I hope this birthday is just as beautiful as you are.\n\nAlways here for you, always loving you. ❤️",
      images: [],
      audio: null,
      wishes: [ "May every day bring fresh smiles!", "May your year be as beautiful as your heart.", "Keep shining brighter than any star.", "You are truly one in a million!" ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_mega_data', JSON.stringify(data)); }, [data]);
  const [currentPic, setCurrentPic] = useState(0);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <Balloons />
      <AudioController audioSrc={data.audio} setAudioSrc={src => setData({...data, audio: src})} />
      
      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }} transition={{ duration: 1.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }}
              style={{ position: 'absolute', width: '80vw', maxWidth: '500px', aspectRatio: '1/1', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,77,109,0.25) 0%, transparent 70%)', pointerEvents: 'none', zIndex: -1 }} />
            <Cake size={110} className="floating-b" color="#ff4d6d" style={{ filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.9))' }} />
            <h1 style={{ fontSize: 'clamp(2.5rem, 12vw, 6.5rem)', margin: '1rem 0' }}><span className="rainbow-text">{data.title}</span></h1>
            <motion.button className="btn-primary" onClick={() => { confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); setShowContent(true); }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}> <Gift size={28} style={{ marginRight: 15 }} /> Open Your Surprise 🎁 </motion.button>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* HERO HERO SECTION */}
            <motion.div className="glass-card" style={{ padding: 'clamp(2rem, 6vw, 4rem) 1.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <Heart size={85} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ filter: 'drop-shadow(0 0 25px rgba(255,77,109,0.7))', marginBottom: '1.8rem' }} />
              <h1 style={{ fontSize: 'clamp(2rem, 9vw, 4.2rem)', marginBottom: '1.2rem', fontFamily: 'Playfair Display' }} className="rainbow-text">{data.title}</h1>
              <p style={{ fontSize: 'clamp(1rem, 3.8vw, 1.45rem)', lineHeight: 1.8, color: '#4a4e69', maxWidth: '750px', margin: '0 auto' }}>{data.message}</p>
              
              <div style={{ marginTop: '2.5rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Clock size={20} /> Countdown to April 28th</h4>
                <CountdownTimer />
              </div>
            </motion.div>

            {/* PHOTO SECTION */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '2rem' }} className="shimmer-text">Beautiful Memories 📸</h3>
              {data.images.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="photo-frame" style={{ maxWidth: '420px', margin: '0 auto', aspectRatio: '3/4', position: 'relative' }}>
                    <div className="ribbon">{data.images[currentPic].label}</div>
                    <AnimatePresence mode="wait"><motion.img key={currentPic} src={data.images[currentPic].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} /></AnimatePresence>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '2.5rem 1.2rem 1rem', color: 'white' }}>
                      <p style={{ fontFamily: 'Dancing Script', fontSize: '1.6rem' }}>{data.images[currentPic].caption}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1.5rem' }}>
                    <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => setCurrentPic(c => (c > 0 ? c - 1 : data.images.length - 1))}>Prev</button>
                    <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={() => setCurrentPic(c => (c < data.images.length - 1 ? c + 1 : 0))}>Next</button>
                  </div>
                </div>
              ) : <p style={{ textAlign: 'center', color: '#888' }}>No photos yet. Scroll down to personalize!</p>}
            </div>

            {/* SECRET LETTER */}
            <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Mail size={24} /> A Secret For You</h3>
              <div className="secret-letter">
                {data.secretLetter.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                <div style={{ textAlign: 'center' }}>
                  <button className="btn-secret" onClick={fireFireworks}>Launch Fireworks! 🎆</button>
                </div>
              </div>
            </motion.div>

            {/* EDITOR SECTION */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Edit3 size={24} /> Personalize The Page</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div><label style={{ fontWeight: 600 }}>Greeting Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label style={{ fontWeight: 600 }}>Birthday Message</label><textarea className="input-field" style={{ minHeight: '80px' }} value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div><label style={{ fontWeight: 600 }}>Secret Letter Content</label><textarea className="input-field" style={{ minHeight: '120px' }} value={data.secretLetter} onChange={e => setData({...data, secretLetter: e.target.value})} /></div>
                <div><label style={{ fontWeight: 600 }}>Update Gallery</label><label className="upload-area" style={{ marginTop: '8px' }}>
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => { const reader = new FileReader(); reader.onloadend = () => setData(prev => ({...prev, images: [...prev.images, { src: reader.result, caption: 'Memory ✨', label: 'Best Girl 🌸' }] })); reader.readAsDataURL(file); });
                  }} /><Upload size={24} color="var(--primary)" /> <p style={{ margin: 0 }}>Select New Photos</p></label></div>
                <div className="image-preview-grid">{data.images.map((img, i) => (<div key={i} className="preview-item"><img src={img.src} alt="" /><button className="remove-btn" onClick={() => setData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))}><Trash2 size={12} /></button></div>))}</div>
              </div>
            </div>

            {/* WISHES */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Birthday Notes ✍️</h3>
              {data.wishes.map((w, i) => <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '15px', marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>{w}</div>)}
            </div>

            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <PartyPopper size={60} color="var(--primary)" className="floating" />
              <h2 style={{ fontSize: '2.5rem', marginTop: '1.5rem' }} className="shimmer-text">Celebrate Your Day! 🎊</h2>
              <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })}>More Confetti! 🎉</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
