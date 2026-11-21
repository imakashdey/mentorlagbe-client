import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mentorlagbe-server-taupe.vercel.app";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        plan: { type: "string" },
        phone: { type: "string" },
        bio: { type: "string" },
      },
    }),
  ],
});
