import { useEffect, useRef, useState } from 'react';

interface UseKeyboardNavigationProps {
  onSpacePress?: () => void;
  onEnterPress?: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = <T extends HTMLElement = HTMLElement>({
  onSpacePress,
  onEnterPress,
  disabled = false
}: UseKeyboardNavigationProps = {}) => {
  const elementRef = useRef<T>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && onSpacePress) {
        event.preventDefault();
        setIsPressed(true);
        onSpacePress();
      } else if (event.code === 'Enter' && onEnterPress) {
        event.preventDefault();
        setIsPressed(true);
        onEnterPress();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        setIsPressed(false);
      }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      setIsPressed(false);
    };

    // Tornar o elemento focável se não for
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('keyup', handleKeyUp);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('keyup', handleKeyUp);
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [onSpacePress, onEnterPress, disabled]);

  return {
    elementRef,
    isPressed,
    isFocused,
    className: `clickable ${isPressed ? 'pressed' : ''}`
  };
};

export default useKeyboardNavigation;