import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart,
  Zap,
  Download,
  Share2,
  RadioTower,
  Cloud,
  Filter,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { formatCurrency } from "../lib/formatters";

interface InsightsTabProps {
  currentMetrics?: any;
  insights?: any;
  isInsightsLoading?: boolean;
  isUsingRealtime?: boolean;
  onRefresh?: () => void;
  onGenerateReport?: () => void;
  onShareInsights?: () => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  currentMetrics,
  insights,
  isInsightsLoading = false,
  isUsingRealtime = false,
  onGenerateReport,
  onShareInsights,
}) => {
  const [previousMetrics, setPreviousMetrics] = useState<any | null>(null);

  useEffect(() => {
    if (!insights) return;

    setPreviousMetrics((prev: any) => prev ?? currentMetrics);
  }, [insights]);

  // Calculate performance score
  const performanceScore = useMemo(() => {
    if (!currentMetrics) return 0;

    return Number(
      (currentMetrics.ctr * 0.4 + currentMetrics.conversion_rate * 0.6).toFixed(
        1
      )
    );
  }, [currentMetrics]);

  // Calculate cost per conversion
  const costPerConversion = useMemo(() => {
    if (!currentMetrics || currentMetrics.conversions === 0) return 0;
    return currentMetrics.spend / currentMetrics.conversions;
  }, [currentMetrics]);

  const engagementRate = useMemo(() => {
    if (!currentMetrics || currentMetrics.impressions === 0) return 0;
    return (currentMetrics.clicks / currentMetrics.impressions) * 100;
  }, [currentMetrics]);

  // Mock performance distribution data
  const performanceDistribution = useMemo(() => {
    if (!currentMetrics) return [];

    return [
      {
        name: "CTR",
        value: currentMetrics.ctr,
        fill: "#3B82F6",
      },
      {
        name: "Conversion Rate",
        value: currentMetrics.conversion_rate,
        fill: "#10B981",
      },
      {
        name: "Engagement",
        value: engagementRate,
        fill: "#8B5CF6",
      },
      {
        name: "Cost Efficiency",
        value: Math.max(0, 100 - costPerConversion),
        fill: "#F59E0B",
      },
    ];
  }, [currentMetrics, engagementRate, costPerConversion]);

  // Mock trend data
  // const trendData = [
  //   { day: 'Mon', impressions: 4200, clicks: 210, conversions: 42 },
  //   { day: 'Tue', impressions: 4800, clicks: 240, conversions: 48 },
  //   { day: 'Wed', impressions: 5200, clicks: 260, conversions: 52 },
  //   { day: 'Thu', impressions: 4600, clicks: 230, conversions: 46 },
  //   { day: 'Fri', impressions: 5100, clicks: 255, conversions: 51 },
  //   { day: 'Sat', impressions: 3800, clicks: 190, conversions: 38 },
  //   { day: 'Sun', impressions: 3500, clicks: 175, conversions: 35 }
  // ];

  const trendData = useMemo(() => {
    if (!currentMetrics || !previousMetrics) return [];

    return [
      {
        day: "Previous",
        impressions: previousMetrics.impressions,
        clicks: previousMetrics.clicks,
        conversions: previousMetrics.conversions,
      },
      {
        day: "Current",
        impressions: currentMetrics.impressions,
        clicks: currentMetrics.clicks,
        conversions: currentMetrics.conversions,
      },
    ];
  }, [currentMetrics, previousMetrics]);

  // Format currency
  // const formatCurrency = (amount: number): string => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(amount);
  // };

  if (isInsightsLoading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Insights
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Analyzing campaign performance data to provide actionable
            recommendations...
          </p>
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
            AI Insights & Recommendations
          </h2>
          <p className="text-gray-600">
            Smart suggestions to optimize your campaign performance
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Data Status */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isUsingRealtime
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {isUsingRealtime ? (
              <>
                <RadioTower className="w-4 h-4" />
                <span className="text-sm font-medium">Live Stream Active</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span className="text-sm font-medium">Cached Data</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button> */}
            <button
              onClick={onGenerateReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={onShareInsights}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Score Card */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Campaign Performance Score
                </h3>
                <p className="text-blue-100 mb-4">
                  Based on real-time metrics and industry benchmarks
                </p>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="text-5xl font-bold">
                      {performanceScore.toFixed(1)}
                    </div>
                    <div className="text-blue-200">/10</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-blue-200">
                        Score Breakdown
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          performanceScore >= 7
                            ? "text-green-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {performanceScore >= 7
                          ? "Excellent"
                          : performanceScore >= 5
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </div>
                    <div className="w-full bg-blue-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-linear-to-r from-green-400 to-cyan-400 transition-all duration-500"
                        style={{ width: `${performanceScore * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <div className="relative w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="30%"
                      outerRadius="100%"
                      data={[{ value: performanceScore * 10 }]}
                      startAngle={180}
                      endAngle={-180}
                    >
                      <RadialBar
                        background={{ fill: "rgba(255, 255, 255, 0.1)" }}
                        dataKey="value"
                        cornerRadius={10}
                        fill="url(#performanceGradient)"
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-2xl font-bold fill-white"
                      >
                        {performanceScore.toFixed(1)}
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    currentMetrics?.ctr && currentMetrics.ctr > 2.5
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentMetrics?.ctr && currentMetrics.ctr > 2.5
                    ? "Above Avg"
                    : "Below Avg"}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {currentMetrics?.ctr ? `${currentMetrics.ctr}%` : "0%"}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Click-Through Rate
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {currentMetrics?.ctr && currentMetrics.ctr > 2.5
                  ? "Excellent engagement rate"
                  : "Opportunity for improvement"}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    currentMetrics?.conversion_rate &&
                    currentMetrics.conversion_rate > 4
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentMetrics?.conversion_rate &&
                  currentMetrics.conversion_rate > 4
                    ? "Strong"
                    : "Moderate"}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {currentMetrics?.conversion_rate
                  ? `${currentMetrics.conversion_rate}%`
                  : "0%"}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Conversion Rate
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {currentMetrics?.conversion_rate &&
                currentMetrics.conversion_rate > 4
                  ? "High conversion efficiency"
                  : "Average performance"}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    currentMetrics?.cpc && currentMetrics.cpc < 3
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentMetrics?.cpc && currentMetrics.cpc < 3
                    ? "Efficient"
                    : "Moderate"}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${currentMetrics?.cpc ? currentMetrics.cpc.toFixed(2) : "0.00"}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Cost Per Click
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {currentMetrics?.cpc && currentMetrics.cpc < 3
                  ? "Good cost efficiency"
                  : "Consider optimizing bids"}
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Weekly performance insights
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="text-sm border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last quarter</option>
                </select>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="impressionsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="clicksGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="conversionsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#3B82F6"
                    fill="url(#impressionsGradient)"
                    name="Impressions"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    fill="url(#clicksGradient)"
                    name="Clicks"
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="#8B5CF6"
                    fill="url(#conversionsGradient)"
                    name="Conversions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats & Distribution */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">
                    Avg. Session Value
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(costPerConversion * 1.5)}
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                  <div className="text-lg font-bold text-gray-900">
                    {engagementRate.toFixed(2)}%
                  </div>
                </div>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">ROI Potential</div>
                  <div className="text-lg font-bold text-gray-900">
                    +{Math.round(performanceScore * 15)}%
                  </div>
                </div>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Cost Efficiency</div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(100 - costPerConversion / 100)}/100
                  </div>
                </div>
                <BarChart className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) =>
                      `${entry.name}: ${entry.value.toFixed(1)}%`
                    }
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Value"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
