// Note: jest types should be provided by the consuming project
// This is a type-only import that won't fail if jest isn't installed
type JestConfig = {
  moduleFileExtensions?: string[];
  rootDir?: string;
  testRegex?: string;
  transform?: Record<string, string>;
  collectCoverageFrom?: string[];
  coverageDirectory?: string;
  testEnvironment?: string;
  [key: string]: any;
};

export interface JestConfigOptions {
  /**
   * Root directory for tests
   * @default 'src'
   */
  rootDir?: string;
  /**
   * Test environment
   * @default 'node'
   */
  testEnvironment?: "node" | "jsdom";
  /**
   * Test file pattern
   * @default '.*\\.spec\\.ts$'
   */
  testRegex?: string;
  /**
   * Coverage directory
   * @default '../coverage'
   */
  coverageDirectory?: string;
  /**
   * Files to collect coverage from
   * @default matches TypeScript and JavaScript files
   */
  collectCoverageFrom?: string[];
}

/**
 * Get Jest configuration preset
 * @param options Configuration options
 * @returns Jest configuration
 */
export function getJestConfig(options: JestConfigOptions = {}): JestConfig {
  const {
    rootDir = "src",
    testEnvironment = "node",
    testRegex = ".*\\.spec\\.ts$",
    coverageDirectory = "../coverage",
    collectCoverageFrom = ["**/*.(t|j)s"],
    ...additionalConfig
  } = options;

  return {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir,
    testRegex,
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom,
    coverageDirectory,
    testEnvironment,
    ...additionalConfig,
  };
}
