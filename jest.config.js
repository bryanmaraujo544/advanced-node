/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/main/**/*",
        "!<rootDir>/src/**/index.ts",
    ],
    coverageDirectory: "coverage",
    coverageProvider: "babel",
    moduleNameMapper: {
        "@/tests/(.+)": "<rootDir>/tests/$1",
        "@/(.+)": "<rootDir>/src/$1",
    },
    testMatch: ["**/*.spec.ts"],
    roots: ["<rootDir>/tests", "<rootDir>/src"],
    transform: {
        "\\.ts$": "ts-jest",
    },
    clearMocks: true,
};

module.exports = config;
