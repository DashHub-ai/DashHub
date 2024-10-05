import { controlled, type OmitControlStateAttrs } from '@under-control/forms';
import clsx from 'clsx';

import { Tabs, type TabsProps } from '~/components/tabs';
import { useI18n } from '~/i18n';

type Props = Omit<OmitControlStateAttrs<TabsProps>, 'tabs'>;

export const ArchiveFilterTabs = controlled<boolean, Props>((
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
  ];

  return (
    <Tabs
      {...props}
      className={clsx(className, 'w-auto')}
      value={value}
      onChange={(newValue) => {
        setValue({
          value: newValue as boolean,
        });
      }}
      tabs={tabs}
    />
  );
});
