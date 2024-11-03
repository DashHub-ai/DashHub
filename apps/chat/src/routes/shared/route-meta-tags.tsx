import { Helmet } from 'react-helmet-async';

import { useI18n } from '~/i18n';

type Props = {
  meta: {
    title: string;
    description: string;
  };
};

export function RouteMetaTags({ meta }: Props) {
  const { pack } = useI18n();
  const prefix = pack.routes.shared.meta;

  return (
    <Helmet>
      <title>{`${prefix.title} | ${meta.title}`}</title>
      <meta name="description" content={meta.description} />
    </Helmet>
  );
}
