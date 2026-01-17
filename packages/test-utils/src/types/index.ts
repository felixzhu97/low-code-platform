/**
 * Common types for test utilities
 */

/**
 * Mock function type
 */
export type MockFunction = (...args: any[]) => any;

/**
 * Mock implementation type
 */
export type MockImplementation<T extends MockFunction> = (
  ...args: Parameters<T>
) => ReturnType<T>;

/**
 * Test environment type
 */
export type TestEnvironment = "jsdom" | "node";

/**
 * Vitest config type
 * Note: Actual type should come from 'vitest/config' in consuming projects
 */
export type VitestConfig = any;

/**
 * Jest config type
 * Note: Actual type should come from 'jest' in consuming projects
 */
export type JestConfig = any;
