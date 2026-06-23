import { useEffect, useState } from 'react';

export function usePersistentState<T>(loader: () => T, saver: (value: T) => void): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => loader());

  useEffect(() => {
    saver(state);
  }, [saver, state]);

  return [state, setState];
}
