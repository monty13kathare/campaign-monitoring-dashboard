import { useEffect, useState } from "react";
import CampaignTable from "../components/CampaignTable";
import type { Campaign } from "../types/campaign";
import { getCampaigns, getGlobalInsights } from "../api/campaign";
import {
  TrendingUp,
  Users,
  Target,
  MousePointer,
  DollarSign,
  PieChart,
  Zap,
  BarChart3,
  Calendar,
} from "lucide-react";
import InsightsErrorState from "../components/InsightsErrorStat";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     Promise.all([
//       getCampaigns(),
//       getGlobalInsights()
//     ]).then(([campaignData, insightData]) => {
//       setCampaigns(campaignData.campaigns);
//       setInsights(insightData.insights);
//       setIsLoading(false);
//     }).catch(error => {
//       console.error("Error fetching data:", error);
//       setIsLoading(false);
//     });
//   }, []);

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
        getGlobalInsights()
      ]);
      
      setCampaigns(campaignsData.campaigns);
      setInsights(insightsData.insights);
    
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
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

//   if (!insights) return <div className="p-6 text-red-600">Failed to load insights</div>;

 if (error || !insights) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign Dashboard</h1>
            <p className="text-gray-600">View and analyze your campaign performance</p>
          </div>
          
          <InsightsErrorState 
            error={error || "Failed to load insights"}
            onRetry={handleRefresh}
            isLoading={isRefreshing}
          />
          
          {/* Show campaigns even if insights failed */}
          {campaigns.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaigns (cached data)</h2>
              <CampaignTable campaigns={campaigns} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPerformanceStatus = (value: number, type: 'ctr' | 'conversion' | 'cpc') => {
    if (type === 'ctr') return value > 3 ? 'good' : value > 2 ? 'average' : 'poor';
    if (type === 'conversion') return value > 4 ? 'good' : value > 3 ? 'average' : 'poor';
    if (type === 'cpc') return value < 2.5 ? 'good' : value < 3 ? 'average' : 'poor';
    return 'average';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Campaign Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and analyze your advertising performance</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>Last updated:</span>
            <span className="font-medium">
              {new Date(insights.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-lg transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Campaigns</p>
                <h3 className="text-3xl font-bold mt-2">{insights.total_campaigns}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{insights.active_campaigns} active</span>
                </div>
              </div>
              <BarChart3 className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-lg transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Spend</p>
                <h3 className="text-3xl font-bold mt-2">{formatCurrency(insights.total_spend)}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Avg CPC: ${insights.avg_cpc}</span>
                </div>
              </div>
              <PieChart className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-lg transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Clicks</p>
                <h3 className="text-3xl font-bold mt-2">{formatNumber(insights.total_clicks)}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <MousePointer className="w-4 h-4 mr-2" />
                  <span>CTR: {insights.avg_ctr}%</span>
                </div>
              </div>
              <Zap className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl p-5 shadow-lg transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Conversions</p>
                <h3 className="text-3xl font-bold mt-2">{formatNumber(insights.total_conversions)}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Rate: {insights.avg_conversion_rate}%</span>
                </div>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Campaign Status */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Campaign Status
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Active', value: insights.active_campaigns, color: 'bg-green-500' },
                { label: 'Paused', value: insights.paused_campaigns, color: 'bg-yellow-500' },
                { label: 'Completed', value: insights.completed_campaigns, color: 'bg-blue-500' },
                { label: 'Total', value: insights.total_campaigns, color: 'bg-gray-500' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}</span>
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
                  label: 'Click-through Rate (CTR)', 
                  value: `${insights.avg_ctr}%`,
                  status: getPerformanceStatus(insights.avg_ctr, 'ctr'),
                  description: 'Average across all campaigns'
                },
                { 
                  label: 'Conversion Rate', 
                  value: `${insights.avg_conversion_rate}%`,
                  status: getPerformanceStatus(insights.avg_conversion_rate, 'conversion'),
                  description: 'Based on total conversions'
                },
                { 
                  label: 'Cost Per Click (CPC)', 
                  value: `$${insights.avg_cpc}`,
                  status: getPerformanceStatus(insights.avg_cpc, 'cpc'),
                  description: 'Average cost per click'
                }
              ].map((metric) => (
                <div key={metric.label} className="pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-gray-700">{metric.label}</span>
                    <span className={`font-bold ${
                      metric.status === 'good' ? 'text-green-600' :
                      metric.status === 'average' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        metric.status === 'good' ? 'bg-green-500 w-3/4' :
                        metric.status === 'average' ? 'bg-yellow-500 w-1/2' : 'bg-red-500 w-1/4'
                      }`}></div>
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
                    {Math.round((insights.total_clicks / insights.total_impressions) * 10000) / 100}%
                  </div>
                  <p className="text-sm text-gray-600">Click Rate</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((insights.total_conversions / insights.total_clicks) * 10000) / 100}%
                  </div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Cost Per Conversion</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(insights.total_spend / insights.total_conversions || 0)}
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
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Campaign Performance</h2>
            <p className="text-gray-600 mt-1">Detailed view of all campaigns and their metrics</p>
          </div>
          <div className="p-1 md:p-2">
            <CampaignTable campaigns={campaigns} />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="font-semibold text-gray-900">Data Freshness</div>
            <div className="text-gray-600 mt-1">
              Updated {new Date(insights.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="font-semibold text-gray-900">Campaign Distribution</div>
            <div className="text-gray-600 mt-1">
              {Math.round((insights.active_campaigns / insights.total_campaigns) * 100)}% Active
            </div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="font-semibold text-gray-900">Performance Score</div>
            <div className="text-gray-600 mt-1">
              Based on CTR, Conversion Rate, and CPC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}