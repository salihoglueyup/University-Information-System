# Testing

This document describes the testing strategy, existing test coverage, and testing tools used in UBIS.

## Testing Stack

| Layer | Tool | Version | Purpose |
|-------|------|---------|---------|
| **Backend Unit/Integration** | Jest | 30.x | Test runner + assertions |
| **Backend HTTP** | Supertest | 7.x | HTTP endpoint testing |
| **Frontend E2E** | Cypress | 15.x | End-to-end browser testing |
| **CI Integration** | GitHub Actions | — | Automated test execution |

## Test Commands

### Backend

```bash
cd server

# Run all tests
npm test

# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- auth.test.js

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Jest configuration:**
- `--detectOpenHandles`: Detects open handles preventing Jest from exiting
- `--forceExit`: Forces Jest to exit after tests complete

### Frontend

```bash
cd client

# Open Cypress UI
npx cypress open

# Headless run
npx cypress run
```

## Existing Test Files

### Backend Tests (`server/tests/`)

| File | Tests | Description |
|------|-------|-------------|
| `app.test.js` | Basic app tests | Server startup, health check |
| `auth.test.js` | Auth flow tests | Login, register, token validation |
| `authMiddleware.test.js` | Middleware tests | verifyToken, verifyRole, restrictTo |
| `errorHandler.test.js` | Error handling | All error types (Mongoose, Zod, JWT, CSRF) |
| `paymentService.test.js` | Payment service | Payment logic, tuition, transactions |
| `userService.test.js` | User service | User CRUD operations |
| `validate.test.js` | Validation | Zod schema validation middleware |
| `secureUploads.test.js` | Upload security | File upload access control |

### Test Coverage Summary

| Category | Files | Tests | Coverage |
|----------|-------|-------|----------|
| Controllers | 23 | 0 direct | ⚠️ Not tested |
| Services | 22 | 2 tested | ⚠️ Low |
| Middleware | 7 | 4 tested | ✅ Good |
| Models | 22 | 0 direct | ⚠️ Not tested |
| Routes | 23 | 1 tested | ⚠️ Low |
| **Total** | **97** | **8 files** | **~8%** |

## CI Integration

Tests run automatically on every push/PR to `main`:

```yaml
# .github/workflows/ci.yml
server:
  steps:
    - npm ci
    - npm run lint
    - npm test    # Jest with --detectOpenHandles --forceExit
```

## Test Patterns

### Middleware Testing Example

```javascript
// tests/authMiddleware.test.js
describe('verifyToken', () => {
    it('should return 401 if no token provided', () => {
        const req = { headers: {} };
        const res = {};
        const next = jest.fn();
        
        verifyToken(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401 })
        );
    });
});
```

### Error Handler Testing Example

```javascript
// tests/errorHandler.test.js
describe('errorHandler', () => {
    it('should handle Mongoose duplicate key error', () => {
        const err = { code: 11000, errmsg: 'duplicate key "test@mail.com"' };
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
```

## Recommended Improvements

### Priority Test Areas

| Priority | Area | Reason |
|----------|------|--------|
| 🔴 P0 | Auth controller integration tests | Critical security path |
| 🔴 P0 | Grade service tests | Core academic functionality |
| 🟡 P1 | Payment service (existing) | Financial accuracy |
| 🟡 P1 | Student service tests | Data integrity |
| 🟢 P2 | Search service tests | Search accuracy |
| 🟢 P2 | Cypress critical paths | Login → dashboard → grades |

### Coverage Target

| Current | Target | Timeline |
|---------|--------|----------|
| ~8% | 40% | Phase 1 (core services) |
| 40% | 60% | Phase 2 (controllers + integration) |
| 60% | 80% | Phase 3 (E2E + edge cases) |
