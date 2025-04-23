import { useCallback, useEffect } from 'react';

interface NavigationConfig {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onEnter?: () => void;
  enabled?: boolean; // 🆕 Control if listener is active
}

export const useKeyboardNavigation = (config: NavigationConfig) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (config.enabled === false) return;

    const active = document.activeElement as HTMLElement | null;
    if (!active) return;

    // Only handle relevant input types
    const inputTypesToHandle = ['text', 'number', 'search', 'tel'];
    const isHandledInput = (
      (active instanceof HTMLInputElement && inputTypesToHandle.includes(active.type)) ||
      active instanceof HTMLTextAreaElement
    );

    if (!isHandledInput || active.isContentEditable) return;

    switch (e.key) {
      case 'ArrowLeft':
        // e.preventDefault();
        config.onLeft?.();
        break;
      case 'ArrowRight':
        // e.preventDefault();
        config.onRight?.();
        break;
      case 'ArrowUp':
        // e.preventDefault();
        config.onUp?.();
        break;
      case 'ArrowDown':
        // e.preventDefault();
        config.onDown?.();
        break;
      case 'Enter':
        // e.preventDefault();
        config.onEnter?.();
        break;
      default:
        break;
    }
  }, [config]);

  useEffect(() => {
    document.addEventListener('', handleKeyDown);
    return () => {
      document.removeEventListener('', handleKeyDown);
    };
  }, [handleKeyDown]);
};
