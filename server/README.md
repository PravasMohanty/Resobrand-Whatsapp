# Resobrand Backend — Member 2: Identity, Access & Billing

## Stack
- **Runtime**: Node.js + Express
- **Language**: JavaScript (CommonJS)
- **ORM**: Prisma → PostgreSQL (NeonDB)
- **Cache**: Redis (ioredis)
- **Auth**: JWT (access + refresh token rotation)
- **Passwords**: bcryptjs
- **Email**: Nodemailer (SMTP)
- **Payments**: Razorpay (webhook-driven)
- **Pattern**: MVC

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # All DB models (User, Subscription, AuditLog, etc.)
│   └── seed.js              # Plan config seeder
├── src/
│   ├── config/
│   │   ├── index.js         # Centralized env config
│   │   └── redis.js         # Redis client + cache helpers
│   ├── controllers/
│   │   ├── authController.js        # register, login, logout, refresh, forgot/reset password
│   │   ├── userController.js        # getMe, updateMe, changePassword, listUsers, changeRole
│   │   ├── auditController.js       # getLogs, getLog
│   │   └── subscriptionController.js # plans, order, Razorpay webhook, cancel
│   ├── middleware/
│   │   ├── authenticate.js   # JWT verify + Redis-cached user attach
│   │   ├── authorize.js      # RBAC role check + plan feature entitlement
│   │   ├── errorHandler.js   # Global error handler
│   │   └── validators.js     # express-validator chains
│   ├── prisma/
│   │   └── client.js         # Prisma singleton (prevents hot-reload duplicates)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── audit.routes.js
│   │   └── subscription.routes.js
│   └── utils/
│       ├── apiError.js       # ApiError class + asyncHandler
│       ├── audit.js          # Fire-and-forget audit logger
│       ├── email.js          # Nodemailer templates
│       ├── jwt.js            # Sign/verify access & refresh tokens
│       └── logger.js         # Winston structured logger
└── frontend_patches/
    ├── Login.jsx             # Drop into src/pages/Login.jsx
    └── Register.jsx          # Drop into src/pages/Register.jsx
```

---

## Setup

### 1. Environment
```bash
cp .env.example .env
# Fill in: DATABASE_URL, JWT secrets, SMTP, Redis, Razorpay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Push DB schema to NeonDB
```bash
npx prisma db push
# or for migrations:
npx prisma migrate dev --name init
```

### 4. Seed plan configs
```bash
node prisma/seed.js
```

### 5. Start dev server
```bash
npm run dev
# Server starts on http://localhost:5000
```

---

## API Endpoints

### Auth  `POST /api/auth/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Create account + send email verification |
| POST | `/login` | — | Login → access token + refresh cookie |
| POST | `/refresh-token` | Cookie | Rotate refresh token |
| POST | `/logout` | ✅ | Revoke refresh token |
| POST | `/forgot-password` | — | Send reset email |
| POST | `/reset-password` | — | Set new password via token |
| GET | `/verify-email?token=` | — | Mark email verified |

### Users  `GET|PATCH /api/users/`
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/me` | ✅ | Any | Get own profile |
| PATCH | `/me` | ✅ | Any | Update own profile |
| POST | `/me/change-password` | ✅ | Any | Change password |
| GET | `/` | ✅ | MANAGER+ | List all users (paginated) |
| PATCH | `/:id/role` | ✅ | ADMIN+ | Change user role |
| PATCH | `/:id/deactivate` | ✅ | ADMIN+ | Deactivate user |

### Subscriptions  `/api/subscriptions/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/plans` | — | List all plan configs |
| GET | `/my` | ✅ | Get own subscription |
| POST | `/order` | ✅ | Create Razorpay order |
| POST | `/cancel` | ✅ | Cancel subscription |

### Audit Logs  `/api/audit-logs/`
| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/` | ✅ | ADMIN+ |
| GET | `/:id` | ✅ | ADMIN+ |

### Webhook (no auth, signature-verified)
| Method | Path |
|--------|------|
| POST | `/api/webhooks/razorpay` |

---

## How Other Members Use Your Work

### Using the auth middleware
```js
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Any authenticated user
router.get('/my-route', authenticate, handler);

// Only ADMIN or SUPER_ADMIN
router.delete('/admin-route', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), handler);

// Check plan feature (e.g. AI)
const { requireFeature } = require('../middleware/authorize');
router.post('/ai-reply', authenticate, requireFeature('canUseAI'), handler);
```

### Writing an audit log
```js
const { audit } = require('../utils/audit');
await audit({ actorId: req.user.id, action: 'LEAD_EXPORTED', targetType: 'Lead', req });
```

### ApiError usage
```js
const { ApiError, asyncHandler } = require('../utils/apiError');

exports.myHandler = asyncHandler(async (req, res) => {
  const item = await db.findById(req.params.id);
  if (!item) throw ApiError.notFound('Item not found.');
  res.json({ success: true, data: item });
});
```

---

## Frontend Integration

Copy the patched files to your React project:
```bash
cp frontend_patches/Login.jsx   ../frontend/src/pages/Login.jsx
cp frontend_patches/Register.jsx ../frontend/src/pages/Register.jsx
```

Add to your `vite.config.js` or `.env`:
```
VITE_API_URL=http://localhost:5000
```

---

## Security Decisions

| Decision | Why |
|----------|-----|
| Refresh token in HttpOnly cookie | XSS can't steal it |
| Refresh token rotation | Stolen token can't be reused |
| 15-min access token TTL | Limits blast radius if leaked |
| bcrypt rounds=12 | Slow enough to resist brute-force |
| Email enumeration prevention | Forgot-password always returns same message |
| Password reset invalidates all sessions | Forces re-auth after compromise |
| Razorpay webhook signature verify | Prevents fake payment events |
| Redis user cache (5 min) | Reduces DB load on every authenticated request |
