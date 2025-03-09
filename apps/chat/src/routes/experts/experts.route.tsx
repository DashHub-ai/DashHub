import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { ExpertsGrid } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';
import { CreateButton, PaginationSearchToolbarItem, PaginationToolbar } from '~/ui';

import { ExpertsTutorial } from './experts-tutorial';

const SAMPLE_EXPERTS = [
  {
    id: '1',
    name: 'Code Review Expert',
    description: 'AI assistant specialized in code reviews, best practices, and security analysis',
    updatedAt: new Date('2024-01-15'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '2',
    name: 'Documentation Writer',
    description: 'Generates and maintains technical documentation, API references, and guides',
    updatedAt: new Date('2024-01-10'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '3',
    name: 'DevOps Advisor',
    description: 'Provides guidance on CI/CD pipelines, infrastructure, and deployment strategies',
    updatedAt: new Date('2024-01-05'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '4',
    name: 'Data Analyst',
    description: 'Assists with data analysis, SQL queries, and data visualization recommendations',
    updatedAt: new Date('2024-01-01'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '5',
    name: 'Architecture Consultant',
    description: 'Helps with system design decisions and architectural pattern recommendations',
    updatedAt: new Date('2023-12-25'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '6',
    name: 'Testing Strategist',
    description: 'Guides on test planning, test case generation, and QA best practices',
    updatedAt: new Date('2023-12-20'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '7',
    name: 'Performance Optimizer',
    description: 'Analyzes and suggests improvements for application performance',
    updatedAt: new Date('2023-12-15'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '8',
    name: 'Security Consultant',
    description: 'Identifies security vulnerabilities and recommends protection measures',
    updatedAt: new Date('2023-12-10'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '9',
    name: 'UI/UX Advisor',
    description: 'Provides guidance on interface design and user experience improvements',
    updatedAt: new Date('2023-12-05'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    id: '10',
    name: 'API Designer',
    description: 'Assists in designing RESTful APIs and GraphQL schemas',
    updatedAt: new Date('2023-12-01'),
    aiModels: [
      {
        id: 1,
        name: 'gpt-4',
      },
      {
        id: 2,
        name: 'gpt-3.5-turbo',
      },
    ],
  },
] as any;

export function ExpertsRoute() {
  const t = useI18n().pack.routes.experts;

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <ExpertsTutorial />

      <section>
        <PaginationToolbar
          className="mb-6"
          suffix={(
            <CreateButton loading={false} />
          )}
        >
          <PaginationSearchToolbarItem defaultValue="" />
        </PaginationToolbar>

        <ExpertsGrid items={SAMPLE_EXPERTS} />
      </section>
    </PageWithSidebarLayout>
  );
}
