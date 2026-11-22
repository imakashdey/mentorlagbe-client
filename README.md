# MentorLagbe Server

Express + MongoDB REST API for **MentorLagbe**, a role-based tuition and mentorship platform (Students, Tutors, Admins).

- **Live API:** https://mentorlagbe-server-taupe.vercel.app
- **Live Client:** https://mentorlagbe-client-livid.vercel.app
- **Client Repo:** https://github.com/imakashdey/mentorlagbe-client

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mentorlagbe.com | Admin@123456 |
| Pro Tutor | rahim.tutor@mentorlagbe.com | Tutor@123456 |
| Student (Free) | student1@mentorlagbe.com | Student@123456 |

## Key Features

- BetterAuth with MongoDB adapter (`/api/auth/*`) and role-aware sign up
- JWT issuing only for users with a valid session (`POST /api/jwt`)
- Role middlewares: `verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`
- Tuitions: server-side search, filters and pagination; full CRUD for tutors; free plan limit of 2 posts
- Applications: students apply (duplicates blocked), tutors accept/reject
- Admin: approve/reject tuitions, manage user roles, view transactions
- Stripe Checkout with session verification, saving payments and upgrading the user plan to `pro`
- Public `/stats` endpoint returning real platform counts
- Restricted CORS (localhost and `CLIENT_URL` only)

## MongoDB Collections

`users`, `tuitions`, `applications`, `payments`

## Main Endpoints

| Route | Description |
|-------|-------------|
| `/api/auth/*` | BetterAuth (sign up, sign in, session) |
| `POST /api/jwt` | Issue JWT for the signed-in user |
| `/tuitions` | Public list, latest, filters, details; tutor CRUD |
| `/applications` | Student apply/cancel, tutor manage applicants |
| `/users` | Profile update, bookmarks |
| `/admin` | Users, tuition moderation, stats, transactions |
| `/payments` | Stripe checkout and session verification |
| `GET /stats` | Public platform statistics |
| `GET /me` | Current user (JWT required) |

## NPM Packages

`express`, `cors`, `dotenv`, `mongodb`, `better-auth`, `@better-auth/mongo-adapter`, `jsonwebtoken`, `stripe`

## Local Setup

```bash
git clone https://github.com/imakashdey/mentorlagbe-server.git
cd mentorlagbe-server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:5000
JWT_SECRET=your_random_secret
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the server:

```bash
npm run dev
```

## Deployment

Deployed on Vercel. Set the same environment variables in the Vercel project, with `CLIENT_URL=https://mentorlagbe-client-livid.vercel.app` (no trailing slash).