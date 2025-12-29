import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  DollarSign,
  MousePointer,
  RadioTower,
  Download,
  Play,
  Pause,
} from "lucide-react";
import { formatCurrency } from "../lib/formatters";

interface PerformanceTabProps {
  currentMetrics?: any;
  isStreaming?: boolean;
  onToggleStream?: () => void;
  onExport?: () => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  currentMetrics,
  isStreaming = false,
  onToggleStream,
  onExport,
}) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [activeMetric, setActiveMetric] = useState<
    "impressions" | "clicks" | "conversions" | "spend"
  >("impressions");
  const prevMetrics = useRef<any | null>(null);

  // Store historical chart data
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!currentMetrics) return;

    setChartData((prev) => [
      ...prev.slice(-29), // last 30 entries
      {
        date: new Date(currentMetrics.timestamp).toLocaleTimeString(),
        impressions: currentMetrics.impressions,
        clicks: currentMetrics.clicks,
        conversions: currentMetrics.conversions,
        spend: currentMetrics.spend,
        impressionsTarget: currentMetrics.impressions * 1.1,
        clicksTarget: currentMetrics.clicks * 1.1,
        conversionsTarget: currentMetrics.conversions * 1.1,
        spendTarget: currentMetrics.spend * 1.1,
      },
    ]);

    prevMetrics.current = currentMetrics;
  }, [currentMetrics]);

  const getChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // KPI Cards
  const kpiCards = useMemo(() => {
    if (!currentMetrics) return [];
    const prev = prevMetrics.current;

    return [
      {
        title: "CTR",
        value: `${currentMetrics.ctr.toFixed(2)}%`,
        change: getChange(currentMetrics.ctr, prev?.ctr ?? 0),
        trend: currentMetrics.ctr >= (prev?.ctr ?? 0) ? "up" : "down",
        icon: MousePointer,
        color: "blue",
      },
      {
        title: "Conversion Rate",
        value: `${currentMetrics.conversion_rate.toFixed(2)}%`,
        change: getChange(
          currentMetrics.conversion_rate,
          prev?.conversion_rate ?? 0
        ),
        trend:
          currentMetrics.conversion_rate >= (prev?.conversion_rate ?? 0)
            ? "up"
            : "down",
        icon: Target,
        color: "green",
      },
      {
        title: "Avg. CPC",
        value: formatCurrency(currentMetrics.cpc),
        change: getChange(currentMetrics.cpc, prev?.cpc ?? 0),
        trend: currentMetrics.cpc <= (prev?.cpc ?? 0) ? "up" : "down", // lower CPC is good
        icon: DollarSign,
        color: "purple",
      },
      {
        title: "Cost / Conversion",
        value: formatCurrency(
          currentMetrics.spend / currentMetrics.conversions
        ),
        change: prev
          ? getChange(
              currentMetrics.spend / currentMetrics.conversions,
              prev.spend / prev.conversions
            )
          : 0,
        trend:
          currentMetrics.spend / currentMetrics.conversions <=
          (prev ? prev.spend / prev.conversions : 0)
            ? "up"
            : "down",
        icon: Zap,
        color: "amber",
      },
    ];
  }, [currentMetrics]);

  // Efficiency Metrics
  const efficiencyData = useMemo(() => {
    if (!currentMetrics) return [];

    const safeDivide = (num: number, denom: number) =>
      denom ? num / denom : 0;

    return [
      {
        name: "Click Efficiency",
        value:
          safeDivide(currentMetrics.clicks, currentMetrics.impressions) * 100,
        target: 2.5,
        color: "#2563EB", // blue-600
      },
      {
        name: "Conversion Efficiency",
        value:
          safeDivide(currentMetrics.conversions, currentMetrics.clicks) * 100,
        target: 10,
        color: "#059669", // green-600
      },
      {
        name: "Cost Efficiency",
        value: safeDivide(currentMetrics.spend, currentMetrics.conversions),
        target: 50,
        color: "#7C3AED", // purple-600
      },
      {
        name: "ROI Potential",
        value: safeDivide(
          currentMetrics.conversions * 100,
          currentMetrics.spend
        ),
        target: 200,
        color: "#D97706", // amber-600
      },
    ];
  }, [currentMetrics]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {entry.dataKey === "spend"
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Performance Analytics
          </h2>
          <p className="text-sm text-gray-600">Real-time insights and trends</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Time range */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
          </div>

          {/* Metric selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(["impressions", "clicks", "conversions", "spend"] as const).map(
              (metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric)}
                  className={`px-3 py-1.5 text-sm font-medium capitalize rounded-md transition-colors ${
                    activeMetric === metric
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {metric}
                </button>
              )
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onToggleStream}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                isStreaming
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Stream
                </>
              )}
            </button>
            <button
              onClick={onExport}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Streaming status */}
      <div
        className={`rounded-xl p-4 border ${
          isStreaming
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isStreaming ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <RadioTower
                className={`w-5 h-5 ${
                  isStreaming ? "text-green-600" : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {isStreaming
                  ? "Live Data Streaming Active"
                  : "Data Streaming Paused"}
              </h3>
              <p className="text-sm text-gray-600">
                {isStreaming
                  ? "Receiving real-time updates"
                  : 'Click "Stream" to enable updates'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isStreaming ? "LIVE" : "PAUSED"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;

          // Map color classes once
          const cardBgClasses: Record<string, string> = {
            blue: "border-blue-200 bg-blue-50",
            green: "border-green-200 bg-green-50",
            purple: "border-purple-200 bg-purple-50",
            amber: "border-amber-200 bg-amber-50",
          };
          const iconBgClasses: Record<string, string> = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            amber: "bg-amber-100 text-amber-600",
          };

          // Determine trend sign and color
          const isPositive = kpi.trend === "up";
          const trendSign = isPositive ? "+" : "-";
          const trendColor = isPositive ? "text-green-600" : "text-red-600";

          return (
            <div
              key={i}
              className={`rounded-xl border p-4 ${cardBgClasses[kpi.color]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconBgClasses[kpi.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {trendSign}
                  {Math.abs(kpi.change).toFixed(2)}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {kpi.value}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {kpi.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {activeMetric} Trend ({timeRange})
              </h3>
              <p className="text-sm text-gray-600">
                Daily performance over time
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(val) =>
                    activeMetric === "spend" ? `$${val}` : val.toLocaleString()
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={`${activeMetric}Target`}
                  stroke="#93C5FD"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Metrics Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Efficiency Metrics
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {efficiencyData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
                <Bar
                  dataKey="target"
                  fill="#d1d5db"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
