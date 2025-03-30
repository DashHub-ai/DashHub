export function preloadResource(url: string, { attributes }: PreloadResourceProps = {}): void {
  if (document.head.querySelector(`link[href="${url}"][rel="preload"]`)) {
    return;
  }

  const link = document.createElement('link');

  // Set additional attributes if provided.
  for (const [key, value] of Object.entries(attributes || {})) {
    link.setAttribute(key, value);
  }

  link.rel = 'preload';
  link.as = detectTypeOfResource(url);
  link.href = url;

  document.head.insertBefore(link, document.head.firstChild);
}

export function preloadResources(urls: string[], { attributes }: PreloadResourceProps = {}): void {
  urls.forEach((url) => {
    preloadResource(url, { attributes });
  });
}

type PreloadResourceProps = {
  attributes?: Record<string, any>;
};

function detectTypeOfResource(url: string): string {
  switch (true) {
    case /\.css$/.test(url):
      return 'style';

    case /\.js$/.test(url):
      return 'script';

    default:
      return 'fetch';
  }
}
