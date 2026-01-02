import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import type { Campaign } from "../types/campaign";
import { getCampaignById, getCampaignInsights } from "../api/campaign";
import {
  ArrowLeft,
  MoreVertical,
  Share2,
  Download,
  Calendar,
  BarChart3,
  LineChart,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Building2,
  Tag,
  RefreshCw,
  TrendingUp as TrendingUpIcon,
  WifiOff,
  RadioTower,
  Activity as ActivityIcon,
  RefreshCcw as RefreshIcon,
  AlertTriangle,
} from "lucide-react";
import { CampaignOverview } from "../components/CampaignOverview";
import { PerformanceTab } from "../components/PerformanceTab";
import { InsightsTab } from "../components/InsightsTab";
import { AnalyticsTab } from "../components/AnalyticsTab";
import { formatDate } from "../lib/formatters";

interface CampaignInsights {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

interface CampaignMetrics extends CampaignInsights {
  // Real-time streaming data
  is_realtime?: boolean;
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [realtimeMetrics, setRealtimeMetrics] =
    useState<CampaignMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch campaign basic data
  useEffect(() => {
    if (!id) return;

    const fetchCampaignData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const campaignData = await getCampaignById(id);
        setCampaign(campaignData.campaign || campaignData);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  // Fetch initial insights
  useEffect(() => {
    if (!id) return;

    const fetchInsights = async () => {
      setIsInsightsLoading(true);
      try {
        const insightsData = await getCampaignInsights(id);
        const insights = insightsData.insights || insightsData;
        setInsights(insights);
        setRealtimeMetrics(insights); // Initialize with API data
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setIsInsightsLoading(false);
      }
    };

    fetchInsights();
  }, [id]);

  // SSE Streaming for real-time metrics
  useEffect(() => {
    if (!id || !autoRefresh) return;

    const connectToStream = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(
        `${
          import.meta.env.VITE_API_BASE_URL ||
          "https://mixo-fe-backend-task.vercel.app"
        }/campaigns/${id}/insights/stream`
      );

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setIsStreaming(true);
        setStreamError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received SSE data:", data);

          setRealtimeMetrics({
            ...data,
            is_realtime: true,
          });

          setLastUpdated(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        setIsStreaming(false);
        setStreamError("Connection lost. Attempting to reconnect...");
        eventSource.close();

        // Attempt reconnection after delay
        setTimeout(() => {
          if (autoRefresh) {
            connectToStream();
          }
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    };

    connectToStream();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsStreaming(false);
    };
  }, [id, autoRefresh]);

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh && eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const manuallyRefreshInsights = async () => {
    if (!id) return;

    setIsInsightsLoading(true);
    try {
      const insightsData = await getCampaignInsights(id);
      const insights = insightsData.insights || insightsData;
      setInsights(insights);
      setRealtimeMetrics(insights);
      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error("Error refreshing insights:", err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Campaign Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "The campaign you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Current metrics (use realtime if available, otherwise insights)
  const currentMetrics = realtimeMetrics || insights;
  const isUsingRealtime = realtimeMetrics?.is_realtime || false;

  console.log("currentMetrics", currentMetrics);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {campaign.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span className="font-mono">{campaign.brand_id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(campaign.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>ID: {campaign.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status Indicator */}
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  isStreaming
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium">
                  {isStreaming ? "Live" : "Offline"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Status Banner */}
      {streamError && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">{streamError}</span>
              </div>
              <button
                onClick={toggleAutoRefresh}
                className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
              >
                {autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Data Source:
              <span
                className={`ml-2 font-medium ${
                  isUsingRealtime ? "text-green-600" : "text-blue-600"
                }`}
              >
                {isUsingRealtime ? (
                  <span className="flex items-center gap-1">
                    <RadioTower className="w-4 h-4" />
                    Real-time Stream
                  </span>
                ) : (
                  "API Cache"
                )}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated:
              <span className="ml-2 font-medium text-gray-900">
                {lastUpdated}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAutoRefresh}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {autoRefresh ? (
                <>
                  <RadioTower className="w-4 h-4" />
                  Auto-refresh ON
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Auto-refresh OFF
                </>
              )}
            </button>

            <button
              onClick={manuallyRefreshInsights}
              disabled={isInsightsLoading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshIcon
                className={`w-4 h-4 ${isInsightsLoading ? "animate-spin" : ""}`}
              />
              Refresh Now
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 overflow-scroll no-scrollbar md:overflow-hidden">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: <BarChart3 className="w-4 h-4" />,
                },
                {
                  id: "performance",
                  label: "Performance",
                  icon: <ActivityIcon className="w-4 h-4" />,
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: <LineChart className="w-4 h-4" />,
                },
                {
                  id: "insights",
                  label: "Insights",
                  icon: <TrendingUpIcon className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <CampaignOverview
            campaign={campaign}
            currentMetrics={currentMetrics}
            isUsingRealtime={isUsingRealtime}
            className="p-4 md:p-6"
          />
        )}

        {/* Insights Tab Content */}
        {activeTab === "insights" && (
          <InsightsTab
            currentMetrics={currentMetrics}
            insights={insights}
            isInsightsLoading={isInsightsLoading}
            isUsingRealtime={isUsingRealtime}
          />
        )}

        {/* Performance Tab Content */}
        {activeTab === "performance" && (
          <PerformanceTab
            currentMetrics={currentMetrics}
            isStreaming={isStreaming}
            onToggleStream={() => setIsStreaming(!isStreaming)}
          />
        )}

        {/* Analytics Tab Content */}
        {activeTab === "analytics" && (
          <AnalyticsTab currentMetrics={currentMetrics} />
        )}
      </div>
    </div>
  );
}
