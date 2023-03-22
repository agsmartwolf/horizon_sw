/**
 * Returns an array of the keys of the given object. This is a TypeScript implementation of
 * the built-in `Object.keys` function.
 *
 * @template Obj - The type of the object.
 * @param {Obj} obj - The object to get the keys of.
 * @returns {(keyof Obj)[]} An array of the keys of the given object.
 */
export const objectKeys = <Obj>(obj: Record<string, any>): (keyof Obj)[] =>
  Object.keys(obj) as (keyof Obj)[];

const REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

export function deepMerge<
  T extends Object & { [key: string]: any },
  U extends Object & { [k: string]: any },
>(target: T, source: U): T & U & { [k: string]: any } {
  const output = Object.assign({}, target) as T & U;
  if (isMergeableObject(target) && isMergeableObject(source)) {
    Object.keys(source).forEach(key => {
      if (isMergeableObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else
          (output as Object & { [k: string]: any })[key] = deepMerge(
            target[key],
            source[key],
          );
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isMergeableObject(value: any): boolean {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value: any): boolean {
  return !!value && typeof value === 'object';
}

function isSpecial(value: any): boolean {
  const stringValue = Object.prototype.toString.call(value);

  return (
    stringValue === '[object RegExp]' ||
    stringValue === '[object Date]' ||
    isReactElement(value)
  );
}

function isReactElement(value: any): boolean {
  return value.$$typeof === REACT_ELEMENT_TYPE;
}
