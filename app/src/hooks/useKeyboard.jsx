import { useEffect, useState } from 'react';

function useKeyboard(key) {
  const [pressed, setPressed] = useState(null);

  const keyDownEventListener = ev => {
    if (ev.key === key) {
      ev.preventDefault();
      setPressed(true);
    }
  };

  const keyUpEventListener = ev => {
    if (ev.key === key) {
      ev.preventDefault();
      setPressed(false);
    }
  };

  const register = () => {
    window.addEventListener('keydown', keyDownEventListener);
    window.addEventListener('keyup', keyUpEventListener);
  };

  const unregister = () => {
    setPressed(false);
    window.removeEventListener('keydown', keyDownEventListener);
    window.removeEventListener('keyup', keyUpEventListener);
  };

  useEffect(() => {
    return () => {
      unregister();
    };
  }, []);

  return {
    register,
    pressed,
    unregister,
  };
}

export default useKeyboard;
