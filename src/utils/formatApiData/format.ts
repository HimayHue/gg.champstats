export const toTitleCase = (value: string) =>
   value
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());