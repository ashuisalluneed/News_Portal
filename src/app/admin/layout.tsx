import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage system settings and users",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 border-b border-outline/30 pb-4">
          <h1 className="text-3xl font-black text-foreground mb-2" style={{ fontFamily: 'var(--font-heading), serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-foreground-muted">Manage users, view metrics, and adjust system settings.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
