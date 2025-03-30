/**
 * Map of injected scripts. It is used to prevent injecting the same script multiple times.
 * It happens quite often in React Strict mode when the component is rendered twice.
 */
const INJECTED_SCRIPTS = new Map<string, Promise<void>>();

/**
 * Injects a script into the document.
 */
export function injectScript(src: string, { attributes }: InjectScriptProps = {}): Promise<void> {
  // Return the promise if the script is already injected by this function.
  if (INJECTED_SCRIPTS.has(src)) {
    return INJECTED_SCRIPTS.get(src)!;
  }

  // Return the promise if the script is already present in the document but not injected by this function.
  // We are not sure if the script is loaded or not, so we have to show warning in this case.
  const maybePrevScript = document.querySelector(`script[src="${src}"]`);

  if (maybePrevScript) {
    console.warn(`Script with "${src}" src is already present in DOM!`);
    maybePrevScript.remove();
  }

  // Inject the script and return the promise.
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');

    script.onerror = reject;
    script.onload = () => {
      resolve();
    };

    // Set additional attributes if provided.
    for (const [key, value] of Object.entries(attributes || {})) {
      script.setAttribute(key, value);
    }

    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.head.appendChild(script);

    // It should remove script if script is being removed from the DOM.
    const observer = new MutationObserver((mutations) => {
      const removedNodes = mutations.flatMap(mutation => Array.from(mutation.removedNodes));

      if (removedNodes.includes(script)) {
        INJECTED_SCRIPTS.delete(src);
        observer.disconnect();
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });
  });

  INJECTED_SCRIPTS.set(src, promise);

  return promise;
}

/**
 * Props for the `injectScript` function.
 */
export type InjectScriptProps = {
  attributes?: Record<string, any>;
};

/**
 * Injects multiple scripts into the document in parallel.
 */
export async function injectScriptsInParallel(sources: Array<string>, props?: InjectScriptProps): Promise<void> {
  await Promise.all(
    sources.map(src => injectScript(src, props)),
  );
}
