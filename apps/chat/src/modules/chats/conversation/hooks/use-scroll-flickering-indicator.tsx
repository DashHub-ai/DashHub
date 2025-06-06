import { useState } from 'react';

import { useTimeout } from '@dashhub/commons-front';

export function useScrollFlickeringIndicator() {
  const [visible, setVisible] = useState(false);

  useTimeout(() => {
    setVisible(true);
  }, { time: 100 });

  return { visible };
}
