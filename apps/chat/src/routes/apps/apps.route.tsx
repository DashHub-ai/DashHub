import { CreateButton, PaginationSearchToolbarItem, PaginationToolbar } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsGrid } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { AppsTutorial } from './apps-tutorial';

const SAMPLE_APPS = [
  {
    id: '1',
    name: 'AI Image Generator',
    description: 'Create stunning artwork using advanced AI algorithms',
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Code Analyzer',
    description: 'Static code analysis tool with security vulnerability detection',
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Virtual Assistant',
    description: 'Smart AI assistant for task automation and scheduling',
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'Data Visualizer',
    description: 'Interactive charts and graphs for complex data analysis',
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Language Translator',
    description: 'Real-time translation tool supporting 50+ languages',
    updatedAt: new Date('2023-12-25'),
  },
  {
    id: '6',
    name: 'Smart Home Controller',
    description: 'IoT device management and automation platform',
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '7',
    name: 'Video Editor',
    description: 'Cloud-based video editing with AI-powered features',
    updatedAt: new Date('2023-12-15'),
  },
  {
    id: '8',
    name: 'Password Manager',
    description: 'Secure password storage with encryption and sync',
    updatedAt: new Date('2023-12-10'),
  },
  {
    id: '9',
    name: 'Note Taking App',
    description: 'Collaborative note-taking with markdown support',
    updatedAt: new Date('2023-12-05'),
  },
  {
    id: '10',
    name: 'Stock Analyzer',
    description: 'Financial market analysis with predictive algorithms',
    updatedAt: new Date('2023-12-01'),
  },
] as any;

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <section>
        <PaginationToolbar
          className="mb-6"
          suffix={(
            <CreateButton loading={false} />
          )}
        >
          <PaginationSearchToolbarItem defaultValue="" />
        </PaginationToolbar>

        <AppsGrid items={SAMPLE_APPS} />
      </section>
    </PageWithNavigationLayout>
  );
}
