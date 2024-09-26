import { useState } from 'react';

export function useForceRerender() {
  const [revision, set] = useState(0);

  return {
    revision,
    forceRerender: () => set(prev => prev + 1),
  };
};
