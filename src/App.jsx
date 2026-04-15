import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, Camera, Music } from 'lucide-react';
import './index.css';

function App() {
  const [showContent, setShowContent] = useState(false);
  const [currentPic, setCurrentPic] = useState(0);

  const images = ["/image1.jpg", "/image2.jpg"];

  const handleSurprise = () => {
    setShowContent(true);
    let duration = 3 * 1000;
    let end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPic((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[var(--light)]">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] text-[var(--secondary)]"
        >
          <Heart size={48} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[15%] text-[var(--primary)]"
        >
          <Sparkles size={64} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -40, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[15%] left-[20%] text-[var(--secondary)]"
        >
          <Gift size={56} />
        </motion.div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
        <AnimatePresence mode="wait">
          {!showContent ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}
            >
              <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                Happy Birthday!
              </h1>
              <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: 'var(--dark)', fontWeight: 300 }}>
                A very special day for a very special person. <br/> 28th April
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={handleSurprise}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem', padding: '15px 40px' }}
              >
                <Gift size={24} /> Open Your Surprise
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '3rem' }}
            >
              
              {/* Header Section */}
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
                >
                  <Heart size={64} fill="var(--primary)" color="var(--primary)" style={{ margin: '0 auto', marginBottom: '1.5rem' }} className="floating" />
                </motion.div>
                <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Wishing You the Best!
                </h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#4a4e69' }}>
                  May your 28th of April be filled with immense joy, beautiful smiles, and unforgettable memories. 
                  You deserve all the happiness in the world today and always. Keep shining brightly! 
                </p>
              </div>

              {/* Photo Gallery Section */}
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Camera color="var(--primary)" /> Beautiful Memories
                </h3>
                
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '3/4', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPic}
                      src={images[currentPic]}
                      alt="Birthday Girl"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        width: '12px', height: '12px', borderRadius: '50%', 
                        background: currentPic === idx ? 'var(--primary)' : 'var(--secondary)',
                        transition: 'all 0.3s ease', cursor: 'pointer'
                      }}
                      onClick={() => setCurrentPic(idx)}
                    />
                  ))}
                </div>
              </div>

              {/* Closing Message */}
              <div style={{ textAlign: 'center', padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Enjoy Your Special Day! ✨
                </h2>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
