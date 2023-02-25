import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Popover, Transition } from '@headlessui/react';
import { OPTION_INPUT_TYPE, ProductOption } from 'types/shared/products';
import { Action, ACTIONS, ReducerState } from 'hooks/useProductSelection';
import Button from '../Button';
import { BUTTON_STYLE, BUTTON_TYPE } from 'types/shared/button';
import ArrowLeft from 'assets/icons/arrow-left.svg';
import UnfilledTick from 'assets/icons/unfilled-tick.svg';
import OptionSelectGrid from 'components/atoms/OptionSelectGrid';
import ToggleSmall from 'components/molecules/ToggleSmall';
import useCurrency from 'stores/currency';
import type { AddToCartConfig } from 'stores/cart';
import ProductColorSelect from '../ProductColorSelect';
import { addStockOptionData } from '../../../lib/utils/products';
import type {
  SwellProductPurchaseOptions,
  SwellProductVariant,
} from '../../../lib/graphql/generated/sdk';

interface QuickAddProps {
  hoverableElement: (props: any) => JSX.Element;
  className?: string;
  focusOnRef: React.RefObject<HTMLElement>;
  productOptions: ProductOption[];
  state: ReducerState;
  dispatch: Dispatch<Action>;
  addToCart: (config?: AddToCartConfig) => Promise<void>;
  addToBagLabel: string;
  addedToBagLabel: string;
  nextLabel: string;
  quickAddLabel: string;
  stockLevel: number;
  productVariants: SwellProductVariant[];
  purchaseOptions: SwellProductPurchaseOptions;
}

const QuickAdd: React.FC<QuickAddProps> = ({
  hoverableElement: HoverableElement,
  className,
  focusOnRef,
  productOptions,
  productVariants,
  purchaseOptions,
  state,
  dispatch,
  addToCart,
  addToBagLabel,
  addedToBagLabel,
  nextLabel,
  quickAddLabel,
  stockLevel,
}) => {
  const formatPrice = useCurrency(store => store.formatPrice);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddStarted, setQuickAddStarted] = useState(false);
  const [added, setAdded] = useState(false);
  const [addLabel, setAddLabel] = useState(addToBagLabel);
  const [currentOption, setCurrentOption] = useState(productOptions[0]?.id);

  const optionsWithDisabledKey = useMemo(() => {
    const chosenOptionsValuesMap = new Map<string, string>();
    chosenOptionsValuesMap.set(
      currentOption,
      state.selectedProductOptions.get(currentOption) ?? '',
    );
    return addStockOptionData(
      productOptions,
      chosenOptionsValuesMap,
      purchaseOptions,
      productVariants,
      stockLevel,
    );
  }, [
    currentOption,
    state.selectedProductOptions,
    productOptions,
    purchaseOptions,
    productVariants,
    stockLevel,
  ]);

  const hasOptions = !!optionsWithDisabledKey.length;
  const panelRef = useRef(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isNextDisabled = useMemo(
    () =>
      // '' inputType represents gift-cards
      [OPTION_INPUT_TYPE.SELECT, ''].includes(
        optionsWithDisabledKey.find(option => option.id === currentOption)
          ?.inputType ?? 'invalid-string',
      ) && !state.selectedProductOptions.get(currentOption),
    [state, currentOption, optionsWithDisabledKey],
  );
  const addButtonLabel = useMemo(
    () =>
      addLabel === addToBagLabel ? (
        addLabel
      ) : (
        <>
          <span className="flex items-center justify-center">
            <UnfilledTick className="mr-2.5 w-5" />
            {addLabel}
          </span>
        </>
      ),
    [addLabel, addToBagLabel],
  );
  const currentOptionIndex = useMemo(
    () =>
      optionsWithDisabledKey.map(option => option.id).indexOf(currentOption),
    [currentOption, optionsWithDisabledKey],
  );

  const openQuickAdd = () => setQuickAddOpen(true);
  const closeQuickAdd = () => setQuickAddOpen(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isLastStep =
        currentOptionIndex === optionsWithDisabledKey?.length - 1 ||
        !hasOptions;

      if (isLastStep) {
        addToCart().then(() => {
          // We need to first hide the button & then change the label back
          setAdded(true);
          setAddLabel(addedToBagLabel);
          setTimeout(() => setAdded(false), 3000);
          setTimeout(() => setAddLabel(addToBagLabel), 4000);

          // Reset selection & current option
          dispatch({ type: ACTIONS.RESET_STATE, payload: undefined });
          setCurrentOption(optionsWithDisabledKey[0]?.id);
        });
        return;
      }

      setCurrentOption(optionsWithDisabledKey[currentOptionIndex + 1].id);
    },
    [
      currentOptionIndex,
      optionsWithDisabledKey,
      hasOptions,
      addToCart,
      addToBagLabel,
      addedToBagLabel,
      dispatch,
    ],
  );

  const renderOption = useCallback(
    (productOption: ProductOption) => {
      if (!productOption?.values?.length) {
        return null;
      }

      switch (productOption.attributeId) {
        case 'color': {
          return (
            <div className="mt-2 flex items-center justify-start gap-2 overflow-x-auto scrollbar-hidden flex-wrap">
              {productOption.values?.map(({ id, name, disabled }) => (
                <ProductColorSelect
                  key={id}
                  name={productOption.name || productOption.attributeId}
                  value={id}
                  label={name}
                  onChange={(valueId: string) =>
                    dispatch({
                      type: ACTIONS.SET_SELECTED_PRODUCT_OPTIONS,
                      payload: { optionId: productOption.id, valueId },
                    })
                  }
                  active={
                    state.selectedProductOptions.get(productOption.id) === id
                  }
                  disabled={disabled}
                />
              ))}
            </div>
          );
        }
        default: {
        }
      }

      if (productOption?.inputType === '') {
        return (
          <OptionSelectGrid
            attributeId={productOption.attributeId}
            name={productOption.name}
            active={productOption.active}
            values={productOption.values}
            value={state.selectedProductOptions.get(productOption.id) ?? ''}
            onChange={valueId =>
              dispatch({
                type: ACTIONS.SET_SELECTED_PRODUCT_OPTIONS,
                payload: {
                  optionId: productOption.id,
                  valueId,
                },
              })
            }
          />
        );
      }

      switch (productOption.inputType) {
        case OPTION_INPUT_TYPE.SELECT:
          return (
            <OptionSelectGrid
              attributeId={productOption.attributeId}
              name={productOption.name}
              active={productOption.active}
              values={productOption.values}
              value={state.selectedProductOptions.get(productOption.id) ?? ''}
              onChange={valueId =>
                dispatch({
                  type: ACTIONS.SET_SELECTED_PRODUCT_OPTIONS,
                  payload: {
                    optionId: productOption.id,
                    valueId,
                  },
                })
              }
            />
          );
        case OPTION_INPUT_TYPE.TOGGLE:
          return productOption?.values?.map(value => (
            <ToggleSmall
              key={value.id}
              name={productOption.name}
              checked={state.selectedProductOptions.has(productOption.id)}
              priceDifference={value.price}
              priceFormatter={formatPrice}
              onChange={() => {
                dispatch({
                  type: ACTIONS.TOGGLE_PURCHASE_OPTION,
                  payload: {
                    optionId: productOption.id,
                    valueId: value.id,
                  },
                });
              }}
            />
          ));
        default:
          return null;
      }
    },
    [dispatch, state.selectedProductOptions, formatPrice],
  );

  // Since close() function cannot be exposed outside the Popover,
  // we need to trigger the sr-only (hidden) close button
  useEffect(() => {
    if (added && closeButtonRef) {
      closeButtonRef.current?.click();
    }
  }, [added, closeButtonRef]);

  useEffect(() => {
    if (!quickAddOpen) {
    } else {
    }
  }, [quickAddOpen]);

  return (
    <Popover className={className} as="form" onSubmit={handleSubmit}>
      {({ open, close }) => (
        <>
          <HoverableElement
            onMouseEnter={() => {
              if (!open) {
                openQuickAdd();
              }
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              closeQuickAdd();
              if (open && e.relatedTarget !== panelRef.current) {
                close(focusOnRef);
              }
            }}
            onFocus={() => {
              if (!open) {
                openQuickAdd();
              }
            }}
            onBlur={(e: React.FocusEvent) => {
              closeQuickAdd();
              if (open && e.relatedTarget !== panelRef.current) {
                close(focusOnRef);
              }
            }}
          />
          {hasOptions ? (
            <>
              <Transition
                show={quickAddOpen}
                enter="transition-[opacity,_max-height] duration-800 ease-linear"
                enterFrom="opacity-0 max-h-0"
                enterTo="opacity-100 max-h-112"
                leave="transition-[opacity,_max-height] duration-400 ease-linear"
                leaveFrom="opacity-100 max-h-112"
                leaveTo="opacity-0 max-h-0">
                <Popover.Panel
                  static
                  className="absolute bottom-4 left-4 right-4 hidden w-[calc(100%-32px)] bg-gray-100 p-4 shadow-2xl lg:block"
                  ref={panelRef}
                  onMouseEnter={openQuickAdd}
                  onMouseLeave={closeQuickAdd}
                  onFocus={openQuickAdd}
                  onBlur={closeQuickAdd}>
                  {quickAddStarted ? (
                    <>
                      <div className="grid grid-cols-1 grid-rows-1">
                        {optionsWithDisabledKey.map(
                          (productOption, index) =>
                            !!productOption?.values?.length && (
                              // Expanding/collapsing content wrapper
                              <div
                                ref={ref => {
                                  if (!ref) return;

                                  window.requestAnimationFrame(() => {
                                    if (productOption.id === currentOption) {
                                      ref.style.transitionDelay = '0ms';
                                      ref.style.maxHeight = `${ref.scrollHeight}px`;
                                    } else {
                                      ref.style.transitionDelay = '400ms';
                                      ref.style.maxHeight = `0px`;
                                    }
                                  });
                                }}
                                {...(productOption.id !== currentOption && {
                                  'aria-hidden': 'true',
                                })}
                                className={[
                                  'relative col-start-1 col-end-2 row-start-1 row-end-2 transition-[opacity,_max-height] duration-400 ease-linear',
                                  productOption.id === currentOption
                                    ? 'z-10 opacity-100'
                                    : 'z-0 opacity-0',
                                ].join(' ')}
                                key={productOption.id}>
                                {/* Back button */}
                                {index > 0 && (
                                  <div className="mb-4 border-b border-b-background-black-100 pb-2">
                                    <button
                                      className="flex items-center space-x-1.5 text-sm font-semibold"
                                      type="button"
                                      onClick={() =>
                                        setCurrentOption(
                                          optionsWithDisabledKey[0].id,
                                        )
                                      }>
                                      <ArrowLeft className="w-3" />
                                      <span>Back</span>
                                    </button>
                                  </div>
                                )}
                                {/* Option input form */}
                                {renderOption(productOption)}
                              </div>
                            ),
                        )}
                      </div>

                      <Button
                        elType={BUTTON_TYPE.BUTTON}
                        small
                        className="relative z-10 mt-4 w-full text-center"
                        type="submit"
                        disabled={isNextDisabled}>
                        {currentOptionIndex ===
                        optionsWithDisabledKey.length - 1
                          ? addLabel
                          : nextLabel}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setQuickAddStarted(true)}
                      elType={BUTTON_TYPE.BUTTON}
                      small
                      className="relative z-10 mt-4 w-full text-center"
                      type="button">
                      {quickAddLabel}
                    </Button>
                  )}
                </Popover.Panel>
              </Transition>
            </>
          ) : (
            <Transition
              show={!open && (quickAddOpen || added)}
              className="path-fill-black-100 hover:path-fill-black absolute bottom-4 left-4 right-4 z-30 hidden w-[calc(100%-32px)] text-center transition-opacity ease-in-out lg:inline-block"
              enter="transition-opacity duration-1800"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-800"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              as={Button}
              onMouseEnter={openQuickAdd}
              onMouseLeave={closeQuickAdd}
              onFocus={openQuickAdd}
              onBlur={closeQuickAdd}
              elType={BUTTON_TYPE.BUTTON}
              hasBorder={false}
              hasShadow
              buttonStyle={BUTTON_STYLE.SECONDARY}
              fullWidth
              type="submit">
              {addButtonLabel}
            </Transition>
          )}
          <Transition
            show={added}
            enter="transition-opacity duration-800"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-800"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="path-fill-black-100 hover:path-fill-black pointer-events-none absolute bottom-4 left-4 right-4 z-30 hidden w-[calc(100%-32px)] text-center transition-opacity ease-in-out lg:inline-block"
            as={Button}
            elType={BUTTON_TYPE.BUTTON}
            hasBorder={false}
            hasShadow
            fullWidth
            buttonStyle={BUTTON_STYLE.SECONDARY}>
            {addButtonLabel}
          </Transition>
          <button
            className="sr-only"
            type="button"
            onClick={() => close(focusOnRef)}
            ref={closeButtonRef}>
            Close quick add
          </button>
        </>
      )}
    </Popover>
  );
};

export default QuickAdd;
