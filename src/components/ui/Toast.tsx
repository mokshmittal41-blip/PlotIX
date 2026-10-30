import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import type { ToastItem } from '../../types';

function ToastMessage({ toast }: { toast: ToastItem }) {
  const { removeToast } = useApp();

  const icons = {
    success: <CheckCircle size={15} />,
    error: <XCircle size={15} />,
    info: <Info size={15} />,
    warning: <AlertTriangle size={15} />,
  };

  return (
    <motion.div
      className={`toast ${toast.type || 'info'}`}
      role="alert"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{ display: 'flex', flexShrink: 0 }}>{icons[toast.type as keyof typeof icons] || icons.info}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        style={{ display: 'flex', alignItems: 'center', padding: 2, marginLeft: 4, opacity: 0.7, flexShrink: 0, cursor: 'pointer', color: 'inherit' }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map(t => (
          <ToastMessage key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
