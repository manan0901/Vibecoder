# Current Task: Unit Testing (Task 8.1)

## 📋 Task Overview
**Priority**: High | **Estimated Time**: 6 hours | **Status**: 🔄 In Progress

### Description
Implement comprehensive unit testing for all backend services and frontend components.

## ✅ Acceptance Criteria
- [ ] All critical functions have unit tests
- [ ] Test coverage is above 80%
- [ ] Tests run automatically in CI/CD
- [ ] Mock external dependencies properly
- [ ] Tests are maintainable and readable

## 📝 Subtasks

### 1. Testing Framework Setup
- [ ] Set up Jest and testing utilities
- [ ] Configure test environment
- [ ] Set up code coverage reporting
- [ ] Create test database setup

### 2. Backend Unit Tests
- [ ] Test authentication services
- [ ] Test project management APIs
- [ ] Test payment processing
- [ ] Test file upload functionality

### 3. Frontend Unit Tests
- [ ] Test React components
- [ ] Test custom hooks
- [ ] Test utility functions
- [ ] Test form validations

### 4. Development Scripts
- [ ] Create npm scripts for common development tasks
- [ ] Set up concurrent development script
- [ ] Create build and test scripts
- [ ] Add cleanup and setup scripts

## 🔧 Implementation Steps

### Step 1: Backend Environment Configuration

#### Create Backend .env.example
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/vibecoder_dev"
DATABASE_URL_TEST="postgresql://username:password@localhost:5432/vibecoder_test"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES_IN="30d"

# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_BUCKET_NAME="vibecoder-uploads-dev"
AWS_REGION="ap-south-1"
AWS_CLOUDFRONT_URL="https://your-cloudfront-domain.com"

# Email Configuration
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"
EMAIL_FROM="VibeCoder Marketplace <noreply@vibecoder.com>"

# Redis Configuration (Optional for caching)
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""

# Application Configuration
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"
API_VERSION="v1"

# File Upload Configuration
MAX_FILE_SIZE=524288000  # 500MB in bytes
ALLOWED_FILE_TYPES="zip,rar,7z,tar,gz,pdf,doc,docx,txt,md"
UPLOAD_PATH="./uploads"

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL="debug"
LOG_FILE="./logs/app.log"

# External Services
VIRUS_TOTAL_API_KEY="your_virus_total_api_key"
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
```

#### Backend Package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "prepare": "husky install"
  }
}
```

### Step 2: Frontend Environment Configuration

#### Create Frontend .env.local.example
```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_API_VERSION="v1"

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"

# AWS/CDN Configuration
NEXT_PUBLIC_AWS_CLOUDFRONT_URL="https://your-cloudfront-domain.com"
NEXT_PUBLIC_ASSETS_URL="https://your-assets-domain.com"

# Application Configuration
NEXT_PUBLIC_APP_NAME="VibeCoder Marketplace"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
NEXT_PUBLIC_MIXPANEL_TOKEN="your_mixpanel_token"

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA="true"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_CHAT="false"

# Development Configuration
NEXT_PUBLIC_DEV_MODE="true"
NEXT_PUBLIC_API_TIMEOUT="10000"
```

#### Frontend Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build",
    "prepare": "husky install"
  }
}
```

### Step 3: Code Quality Configuration

#### ESLint Configuration (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["backend/src/**/*.ts"],
      "extends": ["@typescript-eslint/recommended"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "warn"
      }
    }
  ]
}
```

#### Prettier Configuration (prettier.config.js)
```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  arrowParens: 'avoid',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  insertPragma: false,
  requirePragma: false,
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
};
```

### Step 4: TypeScript Configuration

#### Root tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/shared/*": ["../shared/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Backend tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["../shared/*"]
    }
  },
  "include": ["src/**/*", "../shared/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### Step 5: Git Hooks Configuration

#### .husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run linting and formatting
npm run lint:fix
npm run format

# Type checking
npm run type-check

# Add formatted files
git add .

echo "✅ Pre-commit checks passed!"
```

#### .husky/commit-msg
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
npx commitlint --edit $1
```

#### commitlint.config.js
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting, missing semicolons, etc
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'test',     // Adding missing tests
        'chore',    // Maintenance
        'perf',     // Performance improvements
        'ci',       // CI configuration changes
        'build',    // Build system changes
        'revert',   // Revert a commit
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
};
```

## 🧪 Testing the Configuration

### Test Commands to Run:
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Test linting
npm run lint

# 3. Test formatting
npm run format

# 4. Test TypeScript compilation
npm run type-check

# 5. Test environment loading
npm run dev

# 6. Test git hooks
git add .
git commit -m "test: validate commit hooks"
```

## 📁 Files to Create/Modify

### New Files:
- `backend/.env.example`
- `frontend/.env.local.example`
- `.eslintrc.json`
- `prettier.config.js`
- `commitlint.config.js`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `backend/tsconfig.json`
- `frontend/tsconfig.json`

### Modified Files:
- `backend/package.json` (add scripts and dependencies)
- `frontend/package.json` (add scripts and dependencies)
- `.gitignore` (add environment files)

## 🔧 Dependencies to Install

### Backend Dependencies:
```bash
npm install --save-dev @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier eslint-config-prettier husky @commitlint/cli @commitlint/config-conventional nodemon ts-node
```

### Frontend Dependencies:
```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-next prettier eslint-config-prettier husky @commitlint/cli @commitlint/config-conventional
```

## ✅ Task Completion Checklist

- [ ] Environment variables templates created and documented
- [ ] ESLint configuration working for both frontend and backend
- [ ] Prettier formatting applied consistently
- [ ] TypeScript strict mode enabled and compiling
- [ ] Git hooks installed and working
- [ ] Commit message validation working
- [ ] Development scripts functional
- [ ] All dependencies installed
- [ ] Configuration tested and verified

## 🚀 Next Steps After Completion

Once this task is completed:
1. Update task status to ✅ Completed
2. Commit all configuration files
3. Update team on new development standards
4. Proceed to Task 1.3: Database Setup

## 📞 Support

If you encounter issues:
- Check Node.js and npm versions
- Verify all dependencies are installed
- Test each configuration individually
- Reference official documentation for each tool
