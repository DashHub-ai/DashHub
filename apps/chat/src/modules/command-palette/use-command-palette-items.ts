import type { ComponentType } from 'react';

import {
  BotIcon,
  FolderIcon,
  HomeIcon,
  MessageSquareTextIcon,
  PinIcon,
  SettingsIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { useSearchResult } from '../search-bar/results/use-search-result';

export type CommandPaletteItem = {
  id: string;
  label: string;
  subLabel?: string;
  href: string;
  Icon: ComponentType<{ size?: number; }>;
};

export function useCommandPaletteNavItems(): CommandPaletteItem[] {
  const { pack } = useI18n();
  const sitemap = useSitemap();
  const t = pack.navigation.links;

  return [
    { id: 'nav-home', label: t.home, href: sitemap.home, Icon: HomeIcon },
    { id: 'nav-chats', label: t.chats, href: sitemap.chats.index, Icon: MessageSquareTextIcon },
    { id: 'nav-projects', label: t.projects, href: sitemap.projects.index.generate({}), Icon: FolderIcon },
    { id: 'nav-apps', label: t.apps, href: sitemap.apps.index.generate({}), Icon: BotIcon },
    { id: 'nav-experts', label: t.experts, href: sitemap.experts, Icon: UsersIcon },
    { id: 'nav-pinned', label: t.pinnedMessages, href: sitemap.pinnedMessages.index.generate({}), Icon: PinIcon },
    { id: 'nav-integrations', label: t.aiExternalAPIs, href: sitemap.aiExternalAPIs.index.generate({}), Icon: ZapIcon },
    { id: 'nav-settings', label: pack.navigation.loggedIn.settings, href: sitemap.settings.me, Icon: SettingsIcon },
  ];
}

export function useCommandPaletteSearchItems(phrase: string): {
  items: CommandPaletteItem[];
  loading: boolean;
} {
  const { pack } = useI18n();
  const sitemap = useSitemap();
  const result = useSearchResult(phrase);

  if (!phrase || result.status !== 'success') {
    return { items: [], loading: result.status === 'loading' };
  }

  const items: CommandPaletteItem[] = [];
  const { chats, projects, apps } = result.data;

  for (const chat of chats.items) {
    items.push({
      id: `chat-${chat.id}`,
      label: chat.summary.name.value || pack.chat.card.noTitle,
      subLabel: pack.searchBar.groups.chats.itemSubTitle,
      href: sitemap.chat.generate({ pathParams: { id: chat.id } }),
      Icon: MessageSquareTextIcon,
    });
  }

  for (const project of projects.items) {
    items.push({
      id: `project-${project.id}`,
      label: project.name,
      subLabel: pack.searchBar.groups.projects.itemSubTitle,
      href: sitemap.projects.show.generate({ pathParams: { id: project.id } }),
      Icon: FolderIcon,
    });
  }

  for (const app of apps.items) {
    items.push({
      id: `app-${app.id}`,
      label: app.name,
      subLabel: pack.searchBar.groups.apps.itemSubTitle,
      href: sitemap.apps.index.generate({ searchParams: { ids: [app.id] } }),
      Icon: BotIcon,
    });
  }

  return { items, loading: false };
}
