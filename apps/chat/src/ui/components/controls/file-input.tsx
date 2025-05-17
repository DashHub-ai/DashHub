import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import {
  type ChangeEventHandler,
  type ComponentProps,
  useMemo,
  useRef,
} from 'react';

import type { SdkTableRowWithIdNameT } from '@dashhub/sdk';

import { isImageFileUrl, type Nullable } from '@dashhub/commons';
import { useI18n } from '~/i18n';

type SelectGenericFileInputProps = Pick<
  ComponentProps<'input'>,
  'name' | 'required' | 'accept' | 'className'
>;

type TableRowWithPublicUrl = SdkTableRowWithIdNameT & {
  publicUrl?: string;
};

type GenericFileInputValue = Nullable<File | TableRowWithPublicUrl | null>;

export const SelectGenericFileInput = controlled<
  GenericFileInputValue,
  SelectGenericFileInputProps
>(({ className, name, accept, required, control: { value, setValue } }) => {
  const t = useI18n().pack;
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;

    if (files?.length) {
      setValue({
        value: files[0],
      });
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setValue({
      value: null,
    });
  };

  const previewUrl = useMemo(() => {
    if (!value) {
      return null;
    }

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    if (value.publicUrl && isImageFileUrl(value.publicUrl)) {
      return value.publicUrl;
    }

    return null;
  }, [value]);

  return (
    <>
      {previewUrl && (
        <img
          src={previewUrl}
          alt={value instanceof File ? value.name : (value?.name ?? '')}
          className="mb-3 h-16"
        />
      )}

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          className={clsx('text-sm', className)}
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={onChange}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 text-xs"
          >
            {t.form.clearFile}
          </button>
        )}
      </div>
    </>
  );
});
