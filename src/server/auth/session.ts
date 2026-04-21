import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth/auth";

export function getSession() {
  return getServerSession(authOptions);
}

