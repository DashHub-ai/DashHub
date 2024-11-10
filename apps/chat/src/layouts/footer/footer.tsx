import { UkIcon } from '@llm/ui';
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
              <UkIcon icon="github" size={16} />
              {t.github}
            </a>
            <a
              href="https://blog.dashhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
            >
              <UkIcon icon="newspaper" size={16} />
              {t.blog}
            </a>
            <a
              href="https://docs.dashhub.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-500"
            >
              <UkIcon icon="book" size={16} />
              {t.docs}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
