import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode | LucideIcon;
  trend?: number;
  description?: string;
  color?: "blue" | "green" | "purple" | "amber" | "red" | "indigo" | "teal";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  onClick?: () => void;
  badge?: string;
  changeType?: "percent" | "value" | "duration";
  trendDuration?: string;
  compact?: boolean;
  showTrendIcon?: boolean;
  gradient?: boolean;
  shadow?: boolean;
  bordered?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  color = "blue",
  size = "md",
  isLoading = false,
  onClick,
  badge,
  changeType = "percent",
  trendDuration = "vs last period",
  compact = false,
  showTrendIcon = true,
  gradient = false,
  shadow = true,
  bordered = true,
}: StatCardProps) {
  // Color schemes with gradients
  const colorSchemes = {
    blue: {
      bg: gradient
        ? "bg-gradient-to-br from-blue-50 to-blue-100"
        : "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      gradient: "from-blue-400 to-blue-600",
    },
    green: {
      bg: gradient
        ? "bg-gradient-to-br from-green-50 to-emerald-100"
        : "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badge: "bg-green-100 text-green-700",
      gradient: "from-green-400 to-emerald-600",
    },
    purple: {
      bg: gradient
        ? "bg-gradient-to-br from-purple-50 to-purple-100"
        : "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
      gradient: "from-purple-400 to-purple-600",
    },
    amber: {
      bg: gradient
        ? "bg-gradient-to-br from-amber-50 to-amber-100"
        : "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      gradient: "from-amber-400 to-amber-600",
    },
    red: {
      bg: gradient ? "bg-gradient-to-br from-red-50 to-red-100" : "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      badge: "bg-red-100 text-red-700",
      gradient: "from-red-400 to-red-600",
    },
    indigo: {
      bg: gradient
        ? "bg-gradient-to-br from-indigo-50 to-indigo-100"
        : "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      gradient: "from-indigo-400 to-indigo-600",
    },
    teal: {
      bg: gradient
        ? "bg-gradient-to-br from-teal-50 to-teal-100"
        : "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-700",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      badge: "bg-teal-100 text-teal-700",
      gradient: "from-teal-400 to-teal-600",
    },
  };

  // Size classes
  const sizeClasses = {
    sm: {
      padding: "p-3",
      text: "text-sm",
      value: "text-xl",
      icon: "w-4 h-4",
    },
    md: {
      padding: "p-4 md:p-5",
      text: "text-sm",
      value: "text-2xl md:text-3xl",
      icon: "w-5 h-5",
    },
    lg: {
      padding: "p-5 md:p-6",
      text: "text-base",
      value: "text-3xl md:text-4xl",
      icon: "w-6 h-6",
    },
  };

  const scheme = colorSchemes[color];
  const sizeConfig = sizeClasses[size];

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={`${scheme.bg} ${
          bordered ? `border ${scheme.border}` : ""
        } rounded-xl ${sizeConfig.padding} ${
          shadow ? "shadow-sm" : ""
        } animate-pulse`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  // Format trend value
  const formatTrend = (value: number) => {
    if (changeType === "value") {
      return Math.abs(value).toLocaleString();
    } else if (changeType === "duration") {
      return `${Math.abs(value)} days`;
    }
    return `${Math.abs(value)}%`;
  };

  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <div
      onClick={onClick}
      className={`
        ${scheme.bg} 
        ${bordered ? `border ${scheme.border}` : ""} 
        rounded-xl 
        ${sizeConfig.padding} 
        transition-all duration-200 
        ${shadow ? "shadow-sm hover:shadow-md" : ""}
        ${
          onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""
        }
        overflow-hidden
        relative
        group
      `}
    >
      {/* Optional gradient accent */}
      {gradient && (
        <div
          className={`absolute top-0 right-0 w-16 h-16 bg-linear-to-br ${scheme.gradient} opacity-5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition-transform duration-300`}
        ></div>
      )}

      {/* Badge */}
      {badge && (
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${scheme.badge}`}
        >
          {badge}
        </div>
      )}

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span
          className={`${sizeConfig.text} font-medium ${scheme.text} opacity-90`}
        >
          {label}
        </span>

        {Icon && (
          <div
            className={`p-2 rounded-lg ${scheme.iconBg} ${scheme.iconColor} transition-colors group-hover:opacity-90`}
          >
            {typeof Icon === "function" ? (
              <Icon className={sizeConfig.icon} />
            ) : (
              <div className={sizeConfig.icon}>{Icon}</div>
            )}
          </div>
        )}
      </div>

      <div className="mb-2 relative z-10">
        <div
          className={`${sizeConfig.value} font-bold text-gray-900 mb-1 ${
            compact ? "truncate" : ""
          }`}
        >
          {value}
        </div>

        {(description || (trend !== undefined && !compact)) && (
          <div className="flex items-center justify-between">
            {description && (
              <p
                className={`${sizeConfig.text} ${scheme.text} opacity-75 ${
                  compact ? "truncate" : ""
                }`}
              >
                {description}
              </p>
            )}

            {trend !== undefined && !compact && (
              <div className="flex items-center gap-1">
                {showTrendIcon && (
                  <div
                    className={
                      isPositiveTrend ? "text-green-500" : "text-red-500"
                    }
                  >
                    {isPositiveTrend ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                )}
                <span
                  className={`${sizeConfig.text} font-medium ${
                    isPositiveTrend ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositiveTrend ? "+" : "-"}
                  {formatTrend(trend)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Compact trend display */}
        {trend !== undefined && compact && (
          <div className="mt-1 flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                isPositiveTrend ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositiveTrend ? "↗" : "↘"} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-500">{trendDuration}</span>
          </div>
        )}
      </div>

      {/* Trend bar for visual representation */}
      {trend !== undefined && !compact && (
        <div className="mt-3 relative z-10">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Trend</span>
            <span>{trendDuration}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPositiveTrend
                  ? "bg-linear-to-r from-green-400 to-green-600"
                  : "bg-linear-to-r from-red-400 to-red-600"
              }`}
              style={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
