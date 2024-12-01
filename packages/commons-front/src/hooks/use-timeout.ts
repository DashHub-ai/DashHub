import { useEffect } from 'react';

type TimeoutAttrs = {
  time: number;
  pause?: boolean;
  key?: any;
};

export function useTimeout(
  callback: () => any,
  { time, pause, key }: TimeoutAttrs,
) {
  useEffect(() => {
    if (pause) {
      return;
    }

    const timer = setTimeout(callback, time);

    return () => {
      clearTimeout(timer);
    };
  }, [pause, time, key]);
}
