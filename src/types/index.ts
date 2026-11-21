export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type TuitionMode = "Online" | "Offline";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  plan?: Plan;
  phone?: string;
  bio?: string;
  image?: string | null;
  createdAt?: string | Date;
}

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location?: string;
  monthlyFee: number;
  daysPerWeek?: number;
  bannerImage?: string;
  description?: string;
  tutorName: string;
  tutorEmail?: string;
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
  createdAt?: string | Date;
  tutor?: Partial<User>;
}

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote?: string;
  status: ApplicationStatus;
  appliedAt: string | Date;
}

export interface Payment {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: Role;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string | Date;
}

export interface StudentStats {
  totalApplied: number;
  accepted: number;
  pending: number;
  plan: Plan;
}

export interface TutorStats {
  totalTuitions: number;
  activeApproved: number;
  totalApplicants: number;
  plan: Plan;
}

export interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  pendingTuitions: number;
  approvedTuitions: number;
  rejectedTuitions: number;
  totalRevenue: number;
}
