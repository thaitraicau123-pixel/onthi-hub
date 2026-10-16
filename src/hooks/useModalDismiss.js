import { useEffect } from 'react';

/**
 * Custom hook to allow dismissing modals via the Escape key
 * @param {Function} onClose - Function to call when Escape is pressed
 * @param {boolean} [enabled=true] - Whether the listener is active
 */
export function useModalDismiss(onClose, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof onClose !== 'function') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, enabled]);
}

export default useModalDismiss;
