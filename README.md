# MentorLagbe (Smart Tuition & Mentorship Platform)

A full-stack, role-based EdTech platform connecting qualified Tutors offering subject-wise tuition batches or 1-on-1 mentorship with Students seeking personalized academic guidance, moderated by Administrators.

- **Live Frontend URL:** [https://mentorlagbe-client.vercel.app](https://mentorlagbe-client.vercel.app)
- **Live Backend API URL:** [https://mentorlagbe-server-taupe.vercel.app](https://mentorlagbe-server-taupe.vercel.app)

---

## 🔑 Demo & Testing Credentials

For quick evaluation, one-click demo credentials buttons are available directly on the **Sign In** page.

| Role | Email | Password | Privileges / Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mentorlagbe.com` | `Admin@123456` | Platform stats, user role management, tuition approval flow, Stripe transaction log |
| **Pro Tutor** | `rahim.tutor@mentorlagbe.com` | `Tutor@123456` | Unlimited tuition posts, verified badge, applicant accept/reject, active toggle |
| **Free Tutor** | `imran.tutor@mentorlagbe.com` | `Tutor@123456` | 2 free tuition posts limit test, Pro upgrade flow |
| **Student (Pro)** | `student2@mentorlagbe.com` | `Student@123456` | Priority booking, apply for tuitions, track applications, cancel pending applications |
| **Student (Free)** | `student1@mentorlagbe.com` | `Student@123456` | Apply for tuitions, cancel pending applications, bookmark tuitions |

---

## 🌟 Key Features

### 1. Robust Role-Based Authentication & Authorization
- Powered by **BetterAuth** with MongoDB adapter and client-side plugins.
- **JWT token integration:** Protected API calls pass `Authorization: Bearer <token>`.
- Custom Express role middlewares: `verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`.
- **Zero-Flicker Session Persistence:** Authenticated users never get booted or redirected to login on page reloads.

### 2. Browse Tuitions & Server-Side Filtering (Challenge 1 & Optional 1)
- **Server-Side Search:** Instant lookup by tuition title or subject.
- **Multi-Parameter Filtering:** Subject, class level (SSC, HSC, Admission, University, etc.), mode (Online vs Offline).
- **Server-Side Pagination:** MongoDB `.skip()` and `.limit()` with Previous, Next, and Page number controls.
- **Bookmarks & Saved Tuitions (Optional 3):** Students can bookmark favorite listings and view them in their saved dashboard.

### 3. Tuition Details & Role-Restricted Application Flow
- Comprehensive tuition batch details: title, subject, schedule, mode, location, monthly fee, description, tutor bio, and verified badges.
- **Role Enforcement:** Only accounts with `role: "student"` can apply. Tutors and Admins are restricted with notices.
- Prevents duplicate applications from the same student for the same tuition.
- Real-time application tracking with instant status badges (`Pending`, `Accepted`, `Rejected`).

### 4. Direct Image Upload via ImgBB API (Challenge 3)
- Direct image file upload to **ImgBB API** on both the **Tutor's Post a Tuition** page and the shared **Update Profile** page.
- Instant image preview and direct URL fallback.

### 5. Stripe Subscription Checkout & Database Sync
- Seamless Stripe Checkout Session integration for upgrading to Pro Plan:
  - **Tutors ($15):** Unlimited tuition posts and verified mentor badge.
  - **Students ($10):** Priority application queue and enhanced booking.
- Automated session verification (`/payments/verify-session`) recording transactions in the `payments` collection and upgrading the user's plan to `pro` in the `users` collection.
- Custom `/payment/success` and `/payment/cancel` status pages.

### 6. Role-Based Dashboards
- **Student Dashboard:** Overview stats, My Applications management (with cancel action for pending submissions), and Saved Tuitions.
- **Tutor Dashboard:** Overview stats, Post a Tuition (with free limit validation), My Created Tuitions (full CRUD: edit, delete, toggle active/closed), and Manage Applicants (accept/reject).
- **Admin Dashboard:** Overview stats (Total Users, Tutors, Students, Live Tuitions, Stripe Revenue), User Management (role switching), Tuition Moderation (approve/reject), and Stripe Transactions history.
- **Shared Update Profile:** Name, phone, bio, and profile picture upload for all authenticated users.

### 7. Custom UX & UI Polish
- Custom loading spinner loader (`loading.tsx`).
- Custom 404 page (`not-found.tsx`) and error boundary (`error.tsx`).
- Rich toast notifications with `sonner`.
- Clean pastel design system with cohesive color contrast (Dark `#0A0E09`, Pink `#FBE4E3`, Lime `#ECFAB5`, Lavender `#ECEEFE`, Sky `#D9F0FF`, Green `#96EE60`, Mint `#7FD09F`).

---

## 🛠️ Tech Stack & NPM Packages Used

### Client
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React (`lucide-react`)
- **Authentication:** BetterAuth React Client (`better-auth`)
- **Notifications:** Sonner (`sonner`)
- **Forms & Validation:** React Hook Form (`react-hook-form`), Zod (`zod`), Hookform Resolvers (`@hookform/resolvers`)
- **HTTP Client:** Native Fetch & Axios (`axios`)

### Server
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Native driver)
- **Auth & JWT:** BetterAuth with MongoDB adapter, JSONWebToken (`jsonwebtoken`)
- **Payments:** Stripe SDK (`stripe`)
- **CORS & Environment:** `cors`, `dotenv`
- **Hosting:** Vercel Serverless

---

## 💻 Local Setup Instructions

### Client Setup
```bash
cd mentorlagbe-client
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://mentorlagbe-server-taupe.vercel.app
NEXT_PUBLIC_IMGBB_API_KEY=8c8430b200b39ad34b223d6a62a74c77
```

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
