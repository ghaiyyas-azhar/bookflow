import type { Metadata } from "next";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "BookFlow Admin Dashboard",
  description: "Premium modern SaaS admin dashboard for BookFlow.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-[var(--sidebar-width,16rem)]">
        <Header />
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}