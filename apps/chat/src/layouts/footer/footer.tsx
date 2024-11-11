import { GithubIcon, InfoIcon, NewspaperIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

export function Footer() {
  const t = useI18n().pack.footer;

  return (
    <footer className="py-12 w-full">
      <div className="mx-auto px-4 container">
        <div className="flex flex-col items-center gap-6 text-sm">
          <div className="text-gray-400">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            DashHub.
            {' '}
            {t.copyright}
            {' '}
            •
            {' '}
            {t.madeWith}
            <span className="mx-1">❤️</span>
            {t.withAI}
          </div>

          <div className="flex items-center gap-8">
            <a
              href="https://github.com/DashHub-ai/DashHub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
            >
              <GithubIcon size={16} />
              {t.github}
            </a>
            <a
              href="https://dashhub.ai/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
            >
              <NewspaperIcon size={16} />
              {t.blog}
            </a>
            <a
              href="https://dashhub.ai/about"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
            >
              <InfoIcon size={16} />
              {t.about}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
