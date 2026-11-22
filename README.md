# MentorLagbe (Smart Tuition & Mentorship Platform)

A full-stack, role-based EdTech tuition finder and mentorship booking platform built with Next.js (App Router), Express, MongoDB, BetterAuth, JWT, and Stripe.

- **Live URL:** [https://mentorlagbe-client-livid.vercel.app](https://mentorlagbe-client-livid.vercel.app)
- **Server API:** [https://mentorlagbe-server-taupe.vercel.app](https://mentorlagbe-server-taupe.vercel.app)
- **Client GitHub Repository:** [https://github.com/imakashdey/mentorlagbe-client](https://github.com/imakashdey/mentorlagbe-client)
- **Server GitHub Repository:** [https://github.com/imakashdey/mentorlagbe-server](https://github.com/imakashdey/mentorlagbe-server)

---

## 🎯 Purpose & Overview
MentorLagbe bridges the gap between qualified academic mentors and students in Bangladesh and worldwide. It enables students to easily find verified tutors by subject, class level, mode (Online/Offline), and budget. Skiled tutors can showcase their batches, manage applicants, and upgrade their membership via Stripe. Platform administrators oversee moderation, role assignments, and subscription revenue.

---

## 🔐 Credentials for Testing

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Admin** | `admin@mentorlagbe.com` | `Admin@123456` | Full platform overview, user roles, tuition moderation, Stripe revenue |
| **Pro Tutor** | `rahim.tutor@mentorlagbe.com` | `Tutor@123456` | Unlimited postings, applicant acceptance/rejection, verified pro badge |
| **Free Tutor** | `imran.tutor@mentorlagbe.com` | `Tutor@123456` | Max 2 tuition post limit |
| **Pro Student** | `student2@mentorlagbe.com` | `Student@123456` | Unlimited bookmarks, priority booking, review submission |
| **Free Student** | `student1@mentorlagbe.com` | `Student@123456` | 5 bookmark limit, application submission & cancel |

---

## 🚀 Key Features

### 1. Authentication & Role-Based Authorization
- **BetterAuth Integration:** Secure sign up and login with MongoDB adapter.
- **JWT Middleware Security:** Express routes protected with custom middlewares (`verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`).
- **Dynamic Role Navigation:** Auto-redirects users to role-specific workspaces upon sign in.

### 2. Tuitions & Discovery
- **Server-Side Search & Multi-Filters (Challenge 1):** Real-time search by Title/Subject and filter by Class Level and Mode (Online/Offline).
- **Server-Side Pagination (Optional 1):** Custom numbered circular pagination controls for browsing large datasets.
- **Tuition Details Page:** Complete listing overview, teacher profile summary, schedule, fee breakdown, and verified pro badge.

### 3. Student Application Workflow
- **Role-Restricted Apply:** Exclusively student accounts can submit applications; tutors/admins are prevented with informative banners.
- **Application Tracking:** Students view all applied batches, live status badges (`pending`, `accepted`, `rejected`), and can cancel pending applications.

### 4. Student Review & Rating System (Optional 5)
- **Verified Student Reviews:** Enrolled students whose application status is `accepted` can submit a 1–5 star rating and feedback.
- **Tuition Details Review Section:** Displays average rating, review count, and reviews with student avatars.
- **Quick Review from Dashboard:** Students can review mentors directly from `My Applications`.

### 5. Bookmark & Saved Tuitions (Optional 3)
- Save and unsave favorite tuition postings with persistent storage and a dedicated saved tuitions view.
- 5 bookmark cap for Free Students, with instant toast prompting an upgrade to Pro.

### 6. Tutor Dashboard & Moderation
- **Post a Tuition (Challenge 3):** Form with direct ImgBB file uploads and instant Base64 fallback.
- **Free vs. Pro Posting Limits:** Free tutors can post up to 2 tuitions; Pro tutors can post unlimited.
- **Applicant Management:** Tutors can accept or reject student applications.

### 7. Stripe Pro Subscription Upgrade
- Stripe Checkout for upgrading Tutors ($15) and Students ($10).
- Session verification updates the `payments` collection and elevates account status to `pro`.

### 8. Admin Moderation Suite
- **User Management:** View registered users and update roles (`student`, `tutor`, `admin`).
- **Tuition Moderation:** Approve or reject newly posted listings before public display.
- **Revenue Overview:** Track Stripe subscription transactions and total earnings.

---

## 📦 NPM Packages Used

### Client Dependencies
- `next`: ^16.4.6 (Next.js App Router & Server Components)
- `react` & `react-dom`: ^19.0.0
- `better-auth`: ^1.2.9 (Authentication library)
- `jose`: ^6.0.8 (JWT token signing & verification)
- `lucide-react`: ^1.16.0 (Modern icon library with rebrand X icon)
- `sonner`: ^2.0.1 (Toast notification system)
- `canvas-confetti`: ^1.9.4 (Payment celebration animations)
- `tailwindcss` & `@tailwindcss/postcss`: ^4.0.0

---

## 💻 Local Development Setup

```bash
# Clone the client repository
git clone https://github.com/imakashdey/mentorlagbe-client.git
cd mentorlagbe-client

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
