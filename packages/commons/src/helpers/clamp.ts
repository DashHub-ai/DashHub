export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function clampC(min: number, max: number) {
  return (value: number) =>
    clamp(min, max, value);
}
