import { useEffect, useState } from "react";
import CampaignTable from "../components/CampaignTable";
import type { Campaign } from "../types/campaign";
import { getCampaigns, getGlobalInsights } from "../api/campaign";
import { Target, MousePointer, DollarSign, Activity } from "lucide-react";
import InsightsErrorState from "../components/InsightsErrorStat";
import CampaignDonutChart from "../components/dashboard/CampaignDonutChart";
import StatCard from "../components/dashboard/StatCard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { formatCurrency, formatNumber } from "../lib/formatters";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const [campaignsData, insightsData] = await Promise.all([
        getCampaigns(),
        getGlobalInsights(),
      ]);

      // Validate responses
      if (!campaignsData || !campaignsData.campaigns) {
        throw new Error("Failed to load campaigns data.");
      }
      if (!insightsData || !insightsData.insights) {
        throw new Error("Failed to load insights data.");
      }

      setCampaigns(campaignsData.campaigns);
      setInsights(insightsData.insights);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Campaign Dashboard
            </h1>
            <p className="text-gray-600">
              View and analyze your campaign performance
            </p>
          </div>

          <InsightsErrorState
            error={error || "Failed to load insights"}
            onRetry={handleRefresh}
            isLoading={isRefreshing}
          />

          {/* Show campaigns even if insights failed */}
          {campaigns.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Campaigns (cached data)
              </h2>
              <CampaignTable campaigns={campaigns} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const getPerformanceStatus = (
    value: number,
    type: "ctr" | "conversion" | "cpc"
  ) => {
    if (type === "ctr")
      return value > 3 ? "good" : value > 2 ? "average" : "poor";
    if (type === "conversion")
      return value > 4 ? "good" : value > 3 ? "average" : "poor";
    if (type === "cpc")
      return value < 2.5 ? "good" : value < 3 ? "average" : "poor";
    return "average";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <DashboardHeader
          timestamp={insights.timestamp}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Campaigns"
            value={insights.total_campaigns}
            subtitle={`${insights.active_campaigns} active`}
            icon={Activity}
            variant="blue"
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />

          <StatCard
            title="Total Spend"
            value={formatCurrency(insights.total_spend)}
            subtitle={`Avg CPC: $${insights.avg_cpc}`}
            icon={DollarSign}
            variant="green"
            trend={{ value: 8, isPositive: true }}
            delay={100}
          />
          <StatCard
            title="Total Clicks"
            value={formatNumber(insights.total_clicks)}
            subtitle={`CTR: ${insights.avg_ctr}%`}
            icon={MousePointer}
            variant="purple"
            trend={{ value: 15, isPositive: true }}
            delay={200}
          />
          <StatCard
            title="Conversions"
            value={formatNumber(insights.total_conversions)}
            subtitle={`Rate: ${insights.avg_conversion_rate}%`}
            icon={Target}
            variant="amber"
            trend={{ value: 5, isPositive: true }}
            delay={300}
          />
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Campaign Status Donut */}
          <div
            className="bg-white rounded-xl p-6 shadow-md  animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Campaign Status
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Distribution by status
            </p>
            <CampaignDonutChart
              active={insights.active_campaigns}
              paused={insights.paused_campaigns}
              completed={insights.completed_campaigns}
            />
            <div className="mt-4 space-y-2">
              {[
                {
                  label: "Active",
                  value: insights.active_campaigns,
                  color: "bg-green-500",
                },
                {
                  label: "Paused",
                  value: insights.paused_campaigns,
                  color: "bg-amber-500",
                },
                {
                  label: "Completed",
                  value: insights.completed_campaigns,
                  color: "bg-blue-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Performance Metrics
            </h3>
            <div className="space-y-5">
              {[
                {
                  label: "Click-through Rate (CTR)",
                  value: `${insights.avg_ctr}%`,
                  status: getPerformanceStatus(insights.avg_ctr, "ctr"),
                  description: "Average across all campaigns",
                },
                {
                  label: "Conversion Rate",
                  value: `${insights.avg_conversion_rate}%`,
                  status: getPerformanceStatus(
                    insights.avg_conversion_rate,
                    "conversion"
                  ),
                  description: "Based on total conversions",
                },
                {
                  label: "Cost Per Click (CPC)",
                  value: `$${insights.avg_cpc}`,
                  status: getPerformanceStatus(insights.avg_cpc, "cpc"),
                  description: "Average cost per click",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700">{metric.label}</span>
                    <span
                      className={`font-bold ${
                        metric.status === "good"
                          ? "text-green-600"
                          : metric.status === "average"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === "good"
                            ? "bg-green-500 w-3/4"
                            : metric.status === "average"
                            ? "bg-yellow-500 w-1/2"
                            : "bg-red-500 w-1/4"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Overview */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Engagement Overview
            </h3>
            <div className="space-y-5">
              <div className="text-center p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatNumber(insights.total_impressions)}
                </div>
                <p className="text-gray-600">Total Impressions</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (insights.total_clicks / insights.total_impressions) *
                        10000
                    ) / 100}
                    %
                  </div>
                  <p className="text-sm text-gray-600">Click Rate</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      (insights.total_conversions / insights.total_clicks) *
                        10000
                    ) / 100}
                    %
                  </div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Cost Per Conversion</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      insights.total_spend / insights.total_conversions || 0
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Total spend divided by total conversions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-1 md:p-2">
            <CampaignTable campaigns={campaigns} />
          </div>
        </div>
      </div>
    </div>
  );
}
