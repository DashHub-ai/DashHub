import type { SdkPermissionAccessLevelT } from '@llm/sdk';

import { Checkbox } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  value: SdkPermissionAccessLevelT;
  onChange: (value: SdkPermissionAccessLevelT) => void;
};

export function PermissionCheckboxes({ value, onChange }: Props) {
  const t = useI18n().pack.permissions.accessLevels;

  const canWrite = value === 'write';
  const canRead = value === 'read';

  return (
    <div className="flex gap-3">
      <Checkbox
        value={canRead}
        onChange={() => {
          onChange(canRead ? 'write' : 'read');
        }}
        className="text-xs"
        checkboxClassName="w-4 h-4"
      >
        {t.read}
      </Checkbox>

      <Checkbox
        value={canWrite}
        onChange={() => {
          onChange(canWrite ? 'read' : 'write');
        }}
        className="text-xs"
        checkboxClassName="w-4 h-4"
      >
        {t.write}
      </Checkbox>
    </div>
  );
}
