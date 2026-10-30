import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

interface DesktopShellProps {
  currentPage: string;
  onNavigate: (page: string, propertyId?: string) => void;
  children: React.ReactNode;
}

export default function DesktopShell({
  currentPage,
  onNavigate,
  children,
}: DesktopShellProps) {
  const isMapPage = currentPage === 'map';

  useEffect(() => {
    scrollToTop(false);
  }, [currentPage]);

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  };

  return (
    <div className="desktop-shell-root">
      {/* 260px Fixed Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className={`desktop-main-wrapper ${isMapPage ? 'desktop-map-wrapper' : ''}`}>
        {/* Fixed Desktop Header */}
        {!isMapPage && <Header currentPage={currentPage} />}

        <main className={`desktop-content-area ${isMapPage ? 'desktop-map-fill' : ''}`}>
          {isMapPage ? (
            <div className="map-direct-fill">
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
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
