import { createDirectus, rest } from '@directus/sdk';

export type Author = {
  id: number;
  name: string;
};

type ArticleStatus = 'published' | 'draft' | 'archived';

export type Article = {
  cover: string;
  title: string;
  status: ArticleStatus;
  author: Author;
  content: string;
  description: string;
  published_date: string;
  slug: string;
};

type NewsletterList = {
  email: string;
};

type Schema = {
  Author: Author[];
  Article: Article[];
  Newsletter_List: NewsletterList[];
};

export const directusSdk = createDirectus<Schema>(import.meta.env.PUBLIC_VITE_DIRECTUS_URL).with(rest());
