import { Calendar, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface DashboardHeaderProps {
  timestamp: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function DashboardHeader({
  timestamp,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Campaign Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor and analyze your advertising performance
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-card px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Last updated:</span>
          <span className="font-medium text-foreground">
            {new Date(timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 border border-gray-300 rounded-md cursor-pointer"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </button>
      </div>
    </div>
  );
}
