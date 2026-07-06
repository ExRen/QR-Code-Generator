import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth();
    if (!session) redirect("/login");
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-20 px-4 pb-8 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
