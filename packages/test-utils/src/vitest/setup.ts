import "@testing-library/jest-dom";
import { vi } from "vitest";
import { mockBrowserAPIs, mockReactIcons } from "../mocks";

/**
 * Setup Vitest test environment with common mocks
 * Call this in your vitest.config setupFiles array
 */
export function setupVitest() {
  // Setup browser API mocks
  mockBrowserAPIs(vi);

  // Setup React component mocks
  mockReactIcons(vi);
}

// Auto-setup if imported directly
setupVitest();
