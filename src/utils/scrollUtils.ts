/**
 * Universal scroll-to-top utility for PropWise
 * Resets window, document, and any scrollable layout containers smoothly or instantly
 */
export function scrollToTop(smooth: boolean = true) {
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Reset all potential scroll container elements in Desktop & Mobile shells
    const scrollContainers = document.querySelectorAll(
      '.desktop-main-wrapper, .desktop-content-area, .mobile-main-canvas, .mobile-shell-root, .desktop-shell-root, .mobile-page-transition-wrap, main, .app-layout'
    );

    scrollContainers.forEach(el => {
      if (el) {
        if (smooth) {
          el.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } else {
          el.scrollTop = 0;
        }
      }
    });
  } catch {
    window.scrollTo(0, 0);
  }
}
