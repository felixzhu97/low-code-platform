import { waitFor as rtlWaitFor } from "@testing-library/react";
import type { WaitForOptions } from "@testing-library/react";

/**
 * Enhanced waitFor utility with common timeout and error handling
 * @param callback Function to wait for
 * @param options Wait options
 * @returns Promise that resolves when callback passes
 */
export async function waitFor(
  callback: () => void | Promise<void>,
  options?: WaitForOptions
) {
  return rtlWaitFor(callback, {
    timeout: 5000,
    ...options,
  });
}

/**
 * Wait for element to be removed from DOM
 * @param element Element or function returning element
 * @param options Wait options
 */
export async function waitForElementToBeRemoved<T>(
  element: T | (() => T),
  options?: WaitForOptions
) {
  const { waitForElementToBeRemoved: rtlWaitForRemoval } = await import(
    "@testing-library/react"
  );
  return rtlWaitForRemoval(element, {
    timeout: 5000,
    ...options,
  });
}
