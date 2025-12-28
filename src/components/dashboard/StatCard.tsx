import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

type Variant = "blue" | "green" | "purple" | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: Variant;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const variantStyles: Record<Variant, string> = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-800",
  green: "bg-gradient-to-br from-green-500 to-emerald-800",
  purple: "bg-gradient-to-br from-purple-500 to-purple-800",
  amber: "bg-gradient-to-br from-amber-500 to-amber-800",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg",
        "transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl",
        "animate-slide-up",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/80">{title}</p>

          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>

          {subtitle && (
            <div className="flex items-center gap-2 pt-1">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                    trend.isPositive
                      ? "bg-white/20 text-white"
                      : "bg-red-500/20 text-red-100"
                  )}
                >
                  {trend.isPositive ? "▲" : "▼"} {Math.abs(trend.value)}%
                </span>
              )}
              <span className="text-sm text-white/70">{subtitle}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
