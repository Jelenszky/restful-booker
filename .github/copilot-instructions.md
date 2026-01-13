# Copilot Instructions for Restful-Booker API Tests

## Project Overview
API test automation framework for [Restful-Booker API](https://restful-booker.herokuapp.com) using Playwright. Targets booking management with token-based and basic authentication.

## Architecture

### Directory Structure
```
src/services/       → Service layer (API abstractions extending BaseService)
common/constants/   → HTTP status codes, error messages (re-exported via index.ts)
common/utils/       → ServiceFactory for dependency injection
tests/              → Playwright test specs
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
- Get baseURL from config: `const baseURL = config.use?.baseURL!`

### Error Handling
- Always use `ErrorMessages` constants, never hardcoded strings
- Services throw errors; tests catch and assert

### Test Structure
```typescript
test('description', async () => {
  const requestContext = await request.newContext();
  try {
    const factory = new ServiceFactory(baseURL, requestContext);
    // test logic
  } finally {
    await requestContext.dispose();  // Always cleanup
  }
});
```

### Authentication
- Token stored in `.auth/token.json` via `auth.spec.ts` setup
- Credentials from environment: `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`

## Commands
```bash
npx playwright test                    # Run all tests
npx playwright test health.spec.ts     # Run specific test
npx playwright test --ui               # Interactive UI mode
```

## Key Files
- [playwright.config.ts](../playwright.config.ts) - baseURL, test settings
- [common/utils/service.factory.ts](../common/utils/service.factory.ts) - Service instantiation
- [src/services/base.service.ts](../src/services/base.service.ts) - Base class for all services
