import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the directory where Next.js is located
  dir: "./",
});

const customJestConfig: Config = {
  // Automatically clear mock calls, instances, and results before each test
  clearMocks: true,
  // Collect coverage data
  collectCoverage: true,
  // Directory where coverage information is collected
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // Specify test environment for running tests
  testEnvironment: "jsdom",
  // Configure transformers for handling TypeScript
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // Map module directories and files
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Setup files to be run after the environment has been set up for each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Look for test files with .test.ts or .test.tsx extensions in the __tests__ directory
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};

export default createJestConfig(customJestConfig);
