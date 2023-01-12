import React, { useCallback, useMemo, useState } from 'react';
import Input from 'components/atoms/Input';
import useClassNames from 'hooks/useClassNames';
import ValidationErrorText from 'components/atoms/ValidationErrorText';
import ArrowRight from 'assets/icons/arrow-right.svg';
import Button from '../../atoms/Button';
import { BUTTON_STYLE, BUTTON_TYPE } from '../../../types/shared/button';

export interface ActionInputProps extends React.AriaAttributes {
  id: string;
  onAction: (value: string) => void;
  small?: boolean;
  errorLabel?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  noValidate?: boolean;
  arrowHidden?: boolean;
  submitLabel?: string;
}

const ActionInput: React.FC<ActionInputProps> = ({
  id,
  errorLabel,
  onChange,
  onAction,
  value,
  defaultValue = '',
  noValidate,
  submitLabel = null,
  ...props
}) => {
  const inputClassNames = useClassNames({
    'border-error-dark': !!errorLabel,
  });

  const buttonClassNames = useClassNames(
    'absolute right-4 top-1/2 -translate-y-1/2',
    {
      'w-4': !props.small,
      'w-3': !!props.small,
      hidden: !!props.arrowHidden,
    },
  );

  const [inputValue, setInputValue] = useState(defaultValue);

  const changeValueHandler = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    e => {
      onChange?.(e);
      setInputValue(e.target.value);
    },
    [onChange],
  );

  const submitHandler = useCallback<React.FormEventHandler<HTMLFormElement>>(
    e => {
      e.preventDefault();
      onAction(value ?? inputValue);
    },
    [inputValue, onAction, value],
  );

  const inputProps = useMemo(() => {
    const c = { ...props };
    delete c.arrowHidden;
    return c;
  }, [props]);
  return (
    <form
      className="gap flex flex-col gap-1"
      onSubmit={submitHandler}
      noValidate={noValidate}>
      <div className="flex">
        {submitLabel && (
          <Button
            elType={BUTTON_TYPE.BUTTON}
            buttonStyle={BUTTON_STYLE.SECONDARY}
            className={''}
            type="submit"
            small={props.small}>
            {submitLabel}
          </Button>
        )}

        <div className="relative flex-grow">
          <Input
            aria-describedby={`${id}-error`}
            className={inputClassNames}
            inputClassname={'bg-black-100 text-gray-400'}
            value={value ?? inputValue}
            onChange={changeValueHandler}
            error={!!errorLabel}
            {...inputProps}
          />
          <button type="submit" className={buttonClassNames}>
            <ArrowRight className="stroke-green-100" />
          </button>
        </div>
      </div>
      {errorLabel && (
        <ValidationErrorText id={`${id}-error`}>
          {errorLabel}
        </ValidationErrorText>
      )}
    </form>
  );
};

export default ActionInput;
