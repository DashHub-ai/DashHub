export const Time = {
  toMilliseconds: {
    minutes: (count: number) => count * 60 * 1000,
    hours: (count: number) => count * 3600 * 1000,
  },

  toSeconds: {
    minutes: (count: number) => count * 60,
    hours: (count: number) => count * 3600,
    years: (count: number) => count * 31_536_000,
    months: (count: number) => count * 2_628_000,
  },
};
