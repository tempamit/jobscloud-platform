import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRouter() {
  // 1. Get the securely encrypted session token
  const session = await getServerSession(authOptions);

  // 2. If they aren't logged in, kick them to login
  if (!session) {
    redirect("/login");
  }

  // 3. Read their role and route them to the correct dashboard
  if (session.user.role === "EMPLOYER") {
    redirect("/dashboard/employer");
  } else {
    redirect("/dashboard/seeker");
  }
}