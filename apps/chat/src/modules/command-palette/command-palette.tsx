import clsx from 'clsx';
import { SearchIcon } from 'lucide-react';
import {
  type KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'wouter';

import { useDebounceValue, useWindowListener } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import type { CommandPaletteItem } from './use-command-palette-items';

import {
  useCommandPaletteNavItems,
  useCommandPaletteSearchItems,
} from './use-command-palette-items';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { pack } = useI18n();

  const debouncedQuery = useDebounceValue({ delay: 120 }, query);
  const navItems = useCommandPaletteNavItems();
  const searchItems = useCommandPaletteSearchItems(debouncedQuery.value);

  const items: CommandPaletteItem[] = query
    ? searchItems.items
    : navItems;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useWindowListener({
    keydown(e: KeyboardEvent) {
      const isK = e.key === 'k' || e.key === 'K';
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setQuery('');
  }

  function navigateTo(href: string) {
    const forceHref = sitemap.forceRedirect.generate(href);
    navigate(forceHref);
    close();
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (items[activeIndex]) {
          navigateTo(items[activeIndex].href);
        }
        break;
    }
  };

  if (!isOpen) {
    return null;
  }

  const t = pack.commandPalette;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <div className="w-full max-w-xl mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <SearchIcon size={16} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 px-3 py-4 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            placeholder={t.placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded">
            esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {items.length === 0 && !searchItems.loading && (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {t.noResults}
            </p>
          )}

          {items.map((item, index) => {
            const { Icon } = item;
            return (
              <button
                key={item.id}
                type="button"
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                  index === activeIndex
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => navigateTo(item.href)}
              >
                <Icon size={16} className="shrink-0 text-gray-400" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.subLabel && (
                  <span className="text-xs text-gray-400 shrink-0">{item.subLabel}</span>
                )}
              </button>
            );
          })}
        </div>

        {!query && (
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex gap-3 text-xs text-gray-400">
            <span>
              <kbd className="font-mono">↑↓</kbd>
              {' '}
              {t.hints.navigate}
            </span>
            <span>
              <kbd className="font-mono">↵</kbd>
              {' '}
              {t.hints.open}
            </span>
            <span>
              <kbd className="font-mono">esc</kbd>
              {' '}
              {t.hints.close}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
