export const dropSearchParams = (url: string) => url.split('?')[0];

export const hasSearchParams = (href: string) => href.includes('?');
