import { useEffect, useCallback } from 'react';

/**
 * Custom hook to allow dismissing modals via the Escape key and backdrop click
 * @param {Function} onClose - Function to call when Escape is pressed or backdrop is clicked
 * @param {boolean} [enabled=true] - Whether the listener is active
 * @returns {{ handleBackdropClick: Function }}
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

  const handleBackdropClick = useCallback(
    (e) => {
      if (!enabled || typeof onClose !== 'function') return;
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose, enabled]
  );

  return { handleBackdropClick };
}

export default useModalDismiss;
