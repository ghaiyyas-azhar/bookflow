import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BarChart3 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">Reports</h1>
      <p className="mt-2 text-muted-foreground">View reports. Content coming soon.</p>
    </div>
  );
}
