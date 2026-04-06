/**
 * Class name utility function
 * Merges class names with clsx
 */
import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
