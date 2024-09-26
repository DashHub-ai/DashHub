import { flattenMessagesList, type ValidationError } from '@under-control/forms';
import clsx from 'clsx';
import {
  Children,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from 'react';

type Props = PropsWithChildren & {
  className?: string;
  label?: ReactNode;
  errors?: Array<FormFieldError>;
  showErrorsAfterBlur?: boolean;
};

export function FormField(
  {
    className,
    errors = [],
    label,
    showErrorsAfterBlur = true,
    children,
  }: Props,
) {
  const [errorsEnabled, setErrorsEnabled] = useState<boolean>(
    !showErrorsAfterBlur,
  );

  const onErrorsEnable = () => {
    setTimeout(() => {
      setErrorsEnabled(true);
    }, 250);
  };

  // eslint-disable-next-line react/no-children-map
  const mappedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return null;
    }

    if ('className' in child.props) {
      // eslint-disable-next-line react/no-clone-element
      return cloneElement(child as any, {
        className: clsx(
          child.props.className,
          errorsEnabled && errors.length > 0 && 'uk-form-danger',
        ),
      });
    }

    return child;
  });

  return (
    <div className={clsx('space-y-1.5', className)}>
      {label && (
        <label
          className={clsx(
            'uk-form-label uk-text-danger',
            errorsEnabled && errors.length > 0 && 'uk-text-danger',
          )}
        >
          {label}
        </label>
      )}

      <div
        className="uk-form-controls"
        {...(showErrorsAfterBlur && {
          onBlurCapture: onErrorsEnable,
        })}
      >
        {mappedChildren}
      </div>

      {errorsEnabled && errors.flatMap(normalizeFormFieldError).map(error => (
        <p key={error} className="uk-form-help uk-text-danger">
          {error}
        </p>
      ))}
    </div>
  );
}

function normalizeFormFieldError(error: FormFieldError): string[] {
  if (typeof error === 'string') {
    return [error];
  }

  if ('messages' in error) {
    return flattenMessagesList([error]);
  }

  return [];
}

type FormFieldError =
  | string
  | ValidationError<any>;
