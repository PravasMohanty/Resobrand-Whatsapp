# Server Folder Documentation

## Overview

This `server/` folder contains the backend API for the Resobrand WhatsApp CRM project. It is built with:

- Node.js + Express
- Prisma ORM for PostgreSQL
- Redis for caching
- JWT for authentication
- Nodemailer for email
- Razorpay webhook integration
- Winston for logging
- Express-validator for input validation

The backend is structured around a basic MVC pattern and is focused on identity, access control, billing, and audit logging.

---

## Setup and Run

### 1. Install

```bash
cd server
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and fill in all values:

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `REDIS_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

### 3. Database

Manage your Prisma schema with these commands:

```bash
npm run db:generate
npm run db:push
```

If you want migrations instead:

```bash
npx prisma migrate dev --name init
```

### 4. Seed plans

```bash
node prisma/seed.js
```

This populates the `PlanConfig` table with `FREE`, `BUSINESS`, and `ENTERPRISE` plans.

### 5. Run server

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default.

---

## Folder Structure

```
server/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── index.js
│   │   └── redis.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── auditController.js
│   │   └── subscriptionController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── prisma/
│   │   └── client.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── audit.routes.js
│   │   └── subscription.routes.js
│   └── utils/
│       ├── appSetup.js
│       ├── apiError.js
│       ├── audit.js
│       ├── authHelpers.js
│       ├── jwt.js
│       ├── logger.js
│       ├── rateLimiters.js
│       └── userHelpers.js
└── package.json
```

---

## Important Files Explained

### `package.json`

Contains project metadata, dependencies, and scripts:

- `dev`: runs `nodemon src/index.js`
- `start`: runs `node src/index.js`
- Prisma commands: `db:generate`, `db:migrate`, `db:push`, `db:studio`

Dependencies include Express, Prisma, Redis client, JWT, bcrypt, Nodemailer, Winston, and others.

---

## Environment Variables

### `server/.env.example`

The environment variables control the runtime behavior of the server:

- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: server port.
- `NODE_ENV`: environment mode.
- `CLIENT_URL`: frontend origin allowed by CORS.
- `JWT_ACCESS_SECRET`: secret for access tokens.
- `JWT_REFRESH_SECRET`: secret for refresh tokens.
- `JWT_ACCESS_EXPIRES_IN`: access token lifetime.
- `JWT_REFRESH_EXPIRES_IN`: refresh token lifetime.
- `REDIS_URL`: Redis connection.
- `SMTP_*`: email transport credentials.
- `RAZORPAY_*`: Razorpay payment gateway config.
- `PASSWORD_RESET_URL`, `EMAIL_VERIFY_URL`: frontend URLs for email links.
- `BCRYPT_ROUNDS`: password hashing rounds.
- `TRIAL_DAYS`: trial period length.

---

## `src/index.js`

This is the server entry point. It does the following:

1. Loads environment variables.
2. Sets up Express.
3. Uses `setupApp(app)` from `src/utils/appSetup.js` to configure middleware.
4. Configures the Razorpay webhook route with `express.raw()`.
5. Adds health-check endpoint `/api/health`.
6. Mounts API routers.
7. Adds placeholder stub routes for unfinished endpoints.
8. Mounts global error handlers.
9. Starts the server when run directly.
10. Handles graceful shutdown on `SIGTERM`.

### `setupApp(app)`

The `src/utils/appSetup.js` file contains shared Express middleware setup:

- Proxy trust
- Helmet security headers
- CORS using `CLIENT_URL`
- Global rate limiting on `/api`
- JSON and URL-encoded body parsing
- Cookie parsing
- Compression
- HTTP request logging via Morgan + Winston

This centralizes startup middleware so `index.js` remains clean.

---

## `src/config/index.js`

Centralized configuration object based on `process.env`.

Key settings:

- `port`
- `nodeEnv`
- `clientUrl`
- `jwt` secrets and expirations
- `redis.url`
- `email` SMTP settings
- `razorpay` keys and webhook secret
- `urls` for password reset and email verification
- `bcryptRounds`
- `trialDays`

It also crashes fast in production if critical secrets are missing.

---

## `src/config/redis.js`

Redis helper for caching:

- Creates a Redis client with retry strategy.
- Exposes `cacheGet`, `cacheSet`, `cacheDel`.
- Handles Redis downtime gracefully by returning `null` or ignoring failures.

Usage:

- `cacheGet(key)` returns parsed JSON or `null`.
- `cacheSet(key, value, ttlSeconds)` stores JSON.
- `cacheDel(...keys)` removes keys.

---

## `src/utils/logger.js`

Winston logger configuration:

- Uses pretty console logs in development.
- Writes `error.log` and `combined.log` in production.
- Includes timestamps and stack traces.

---

## `src/utils/apiError.js`

Custom error handling utilities:

- `ApiError`: extends `Error` with `statusCode`, `errors`, and `isOperational`.
- Static helpers: `badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `tooMany`, `internal`.
- `asyncHandler(fn)`: wraps async route handlers and forwards exceptions to Express.

This lets controllers throw structured errors instead of writing try/catch everywhere.

---

## `src/utils/jwt.js`

JWT helpers:

- `signAccessToken(payload)`: uses `JWT_ACCESS_SECRET`, expires in `JWY_ACCESS_EXPIRES_IN`.
- `signRefreshToken(payload)`: uses `JWT_REFRESH_SECRET`, expires in `JWT_REFRESH_EXPIRES_IN`.
- `verifyAccessToken(token)`
- `verifyRefreshToken(token)`

These are the only places where JWT tokens are signed or validated.

---

## `src/utils/authHelpers.js`

Authentication helper methods:

- `REFRESH_TOKEN_TTL_DAYS = 7`
- `setRefreshCookie(res, token)`: writes `refreshToken` cookie with `httpOnly`, `secure`, `sameSite: strict`, path `/api/auth`.
- `clearRefreshCookie(res)`.
- `buildUserPayload(user)`: returns minimal token payload.
- `createTokens(user)`: creates access + refresh tokens together.

---

## `src/utils/userHelpers.js`

A reusable Prisma select object:

- `SAFE_USER_SELECT`: selected fields to return in API responses.
- Excludes `passwordHash` to prevent leaking credentials.

Used by user APIs to control which user fields are exposed.

---

## `src/utils/rateLimiters.js`

Express rate-limit definitions for auth routes:

- `authLimiter`: 10 requests per 15 minutes.
- `forgotPasswordLimiter`: 5 requests per hour.

These protect login/register and password reset endpoints.

---

## `src/utils/audit.js`

Audit logger helper:

- Writes audit records to `auditLog` table.
- Accepts `actorId`, `action`, `targetType`, `targetId`, `metadata`, and `req`.
- Fire-and-forget: errors are caught and logged, not thrown.

This makes the audit trail non-blocking.

---

## `src/prisma/client.js`

Prisma client singleton:

- In production: creates a fresh `PrismaClient`.
- In development: stores the instance on `global.__prisma` to avoid duplicates during hot reload.
- Logs queries in development via Prisma's `log` option.

---

## Controllers

### `src/controllers/authController.js`

This file owns authentication and account lifecycle flow.

#### `register(req, res)`

1. Reads registration fields from `req.body`.
2. Checks if email is already registered.
3. Hashes password with bcrypt.
4. Uses a Prisma transaction to:
   - Create the `User`.
   - Create a `Subscription` in `FREE` trial.
   - Create an `EmailVerification` token.
5. Sends email verification and welcome emails asynchronously.
6. Writes audit log: `USER_REGISTERED`.
7. Responds with new user data.

#### `login(req, res)`

1. Finds user by email.
2. Verifies password using bcrypt.
3. Checks `isActive` status.
4. Creates access + refresh tokens.
5. Stores refresh token in `refreshTokens` table.
6. Sets `refreshToken` cookie.
7. Writes audit log: `USER_LOGIN`.
8. Returns access token and user profile.

#### `refreshToken(req, res)`

1. Reads refresh token from cookie or body.
2. Verifies JWT signature.
3. Validates token exists in DB and is not revoked.
4. Revokes old token.
5. Loads user and checks active status.
6. Issues new access + refresh tokens.
7. Stores new token in DB and cookie.
8. Returns new access token.

#### `logout(req, res)`

1. Revokes the provided refresh token.
2. Clears auth cache for the user.
3. Clears refresh cookie.
4. Writes audit log: `USER_LOGOUT`.
5. Returns success message.

#### `forgotPassword(req, res)`

1. Finds user by email.
2. If user exists:
   - Marks any existing reset tokens as used.
   - Creates a new `PasswordReset` token valid for 15 minutes.
   - Sends password reset email.
3. Always returns a generic success message to prevent account enumeration.
4. Writes audit log: `PASSWORD_RESET_REQUESTED`.

#### `resetPassword(req, res)`

1. Finds password reset record by token.
2. Validates token exists, is unused, and not expired.
3. Hashes new password.
4. In a transaction:
   - Updates user password.
   - Marks reset token as used.
   - Revokes all refresh tokens.
5. Clears user cache.
6. Writes audit log: `PASSWORD_RESET_COMPLETED`.
7. Returns success message.

#### `verifyEmail(req, res)`

1. Finds email verification record by token.
2. Validates it.
3. In a transaction:
   - Marks user `isEmailVerified = true`.
   - Marks verification token as used.
4. Clears user cache.
5. Returns success message.

---

### `src/controllers/userController.js`

User profile and admin user management.

#### `getMe(req, res)`

- Returns the authenticated user's profile using `SAFE_USER_SELECT`.

#### `updateMe(req, res)`

- Updates profile fields if provided.
- Uses spread helpers so only present fields are updated.
- Clears auth cache.
- Writes audit log: `USER_UPDATED`.

#### `changePassword(req, res)`

- Verifies current password.
- Validates new password length.
- Hashes new password.
- In a transaction, updates password and revokes refresh tokens.
- Clears auth cache.
- Writes audit log: `PASSWORD_CHANGED`.

#### `getUsers(req, res)`

- Admin/manager endpoint to list users.
- Supports pagination, filtering by role, search, and active status.
- Returns pagination metadata.

#### `changeRole(req, res)`

- Admin-only endpoint to change another user's role.
- Prevents users from changing their own role.
- Requires `SUPER_ADMIN` to assign `ADMIN`.
- Clears cache for target user.
- Writes audit log: `ROLE_CHANGED`.

#### `deactivateUser(req, res)`

- Admin-only endpoint to deactivate a user.
- Prevents self-deactivation.
- Revokes all refresh tokens for that user.
- Clears cache.
- Writes audit log: `USER_UPDATED` with metadata.

---

### `src/controllers/auditController.js`

Audit log queries for admins.

#### `getLogs(req, res)`

- Fetches audit records with optional filters:
  - `actorId`, `action`, `targetType`, `targetId`, `from`, `to`
- Supports pagination.
- Includes actor user details.

#### `getLog(req, res)`

- Returns a single audit log entry by ID.

---

### `src/controllers/subscriptionController.js`

Subscription and billing-related endpoints.

#### `getSubscription(req, res)`

- Returns the current user's subscription record.
- Includes plan config for the user's current plan.

#### `getPlans(req, res)`

- Returns all plan configurations from `PlanConfig`.

#### `createOrder(req, res)`

- Validates selected plan.
- Looks up plan config.
- Calculates amount based on monthly/yearly billing.
- Returns a stub order object while Razorpay is not enabled.
- Includes Razorpay `keyId` in response.

#### `razorpayWebhook(req, res)`

- Receives raw JSON body from Razorpay.
- Verifies HMAC signature using `RAZORPAY_WEBHOOK_SECRET`.
- Stores the raw event in `PaymentEvent`.
- Processes the event in `handleRazorpayEvent()`.
- Returns 200 regardless of processing success.

##### `handleRazorpayEvent(event)`

Handles specific Razorpay event types:

- `subscription.activated`
  - Updates subscription status to `ACTIVE`.
  - Stores razorpay subscription info.
  - Writes `PLAN_UPGRADED` audit event.

- `subscription.cancelled`
  - Marks subscription as `CANCELLED`.
  - Writes `SUBSCRIPTION_CANCELLED` audit event.

- `payment.failed`
  - Marks subscription as `PAST_DUE`.

- Default: logs unhandled event.

#### `cancelSubscription(req, res)`

- Cancels the current user's subscription locally.
- Marks status `CANCELLED` and records `cancelledAt`.
- Clears cache.
- Writes audit log: `SUBSCRIPTION_CANCELLED`.

Note: actual Razorpay cancellation is not implemented; the code is stubbed.

---

## Routes

### `src/routes/auth.routes.js`

Public auth routes:

- `/register`
- `/login`
- `/refresh-token`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

Protected:

- `/logout`

### `src/routes/user.routes.js`

All routes require authentication.

- `/me` GET/PATCH
- `/me/change-password`
- `/` GET list users (MANAGER+)
- `/:id/role` PATCH (ADMIN+)
- `/:id/deactivate` PATCH (ADMIN+)

### `src/routes/subscription.routes.js`

- `/plans` GET public
- `/my` GET protected
- `/order` POST protected
- `/cancel` POST protected

### `src/routes/audit.routes.js`

- `/` GET admin-only audit list
- `/:id` GET single audit record

---

## Middleware

### `src/middleware/authenticate.js`

Authentication middleware does this:

1. Reads JWT from `Authorization` header or `req.cookies.accessToken`.
2. Verifies access token using `verifyAccessToken()`.
3. Looks up user from Redis cache.
4. If cache miss, loads the user from Prisma.
5. Checks user is active.
6. Attaches `req.user`.

It also has `optionalAuth()` for routes that may use auth if available.

### `src/middleware/authorize.js`

Role and feature gating.

- `authorize(...allowedRoles)`: checks user's role level against allowed roles.
- `requireFeature(feature)`: checks current plan config for feature entitlement.
- `requireMessageQuota`: stubbed middleware for message quota checks.

Role hierarchy:

- `AGENT` = 1
- `MANAGER` = 2
- `ADMIN` = 3
- `SUPER_ADMIN` = 4

### `src/middleware/errorHandler.js`

Global error handling:

- Returns structured response for `ApiError`.
- Handles Prisma errors:
  - `P2002`: unique constraint violation.
  - `P2025`: record not found.
- Handles JWT errors.
- Logs unknown errors and hides stack in production.
- `notFoundHandler` returns 404 for unknown routes.

### `src/middleware/validators.js`

Express-validator chains for incoming request validation.

Auth validators:

- `registerValidator`
- `loginValidator`
- `forgotPasswordValidator`
- `resetPasswordValidator`

User validators:

- `updateProfileValidator`
- `changeRoleValidator`

If validation fails, it throws `ApiError.badRequest` with structured error details.

---

## Database Schema (`prisma/schema.prisma`)

### Models

#### `User`

Fields include:

- `email`, `passwordHash`, `fullName`
- profile fields: `phone`, `countryCode`, `country`, `gender`, `address`
- `timezone`, `theme`, `isEmailVerified`, `isActive`, `role`
- relations: `refreshTokens`, `passwordResets`, `emailVerifications`, `auditLogs`, `subscription`

#### `Organization`

A company/tenant model with name, slug, website, industry.

#### `RefreshToken`

Stores issued refresh tokens and metadata for rotation and revocation.

#### `PasswordReset`

Tracks password reset tokens and expiration.

#### `EmailVerification`

Tracks email verification tokens.

#### `PlanConfig`

Static plan definitions with limits and feature flags.

#### `Subscription`

User subscription state and billing fields.

#### `PaymentEvent`

Stores raw webhook events for debugging and idempotency.

#### `AuditLog`

Tracks actions taken by users.

### Enums

- `Role`
- `Plan`
- `SubscriptionStatus`
- `AuditAction`

---

## Seed Script (`prisma/seed.js`)

This script populates `PlanConfig` with three plans:

- `FREE`
- `BUSINESS`
- `ENTERPRISE`

It uses `upsert` so it is safe to run multiple times.

---

## How Authentication Works

### Access Token

- Short-lived JWT stored in frontend memory or header.
- Signed with `JWT_ACCESS_SECRET`.
- Used for authenticated API calls.

### Refresh Token

- Long-lived JWT stored in `HttpOnly` cookie at `/api/auth`.
- Stored in DB for revocation.
- Rotated on every refresh.

### Login Flow

1. User submits email/password.
2. Server verifies credentials.
3. Server issues access token and refresh token.
4. Refresh token saved in DB and cookie.

### Refresh Flow

1. Client calls `/api/auth/refresh-token` with cookie.
2. Server verifies token signature.
3. Server checks DB for valid token.
4. Old token is revoked and new one is issued.

### Logout Flow

1. Client calls `/api/auth/logout`.
2. Server revokes the token and clears cookie.

---

## How the Razorpay Webhook Works

### Why raw body?

Razorpay webhook signatures are calculated on the raw JSON body. The route uses `express.raw({ type: 'application/json' })` to preserve raw text.

### Verification

- Signature header: `x-razorpay-signature`
- Verified with HMAC SHA-256 using `RAZORPAY_WEBHOOK_SECRET`.

### Event processing

- Stores raw event in `PaymentEvent`.
- Processes events in `handleRazorpayEvent()`.
- Marks event processed even if business logic fails.

---

## How Redis Caching is Used

The server caches authenticated user data in `authenticate.js`:

- Cache key: `user:<userId>`
- TTL: 300 seconds (5 minutes)

Cache is cleared when user data changes or when log out occurs.

---

## How to Add a New Route

1. Add controller logic in `src/controllers/`.
2. Add validation middleware if needed under `src/middleware/validators.js`.
3. Add route definition in `src/routes/`.
4. Mount route in `src/index.js`.
5. Add audit logging if the action should be tracked.

---

## Notes and Known Limitations

- The Razorpay order creation flow is stubbed and not fully implemented.
- The server exposes placeholder stub routes for unfinished modules such as `leads`, `contacts`, and `campaigns`.
- `requireMessageQuota` is currently a stub and does not enforce real usage quotas.
- Email sending is fire-and-forget; failures are silently ignored.
- The `User` model includes fields for organization and roles, but multi-tenant logic is limited.

---

## Useful Quick References

### Auth routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email`

### User routes

- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/me/change-password`
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/deactivate`

### Subscription routes

- `GET /api/subscriptions/plans`
- `GET /api/subscriptions/my`
- `POST /api/subscriptions/order`
- `POST /api/subscriptions/cancel`

### Audit routes

- `GET /api/audit-logs`
- `GET /api/audit-logs/:id`

### Webhook

- `POST /api/webhooks/razorpay`

---

## Final Note

The server is now separated into clear layers:

- `config/` for environment config
- `utils/` for shared helpers
- `middleware/` for auth/validation/error handling
- `controllers/` for business logic
- `routes/` for API wiring
- `prisma/` for database client and schema

This document should give you a complete map of how every piece works.
