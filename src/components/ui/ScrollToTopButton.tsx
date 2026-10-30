import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../../utils/scrollUtils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsVisible(scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen to any scrollable layout container
    const containers = document.querySelectorAll('.desktop-content-area, .mobile-main-canvas, main');
    containers.forEach(c => c.addEventListener('scroll', handleScroll, { passive: true }));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      containers.forEach(c => c.removeEventListener('scroll', handleScroll));
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={() => scrollToTop(true)}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.1, translateY: -3 }}
          whileTap={{ scale: 0.95 }}
          className="scroll-to-top-fab"
          title="Back to top"
          aria-label="Scroll back to top"
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35), 0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'box-shadow 0.2s ease, background 0.2s ease'
          }}
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
