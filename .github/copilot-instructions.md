# Copilot Instructions for Restful-Booker API Tests

## Project Overview

API test automation framework for [Restful-Booker API](https://restful-booker.herokuapp.com) using Playwright. Targets booking management with token-based and basic authentication.

## Architecture

### Directory Structure

```
src/services/       → Service layer (API abstractions extending BaseService)
src/types/          → Zod schemas and TypeScript types (re-exported via index.ts)
common/constants/   → HTTP status codes, error messages (re-exported via index.ts)
common/utils/       → ServiceFactory for dependency injection
common/fixtures.ts  → Playwright fixtures (serviceFactory, requestContext)
tests/              → Playwright test specs
tests/data/         → Test data files (e.g., getbookingids.data.ts)
.auth/              → Token storage (token.json - gitignored)
```

### Service Layer Pattern

All services extend `BaseService` and are instantiated via `ServiceFactory`:

```typescript
// ✅ Correct: Use ServiceFactory
const factory = new ServiceFactory(baseURL, requestContext);
const authService = factory.createAuthService();

// ❌ Wrong: Direct instantiation
const authService = new AuthService(baseURL, requestContext);
```

### Adding New Services

1. Create service in `src/services/` extending `BaseService`
2. Add factory method in `common/utils/service.factory.ts`
3. Add error messages to `common/constants/error-messages.ts`

```typescript
// src/services/booking.service.ts
export class BookingService extends BaseService {
  async getBooking(id: number): Promise<Booking> {
    const response = await this.requestContext.get(`${this.baseURL}/booking/${id}`);
    // Always use ErrorMessages constants
    if (!response.ok()) throw new Error(`${ErrorMessages.BOOKING.NOT_FOUND}`);
    return response.json();
  }
}
```

## Conventions

### Imports

- Use barrel exports: `import { HttpStatus, ErrorMessages } from '../common/constants'`
- Use fixtures: `import { test, expect } from '../common/fixtures'`

### Test Structure (Using Fixtures)

Tests use custom fixtures from `common/fixtures.ts` for automatic setup/cleanup:

```typescript
import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';

test('should return 201 status when API is healthy', async ({ serviceFactory }) => {
  const healthService = serviceFactory.createHealthService();
  const response = await healthService.ping();

  expect(response.status()).toBe(HttpStatus.CREATED);
});
```

### Schema Validation with Zod

Use Zod schemas from `src/types/` for runtime response validation:

```typescript
import { GetBookingIdsResponseSchema } from '../src/types';

const bookings = await bookingService.getBookingIds();
const result = GetBookingIdsResponseSchema.safeParse(bookings);
expect(result.success).toBeTruthy();
```

### Test Data Management

Store test data in `tests/data/` folder, not inline in specs:

```typescript
// tests/data/getbookingids.data.ts
export const validFilters = {
  byFirstname: { firstname: 'John' } as GetBookingIdsParams,
};

// tests/getbookingids.spec.ts
import { validFilters } from './data/getbookingids.data';
const bookings = await service.getBookingIds(validFilters.byFirstname);
```

### Error Handling

- Always use `ErrorMessages` constants, never hardcoded strings
- Services throw errors; tests catch and assert

### Authentication

- Token stored in `.auth/token.json` via `auth.spec.ts` setup
- Credentials from environment: `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`

## Code Quality

### Pre-commit Hooks (Husky + lint-staged)

Code is automatically linted and formatted on commit via `.husky/pre-commit`:

- **TypeScript/JavaScript**: ESLint fix + Prettier format
- **JSON/Markdown**: Prettier format only

### ESLint Configuration

[eslint.config.mjs](../eslint.config.mjs) uses flat config with:

- `typescript-eslint` for TypeScript rules
- `eslint-plugin-playwright` for test-specific rules
- `eslint-config-prettier` to avoid conflicts

**Note**: `no-empty-pattern` is disabled for `common/fixtures.ts` - Playwright fixtures require empty object destructuring `{}`.

### Prettier Configuration

[.prettierrc](../.prettierrc): single quotes, 2-space tabs, trailing commas, 100 char width.

## Commands

```bash
# Testing
npx playwright test                    # Run all tests
npx playwright test health.spec.ts     # Run specific test
npx playwright test --ui               # Interactive UI mode

# Code Quality
npm run lint                           # Check ESLint issues
npm run lint:fix                       # Auto-fix ESLint issues
npm run format                         # Format all files
npm run format:check                   # Check formatting
```

## Key Files

- [playwright.config.ts](../playwright.config.ts) - baseURL, test settings
- [common/fixtures.ts](../common/fixtures.ts) - Custom Playwright fixtures
- [common/utils/service.factory.ts](../common/utils/service.factory.ts) - Service instantiation
- [src/services/base.service.ts](../src/services/base.service.ts) - Base class for all services
- [src/types/booking.types.ts](../src/types/booking.types.ts) - Zod schemas example
- [eslint.config.mjs](../eslint.config.mjs) - ESLint flat config
- [.prettierrc](../.prettierrc) - Prettier formatting rules
