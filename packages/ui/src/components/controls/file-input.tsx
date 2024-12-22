import type { ChangeEventHandler, ComponentProps } from 'react';

import { controlled } from '@under-control/forms';

import type { Nullable } from '@llm/commons';
import type { SdkTableRowWithIdNameT } from '@llm/sdk';

type SelectGenericFileInputProps = Pick<
  ComponentProps<'input'>,
  'name' | 'required' | 'accept'
>;

type GenericFileInputValue = Nullable<File | SdkTableRowWithIdNameT>;

export const SelectGenericFileInput = controlled<
  GenericFileInputValue,
  SelectGenericFileInputProps
>(({ name, accept, required, control: { setValue } }) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;

    if (files?.length) {
      setValue({
        value: files[0],
      });
    }
  };

  return (
    <input
      type="file"
      name={name}
      accept={accept}
      required={required}
      onChange={onChange}
    />
  );
});
