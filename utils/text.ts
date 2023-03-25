export const wrapWithCurlyBraces = (arg: string) => `{${arg}}`;

export const parseTextWithVariables = (
  text: string,
  variables: Record<string, string>,
) => {
  const variablesKeys = Object.keys(variables);

  variablesKeys.forEach(key => {
    const variableText = wrapWithCurlyBraces(key);
    if (text.includes(variableText)) {
      text = text.replaceAll(variableText, variables[key]);
    }
  });

  return text;
};

export const fallbackString = (
  text: string | undefined | null,
  fallback = '',
) => {
  if (text === null || text === undefined) {
    return fallback;
  }

  return text;
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
