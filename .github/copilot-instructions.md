# Copilot Instructions for Restful-Booker API Tests

## Project Overview

API test automation framework for [Restful-Booker API](https://restful-booker.herokuapp.com) using Playwright. Features token-based authentication, faker.js test data generation, Allure reporting, and GitHub Actions CI with parallel test execution.

## Architecture

### Directory Structure

```
src/services/       → Service layer (API abstractions extending BaseService)
src/types/          → Zod schemas and TypeScript types (re-exported via index.ts)
common/constants/   → HTTP status codes, error messages (re-exported via index.ts)
common/utils/       → ServiceFactory + TestDataFactory
common/fixtures.ts  → Worker-scoped Playwright fixtures (serviceFactory, testDataFactory, authToken)
tests/              → Playwright test specs
.auth/              → Token storage (token.json - gitignored)
.github/workflows/  → CI/CD pipeline (playwright.yml)
```

### Service Layer Pattern

All services extend `BaseService` and are instantiated via `ServiceFactory`:

```typescript
// ✅ Correct: Use fixtures in beforeAll
let bookingService: GetBookingIdsService;

test.beforeAll(({ serviceFactory }) => {
  bookingService = serviceFactory.createGetBookingIdsService();
});

// ❌ Wrong: Direct instantiation
const service = new GetBookingIdsService(baseURL, requestContext);
```

### Adding New Services

1. Create service in `src/services/` extending `BaseService`
2. Add factory method in `common/utils/service.factory.ts`
3. Add error messages to `common/constants/error-messages.ts`

## Test Data with TestDataFactory

**No hardcoded test data.** Use `TestDataFactory` (faker.js) via fixture:

```typescript
let testData: TestDataFactory;

test.beforeAll(({ serviceFactory, testDataFactory }) => {
  bookingService = serviceFactory.createGetBookingIdsService();
  testData = testDataFactory;
});

test('example', async () => {
  const booking = testData.createBookingTestData(); // Full booking
  const params = testData.createFirstnameFilterTestData(); // Filter with firstname only
});
```

### Factory Method Naming

- All methods end with `TestData` suffix
- Purpose-specific methods (not generic with overrides):
  - `createBookingTestData()` - complete booking
  - `createMinimalBookingTestData()` - without optional fields
  - `createFirstnameFilterTestData()` - filter params with firstname only
  - `createDateRangeFilterTestData()` - filter params with checkin/checkout

### Parameterized Tests (Static Data)

For parameterized tests at module load time, use static methods:

```typescript
// Static method - doesn't use faker, runs before fixtures available
const invalidFormats = TestDataFactory.getInvalidDateFormatsTestData();

for (const { description, params } of invalidFormats) {
  test(`should fail for ${description}`, async () => { ... });
}
```

## Conventions

### Imports

- Barrel exports: `import { HttpStatus, ErrorMessages } from '../common/constants'`
- Fixtures: `import { test, expect } from '../common/fixtures'`
- Types: `import { Booking, BookingWithIdSchema } from '../src/types'`

### Test Structure

```typescript
import { test, expect } from '../common/fixtures';

let bookingService: CreateBookingService;
let testData: TestDataFactory;

test.beforeAll(({ serviceFactory, testDataFactory }) => {
  bookingService = serviceFactory.createCreateBookingService();
  testData = testDataFactory;
});

test.describe('Feature - category', () => {
  test('should do something', async () => {
    const data = testData.createBookingTestData();
    const result = await bookingService.createBooking(data);
    expect(result.bookingid).toBeGreaterThan(0);
  });
});
```

### Schema Validation with Zod

```typescript
import { BookingWithIdSchema } from '../src/types';

const response = await bookingService.createBooking(data);
const result = BookingWithIdSchema.safeParse(response);
expect(result.success).toBeTruthy();
```

### Error Handling

- Always use `ErrorMessages` constants, never hardcoded strings
- Services throw errors; tests catch and assert

## Authentication

Token-based auth available as worker-scoped fixture:

```typescript
// Use authToken fixture for authenticated requests (future update/delete tests)
test.beforeAll(({ serviceFactory, authToken }) => {
  updateService = serviceFactory.createUpdateBookingService();
  token = authToken;
});
```

- `authToken` fixture authenticates once per worker, caches token
- Credentials from environment: `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`
- Use `.env` file for local credentials
- In CI: Set as GitHub repository secrets

## Reporting & CI/CD

### Allure Reports

```bash
npm run test:allure      # Run tests with Allure reporter
npm run allure:generate  # Generate HTML report
npm run allure:open      # Open report in browser
npm run allure:report    # Generate and open (combines above two)
```

- Allure reporter enabled in CI automatically
- Reports published to GitHub Pages after each push to main/master
- View live reports at: `https://<username>.github.io/<repo-name>/`

### GitHub Actions Pipeline

Pipeline runs on push/PR with 3 jobs:

1. **test** - Runs tests in parallel (4 shards)
   - Linting must pass first (fails pipeline if errors)
   - Each shard uploads traces on failure
   - Each shard uploads Allure results

2. **generate-report** - Merges all shard results
   - Downloads Allure results from all shards
   - Generates unified HTML report
   - Uploads as artifact

3. **deploy-report** - Publishes to GitHub Pages (push only)
   - Downloads generated report
   - Deploys to GitHub Pages

**Traceability**: Failed tests generate Playwright traces available as artifacts

**Configuration**: `.github/workflows/playwright.yml`

## Code Quality

### Pre-commit Hooks (Husky + lint-staged)

Code is automatically linted and formatted on commit.

### ESLint Notes

- `no-empty-pattern` disabled for `common/fixtures.ts` (Playwright requires `{}`)
- `varsIgnorePattern: '^_'` allows unused destructured variables starting with `_`
- `eslint-plugin-playwright` for test-specific rules

## Commands

```bash
# Local Testing
npx playwright test                    # Run all tests
npx playwright test health.spec.ts     # Run specific test
npx playwright test --ui               # Interactive UI mode
TEST_SEED=12345 npx playwright test    # Reproducible test data

# Reporting
npm run test:allure                    # Run with Allure reporter
npm run allure:report                  # Generate and view report

# Code Quality
npm run lint                           # Check linting
npm run lint:fix                       # Auto-fix ESLint issues
npm run format                         # Format all files
```

## Key Files

- [common/fixtures.ts](../common/fixtures.ts) - Worker-scoped fixtures (serviceFactory, testDataFactory, authToken)
- [common/utils/service.factory.ts](../common/utils/service.factory.ts) - Service instantiation
- [common/utils/testdata.factory.ts](../common/utils/testdata.factory.ts) - Dynamic test data generation with faker.js
- [src/types/booking.types.ts](../src/types/booking.types.ts) - Zod schemas (BookingSchema, BookingWithIdSchema)
- [.github/workflows/playwright.yml](../.github/workflows/playwright.yml) - CI/CD pipeline with sharding and Pages deployment
- [playwright.config.ts](../playwright.config.ts) - Allure reporter config, trace settings
