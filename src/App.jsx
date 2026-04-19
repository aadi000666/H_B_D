import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Heart, Sparkles, Gift, Camera, Star, Music2,
  PartyPopper, Cake, Diamond, FlowerIcon, Settings, X, Plus, Trash2, Upload, 
  ChevronRight, ChevronLeft, Volume2, VolumeX, Edit3, Save, Music, Clock, Mail, Calendar, HeartOff, Notebook, Palette, Mic, Play, Pause
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
   SPARKLE CURSOR TRAIL
 ───────────────────────────────────────────── */
function SparkleTrail() {
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    const handleMove = (e) => {
      const id = Date.now();
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const char = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
      setSparkles(prev => [...prev.slice(-15), { id, x, y, char }]);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('touchmove', handleMove); };
  }, []);

  return sparkles.map(s => (
    <motion.div key={s.id} className="sparkle" initial={{ opacity: 1 }} animate={{ opacity: 0, scale: 2 }} style={{ left: s.x - 10, top: s.y - 10 }}>{s.char}</motion.div>
  ));
}

/* ─────────────────────────────────────────────
   QUIZ COMPONENT
 ───────────────────────────────────────────── */
function BirthdayQuiz() {
  const questions = [
    { q: "What's her favorite color?", options: ["Pink", "Red", "Lavender", "Gold"], correct: 0 },
    { q: "Her favorite food?", options: ["Pizza", "Pasta", "Burgers", "Sushi"], correct: 1 },
    { q: "Secret superpower?", options: ["Kindness", "Patience", "Comedy", "Sleeping"], correct: 2 }
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  
  if (done) return <div className="quiz-card" style={{ textAlign: 'center' }}><h3>Quiz Over! 🎉</h3><p>Score: {score}/3</p><button className="btn-primary" onClick={() => {setIdx(0);setScore(0);setDone(false);}}>Restart</button></div>;

  return (
    <div className="quiz-card">
      <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Fun Quiz: How well do you know her?</h4>
      <p style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '1.5rem' }}>{questions[idx].q}</p>
      {questions[idx].options.map((opt, i) => (
        <button key={i} className="quiz-option" onClick={() => {if(i===questions[idx].correct)setScore(score+1); if(idx < 2) setIdx(idx+1); else setDone(true);}}>{opt}</button>
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
  const [theme, setTheme] = useState('default');
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('birthday_final_data');
    return saved ? JSON.parse(saved) : {
      title: "Happy Birthday!",
      message: "May your 28th April be filled with immense joy and beautiful smiles.",
      secretLetter: "To the most special person...\n\nI hope this birthday is just as beautiful as you are.",
      images: [], audio: null, voice: null,
      timeline: [ { year: '2024', text: 'Another year of brilliance!' } ],
      stickyNotes: [ { text: "You're a star! 🌟", color: '#fef08a' } ]
    };
  });

  useEffect(() => { localStorage.setItem('birthday_final_data', JSON.stringify(data)); }, [data]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioRef = useRef(null);
  const voiceRef = useRef(null);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && audioRef.current) audioRef.current.play().catch(e => console.log(e));
    else if (audioRef.current) audioRef.current.pause();
  };

  const toggleVoice = () => {
    setIsPlayingVoice(!isPlayingVoice);
    if (!isPlayingVoice && voiceRef.current) voiceRef.current.play().catch(e => console.log(e));
    else if (voiceRef.current) voiceRef.current.pause();
  };

  return (
    <div className={`app-root ${theme !== 'default' ? `theme-${theme}` : ''}`} style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <ParticleBackground />
      <SparkleTrail />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {showHearts && Array.from({ length: 10 }).map((_, i) => <motion.div key={i} className="heart-rain" style={{ left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s` }}>💖</motion.div>)}
      </div>

      <audio ref={audioRef} src={data.audio} loop onPlay={()=>setIsPlayingAudio(true)} onPause={()=>setIsPlayingAudio(false)} />
      <audio ref={voiceRef} src={data.voice} onPlay={()=>setIsPlayingVoice(true)} onPause={()=>setIsPlayingVoice(false)} />

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div key="landing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div className="candle" onClick={() => {setIsBlown(true); confetti({ particleCount: 150 });}}><AnimatePresence>{!isBlown && <motion.div exit={{ opacity: 0, scale: 0 }} className="flame" />}</AnimatePresence></div>
            <Cake size={110} className="floating-b" color="#ff4d6d" style={{ marginTop: '10px' }} />
            <h1 className="rainbow-text" style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)' }}>{data.title}</h1>
            {isBlown && <motion.button className="btn-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => {setShowContent(true); if(audioRef.current) audioRef.current.play().catch(e=>console.log(e));}}>Open Gift 🎁</motion.button>}
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
              <button className={`music-btn ${isPlayingAudio ? 'playing' : ''}`} onClick={toggleAudio}>{isPlayingAudio ? <Volume2 size={24} /> : <VolumeX size={24} />}</button>
            </div>

            {/* HERO */}
            <div className="glass-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', marginBottom: '3rem' }}>
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="heartbeat-anim" style={{ marginBottom: '1.5rem' }} />
              <h1 className="rainbow-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>{data.title}</h1>
              <p style={{ fontSize: '1.3rem', color: '#4a4e69', marginBottom: '2rem' }}>{data.message}</p>
              <button className="btn-primary" onClick={() => setShowHearts(!showHearts)}>{showHearts ? "Stop Hearts" : "Rain Hearts ❤️"}</button>
            </div>

            {/* VOICE NOTE */}
            <div className="voice-note-card">
              <h3>A Personal Message 🎙️</h3>
              {data.voice ? (
                <button className="voice-btn" onClick={toggleVoice}>{isPlayingVoice ? <Pause size={30} /> : <Play size={30} />}</button>
              ) : <p style={{ marginTop: '1rem', color: '#666' }}>No voice note uploaded yet.</p>}
            </div>

            {/* QUIZ */}
            <BirthdayQuiz />

            {/* STICKY NOTES */}
            <div style={{ marginBottom: '4rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Memory Wall 📌</h3>
              <div className="memory-wall">
                {data.stickyNotes.map((note, i) => (<motion.div key={i} className="sticky-note" whileHover={{ scale: 1.1 }}>{note.text}</motion.div>))}
                <button className="btn-primary" style={{ height: '50px', alignSelf: 'center' }} onClick={() => { const t = prompt("Memory text:"); if(t) setData({...data, stickyNotes: [...data.stickyNotes, {text: t}]}); }}><Plus /></button>
              </div>
            </div>

            {/* GALLERY */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
              <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }} className="shimmer-text">Gallery 📸</h3>
              {data.images.length > 0 ? (
                <div key="photo" className="photo-frame" style={{ maxWidth: '400px', margin: '0 auto', aspectRatio: '3/4' }}>
                   <img src={data.images[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : <p style={{ textAlign: 'center' }}>Add photos in the editor below!</p>}
            </div>

            {/* EDITOR */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
              <h3>👑 Master Creator Panel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div><label>Title</label><input className="input-field" value={data.title} onChange={e => setData({...data, title: e.target.value})} /></div>
                <div><label>Message</label><textarea className="input-field" value={data.message} onChange={e => setData({...data, message: e.target.value})} /></div>
                <div><label>Secret Letter</label><textarea className="input-field" style={{ minHeight: '100px' }} value={data.secretLetter} onChange={e => setData({...data, secretLetter: e.target.value})} /></div>
                <div><label>Audio (MP3)</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, audio: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Voice (MP3)</label><input type="file" onChange={e => { const r = new FileReader(); r.onload = () => setData({...data, voice: r.result}); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div><label>Photos</label><input type="file" multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = () => setData(prev => ({...prev, images: [...prev.images, { src: r.result }] })); r.readAsDataURL(f); }); }} /></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '5rem 0' }}><PartyPopper size={60} color="var(--primary)" /><h2 className="shimmer-text">Celebrate Every Day! 🎉</h2></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
