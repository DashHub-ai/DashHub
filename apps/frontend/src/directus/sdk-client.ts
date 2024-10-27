import { createDirectus, rest } from '@directus/sdk';

export type Author = {
  id: number;
  name: string;
};

export type Article = {
  cover: string;
  title: string;
  author: Author;
  content: string;
  description: string;
  published_date: string;
  slug: string;
};

type Schema = {
  Author: Author[];
  Article: Article[];
};

export const directusSdk = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL).with(rest());
