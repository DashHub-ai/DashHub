import { controlled, type OmitControlStateAttrs } from '@under-control/forms';
import clsx from 'clsx';
import { Activity, Archive, LayoutGrid } from 'lucide-react';

import { rejectFalsyItems } from '@llm/commons';
import { Tabs, type TabsProps } from '~/components/tabs';
import { useForwardedI18n } from '~/i18n';

type Props = Omit<OmitControlStateAttrs<TabsProps>, 'tabs'> & {
  withAll?: boolean;
};

export const ArchiveFilterTabs = controlled<boolean | null, Props>((
  {
    control: { value, setValue },
    withAll = true,
    className,
    ...props
  },
) => {
  const t = useForwardedI18n().pack.tabs.archiveFilters;
  const tabs = rejectFalsyItems([
    {
      id: false,
      name: t.active,
      icon: <Activity size={16} />,
    },
    {
      id: true,
      name: t.archived,
      icon: <Archive size={16} />,
    },
    withAll && {
      id: -1,
      name: t.all,
      icon: <LayoutGrid size={16} />,
    },
  ]);

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
