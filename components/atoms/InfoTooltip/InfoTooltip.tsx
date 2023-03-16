import React, { startTransition, useMemo, useState } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
// import { Icon } from '@iconify/react';
import { Transition } from '@headlessui/react';

export interface InfoTooltipProps {
  text: string;
  iconClass?: string;
  hideArrow?: boolean;
  showIconAboveCustomTrigger?: boolean;
  customTrigger?: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  hideArrow = false,
  customTrigger,
  iconClass = '',
}) => {
  const [open, setOpen] = useState(false);

  const toolTipEvents = useMemo(
    () => ({
      onPointerEnter: !customTrigger
        ? undefined
        : () =>
            startTransition(() => {
              setOpen(true);
            }),
      onPointerLeave: !customTrigger
        ? undefined
        : () =>
            startTransition(() => {
              setOpen(false);
            }),
    }),
    [customTrigger],
  );
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open}>
        <TooltipPrimitive.Trigger
          type="button"
          className="flex w-fit"
          {...toolTipEvents}>
          {customTrigger ?? (
            <svg
              viewBox="0 0 11 11"
              xmlns="http://www.w3.org/2000/svg"
              onPointerEnter={() =>
                startTransition(() => {
                  setOpen(true);
                })
              }
              onPointerLeave={() =>
                startTransition(() => {
                  setOpen(false);
                })
              }
              className={`${iconClass}`}
              width={11}
              height={11}>
              <rect
                x="0.5"
                y="0.5"
                width="10"
                height="10"
                fill="#FFFFFF"
                stroke="inherit"
              />
              <path
                fill="inherit"
                stroke="none"
                d="M5.25 9V3.71H5.99V9H5.25ZM4.4 4.31V3.71H5.99V4.31H4.4ZM5.41 2.73C5.23 2.73 5.09333 2.68333 5 2.59C4.91333 2.49 4.87 2.36667 4.87 2.22C4.87 2.07333 4.91333 1.95333 5 1.86C5.09333 1.76 5.23 1.71 5.41 1.71C5.59 1.71 5.72333 1.76 5.81 1.86C5.89667 1.95333 5.94 2.07333 5.94 2.22C5.94 2.36667 5.89667 2.49 5.81 2.59C5.72333 2.68333 5.59 2.73 5.41 2.73Z"
              />
            </svg>
          )}
        </TooltipPrimitive.Trigger>
        <Transition.Root show={open}>
          <TooltipPrimitive.Content>
            <Transition.Child
              className="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100">
              <div className="max-w-[10rem] rounded-lg bg-body px-2 py-1.5 text-sm text-white">
                {!hideArrow && (
                  <TooltipPrimitive.Arrow
                    width={19}
                    height={9.5}
                    offset={6}
                    className="fill-body"
                  />
                )}
                {text}
              </div>
            </Transition.Child>
          </TooltipPrimitive.Content>
        </Transition.Root>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default InfoTooltip;
