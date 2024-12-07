import {
  BotIcon,
  BuildingIcon,
  CloudIcon,
  FolderIcon,
  GraduationCapIcon,
  LayersIcon,
  UserIcon,
} from 'lucide-react';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { useSitemap } from '~/routes';

import { RouteMetaTags } from '../shared';
import { QuickAccessCard, QuickAccessSection } from './components';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;
  const sitemap = useSitemap();

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader root>
          {t.title}
        </LayoutHeader>

        <div className="gap-12 grid p-6">
          <QuickAccessSection
            icon={<BuildingIcon size={18} />}
            title={t.sections.resources.title}
          >
            <QuickAccessCard
              icon={<BuildingIcon size={24} />}
              title={t.sections.resources.cards.organizations.title}
              description={t.sections.resources.cards.organizations.description}
              href={sitemap.organizations.index.raw}
            />
            <QuickAccessCard
              icon={<UserIcon size={24} />}
              title={t.sections.resources.cards.users.title}
              description={t.sections.resources.cards.users.description}
              href={sitemap.users.index.raw}
            />
          </QuickAccessSection>

          <div className="bg-border h-px" />

          <QuickAccessSection
            icon={<FolderIcon size={18} />}
            title={t.sections.development.title}
          >
            <QuickAccessCard
              icon={<BotIcon size={24} />}
              title={t.sections.development.cards.apps.title}
              description={t.sections.development.cards.apps.description}
              href={sitemap.apps.index.raw}
            />
            <QuickAccessCard
              icon={<FolderIcon size={24} />}
              title={t.sections.development.cards.appsCategories.title}
              description={t.sections.development.cards.appsCategories.description}
              href={sitemap.apps.categories.index.raw}
            />
            <QuickAccessCard
              icon={<LayersIcon size={24} />}
              title={t.sections.development.cards.projects.title}
              description={t.sections.development.cards.projects.description}
              href={sitemap.projects.index.raw}
            />
          </QuickAccessSection>

          <div className="bg-border h-px" />

          <QuickAccessSection
            icon={<GraduationCapIcon size={18} />}
            title={t.sections.aiAndStorage.title}
          >
            <QuickAccessCard
              icon={<GraduationCapIcon size={24} />}
              title={t.sections.aiAndStorage.cards.aiModels.title}
              description={t.sections.aiAndStorage.cards.aiModels.description}
              href={sitemap.aiModels.index.raw}
            />
            <QuickAccessCard
              icon={<CloudIcon size={24} />}
              title={t.sections.aiAndStorage.cards.s3Buckets.title}
              description={t.sections.aiAndStorage.cards.s3Buckets.description}
              href={sitemap.s3Buckets.index.raw}
            />
          </QuickAccessSection>
        </div>
      </PageWithNavigationLayout>
    </>
  );
}
