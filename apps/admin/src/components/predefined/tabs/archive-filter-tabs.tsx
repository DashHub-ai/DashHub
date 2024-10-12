import { controlled, type OmitControlStateAttrs } from '@under-control/forms';
import clsx from 'clsx';

import { Tabs, type TabsProps } from '~/components/tabs';
import { useI18n } from '~/i18n';

type Props = Omit<OmitControlStateAttrs<TabsProps>, 'tabs'>;

export const ArchiveFilterTabs = controlled<boolean | null, Props>((
  {
    control: { value, setValue },
    className,
    ...props
  },
) => {
  const t = useI18n().pack.tabs.archiveFilters;
  const tabs = [
    {
      id: false,
      name: t.active,
    },
    {
      id: true,
      name: t.archived,
    },
    {
      id: -1,
      name: t.all,
    },
  ];

  return (
    <Tabs
      {...props}
      className={clsx(className, 'w-auto')}
      value={value ?? -1}
      onChange={(newValue) => {
        setValue({
          value: newValue === -1 ? null : Boolean(newValue),
        });
      }}
      tabs={tabs}
    />
  );
});
