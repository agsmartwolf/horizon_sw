/**
 * Access a property of an object by string path.
 *
 * Example:
 * ```ts
 * const obj = {
 *  a: { b: { c: 'hello' } }
 * }
 * const result = getProperty(obj, 'a.b.c');
 * // result = 'hello'
 * ```
 */
export const getProperty = (obj: object, path: string) =>
  path.split('.').reduce<unknown>((prev, current) => {
    if (!prev || typeof prev !== 'object' || Object.keys(obj).length === 0)
      return undefined;

    return prev[current as keyof typeof prev];
  }, obj ?? {});

/**
 * Set a property inside an object using a string path.
 *
 * Example:
 * ```ts
 * const obj = {}
 * setProperty(obj, 'a.b.c.0', 'hello');
 * // obj = { a: { b: { c: [ 'hello' ] } } }
 * ```
 */
export const setProperty = (obj: object, path: string, value: unknown) => {
  // Split the path into an array of keys
  const keys = path.split('.');

  // Get the last key in the path
  const last = keys[keys.length - 1] as keyof object;

  // Iterate over the keys and create the missing nested properties, skipping the last key
  const parent = keys.slice(0, -1).reduce<unknown>((acc, current, index) => {
    // Access the current property's value
    const value = (acc as Record<string, unknown> | undefined)?.[current];

    const doesValueExist = !!value && typeof value === 'object';

    if (doesValueExist) return value;

    const nextKey = keys[index + 1];

    // Check if the next key is a number
    const isArray = !isNaN(Number(nextKey));

    // Create the new property
    const newValue = isArray ? [] : {};

    // Set the property
    (acc as Record<string, unknown>)[current] = newValue;

    return newValue;
  }, obj) as object;

  // Set the last property of the path to the value
  parent[last] = value as object[keyof object];

  // Return the root object
  return obj as Record<string, unknown>;
};

export function generateId() {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
}

module CaseTransform {
  export type Snake = Lowercase<`${string}_${string}`>;
  export type Camel =
    | Capitalize<string>
    | `${Capitalize<string>}${Capitalize<string>}`;

  export type SnakeToCamel<S extends string> =
    S extends `${infer Start}_${infer Rest}`
      ? `${Start}${Capitalize<SnakeToCamel<Rest>>}`
      : S;

  export function capitalize<S extends string>(string: S): Capitalize<S> {
    if (string.length === 0) return '' as never;

    return (string[0].toUpperCase() + string.slice(1)) as never;
  }
  export function snakeToCamel<S extends string>(string: S): SnakeToCamel<S> {
    const [start, ...rest] = string.split('_');

    return (start + rest.map(capitalize)) as never;
  }
}

export module ObjectTransform {
  export function snakeToCamel<O extends object, K extends keyof O>(
    object: O,
  ): {
    [P in K as P extends CaseTransform.Snake
      ? CaseTransform.SnakeToCamel<P>
      : P]: O[P];
  } {
    return Object.entries(object).reduce(
      (result, [key, value]) => ({
        ...result,
        [CaseTransform.snakeToCamel(key)]: value,
      }),
      {},
    ) as never;
  }
}
