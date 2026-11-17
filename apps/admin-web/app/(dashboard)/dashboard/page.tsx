import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LayoutDashboard className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to BookFlow Admin Dashboard. Content coming soon.
      </p>
    </div>
  );
}
