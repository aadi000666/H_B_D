import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff, Notebook
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
   QUIZ COMPONENT
 ───────────────────────────────────────────── */
function BirthdayQuiz() {
  const questions = [
    { q: "What is her favorite color?", options: ["Pink", "Red", "Blue", "Lavender"], correct: 0 },
    { q: "Where would she most likely go on a vacation?", options: ["Beach", "Mountains", "Big City", "Forest"], correct: 1 },
    { q: "What's her secret superpower?", options: ["Being Kind", "Making Friends", "Reading Minds", "Best Cook"], correct: 0 }
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (idx) => {
    if (idx === questions[current].correct) {
      setScore(score + 1);
      setFeedback("correct");
      confetti({ particleCount: 30, spread: 40 });
    } else {
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback(null);
      if (current < questions.length - 1) setCurrent(current + 1);
      else setShowResult(true);
    }, 1000);
  };

  return (
    <div className="quiz-card">
      {!showResult ? (
        <>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Quiz: How well do you know her?</h4>
          <p style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '1.5rem' }}>{questions[current].q}</p>
          {questions[current].options.map((opt, i) => (
            <button key={i} className={`quiz-option ${feedback && i === questions[current].correct ? 'correct' : feedback && i !== questions[current].correct ? 'wrong' : ''}`} 
                    onClick={() => !feedback && handleAnswer(i)}>
              {opt}
            </button>
          ))}
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>Quiz Finished! 🎉</h3>
          <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Score: {score}/{questions.length}</p>
          <button className="btn-primary" onClick={() => { setCurrent(0); setScore(0); setShowResult(false); }}>Try Again</button>
        </div>
      )}
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
    const saved = localStorage.getItem('birthday_master_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      images: [], audio: null,
      timeline: [ { year: '2023', text: 'The beginning of something beautiful.' } ],
      stickyNotes: [ { text: "You are the best! 💖", color: "#fef08a" }, { text: "Keep shining! ✨", color: "#bbf7d0" } ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_master_data', JSON.stringify(data)); }, [data]);
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
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {showHearts && Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 2 + 3}s`, animationDelay: `${Math.random() * 5}s` }}>💖</motion.div>
        ))}
      </div>
      
      <audio ref={audioRef} src={data.audio} loop />

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className="candle" onClick={handleBlow}><AnimatePresence>{!isBlown && <motion.div exit={{ opacity: 0, scale: 0 }} className="flame" />}</AnimatePresence></div>
            <Cake size={110} className="floating-b" color="#ff4d6d" style={{ filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.9))', marginTop: '10px' }} />
            <h1 className="rainbow-text" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)', margin: '1rem 0' }}>{data.title}</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>{isBlown ? "Wish made! ✨ Click below." : "Blow out the candle to start!"}</p>
            {isBlown && <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { setShowContent(true); if(audioRef.current) audioRef.current.play().catch(e=>console.log(e)); }}><Gift style={{ marginRight: 10 }} /> Open Surprise</motion.button>}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 'clamp(0.8rem, 4vw, 3rem)', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            
            {/* HERO */}
            <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.5rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', color: '#4a4e69', marginBottom: '2rem' }}>{data.message}</p>
              <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>{showHearts ? "Stop Love" : "Rain Love ❤️"}</button>
            </div>

            {/* QUIZ */}
            <BirthdayQuiz />

            {/* STICKY NOTES */}
            <div style={{ marginBottom: '4rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem' }} className="shimmer-text">Memory Wall 📌</h3>
              <div className="memory-wall">
                {data.stickyNotes.map((note, i) => (
                  <motion.div key={i} className="sticky-note" whileHover={{ scale: 1.1 }}>{note.text}</motion.div>
                ))}
                <button className="btn-primary" style={{ height: '50px', alignSelf: 'center' }} onClick={() => { 
                  const text = prompt("Enter a small memory:");
                  if (text) setData({...data, stickyNotes: [...data.stickyNotes, { text, color: '#fef08a' }]});
                }}><Plus /> Add Note</button>
              </div>
            </div>

            {/* GALLERY */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>Memories 📸</h3>
              {data.images.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="photo-frame" style={{ maxWidth: '400px', margin: '0 auto', aspectRatio: '3/4' }}>
                    <AnimatePresence mode="wait"><motion.img key={currentPic} src={data.images[currentPic].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></AnimatePresence>
                    <button className="nav-arrow left" style={{ left: 10, position: 'absolute', top: '50%' }} onClick={() => setCurrentPic(c => (c > 0 ? c - 1 : data.images.length - 1))}><ChevronLeft /></button>
                    <button className="nav-arrow right" style={{ right: 10, position: 'absolute', top: '50%' }} onClick={() => setCurrentPic(c => (c < data.images.length - 1 ? c + 1 : 0))}><ChevronRight /></button>
                  </div>
                </div>
              ) : <p style={{ textAlign: 'center' }}>Add photos below!</p>}
            </div>

            {/* SECRET LETTER */}
            <div className="secret-letter" style={{ marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontFamily: 'Playfair Display' }}>My Secret Note ✉️</h3>
              {data.secretLetter.split('\n').map((l, i) => <p key={i}>{l}</p>)}
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
              <h3>👑 Master Creator Panel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Big Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Short Msg</label><textarea className="input-field" value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div><label>Secret Letter</label><textarea className="input-field" style={{ minHeight: '120px' }} value={data.secretLetter} onChange={e => setData({...data, secretLetter: e.target.value})} /></div>
                <div><label>Music (Upload MP3)</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Gallery (Upload Photos)</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result, label: 'Memory' }] })); r.readAsDataURL(f); }); }} /></div>
                <div className="image-preview-grid">{data.images.map((img, i) => (<div key={i} className="preview-item"><img src={img.src} /><button className="remove-btn" onClick={() => setData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))}>X</button></div>))}</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '5rem 0' }}><PartyPopper size={60} color="var(--primary)" /><h2 className="shimmer-text">Happy Birthday Once Again! 🎊</h2></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
