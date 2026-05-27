# Contributing

Welcome to UBIS! This guide will help you set up your development environment and understand the contribution workflow.

## Development Setup

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **MongoDB** 7+ (local or Docker)
- **Git** 2.40+
- **Docker Desktop** (optional but recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/salihoglueyup/University-Information-System.git
cd ubis

# Option 1: Docker (recommended)
cd docker && cp .env.example .env && docker compose up -d

# Option 2: Manual
cd server && cp .env.example .env && npm install && npm run dev
cd ../client && npm install && npm run dev
```

### Recommended IDE Setup

**VSCode Extensions:**
- ESLint
- Tailwind CSS IntelliSense
- Prettier
- MongoDB for VS Code
- Thunder Client (API testing)
- Docker

---

## Project Structure

```
ubis/
├── client/          # React 19 SPA (Vite)
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Reusable UI components
│       ├── context/     # React contexts
│       ├── hooks/       # Custom hooks
│       ├── layouts/     # Page layouts
│       ├── pages/       # Page components
│       ├── store/       # Zustand state
│       └── utils/       # Utilities
├── server/          # Express 5 API
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Route definitions
│   ├── middleware/   # Express middleware
│   ├── utils/       # Shared utilities
│   ├── jobs/        # Cron tasks
│   ├── consumers/   # RabbitMQ consumers
│   ├── socket/      # Socket.io server
│   └── tests/       # Jest tests
├── docker/          # Docker configurations
├── k8s/             # Kubernetes manifests
├── scripts/         # Data generation scripts
└── docs/            # Documentation
```

---

## Development Workflow

### Branch Strategy

```
main                    # Production-ready code
├── feature/XYZ         # New features
├── fix/XYZ             # Bug fixes
├── docs/XYZ            # Documentation updates
└── refactor/XYZ        # Code refactoring
```

### Commit Messages

Follow **Conventional Commits**:

```
<type>(<scope>): <description>

feat(auth): add Google OAuth 2.0 login flow
fix(grades): correct GPA calculation rounding
docs(api): add missing payment endpoints
refactor(server): extract middleware to separate files
test(auth): add 2FA verification tests
chore(docker): update Node.js to v20
style(client): fix ESLint warnings in Dashboard
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and tests locally
4. Push and create a Pull Request
5. Ensure CI passes (lint + build + test)
6. Request a code review
7. Merge after approval

---

## Adding New Features

### Adding a New API Endpoint

Follow the **Route → Controller → Service → Model** pattern:

#### 1. Create Model (if needed)

```javascript
// server/models/NewEntity.js
const mongoose = require('mongoose');

const NewEntitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    // ... fields
}, { timestamps: true });

module.exports = mongoose.model('NewEntity', NewEntitySchema);
```

#### 2. Create Service

```javascript
// server/services/newEntityService.js
const NewEntity = require('../models/NewEntity');

class NewEntityService {
    async getAll() {
        return NewEntity.find().sort('-createdAt');
    }
    // ... methods
}

module.exports = new NewEntityService();
```

#### 3. Create Controller

```javascript
// server/controllers/newEntityController.js
const newEntityService = require('../services/newEntityService');

class NewEntityController {
    async getAll(req, res) {
        try {
            const data = await newEntityService.getAll();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new NewEntityController();
```

#### 4. Create Route

```javascript
// server/routes/newEntity.js
const router = require('express').Router();
const controller = require('../controllers/newEntityController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, controller.getAll);

module.exports = router;
```

#### 5. Register in `index.js`

```javascript
const newEntityRoute = require('./routes/newEntity');
app.use("/api/new-entity", verifyToken, newEntityRoute);
```

### Adding a New Frontend Page

#### 1. Create Page Component

```jsx
// client/src/pages/dashboard/NewPage.jsx
export default function NewPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">New Page</h1>
            {/* Content */}
        </div>
    );
}
```

#### 2. Add Lazy Import in App.jsx

```javascript
const NewPage = lazy(() => import('./pages/dashboard/NewPage'));
```

#### 3. Add Route

```jsx
<Route path="new-page" element={<NewPage />} />
// Or with role protection:
<Route path="new-page" element={
    <RoleRoute allowedRoles={['admin']}>
        <NewPage />
    </RoleRoute>
} />
```

#### 4. Add Sidebar Entry (if needed)

Update the sidebar menu in `components/layout/Sidebar.jsx`.

---

## Code Style

### ESLint

Both client and server have ESLint configured:

```bash
# Check lint errors
cd server && npm run lint
cd client && npm run lint

# Auto-fix
cd server && npm run lint:fix
cd client && npm run lint:fix
```

### General Rules

- Use **`const`** by default, `let` when reassignment is needed
- Use **async/await** over `.then()` chains
- Use **arrow functions** for callbacks
- Use **destructuring** for object properties
- Server uses **CommonJS** (`require/module.exports`)
- Client uses **ES Modules** (`import/export`)
- All model files use **PascalCase** (e.g., `User.js`)
- All route/controller/service files use **camelCase** (e.g., `authController.js`)

---

## Testing

### Backend Tests

```bash
cd server
npm test                    # Run all Jest tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
```

### Frontend Tests

```bash
cd client
npx cypress open            # Open Cypress UI
npx cypress run             # Headless run
```

### Writing Tests

Tests live in `server/tests/` and follow the pattern `*.test.js`.

See [Testing](../security/TESTING.md) for detailed strategy and examples.

---

## Documentation

When making changes, update the relevant documentation:

| Change Type | Update |
|------------|--------|
| New API endpoint | `API_REFERENCE.md` |
| New model | `DATABASE_SCHEMA.md` |
| Auth changes | `AUTHENTICATION.md` |
| New environment variable | `SETUP_GUIDE.md` |
| Docker changes | `DEPLOYMENT.md` |
| Security changes | `SECURITY.md` |
| New UI component | `UI_COMPONENTS.md` |

---

## CI/CD

Every push/PR to `main` triggers:

1. **Client**: lint → build
2. **Server**: lint → test

Ensure your changes pass CI before requesting review.

See [CI/CD](../infrastructure/CI_CD.md) for pipeline details.
