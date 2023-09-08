import { useEffect, useMemo, useState } from 'react';
import type { ReactiveState } from '@briosheje/ipc-reactive-state-electron';

export function useReactiveState<T extends ReactiveState>(key: string) {
  const [state, setState] = useState<T>();

  const updateState = (newState: T) => {
    window.ipcReactiveState.updateState<T>(key, newState);
  };

  useEffect(() => {
    const unsubscribe = window.ipcReactiveState.onStateUpdated<T>(key, (v) => {
      setState(v);
    });

    return () => unsubscribe();
  }, [key]);

  useEffect(() => {
    window.ipcReactiveState.getState<T>(key).then((v) => {
      setState(v);
    });
  }, [key]);

  const outState = useMemo(() => Object.freeze<T | undefined>(state), [state]);

  return [outState, updateState] as const;
}
