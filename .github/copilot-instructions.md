# Copilot Instructions for Restful-Booker API Tests

## Project Overview

API test automation framework for [Restful-Booker API](https://restful-booker.herokuapp.com) using Playwright. Targets booking management with token-based and basic authentication.

## Architecture

### Directory Structure

```
src/services/       → Service layer (API abstractions extending BaseService)
src/types/          → Zod schemas and TypeScript types (re-exported via index.ts)
common/constants/   → HTTP status codes, error messages (re-exported via index.ts)
common/utils/       → ServiceFactory + TestDataFactory
common/fixtures.ts  → Worker-scoped Playwright fixtures
tests/              → Playwright test specs
.auth/              → Token storage (token.json - gitignored)
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
import { TestDataFactory } from '../common/utils/testdata.factory';

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

Token-based auth setup runs before tests via `auth.spec.ts`:

```typescript
// Credentials from environment variables
process.env.TEST_USER_USERNAME;
process.env.TEST_USER_PASSWORD;

// Token saved to .auth/token.json (gitignored)
```

- `AuthService.authenticate()` returns token string
- Token file created automatically by auth setup test
- Use `.env` file for local credentials

## Code Quality

### Pre-commit Hooks (Husky + lint-staged)

Code is automatically linted and formatted on commit.

### ESLint Notes

- `no-empty-pattern` disabled for `common/fixtures.ts` (Playwright requires `{}`)
- `eslint-plugin-playwright` for test-specific rules

## Commands

```bash
npx playwright test                    # Run all tests
npx playwright test health.spec.ts     # Run specific test
npx playwright test --ui               # Interactive UI mode
npm run lint:fix                       # Auto-fix ESLint issues
npm run format                         # Format all files
TEST_SEED=12345 npx playwright test    # Reproducible test data
```

## Key Files

- [common/fixtures.ts](../common/fixtures.ts) - Worker-scoped fixtures (serviceFactory, testDataFactory)
- [common/utils/service.factory.ts](../common/utils/service.factory.ts) - Service instantiation
- [common/utils/testdata.factory.ts](../common/utils/testdata.factory.ts) - Dynamic test data generation
- [src/types/booking.types.ts](../src/types/booking.types.ts) - Zod schemas
