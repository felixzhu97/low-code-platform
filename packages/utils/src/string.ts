/**
 * String utility functions
 */

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, length: number, suffix: string = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Remove whitespace from both ends of string
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Remove whitespace from start of string
 */
export function trimStart(str: string): string {
  return str.trimStart();
}

/**
 * Remove whitespace from end of string
 */
export function trimEnd(str: string): string {
  return str.trimEnd();
}

/**
 * Pad string on the left
 */
export function padStart(
  str: string,
  length: number,
  padString: string = " "
): string {
  return str.padStart(length, padString);
}

/**
 * Pad string on the right
 */
export function padEnd(
  str: string,
  length: number,
  padString: string = " "
): string {
  return str.padEnd(length, padString);
}

/**
 * Generate a random string
 */
export function randomString(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
