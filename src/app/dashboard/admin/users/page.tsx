"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Shield, User as UserIcon } from "lucide-react";
import { getAdminUsers, updateAdminUserRole } from "@/lib/api";
import { User, Role } from "@/types";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => {
        console.error("Failed to load users:", err);
        toast.error("Failed to load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (targetUser: User, newRole: Role) => {
    const targetId = targetUser._id || targetUser.id;
    if (!targetId) return;

    if (targetUser.email === currentAdmin?.email) {
      toast.error("You cannot change your own role!");
      return;
    }

    setUpdatingId(targetId);
    try {
      await updateAdminUserRole(targetId, newRole);
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === targetId ? { ...u, role: newRole } : u
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0A0E09]">
          Registered User Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Manage roles and account permissions across all registered students, tutors, and administrators
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-[2rem] border border-[#0A0E09]/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#96EE60]" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Current Plan</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const uid = u._id || u.id || u.email;
                  const isSelf = u.email === currentAdmin?.email;

                  return (
                    <tr key={uid} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#96EE60] font-black text-[#0A0E09]">
                              {u.name?.charAt(0)}
                            </span>
                          )}
                          <div>
                            <p className="font-extrabold text-[#0A0E09]">
                              {u.name}
                            </p>
                            {isSelf && (
                              <span className="text-[10px] font-bold text-emerald-700">
                                (You)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-600">
                        {u.email}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {u.phone || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            u.plan === "pro"
                              ? "bg-[#96EE60] text-[#0A0E09]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.plan || "free"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "tutor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isSelf ? (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            Admin (Self)
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={updatingId === uid}
                            onChange={(e) =>
                              handleRoleChange(u, e.target.value as Role)
                            }
                            className="rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0A0E09] outline-none transition focus:border-[#0A0E09] disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-gray-500">
            No registered users found.
          </div>
        )}
      </div>
    </div>
  );
}
