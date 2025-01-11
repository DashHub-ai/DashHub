import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { ChooseButton } from './choose-button';

type Props = {
  group: SdkTableRowWithIdNameT;
  onSelect: (group: SdkTableRowWithIdNameT) => void;
};

export function AutocompleteGroupItem({ group, onSelect }: Props) {
  return (
    <div className="flex justify-between items-center hover:bg-gray-50 p-3 cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="flex justify-center items-center bg-gray-100 rounded-full w-8 h-8">
          <span className="font-medium text-gray-600 text-xs">
            {group.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="font-medium text-sm">{group.name}</div>
      </div>

      <ChooseButton onClick={() => onSelect(group)} />
    </div>
  );
}
