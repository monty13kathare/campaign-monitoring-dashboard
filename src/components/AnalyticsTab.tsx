import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LineChart,
  BarChart,
  AreaChart,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  DownloadCloud,
  ChevronDown,
  Calendar as CalendarIcon,
  Zap,
  ChartArea,
} from "lucide-react";
import { formatCurrency, formatNumber } from "../lib/formatters";

interface AnalyticsTabProps {
  currentMetrics?: any;
  onExport?: (format: "csv" | "json" | "pdf") => void;
  onScheduleReport?: () => void;
  onRefresh?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  currentMetrics,
  onExport,
  isLoading = false,
}) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "custom">(
    "7d"
  );
  const [chartType, setChartType] = useState<
    "line" | "bar" | "area" | "composed"
  >("line");

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "impressions",
    // "clicks",
    // "conversions",
    // "revenue",
    // "spend"
  ]);
  const [realtimeHistory, setRealtimeHistory] = useState<any[]>([]);
  const [chartKey, setChartKey] = useState(0);
   const [chartData, setChartData] = useState<any[]>([]);

  const previousMetricsRef = useRef<any | null>(null);
   const prevMetrics = useRef<any | null>(null);

  useEffect(() => {
    if (realtimeHistory.length) {
      setChartKey((k) => k + 1);
    }
  }, [realtimeHistory]);

  useEffect(() => {
      if (!currentMetrics) return;
  
      setChartData((prev) => [
        ...prev.slice(-29), // last 30 entries
        {
          date: new Date(currentMetrics.timestamp).toLocaleTimeString(),
          impressions: currentMetrics.impressions,
          clicks: currentMetrics.clicks,
          conversions: currentMetrics.conversions,
          revenue: Number(currentMetrics.conversions ?? 0) * 100,
          spend: currentMetrics.spend,
          impressionsTarget: currentMetrics.impressions * 1.1,
          clicksTarget: currentMetrics.clicks * 1.1,
          conversionsTarget: currentMetrics.conversions * 1.1,
          spendTarget: currentMetrics.spend * 1.1,
        },
      ]);
  
      prevMetrics.current = currentMetrics;
    }, [currentMetrics]);

  useEffect(() => {
    if (!currentMetrics) return;

    const prev = previousMetricsRef.current;

    // Ignore duplicate data
    if (prev && prev.timestamp === currentMetrics.timestamp) return;

    previousMetricsRef.current = currentMetrics;

    setRealtimeHistory((prevHistory) => {
      const next = [
        ...prevHistory,
        {
          date: new Date(currentMetrics.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          }),

          impressions: Number(currentMetrics.impressions ?? 0),
          clicks: Number(currentMetrics.clicks ?? 0),
          conversions: Number(currentMetrics.conversions ?? 0),
          spend: Number(currentMetrics.spend ?? 0),

          revenue: Number(currentMetrics.conversions ?? 0) * 100,

          ctr: Number(currentMetrics.ctr ?? 0),
          engagement:
            currentMetrics.impressions > 0
              ? (currentMetrics.clicks / currentMetrics.impressions) * 100
              : 0,

          roi:
            currentMetrics.spend > 0
              ? ((currentMetrics.conversions * 100 - currentMetrics.spend) /
                  currentMetrics.spend) *
                100
              : 0,
        },
      ];

      // keep last 90 points only
      return next.slice(-90);
    });
  }, [currentMetrics]);

 

  const summaryStats = useMemo(() => {
    if (!currentMetrics) return null;

    return {
      totalImpressions: currentMetrics.impressions,
      totalClicks: currentMetrics.clicks,
      totalConversions: currentMetrics.conversions,
      totalSpend: currentMetrics.spend,
      totalRevenue: currentMetrics.conversions * 100,

      avgCTR: currentMetrics.ctr,
      avgConversionRate: currentMetrics.conversion_rate,
      avgCPC: currentMetrics.cpc,

      avgROI:
        ((currentMetrics.conversions * 100 - currentMetrics.spend) /
          currentMetrics.spend) *
        100,
    };
  }, [currentMetrics]);

  // Performance metrics over time

  const performanceMetrics = useMemo(() => {
    if (!summaryStats || !previousMetricsRef.current) return [];

    const prev = previousMetricsRef.current;

    return [
      {
        label: "Impression Growth",
        current: currentMetrics.impressions,
        previous: prev.impressions,
        icon: Eye,
        color: "blue",
      },
      {
        label: "Click Growth",
        current: currentMetrics.clicks,
        previous: prev.clicks,
        icon: MousePointer,
        color: "green",
      },
      {
        label: "Conversion Growth",
        current: currentMetrics.conversions,
        previous: prev.conversions,
        icon: Target,
        color: "purple",
      },
      {
        label: "Revenue Growth",
        current: currentMetrics.conversions * 100,
        previous: prev.conversions * 100,
        icon: DollarSign,
        color: "amber",
      },
       {
      label: "Spend Growth",
      current: currentMetrics.spend,
      previous: prev.spend,
      icon: DollarSign,
      color: "red", // intentional: rising spend requires scrutiny
    },
    ];
  }, [currentMetrics, summaryStats]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {entry.dataKey === "spend" || entry.dataKey === "revenue"
                  ? `$${entry.value.toLocaleString()}`
                  : entry.dataKey === "ctr" ||
                    entry.dataKey === "conversion_rate" ||
                    entry.dataKey === "engagement"
                  ? `${entry.value.toFixed(2)}%`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  

  const performanceScore = useMemo(() => {
    if (
      currentMetrics?.ctr == null ||
      currentMetrics?.conversion_rate == null
    ) {
      return 0;
    }

    return (
      Math.round(
        (currentMetrics.ctr * 0.4 + currentMetrics.conversion_rate * 0.6) * 10
      ) / 10
    );
  }, [currentMetrics?.ctr, currentMetrics?.conversion_rate]);

  

  if (isLoading) {
    return (
      <div className="min-h-150 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Analytics
          </h3>
          <p className="text-gray-600">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Analytics
          </h2>
          <p className="text-gray-600">
            Deep dive into campaign performance and trends
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range}
              </button>
            ))}
            <button
              onClick={() => setTimeRange("custom")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                timeRange === "custom"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Custom
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded-md transition-colors ${
                chartType === "line"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded-md transition-colors ${
                chartType === "bar"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Bar Chart"
            >
              <BarChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`p-2 rounded-md transition-colors ${
                chartType === "area"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Area Chart"
            >
              <ChartArea  className="w-4 h-4" />
            </button>
          
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 invisible group-hover:visible z-10">
                <button
                  onClick={() => onExport?.("csv")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  CSV Format
                </button>
                <button
                  onClick={() => onExport?.("json")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  JSON Format
                </button>
                <button
                  onClick={() => onExport?.("pdf")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  PDF Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const percentageChange =
              metric.previous === 0
                ? 0
                : ((metric.current - metric.previous) / metric.previous) * 100;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      metric.color === "blue"
                        ? "bg-blue-50"
                        : metric.color === "green"
                        ? "bg-green-50"
                        : metric.color === "purple"
                        ? "bg-purple-50"
                        : "bg-amber-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        metric.color === "blue"
                          ? "text-blue-600"
                          : metric.color === "green"
                          ? "text-green-600"
                          : metric.color === "purple"
                          ? "text-purple-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      percentageChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {percentageChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(percentageChange).toFixed(1)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.label.includes("Revenue")
                    ? formatCurrency(metric.current)
                    : formatNumber(metric.current)}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  vs {formatNumber(metric.previous)} previous period
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-500">Overall Score</span>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-1">
              {performanceScore}/10
            </div>

            <div className="text-sm text-gray-600">
              Based on CTR & Conversion Rate
            </div>

            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${(performanceScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Trends
            </h3>
            <p className="text-sm text-gray-600">Daily metrics over time</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Metric Toggles */}
            <div className="flex flex-wrap gap-2">
              {["impressions", "clicks", "conversions", "spend", "revenue"].map(
                (metric) => (
                  <button
                    key={metric}
                    onClick={() => {
                      setSelectedMetrics((prev) =>
                        prev.includes(metric)
                          ? prev.filter((m) => m !== metric)
                          : [...prev, metric]
                      );
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                      selectedMetrics.includes(metric)
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {metric}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart key={chartKey} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("impressions") && (
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {selectedMetrics.includes("clicks") && (
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {selectedMetrics.includes("conversions") && (
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {selectedMetrics.includes("spend") && (
                  <Line
                    type="monotone"
                    dataKey="spend"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {selectedMetrics.includes("revenue") && (
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart  data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("impressions") && (
                  <Bar
                    dataKey="impressions"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {selectedMetrics.includes("clicks") && (
                  <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes("conversions") && (
                  <Bar
                    dataKey="conversions"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                 {selectedMetrics.includes("revenue") && (
                  <Bar
                    dataKey="revenue"
                    fill="red"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                 {selectedMetrics.includes("spend") && (
                  <Bar
                    dataKey="spend"
                    fill="black"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart  data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("impressions") && (
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                )}
                {selectedMetrics.includes("clicks") && (
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                )}
                {selectedMetrics.includes("conversions") && (
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.2}
                  />
                )}
                
              </AreaChart>
            ) : (
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("impressions") && (
                  <Bar
                    dataKey="impressions"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {selectedMetrics.includes("clicks") && (
                  <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes("conversions") && (
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
               
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    
    </div>
  );
};
