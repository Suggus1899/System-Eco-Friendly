import { useState, useCallback, useEffect, useRef } from 'react';

// Custom hook to help prevent state updates on unmounted components
export const useUnmountedRef = () => {
  const unmountedRef = useRef(false);

  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
};

// Custom hook for safe state updates
export const useSafeState = (initialState) => {
  const [state, setState] = useState(initialState);
  const unmountedRef = useUnmountedRef();

  const safeSetState = useCallback(
    (newState) => {
      if (!unmountedRef.current) {
        setState(newState);
      }
    },
    [unmountedRef]
  );

  return [state, safeSetState];
};