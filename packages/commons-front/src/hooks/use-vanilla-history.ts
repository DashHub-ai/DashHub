/**
 * Hook that does not trigger any handler in `wouter`
 */
export function useVanillaHistory() {
  return {
    get of(): History {
      return Object.getPrototypeOf(window.history);
    },

    replaceState(url: string, data?: any) {
      this.of.replaceState.call(window.history, data, '', url);
    },
  };
}
