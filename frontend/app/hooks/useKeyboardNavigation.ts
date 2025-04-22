
import { useCallback, useEffect } from 'react';

interface NavigationConfig {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onEnter?: () => void;
}

export const useKeyboardNavigation = (config: NavigationConfig) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        config.onLeft?.();
        break;
      case 'ArrowRight':
        config.onRight?.();
        break;
      case 'ArrowUp':
        config.onUp?.();
        break;
      case 'ArrowDown':
        config.onDown?.();
        break;
      case 'Enter':
        config.onEnter?.();
        break;
    }
  }, [config]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};