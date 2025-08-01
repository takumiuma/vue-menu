# CI Setup

This project includes a comprehensive GitHub Actions CI pipeline with the following features:

## Workflow Jobs

### 1. ESLint
- Runs ESLint with Vue and TypeScript support
- Uses `@nuxt/eslint-config` for Nuxt-specific rules
- Command: `yarn lint`

### 2. TypeScript Type Check
- Runs static type analysis with vue-tsc
- Ensures type safety across Vue components and TypeScript files
- Command: `yarn type-check`

### 3. Unit Tests (Vitest)
- Fast unit testing with Vitest
- Configured for Vue components with jsdom environment
- Command: `yarn test:run`

### 4. Security Audit
- Checks for known vulnerabilities in dependencies
- Uses `yarn audit` with moderate level threshold
- Command: `yarn audit`

### 5. Build Verification
- Ensures the application builds successfully
- Uploads build artifacts for potential deployment
- Command: `yarn build`

### 6. E2E Tests (Playwright)
- Smoke tests to verify application loads without errors
- Tests key user flows and page functionality
- Command: `yarn test:e2e`

### 7. CodeQL Security Analysis
- GitHub's advanced security analysis
- Scans for security vulnerabilities and code quality issues
- Automatically runs on push and PR events

## Triggers

The CI workflow runs on:
- Push to `main` and `develop` branches
- Pull requests targeting `main` and `develop` branches

## Local Development

All CI checks can be run locally:

```bash
# Install dependencies
yarn install

# Run linting
yarn lint

# Run type checking
yarn type-check

# Run unit tests
yarn test

# Run E2E tests (requires dev server)
yarn dev # in one terminal
yarn test:e2e # in another terminal

# Build the application
yarn build

# Check for vulnerabilities
yarn audit
```

## Additional Tools Available

- **Prettier**: Code formatting (`yarn format`)
- **Test UI**: Interactive test runner (`yarn test:ui`)
- **Coverage**: Test coverage reporting (`yarn test:coverage`)