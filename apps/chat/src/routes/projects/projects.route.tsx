import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ProjectsGrid } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

const SAMPLE_PROJECTS = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Online store with product management and cart functionality',
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Blog Engine',
    description: 'Custom CMS for managing blog posts and comments',
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Task Manager',
    description: 'Project management tool with task tracking',
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'Chat Application',
    description: 'Real-time chat application with user authentication',
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Social Network',
    description: 'Social platform with user profiles and messaging',
    updatedAt: new Date('2023-12-25'),
  },
  {
    id: '6',
    name: 'Photo Gallery',
    description: 'Image sharing platform with albums and tags',
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '7',
    name: 'Weather App',
    description: 'Weather forecast application with location search',
    updatedAt: new Date('2023-12-15'),
  },
  {
    id: '8',
    name: 'Fitness Tracker',
    description: 'Workout logging tool with exercise routines',
    updatedAt: new Date('2023-12-10'),
  },
  {
    id: '9',
    name: 'Recipe Book',
    description: 'Cookbook application with recipe categories',
    updatedAt: new Date('2023-12-05'),
  },
  {
    id: '10',
    name: 'Music Player',
    description: 'Audio player with playlist management and equalizer',
    updatedAt: new Date('2023-12-01'),
  },
] as any;

export function ProjectsRoute() {
  const t = useI18n().pack.routes.projects;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <section>
        <ProjectsGrid items={SAMPLE_PROJECTS} />
      </section>
    </PageWithNavigationLayout>
  );
}
