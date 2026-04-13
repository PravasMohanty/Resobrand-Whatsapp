# Server Code Guide

## What this guide is

This file explains the `server` folder in plain English:

- how to install and run it
- what each config value does
- how requests move through the app
- what each route does
- what every controller function does
- what the middleware and utility files are responsible for
- how Prisma models map to the backend behavior
- what parts are complete, partial, or stubbed

This server is a Node.js + Express backend using Prisma with PostgreSQL, Redis for caching, JWT for authentication, Nodemailer for email, and partial Razorpay billing support.

## Quick mental model

Think of the backend like this:

1. `src/index.js` creates the Express app and mounts routes.
2. A route file decides which URL maps to which controller.
3. Middleware runs before the controller for auth, authorization, validation, and error handling.
4. Controllers contain the business logic.
5. Controllers talk to the database through Prisma.
6. Helpers in `src/utils` handle reusable concerns like JWT, email, logging, cookies, rate limiting, and audit logging.

## Folder structure

```text
server/
├─ .env.example
├─ .gitignore
├─ package.json
├─ README.md
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.js
└─ src/
   ├─ index.js
   ├─ config/
   │  ├─ index.js
   │  └─ redis.js
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ userController.js
   │  ├─ auditController.js
   │  └─ subscriptionController.js
   ├─ middleware/
   │  ├─ authenticate.js
   │  ├─ authorize.js
   │  ├─ errorHandler.js
   │  └─ validators.js
   ├─ prisma/
   │  └─ client.js
   ├─ routes/
   │  ├─ auth.routes.js
   │  ├─ user.routes.js
   │  ├─ audit.routes.js
   │  └─ subscription.routes.js
   └─ utils/
      ├─ apiError.js
      ├─ appSetup.js
      ├─ authHelpers.js
      ├─ audit.js
      ├─ email.js
      ├─ jwt.js
      ├─ logger.js
      ├─ rateLimiters.js
      └─ userHelpers.js
```

## Setup and run

## Prerequisites

- Node.js installed
- npm installed
- a PostgreSQL database URL
- optional but recommended: Redis
- optional: SMTP credentials for email
- optional: Razorpay keys if you want billing/webhooks

## Install

From the `server` folder:

```bash
npm install
```

## Environment setup

Create `.env` in `server/` by copying `.env.example`.

```bash
cp .env.example .env
```

On Windows PowerShell, if `cp` does not behave as expected:

```powershell
Copy-Item .env.example .env
```

Then fill in the values.

## Database setup

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to the database:

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

Seed plan data:

```bash
node prisma/seed.js
```

## Start the server

Development:

```bash
npm run dev
```

Production-style local run:

```bash
npm start
```

Health check:

```text
GET /api/health
```

Expected response shape:

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-04-13T00:00:00.000Z",
  "environment": "development"
}
```

## Important environment variables

These come from `.env.example` and are loaded in `src/config/index.js`.

## Database

- `DATABASE_URL`
  - PostgreSQL connection string used by Prisma.
  - Required for anything database-related.

## Server

- `PORT`
  - Express server port.
  - Defaults to `5000`.
- `NODE_ENV`
  - Usually `development`, `test`, or `production`.
  - Affects logging, cookie security, and production env validation.
- `CLIENT_URL`
  - Allowed frontend origin for CORS.
  - Defaults to `http://localhost:5173`.

## JWT

- `JWT_ACCESS_SECRET`
  - Secret used to sign short-lived access tokens.
- `JWT_REFRESH_SECRET`
  - Secret used to sign refresh tokens.
- `JWT_ACCESS_EXPIRES_IN`
  - Access token lifetime, default `15m`.
- `JWT_REFRESH_EXPIRES_IN`
  - Refresh token lifetime, default `7d`.

## Redis

- `REDIS_URL`
  - Used by `ioredis`.
  - If Redis is unavailable, the server tries to continue with caching disabled.

## Email

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

These are used by Nodemailer in `src/utils/email.js`.

## Razorpay

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

These are partially wired in. Order creation is currently stubbed, but webhook verification logic exists.

## Frontend callback URLs

- `PASSWORD_RESET_URL`
  - The frontend page used in password reset emails.
- `EMAIL_VERIFY_URL`
  - The frontend page used in email verification links.

## Misc

- `BCRYPT_ROUNDS`
  - Cost factor for password hashing.
  - Default `12`.
- `TRIAL_DAYS`
  - Default free trial duration after registration.
  - Default `14`.

## `package.json`

This file defines the project metadata, scripts, and dependencies.

## Scripts

- `npm run dev`
  - Runs `nodemon src/index.js`
  - Automatically restarts on file changes.
- `npm start`
  - Runs `node src/index.js`
- `npm run db:generate`
  - Runs `prisma generate`
- `npm run db:migrate`
  - Runs `prisma migrate dev`
- `npm run db:push`
  - Runs `prisma db push`
- `npm run db:studio`
  - Opens Prisma Studio

## Main dependencies and why they exist

- `express`
  - HTTP server and routing.
- `@prisma/client` and `prisma`
  - ORM and schema tooling.
- `bcryptjs`
  - Password hashing.
- `jsonwebtoken`
  - Access and refresh token signing/verification.
- `ioredis`
  - Cache layer for user lookups.
- `nodemailer`
  - Sending emails.
- `helmet`
  - Security headers.
- `cors`
  - Cross-origin access rules.
- `compression`
  - Response compression.
- `cookie-parser`
  - Reads cookies from requests.
- `morgan`
  - HTTP request logging.
- `express-rate-limit`
  - Brute-force and abuse protection.
- `express-validator`
  - Input validation in routes.
- `uuid`
  - Generates verification/reset tokens.
- `winston`
  - App logging.
- `multer` and `zod`
  - Installed but not actively used in the current server files you asked me to review.

## App startup flow

The intended entrypoint is `src/index.js`.

## What `src/index.js` is trying to do

1. Load environment variables with `dotenv`.
2. Create an Express app.
3. Call `setupApp(app)` to add shared middleware.
4. Register a special Razorpay webhook route using `express.raw(...)`.
5. Add `/api/health`.
6. Mount route modules:
   - `/api/auth`
   - `/api/users`
   - `/api/audit-logs`
   - `/api/subscriptions`
7. Add placeholder routes for unfinished product areas.
8. Attach `notFoundHandler` and `errorHandler`.
9. Start the server.

## Important quirk in `src/index.js`

This file currently has duplicated and conflicting startup logic:

- routes are mounted once, then more routes are mounted after `module.exports = app`
- error handlers are attached twice
- the app is started once inside `if (require.main === module)` and again later through `startServer()`
- `module.exports = app` appears twice

What that means in practice:

- the file clearly contains merged or duplicated code
- the intended architecture is understandable
- the actual startup code should be cleaned up before relying on it in production

For documentation purposes, the intended structure is still clear enough to explain the app.

## Shared app middleware: `src/utils/appSetup.js`

This file centralizes common Express middleware.

## What `setupApp(app)` adds

- `app.set('trust proxy', 1)`
  - important when behind a proxy or deployment platform
  - affects `req.ip`, secure cookies, rate limit behavior

- `helmet()`
  - sets security-related HTTP headers

- `cors(...)`
  - allows requests only from `config.clientUrl`
  - `credentials: true` means cookies can be sent from the frontend

- global rate limiter on `/api`
  - 500 requests per 15 minutes
  - returns a JSON message when exceeded

- `express.json({ limit: '10mb' })`
  - parses JSON request bodies

- `express.urlencoded({ extended: true, limit: '10mb' })`
  - parses URL-encoded bodies

- `cookieParser()`
  - exposes `req.cookies`

- `compression()`
  - compresses responses

- `morgan('combined', ...)`
  - logs requests using the custom Winston logger
  - skips `/api/health`

## Configuration loader: `src/config/index.js`

This file reads environment variables once and exports a normalized config object.

## Why it exists

Instead of using `process.env` all over the app, the code uses a single config object:

```js
const config = require('../config');
```

That makes the rest of the code cleaner and easier to change.

## Production guard

If `NODE_ENV === 'production'`, it throws immediately if these are missing:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `DATABASE_URL`

This is a crash-fast safety check so production does not start in a broken state.

## Redis config: `src/config/redis.js`

This file creates the Redis client and safe cache wrappers.

## How it behaves

- tries to connect to Redis using `config.redis.url`
- uses `lazyConnect: true`
  - the connection is initialized when needed rather than aggressively at startup
- logs successful connections and Redis errors
- if Redis construction fails, it falls back to `null`

## Exported helpers

- `redis`
  - the raw client instance, or `null`
- `cacheGet(key)`
  - returns parsed JSON or `null`
  - silently returns `null` if Redis is down
- `cacheSet(key, value, ttlSeconds = 300)`
  - stores JSON with expiration
- `cacheDel(...keys)`
  - deletes exact keys

## Why caching is used here

Authentication middleware frequently needs the current user. Caching reduces repeated database lookups:

- cache key format: `user:<userId>`
- default TTL: 5 minutes

## Prisma client: `src/prisma/client.js`

This file exports a singleton Prisma client.

## Why it exists

In development, hot reload can create many Prisma client instances. This file avoids that by storing the client on `global.__prisma`.

## Behavior

- in production: creates a fresh `PrismaClient()`
- in development: reuses a global instance and enables Prisma logs

## Database schema: `prisma/schema.prisma`

This file defines the database structure.

## Enums

### `Role`

- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `AGENT`

Used for authorization.

### `Plan`

- `FREE`
- `BUSINESS`
- `ENTERPRISE`

Used for billing and feature gates.

### `SubscriptionStatus`

- `ACTIVE`
- `INACTIVE`
- `TRIAL`
- `CANCELLED`
- `PAST_DUE`

Used on `Subscription`.

### `AuditAction`

Tracks business events like:

- user registration/login/logout
- password changes/resets
- role changes
- subscription changes
- campaign-related actions
- imports and webhook creation

Even though some campaign/lead features are not implemented in this server, the enum is ready for those events.

## Models

### `User`

Represents an account.

Important fields:

- `id`: UUID primary key
- `email`: unique login identifier
- `passwordHash`: hashed password, never returned publicly
- `fullName`
- profile fields like `phone`, `country`, `age`, `gender`, `address`
- `avatarUrl`
- `timezone`
- `theme`
- `isEmailVerified`
- `isActive`
- `role`
- `organizationId`
- timestamps

Relations:

- belongs to an optional `Organization`
- has many `RefreshToken`
- has many `PasswordReset`
- has many `EmailVerification`
- has many audit logs as `actor`
- has one `Subscription`

### `Organization`

Represents a company/workspace.

Fields:

- `name`
- `slug` unique
- `logoUrl`
- `website`
- `industry`

Relations:

- has many users
- has one subscription

Important note:

The current registration flow does not create organizations yet. The schema supports them, but this part is not wired into the current controllers.

### `RefreshToken`

Stores server-side refresh tokens.

Why this matters:

- refresh tokens are not purely stateless
- they are persisted so they can be revoked
- that makes logout and password-change invalidation possible

Fields:

- `token`
- `userId`
- `expiresAt`
- `isRevoked`
- request metadata like `userAgent` and `ipAddress`

### `PasswordReset`

Stores password reset tokens.

Fields:

- `token`
- `userId`
- `expiresAt`
- `isUsed`

This allows reset links to be single-use and time-limited.

### `EmailVerification`

Stores email verification tokens.

Fields mirror `PasswordReset`:

- `token`
- `userId`
- `expiresAt`
- `isUsed`

### `PlanConfig`

Stores plan limits and feature flags.

Important fields:

- `plan`
- `displayName`
- `priceMonthly`
- `priceYearly`
- usage limits like `maxMessages`, `maxAgents`, `maxCampaigns`, `maxContacts`
- `whatsappTemplates`
- feature booleans:
  - `canUseAI`
  - `canUseCRM`
  - `canExportLeads`
  - `canUseAnalytics`
- optional `razorpayPlanId`

This table is how feature entitlement is meant to work.

### `Subscription`

Represents a user or organization subscription.

Fields:

- `userId`
- `organizationId`
- `plan`
- `status`
- trial dates
- billing period dates
- Razorpay IDs
- `cancelledAt`

Important note:

`userId` is marked `@unique`, so the current design assumes one subscription per user.

### `PaymentEvent`

Stores raw payment webhook events.

Why it exists:

- debugging webhook payloads
- idempotency support
- auditability of billing events

### `AuditLog`

Stores activity events.

Fields:

- `actorId`
- `action`
- `targetType`
- `targetId`
- `metadata` JSON
- `ipAddress`
- `userAgent`
- `createdAt`

Indexes exist on:

- `actorId`
- `action`
- `createdAt`

That helps filtering and sorting for admin audit pages.

## Seed file: `prisma/seed.js`

This file seeds the `PlanConfig` table with three plans.

## Plans created

### Free

- `priceMonthly: 0`
- `priceYearly: 0`
- low usage limits
- AI, CRM, export, analytics disabled

### Business

- `priceMonthly: 2999`
- `priceYearly: 29990`
- much higher limits
- AI, CRM, export, analytics enabled

### Enterprise

- `priceMonthly: 9999`
- `priceYearly: 99990`
- many `-1` values meaning unlimited
- all feature flags enabled

## Why `upsert` is used

The seed can be re-run safely because it updates existing rows if the plan already exists.

## Routing overview

Route files only define URL-to-controller mapping. They keep controllers from becoming cluttered with route declarations.

## `src/routes/auth.routes.js`

Public routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email`

Protected route:

- `POST /api/auth/logout`

Middleware used:

- `authLimiter`
- `forgotPasswordLimiter`
- auth validators
- `authenticate` for logout

## `src/routes/user.routes.js`

Applies `router.use(authenticate)` first, so every route in this file requires a valid access token.

Routes:

- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/me/change-password`
- `GET /api/users/`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/deactivate`

Authorization:

- list users: `MANAGER`, `ADMIN`, `SUPER_ADMIN`
- role changes and deactivation: `ADMIN`, `SUPER_ADMIN`

## `src/routes/audit.routes.js`

Applies:

- `authenticate`
- `authorize('ADMIN', 'SUPER_ADMIN')`

Routes:

- `GET /api/audit-logs/`
- `GET /api/audit-logs/:id`

## `src/routes/subscription.routes.js`

Public:

- `GET /api/subscriptions/plans`

Protected:

- `GET /api/subscriptions/my`
- `POST /api/subscriptions/order`
- `POST /api/subscriptions/cancel`

## Placeholder routes in `src/index.js`

These exist only to avoid frontend 404s and currently return `501 Not implemented yet`:

- `/api/leads`
- `/api/contacts`
- `/api/campaigns`
- `/api/templates`
- `/api/conversations`
- `/api/segments`
- `/api/automations`
- `/api/analytics`
- `/api/integrations`

## Authentication flow

This backend uses a two-token system:

- access token
  - short-lived
  - typically sent as `Authorization: Bearer <token>`
- refresh token
  - longer-lived
  - stored in database
  - also set in an HttpOnly cookie

## JWT helpers: `src/utils/jwt.js`

Exports:

- `signAccessToken(payload)`
- `signRefreshToken(payload)`
- `verifyAccessToken(token)`
- `verifyRefreshToken(token)`

Common JWT behavior:

- issuer is set to `resobrand`
- secrets and expirations come from config

## Auth cookie helpers: `src/utils/authHelpers.js`

### `REFRESH_TOKEN_TTL_DAYS`

Hardcoded to `7`.

Important note:

This duplicates the meaning of `JWT_REFRESH_EXPIRES_IN`. The cookie lifetime is not dynamically derived from the env setting.

### `setRefreshCookie(res, token)`

Sets cookie:

- name: `refreshToken`
- `httpOnly: true`
- `secure: true` only in production
- `sameSite: 'strict'`
- `path: '/api/auth'`

The path restriction means the cookie is only sent to auth endpoints.

### `clearRefreshCookie(res)`

Clears that same cookie path.

### `buildUserPayload(user)`

Builds the JWT payload:

- `userId`
- `email`
- `role`
- `plan`

### `createTokens(user)`

Returns a fresh access token and refresh token for a user.

## Middleware: `src/middleware/authenticate.js`

This is the main auth middleware.

## `authenticate`

What it does:

1. Reads token from:
   - `Authorization: Bearer <token>`
   - or `req.cookies.accessToken`
2. Verifies the access token with `verifyAccessToken`
3. Tries Redis cache with key `user:<userId>`
4. If cache misses, loads the user from Prisma
5. Rejects if:
   - token missing
   - token invalid
   - user missing
   - user inactive
6. Attaches the user to `req.user`

The attached `req.user` includes:

- id
- email
- fullName
- role
- isActive
- isEmailVerified
- organizationId
- subscription plan/status

## `optionalAuth`

If a bearer token exists, it runs full authentication.
If not, it simply allows the request through.

This helper exists for future public-or-authenticated routes, but it is not currently used in the route files reviewed here.

## Authorization middleware: `src/middleware/authorize.js`

This file handles permission checks beyond basic login.

## `authorize(...allowedRoles)`

Role hierarchy:

- `AGENT = 1`
- `MANAGER = 2`
- `ADMIN = 3`
- `SUPER_ADMIN = 4`

The middleware compares the current user level to the minimum required level from the allowed roles.

Example:

```js
authorize('ADMIN', 'SUPER_ADMIN')
```

That means the user must be at least `ADMIN`.

## `requireFeature(feature)`

Loads `PlanConfig` for the user’s current plan and checks a boolean flag like:

- `canUseAI`
- `canUseCRM`
- `canExportLeads`
- `canUseAnalytics`

If the feature is not enabled, the request is rejected with `403`.

This middleware is not used by the current route modules, but it is ready for future product features.

## `requireMessageQuota`

This is a partial/stub middleware.

What it currently does:

- loads the current plan config
- if the plan has a limit, it attaches `req.planConfig`
- does not yet check real usage

So it is a placeholder for future analytics usage enforcement.

## Validation middleware: `src/middleware/validators.js`

This file uses `express-validator`.

## `validate`

Collects validation errors and converts them into a structured `ApiError.badRequest(...)`.

Returned error format includes an array like:

```json
[
  { "field": "email", "message": "Valid email required" }
]
```

## Auth validators

### `registerValidator`

Checks:

- valid email
- password length at least 8
- password must include uppercase, lowercase, and number
- full name length
- optional phone format
- optional country code format

### `loginValidator`

Checks:

- valid email
- password not empty

### `forgotPasswordValidator`

Checks:

- valid email

### `resetPasswordValidator`

Checks:

- token present
- password strength rules

Important note:

The route file imports `resetPasswordValidator` but does not actually use it on `POST /reset-password`. That is likely an oversight.

## User validators

### `updateProfileValidator`

Allows optional checks for:

- `fullName`
- `phone`
- `timezone`
- `theme` (`light` or `dark`)

### `changeRoleValidator`

Checks:

- `:id` is UUID
- `role` is one of `ADMIN`, `MANAGER`, `AGENT`

Important note:

This means the API intentionally does not allow assigning `SUPER_ADMIN` through this route.

## Error system

## `src/utils/apiError.js`

This file defines the project’s custom error type.

### `ApiError`

Properties:

- `statusCode`
- `message`
- `errors`
- `isOperational = true`

Factory helpers:

- `badRequest`
- `unauthorized`
- `forbidden`
- `notFound`
- `conflict`
- `tooMany`
- `internal`

### `asyncHandler(fn)`

Wraps async controllers so rejected promises automatically go to Express error handling without repeated `try/catch`.

## `src/middleware/errorHandler.js`

### `errorHandler`

Handles:

- operational `ApiError`s
- Prisma unique constraint `P2002`
- Prisma record-not-found `P2025`
- JWT errors
- unexpected internal errors

Operational errors return their message directly.

Unexpected errors:

- are logged through Winston
- return stack details only in development
- hide details in production

### `notFoundHandler`

Returns a 404 JSON response for any unmatched route.

## Logging: `src/utils/logger.js`

Uses Winston.

## Behavior

- in development: logs at `debug` level to console
- in production: logs at `warn` level or above and writes:
  - `logs/error.log`
  - `logs/combined.log`

The formatter includes:

- timestamp
- log level
- message or stack
- JSON metadata when provided

## Audit logging: `src/utils/audit.js`

### `audit({ actorId, action, targetType, targetId, metadata, req })`

Writes an `AuditLog` row.

Important behavior:

- fire-and-forget style
- catches its own errors
- never throws back to the main request

That means a failed audit write will not break user-facing actions.

It also records:

- IP from `req.ip`
- user-agent from headers

## Email system: `src/utils/email.js`

This file lazily creates a Nodemailer transporter and exposes email sending helpers.

## `getTransporter()`

Creates a transporter once and reuses it.

Uses:

- host
- port
- secure if port is `465`
- SMTP auth credentials

## `sendEmail({ to, subject, html, text })`

Central helper used by all templates.

It logs success or failure through Winston.

## Template functions

### `sendPasswordResetEmail(to, name, resetLink)`

Sends:

- branded reset email
- tells the user the link expires in 15 minutes

### `sendEmailVerification(to, name, verifyLink)`

Sends:

- verification email
- asks the user to activate the account

### `sendWelcomeEmail(to, name)`

Sends:

- welcome message
- mentions the 14-day free trial

Important note:

`sendWelcomeEmail` hardcodes "14-day free trial" in the template, while the actual trial length comes from `TRIAL_DAYS`. If `TRIAL_DAYS` changes, the email text may become inaccurate.

## Rate limiters: `src/utils/rateLimiters.js`

### `authLimiter`

- 10 requests per 15 minutes
- intended for login/register abuse protection

### `forgotPasswordLimiter`

- 5 requests per hour
- intended to reduce email abuse

## Safe user selection: `src/utils/userHelpers.js`

Exports `SAFE_USER_SELECT`.

Purpose:

- prevent accidental exposure of sensitive columns
- especially `passwordHash`

Any Prisma query using this selector returns safe public user fields plus a small subscription summary.

## Controllers

Controllers contain the main business logic. This is where most of the server behavior lives.

## `src/controllers/authController.js`

This file handles registration, login, refresh token rotation, logout, password reset, and email verification.

### `register`

Purpose:

- create a new user
- create a default free-trial subscription
- create an email verification token
- send verification + welcome emails
- write an audit log

Step by step:

1. Reads `email`, `password`, `fullName`, and profile fields from `req.body`.
2. Checks whether a user with that email already exists.
3. Hashes the password using bcrypt with `config.bcryptRounds`.
4. Opens a Prisma transaction.
5. Creates the user.
6. Calculates `trialEnd = now + config.trialDays`.
7. Creates a `Subscription` with:
   - `plan: 'FREE'`
   - `status: 'TRIAL'`
   - `trialEndsAt`
8. Generates a UUID verification token.
9. Stores the token in `EmailVerification`.
10. Returns the new user and token from the transaction.
11. Builds the verification link using `config.urls.emailVerify`.
12. Sends verification and welcome emails without blocking the request.
13. Writes an audit log with action `USER_REGISTERED`.
14. Returns `201 Created`.

Why the transaction matters:

If user creation succeeds but subscription or verification-token creation fails, the transaction prevents partial data from being left behind.

### `login`

Purpose:

- validate credentials
- issue access token
- issue refresh token
- store refresh token in database
- set refresh cookie

Step by step:

1. Reads `email` and `password`.
2. Loads the user plus subscription summary.
3. Rejects if user not found.
4. Compares password with bcrypt.
5. Rejects if account is inactive.
6. Calls `createTokens(user)`.
7. Stores the refresh token in `RefreshToken` with:
   - expiry
   - IP
   - user-agent
8. Sets refresh cookie.
9. Writes `USER_LOGIN` audit entry.
10. Returns:
   - `accessToken`
   - a trimmed user object

Important output:

The response includes plan and subscription status so the frontend can update UI immediately after login.

### `refreshToken`

Purpose:

- exchange a valid refresh token for a new access token
- rotate refresh token to reduce replay risk

Step by step:

1. Reads refresh token from:
   - `req.cookies.refreshToken`
   - or `req.body.refreshToken`
2. Verifies refresh token signature.
3. Loads stored token from database.
4. Rejects if token:
   - does not exist
   - is revoked
   - is expired
5. Marks old token revoked.
6. Loads the user.
7. Rejects if user is missing or inactive.
8. Generates new access and refresh tokens.
9. Stores the new refresh token in DB.
10. Sets the new refresh cookie.
11. Returns the new access token.

This is refresh token rotation.

### `logout`

Purpose:

- revoke the current refresh token
- clear refresh cookie
- clear user cache

Step by step:

1. Reads refresh token from cookie or body.
2. If it exists, revokes matching DB rows with `updateMany`.
3. Deletes cached `user:<id>` if `req.user` exists.
4. Clears refresh cookie.
5. Writes `USER_LOGOUT` audit entry.
6. Returns success message.

### `forgotPassword`

Purpose:

- create a short-lived password reset token
- email the user
- prevent email enumeration

Step by step:

1. Reads `email`.
2. Looks up user.
3. If no user exists, still returns success.
4. Marks any old unused reset tokens as used.
5. Creates a new UUID reset token with 15-minute expiry.
6. Stores it in `PasswordReset`.
7. Builds reset link from `config.urls.passwordReset`.
8. Sends email without blocking response.
9. Writes `PASSWORD_RESET_REQUESTED`.
10. Returns success message.

Security benefit:

Attackers cannot tell whether an email exists from the API response.

### `resetPassword`

Purpose:

- validate reset token
- set a new password
- invalidate all sessions

Step by step:

1. Reads `token` and `password`.
2. Loads reset record by token.
3. Rejects if not found, used, or expired.
4. Hashes new password.
5. Runs a transaction:
   - update user password
   - mark reset token as used
   - revoke all refresh tokens for the user
6. clears Redis cache for that user
7. writes `PASSWORD_RESET_COMPLETED`
8. returns success

Security benefit:

Revoking all refresh tokens forces re-login everywhere after password reset.

### `verifyEmail`

Purpose:

- mark user email as verified
- consume verification token

Step by step:

1. Reads `token` from query string.
2. Rejects if token missing.
3. Loads verification record.
4. Rejects if invalid, used, or expired.
5. Runs a transaction:
   - set `user.isEmailVerified = true`
   - set `emailVerification.isUsed = true`
6. clears cache
7. returns success

## `src/controllers/userController.js`

This file manages profile data, password changes, user listing, role changes, and deactivation.

### `getMe`

Purpose:

- return the currently authenticated user

Behavior:

- uses `req.user.id`
- reloads from DB using `SAFE_USER_SELECT`
- throws 404 if somehow missing

Why reload from DB instead of directly returning `req.user`:

`req.user` from auth middleware only contains a limited subset of fields. `getMe` returns a fuller profile.

### `updateMe`

Purpose:

- update the authenticated user’s profile

Editable fields:

- `fullName`
- `phone`
- `countryCode`
- `country`
- `age`
- `gender`
- `address`
- `timezone`
- `theme`
- `avatarUrl`

Important implementation detail:

The update uses conditional object spreading, so only provided fields are written.

Example:

```js
...(fullName && { fullName })
```

That means falsy values like empty string will not be written when the code uses truthy checks. Fields checked with `!== undefined` can still be set to `null` or empty values depending on the input.

After updating:

- user cache is cleared
- audit log `USER_UPDATED` is written

### `changePassword`

Purpose:

- change password while logged in

Step by step:

1. Reads `currentPassword` and `newPassword`.
2. Rejects if either is missing.
3. Rejects if new password is too short.
4. Loads user by `req.user.id`.
5. Verifies current password via bcrypt.
6. Hashes new password.
7. Transaction:
   - updates password hash
   - revokes all refresh tokens
8. clears cache
9. writes `PASSWORD_CHANGED`
10. returns success

Important behavior:

The user is told to log in again because all refresh tokens are revoked.

### `getUsers`

Purpose:

- admin/manager list of users with filters and pagination

Query parameters:

- `page`
- `limit`
- `role`
- `search`
- `isActive`

How filtering works:

- `role` exact match
- `isActive` string converted to boolean
- `search` performs case-insensitive match on:
  - `fullName`
  - `email`

Response includes:

- `data`: user array
- `meta.total`
- `meta.page`
- `meta.limit`
- `meta.totalPages`

### `changeRole`

Purpose:

- let admins change another user’s role

Step by step:

1. Reads `id` from params and `role` from body.
2. Blocks self-role-change.
3. Loads target user.
4. If new role is `ADMIN`, only `SUPER_ADMIN` may do it.
5. Updates the target’s role.
6. clears target cache
7. writes audit log with:
   - `ROLE_CHANGED`
   - metadata `{ previousRole, newRole }`
8. returns updated user

Important rule:

Even though both `ADMIN` and `SUPER_ADMIN` can hit the route, only `SUPER_ADMIN` can promote somebody to `ADMIN`.

### `deactivateUser`

Purpose:

- disable another user account

Step by step:

1. Reads `id`.
2. Blocks self-deactivation.
3. Sets `isActive = false`.
4. Revokes all refresh tokens for that user.
5. clears cache
6. writes audit log using `USER_UPDATED` with metadata `{ action: 'deactivated' }`
7. returns success

Important note:

The user’s existing access token may still remain usable until it expires, but future authenticated requests that reload the user should fail because `authenticate` checks `isActive`.

## `src/controllers/auditController.js`

This file exposes audit logs for admins.

### `getLogs`

Purpose:

- paginated filtered audit log listing

Query parameters:

- `page`
- `limit`
- `actorId`
- `action`
- `targetType`
- `targetId`
- `from`
- `to`

How date filtering works:

- builds `createdAt.gte` if `from` exists
- builds `createdAt.lte` if `to` exists

Includes actor summary:

- `id`
- `fullName`
- `email`
- `role`

### `getLog`

Purpose:

- fetch a single audit record by ID

Behavior:

- loads by primary key
- includes actor summary
- returns 404 if not found

## `src/controllers/subscriptionController.js`

This file handles plan reading, subscription reading, order creation, webhook processing, and cancellation.

### `getSubscription`

Purpose:

- return current user subscription and the corresponding plan config

Step by step:

1. finds subscription by `userId`
2. finds plan config using subscription plan or defaults to `FREE`
3. returns both objects

### `getPlans`

Purpose:

- public route listing all plan configurations

Behavior:

- sorts by `priceMonthly` ascending

### `createOrder`

Purpose:

- intended to create a Razorpay order for upgrading subscription

Current status:

- partially implemented
- actual Razorpay SDK code is commented out
- returns a stub order object instead

Validation:

- only accepts `BUSINESS` or `ENTERPRISE`
- `billingCycle` defaults to `monthly`

Amount selection:

- yearly uses `priceYearly`
- otherwise `priceMonthly`

Response includes:

- fake `order`
- `keyId`
- selected `plan`
- `billingCycle`
- INR amount

This means the billing flow is scaffolded but not fully live.

### `razorpayWebhook`

Purpose:

- receive and verify Razorpay webhook events

Why raw body is needed:

Webhook signatures must be calculated from the exact raw request body. That is why `src/index.js` mounts this route before JSON parsing and uses `express.raw(...)`.

Step by step:

1. reads `x-razorpay-signature`
2. reads `req.rawBody`
3. rejects if either is missing
4. calculates HMAC SHA256 using `config.razorpay.webhookSecret`
5. rejects if signature mismatch
6. parses the JSON event
7. stores raw event in `PaymentEvent`
8. calls `handleRazorpayEvent(event)`
9. marks the event processed if handling succeeds
10. logs errors if handling fails
11. still returns success JSON to Razorpay

Important design choice:

It always returns success after receiving the event so Razorpay does not keep retrying because of your app-side processing issues.

### `handleRazorpayEvent(event)`

This is an internal helper, not an Express export.

Supported events:

#### `subscription.activated`

- extracts subscription entity
- reads `entity.notes.userId`
- upserts `Subscription`
- sets:
  - `status = ACTIVE`
  - `razorpaySubId`
  - billing period dates
- clears cache
- writes audit `PLAN_UPGRADED`

Important note:

It currently hardcodes `plan: 'BUSINESS'` in the `create` branch. The comment says plan should really be derived from Razorpay plan mapping.

#### `subscription.cancelled`

- finds user via `entity.notes.userId`
- updates status to `CANCELLED`
- sets `cancelledAt`
- clears cache
- writes `SUBSCRIPTION_CANCELLED`

#### `payment.failed`

- finds user via `entity.notes.userId`
- updates subscription status to `PAST_DUE`
- clears cache

#### default

- logs unhandled event type

### `cancelSubscription`

Purpose:

- user-triggered cancellation endpoint

Step by step:

1. loads subscription by `req.user.id`
2. rejects if missing or already cancelled
3. comment says to call Razorpay cancellation later when enabled
4. locally updates status to `CANCELLED`
5. sets `cancelledAt`
6. clears cache
7. writes `SUBSCRIPTION_CANCELLED`
8. returns success

Current limitation:

This cancels only in your local database. It does not actually call Razorpay yet.

## Request lifecycle examples

## Example 1: login

1. `POST /api/auth/login`
2. `authLimiter` runs
3. `loginValidator` runs
4. `authController.login` runs
5. password checked with bcrypt
6. access + refresh tokens created
7. refresh token stored in DB
8. refresh cookie set
9. audit log written
10. response sent

## Example 2: get current profile

1. `GET /api/users/me`
2. `authenticate` checks access token
3. Redis cache checked for user
4. fallback to Prisma if cache miss
5. `userController.getMe` fetches full profile using `SAFE_USER_SELECT`
6. response sent

## Example 3: password reset

1. `POST /api/auth/forgot-password`
2. forgot-password rate limiter runs
3. validator runs
4. reset token created in DB
5. email sent
6. later user hits `POST /api/auth/reset-password`
7. controller validates token
8. password updated
9. all refresh tokens revoked
10. cache cleared

## Security design choices in this backend

- passwords are hashed with bcrypt
- access tokens are short-lived
- refresh tokens are stored server-side and revocable
- refresh token rotation is implemented
- forgot-password response does not reveal whether email exists
- password reset revokes all sessions
- email verification uses single-use tokens
- route-level validation exists
- role-based authorization exists
- plan-based authorization helpers exist
- webhook signatures are verified
- health endpoint is excluded from noisy request logs

## Things that are partial, inconsistent, or worth cleaning up

These are not guesses. They come directly from the current server code.

## 1. `src/index.js` has duplicate startup and error handler blocks

This is the biggest structural issue. It should be cleaned so the app is started exactly once and middleware/exports appear once.

## 2. `resetPasswordValidator` is imported but not used

In `auth.routes.js`, `POST /reset-password` calls `authController.resetPassword` directly without the validator middleware.

## 3. Access token cookie support is inconsistent

`authenticate` can read `req.cookies.accessToken`, but login only sets a `refreshToken` cookie, not an `accessToken` cookie. So bearer token auth is the real path in current usage.

## 4. `REFRESH_TOKEN_TTL_DAYS` is hardcoded

Cookie lifetime is fixed at 7 days even if `JWT_REFRESH_EXPIRES_IN` changes.

## 5. Email template trial text is hardcoded to 14 days

If `TRIAL_DAYS` is changed in env, the email text can become inaccurate.

## 6. Razorpay order creation is stubbed

`createOrder` returns a fake order unless the Razorpay SDK is installed and the commented code is implemented.

## 7. Subscription plan derivation in webhook is incomplete

`subscription.activated` currently creates plan `BUSINESS` by default instead of deriving from actual Razorpay plan mapping.

## 8. README references `backend/` while actual folder here is `server/`

The README content appears copied from an earlier structure and is slightly out of sync with the current folder name.

## 9. Some installed packages are unused in the reviewed code

Examples:

- `multer`
- `zod`

That is not necessarily wrong, but it usually means either planned features or leftover dependencies.

## 10. Placeholder APIs return 501

Large product areas are still stubs, so the server is not a complete CRM backend yet.

## If you want to understand the code fastest

Read files in this order:

1. `src/index.js`
2. `src/utils/appSetup.js`
3. `src/routes/*.js`
4. `src/middleware/authenticate.js`
5. `src/middleware/authorize.js`
6. `src/controllers/authController.js`
7. `src/controllers/userController.js`
8. `src/controllers/subscriptionController.js`
9. `src/config/index.js`
10. `prisma/schema.prisma`

That order shows:

- how the app starts
- how requests are routed
- how auth works
- how business logic works
- what data exists underneath

## Minimum setup to make it run locally

If you only want enough config to start and test the auth/profile features:

1. create `.env`
2. set:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLIENT_URL`
   - `PORT`
3. run:
   - `npm install`
   - `npm run db:generate`
   - `npm run db:push`
   - `node prisma/seed.js`
   - `npm run dev`

Optional for fuller behavior:

- set Redis to enable caching
- set SMTP credentials to send emails
- set Razorpay keys only if you plan to complete payment integration

## Final summary

This backend is mainly an authentication, user-management, audit-log, and subscription foundation for a larger WhatsApp CRM product.

The parts that are strongest right now are:

- auth flow
- refresh token rotation
- user profile management
- audit logging
- Prisma schema structure
- basic subscription scaffolding

The parts that are still scaffolded or unfinished are:

- actual payment order integration
- several CRM feature areas
- startup cleanup in `src/index.js`

If you want, the next best follow-up would be to clean `src/index.js` and then create a second shorter file with a route-by-route cheat sheet for day-to-day use.
