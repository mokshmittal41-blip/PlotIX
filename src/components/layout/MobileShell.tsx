import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';
import ToastContainer from '../ui/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

interface MobileShellProps {
  currentPage: string;
  onNavigate: (page: string, propertyId?: string) => void;
  children: React.ReactNode;
}

export default function MobileShell({
  currentPage,
  onNavigate,
  children,
}: MobileShellProps) {
  const isMapPage = currentPage === 'map';

  useEffect(() => {
    scrollToTop(false);
  }, [currentPage]);

  const pageVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  };

  return (
    <div className="mobile-shell-root">
      {/* Fixed Mobile Top Header */}
      {!isMapPage && (
        <MobileHeader currentPage={currentPage} onNavigate={onNavigate} />
      )}

      {/* Main Single-Column Mobile Content Area */}
      <main className={`mobile-main-canvas ${isMapPage ? 'mobile-map-canvas' : ''}`}>
        {isMapPage ? (
          <div className="mobile-map-direct-fill">
            {children}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mobile-page-transition-wrap"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Raised Floating Bottom Navigation Dock */}
      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
      <ToastContainer />
    </div>
  );
}
