import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload
} from 'lucide-react';
import './index.css';

/* ─────────────────────────────────────────────
   FLOATING PARTICLE BACKGROUND (3D Parallax)
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
          speedX: (Math.random() - 0.5) * layer.speed * 0.5,
          speedY: -layer.speed,
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
   MAGIC TILT CARD WRAPPER
 ───────────────────────────────────────────── */
function TiltCard({ children, className, style }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: -rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ perspective: 1000, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED NUMBER COUNTER
 ───────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easeOutQuad * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [target, isInView]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   CONFETTI BURST
 ───────────────────────────────────────────── */
function fireConfetti() {
  const colors = ['#ff4d6d', '#ff006e', '#ffb3c1', '#ffd700', '#c77dff', '#9b5de5', '#ffffff'];
  const end = Date.now() + 3000;

  const burst = () => {
    confetti({ particleCount: 15, angle: 60, spread: 70, origin: { x: 0 }, colors });
    confetti({ particleCount: 15, angle: 120, spread: 70, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(burst);
  };
  burst();
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
      transition={{ duration: 1 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', textAlign: 'center', padding: '2rem',
        position: 'relative', zIndex: 2,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute', width: 'clamp(280px, 60vw, 450px)', height: 'clamp(280px, 60vw, 450px)', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,77,109,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Cake size={100} className="floating-b" color="#ff4d6d" 
              style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }} />
      </motion.div>

      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.8 }}
        style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', margin: '1rem 0' }}
      >
        <span className="rainbow-text">Happy Birthday!</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ fontSize: '1.2rem', color: '#4a4e69', marginBottom: '3rem', maxWidth: '80%' }}
      >
        A special digital gift for a very special person 🌸
      </motion.p>

      <motion.button
        className="btn-primary"
        onClick={() => { fireConfetti(); onReveal(); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ fontSize: '1.2rem', padding: '20px 60px' }}
      >
        <Gift size={26} style={{ marginRight: 12 }} />
        Open Your Surprise 🎁
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SETTINGS / IMAGE MANAGER
 ───────────────────────────────────────────── */
function SettingsModal({ isOpen, onClose, images, setImages }) {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [
          ...prev, 
          { src: reader.result, caption: 'New Memory ✨', label: 'Birthday Gal 🌸' }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
      />
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontFamily: 'Playfair Display' }}>Settings & Photos</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="#666" />
          </button>
        </div>

        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Upload photos of the birthday person here. They will appear in the gallery.
        </p>

        <label className="upload-area">
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          <Upload size={32} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <p style={{ fontWeight: 600 }}>Tap to Add Photos</p>
          <small>(Files stay on your device)</small>
        </label>

        <div className="image-preview-grid">
          {images.map((img, i) => (
            <div key={i} className="preview-item">
              <img src={img.src} alt="" />
              <button className="remove-btn" onClick={() => removeImage(i)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
            <Camera size={24} color="#ccc" style={{ marginBottom: '8px' }} />
            <p style={{ color: '#888' }}>No photos added yet.</p>
          </div>
        )}

        <button className="btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '2rem' }}>
          Save & Close
        </button>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
 ───────────────────────────────────────────── */
function App() {
  const [showContent, setShowContent] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('birthday_images');
    // If photos not showing, we fall back to empty or saved
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPic, setCurrentPic] = useState(0);

  useEffect(() => {
    localStorage.setItem('birthday_images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentPic(p => (p + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

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
            style={{ padding: 'clamp(1rem, 5vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}
          >
            {/* HERO SECTION */}
            <TiltCard className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim"
                       style={{ filter: 'drop-shadow(0 0 20px rgba(255,77,109,0.6))', marginBottom: '1.5rem' }} />
              </motion.div>
              <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', marginBottom: '1rem', fontFamily: 'Playfair Display' }} className="rainbow-text">
                Wishing You The Best!
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 3.5vw, 1.4rem)', lineHeight: 1.8, color: '#4a4e69', maxWidth: '700px', margin: '0 auto' }}>
                May your <strong>28th April</strong> be filled with immense joy, beautiful smiles, and unforgettable memories. 
                You deserve all the happiness in the world today and always. 🌸
              </p>
            </TiltCard>

            {/* STATS SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { val: 365, sub: ' Days', lbl: 'of Awesomeness' },
                { val: 100, sub: '%', lbl: 'Pure Brilliance' },
                { val: 1, sub: 'M+', lbl: 'Hearts Won' }
              ].map((s, i) => (
                <motion.div 
                  key={i} 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card" 
                  style={{ padding: '1.5rem', textAlign: 'center' }}
                >
                  <h4 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800 }}>
                    <AnimatedCounter target={s.val} suffix={s.sub} />
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>{s.lbl}</p>
                </motion.div>
              ))}
            </div>

            {/* PHOTO GALLERY */}
            <motion.div 
              className="glass-card" 
              style={{ padding: '2rem', marginBottom: '2.5rem' }}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '2rem' }}>
                <Camera size={30} color="var(--primary)" />
                <h3 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display' }} className="shimmer-text">Beautiful Memories</h3>
              </div>

              {images.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="photo-frame" style={{ maxWidth: '400px', margin: '0 auto', aspectRatio: '3/4', position: 'relative' }}>
                    <div className="ribbon">{images[currentPic].label}</div>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPic}
                        src={images[currentPic].src}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </AnimatePresence>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '2.5rem 1rem 1.2rem', color: 'white'
                    }}>
                      <p style={{ fontFamily: 'Dancing Script', fontSize: '1.6rem' }}>{images[currentPic].caption}</p>
                    </div>
                  </div>
                  
                  <div className="dot-slider" style={{ justifyContent: 'center' }}>
                    {images.map((_, i) => (
                      <div 
                        key={i} 
                        onClick={() => setCurrentPic(i)}
                        className={`dot ${currentPic === i ? 'active' : ''}`}
                        style={{ width: currentPic === i ? 28 : 12, height: 12, cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed #ffb3c1', borderRadius: '32px', background: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <Sparkles size={48} color="#ffb3c1" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>No memories here yet!</h4>
                  <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
                    Tap the <strong>Settings</strong> icon or the button below to add your first photo! 📸
                  </p>
                  <button className="btn-primary" onClick={() => setIsSettingsOpen(true)}>
                    <Plus size={20} style={{ marginRight: 8 }} />
                    Set Photos Now
                  </button>
                </div>
              )}
            </motion.div>

            {/* WISHES LIST */}
            <motion.div 
              className="glass-card" 
              style={{ padding: '2.5rem' }}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2rem', fontFamily: 'Playfair Display' }}>
                <Sparkles size={24} style={{ display: 'inline', marginRight: 10 }} />
                Birthday Wishes
                <Sparkles size={24} style={{ display: 'inline', marginLeft: 10 }} />
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '🌸', text: "May every day bring you fresh reasons to smile and be happy." },
                  { icon: '💫', text: "May your dreams be as big as your beautiful, kind heart." },
                  { icon: '✨', text: "May success and laughter follow you wherever you go." },
                  { icon: '🌟', text: "Keep shining, keep smiling, and have the best year ever!" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.6)' }}
                    style={{ 
                      padding: '20px', 
                      background: 'rgba(255,255,255,0.4)', 
                      borderRadius: '20px', 
                      display: 'flex', 
                      gap: '15px',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <p style={{ color: '#4a4e69', fontSize: '1.05rem', fontWeight: 500 }}>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FINAL FOOTER */}
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <PartyPopper size={70} color="var(--primary)" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginTop: '1.5rem', fontFamily: 'Playfair Display' }} className="shimmer-text">
                Enjoy Your Special Day!
              </h2>
              <p style={{ color: '#666', marginTop: '10px' }}>Made with Love & Sparkles 💖</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '2.5rem' }}
                onClick={fireConfetti}
              >
                Launch Celebration! 🎉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS TOGGLE */}
      <motion.div 
        className="settings-panel"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <button className="settings-btn" onClick={() => setIsSettingsOpen(true)} title="Add Photos">
          <Settings size={28} />
        </button>
      </motion.div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            images={images}
            setImages={setImages}
          />
        )}
      </AnimatePresence>

      <style>{`
        .floating-b { animation: floatB 6s ease-in-out infinite; }
        @keyframes floatB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export default App;
