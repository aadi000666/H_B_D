import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, ChevronRight, ChevronLeft
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
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────
   TILT CARD COMPONENT
 ───────────────────────────────────────────── */
function TiltCard({ children, className, style }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({ x: (y - centerY) / 20, y: -(x - centerX) / 20 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      onTouchEnd={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      style={{ perspective: 1000, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NUMBER COUNTER
 ───────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, isInView]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   CONFETTI UTILITY
 ───────────────────────────────────────────── */
function fireConfetti() {
  const colors = ['#ff4d6d', '#ff006e', '#ffb3c1', '#ffd700', '#c77dff', '#9b5de5', '#ffffff'];
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors });
}

/* ─────────────────────────────────────────────
   LANDING SCREEN
 ───────────────────────────────────────────── */
function LandingScreen({ onReveal }) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1.2 }}
      className="landing-container"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', width: '100%', textAlign: 'center', padding: '1.5rem',
        position: 'relative', zIndex: 2, overflow: 'hidden'
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{
          position: 'absolute', width: '80vw', maxWidth: '500px', aspectRatio: '1/1',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,77,109,0.25) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: -1
        }}
      />

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Cake size={110} className="floating-b" color="#ff4d6d" 
              style={{ filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.9))' }} />
      </motion.div>

      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.7 }}
        style={{ fontSize: 'clamp(2.5rem, 12vw, 6.5rem)', margin: '1rem 0' }}
      >
        <span className="rainbow-text">Happy Birthday!</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)', color: '#4a4e69', marginBottom: '3rem', maxWidth: '85%' }}
      >
        Prepare yourself for a very special surprise ✨
      </motion.p>

      <motion.button
        className="btn-primary"
        onClick={() => { fireConfetti(); onReveal(); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', padding: '22px 55px' }}
      >
        <Gift size={28} style={{ marginRight: 15 }} />
        Open Your Surprise 🎁
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PHOTO SECTION (Uploader + Gallery)
 ───────────────────────────────────────────── */
function PhotoManagerSection({ images, setImages }) {
  const [current, setCurrent] = useState(0);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [
          ...prev, 
          { src: reader.result, caption: 'New Memory ✨', label: 'Birthday Gal 🌸' }
        ]);
        if (images.length === 0) setCurrent(0);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (current >= index && current > 0) setCurrent(c => c - 1);
  };

  return (
    <div className="glass-card" style={{ padding: 'clamp(1.2rem, 4vw, 2.5rem)', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
        <Camera size={32} color="var(--primary)" />
        <h3 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }} className="shimmer-text">Personal Gallery</h3>
      </div>

      {images.length > 0 ? (
        <div style={{ textAlign: 'center' }}>
          <div className="photo-frame" style={{ maxWidth: '420px', margin: '0 auto', aspectRatio: '3/4', position: 'relative' }}>
            <div className="ribbon">{images[current].label}</div>
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current].src}
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
              padding: '2.5rem 1.2rem 1.2rem', color: 'white'
            }}>
              <p style={{ fontFamily: 'Dancing Script', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)' }}>{images[current].caption}</p>
            </div>
            
            {/* Nav Arrows */}
            <button className="nav-arrow left" onClick={() => setCurrent(c => (c > 0 ? c - 1 : images.length - 1))}>
               <ChevronLeft size={30} />
            </button>
            <button className="nav-arrow right" onClick={() => setCurrent(c => (c < images.length - 1 ? c + 1 : 0))}>
               <ChevronRight size={30} />
            </button>
          </div>

          <div className="dot-slider" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            {images.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} className={`dot ${current === i ? 'active' : ''}`}
                   style={{ width: current === i ? 30 : 12 }} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '3px dashed #ffb3c1', borderRadius: '32px', background: 'rgba(255,255,255,0.4)' }}>
          <Sparkles size={50} color="#ffb3c1" style={{ marginBottom: '1.5rem' }} />
          <h4 style={{ fontSize: '1.3rem', color: '#666', marginBottom: '1rem' }}>No photos here yet!</h4>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Use the uploader below to add her beautiful photos 📸</p>
        </div>
      )}

      {/* Uploader UI (Always Visible) */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Add Your Photos Here</h4>
        <label className="upload-area" style={{ padding: '2rem 1.5rem' }}>
          <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
            <Upload size={38} color="var(--primary)" />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Tap to Select Photos</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Upload multiple at once!</p>
            </div>
          </div>
        </label>

        {images.length > 0 && (
          <div className="image-preview-grid" style={{ marginTop: '2rem' }}>
            {images.map((img, i) => (
              <motion.div key={i} layout className="preview-item">
                <img src={img.src} alt="" />
                <button className="remove-btn" onClick={() => removeImage(i)}><Trash2 size={12} /></button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [showContent, setShowContent] = useState(false);
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('birthday_images');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('birthday_images', JSON.stringify(images));
  }, [images]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      
      <AnimatePresence mode="wait">
        {!showContent ? (
          <LandingScreen key="landing" onReveal={() => setShowContent(true)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}
          >
            {/* HERO HERO SECTION */}
            <TiltCard className="glass-card" style={{ padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}>
                <Heart size={85} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim"
                       style={{ filter: 'drop-shadow(0 0 25px rgba(255,77,109,0.7))', marginBottom: '1.8rem' }} />
              </motion.div>
              <h1 style={{ fontSize: 'clamp(2rem, 9vw, 4.2rem)', marginBottom: '1.2rem', fontFamily: 'Playfair Display' }} className="rainbow-text">
                Wishing You The Best!
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 3.8vw, 1.45rem)', lineHeight: 1.8, color: '#4a4e69', maxWidth: '750px', margin: '0 auto' }}>
                May your <strong>28th April</strong> be filled with immense joy, beautiful smiles, and unforgettable memories. 
                You deserve all the happiness in the world. 🌸
              </p>
            </TiltCard>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { val: 365, sub: ' Days', lbl: 'of Pure Magic' },
                { val: 100, sub: '%', lbl: 'Iconic Personality' },
                { val: 1, sub: 'M+', lbl: 'Reasons to Smile' }
              ].map((s, i) => (
                <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                             className="glass-card" style={{ padding: '1.8rem 1rem', textAlign: 'center' }}>
                  <h4 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--primary)', fontWeight: 900 }}>
                    <AnimatedCounter target={s.val} suffix={s.sub} />
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.lbl}</p>
                </motion.div>
              ))}
            </div>

            {/* PHOTO SECTION (Visible directly on page) */}
            <PhotoManagerSection images={images} setImages={setImages} />

            {/* WISHES */}
            <motion.div className="glass-card" style={{ padding: '2.5rem clamp(1rem, 4vw, 2.5rem)' }}
                        initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.2rem', fontFamily: 'Playfair Display' }} className="shimmer-text">
                Birthday Notes ✍️
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { icon: '🌸', text: "May every day bring you a fresh reason to smile!" },
                  { icon: '💫', text: "May your year be as beautiful as your wonderful heart." },
                  { icon: '✨', text: "Keep shining brighter than any star in the galaxy." },
                  { icon: '🌟', text: "You are truly one in a million, keep being YOU!" }
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.7)' }}
                               style={{ padding: '22px', background: 'rgba(255,255,255,0.4)', borderRadius: '24px', display: 'flex', gap: '18px', alignItems: 'center', transition: 'all 0.4s' }}>
                    <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                    <p style={{ color: '#4a4e69', fontSize: '1.1rem', fontWeight: 600 }}>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FOOTER */}
            <div style={{ textAlign: 'center', padding: '7rem 0' }}>
              <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                <PartyPopper size={75} color="var(--primary)" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', marginTop: '1.8rem', fontFamily: 'Playfair Display' }} className="shimmer-text">
                Celebrate Your Day! 🎊
              </h2>
              <button className="btn-primary" style={{ marginTop: '3rem', padding: '20px 60px' }} onClick={fireConfetti}>
                Burs More Confetti! 🎉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.3);
          border: none;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition: all 0.3s;
          z-index: 15;
        }
        .nav-arrow:hover { background: var(--primary); }
        .nav-arrow.left { left: 10px; }
        .nav-arrow.right { right: 10px; }
        
        @media (max-width: 600px) {
          .nav-arrow { width: 35px; height: 35px; }
          .nav-arrow svg { width: 20px; height: 20px; }
        }
      `}</style>
    </div>
  );
}

export default App;
