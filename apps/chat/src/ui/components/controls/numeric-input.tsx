import { controlled, pickEventValue } from '@under-control/inputs';
import { type ChangeEventHandler, useState } from 'react';

import { clamp, isNil } from '@llm/commons';
import { useUpdateEffect } from '@llm/commons-front';

import { Input, type InputProps } from './input';

type NumericInputProps = Omit<InputProps, 'type' | 'ref'> & {
  clampOnChange?: boolean;
};

export const NumericInput = controlled<number, NumericInputProps>(
  ({ control: { value, bind }, clampOnChange, ...props }) => {
    const { min, max } = props;
    const [unparsedValue, setUnparsedValue] = useState<string>(
      value?.toString() ?? '',
    );

    const onChange: ChangeEventHandler<HTMLElement> = (event) => {
      let newUnparsedValue = pickEventValue(event);

      setUnparsedValue(newUnparsedValue);

      if (clampOnChange && !isNil(min) && !isNil(max)) {
        newUnparsedValue = clamp(+min, +max, newUnparsedValue);
      }

      if (!Number.isNaN(+newUnparsedValue)) {
        bind.entire().onChange(+newUnparsedValue);
      }
    };

    useUpdateEffect(() => {
      if (unparsedValue !== '' && !Number.isNaN(+unparsedValue)) {
        setUnparsedValue(value.toString());
      }
    }, [value]);

    return (
      <Input
        type="number"
        value={unparsedValue}
        onChange={onChange}
        {...props}
      />
    );
  },
);
