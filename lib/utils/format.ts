export const formatRowHtmlFontStyles = (html?: string) =>
  html?.replace(/font-size:.*?;/g, '')?.replace(/font-family:.*?;/g, '');
