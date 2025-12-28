// pages/CampaignDetail.tsx
import { useState, useEffect, useRef, type JSX } from "react";
import { useParams, Link } from "react-router-dom";
import type { Campaign } from "../types/campaign";
import { getCampaignById, getCampaignInsights } from "../api/campaign";
import {
  ArrowLeft,
  MoreVertical,
  Share2,
  Download,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  MousePointer,
  Eye,
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
  Cloud,
  RefreshCcw as RefreshIcon,
  AlertTriangle,
} from "lucide-react";

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

  const getPlatformIcon = (platform: string) => {
    const platformIcons: { [key: string]: JSX.Element } = {
      meta: <Facebook className="w-5 h-5 text-blue-600" />,
      facebook: <Facebook className="w-5 h-5 text-blue-600" />,
      instagram: <Instagram className="w-5 h-5 text-pink-600" />,
      twitter: <Twitter className="w-5 h-5 text-sky-500" />,
      google: <Globe className="w-5 h-5 text-red-500" />,
      tiktok: (
        <div className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded">
          TT
        </div>
      ),
      linkedin: (
        <div className="w-5 h-5 bg-blue-700 text-white text-xs flex items-center justify-center rounded">
          in
        </div>
      ),
      pinterest: (
        <div className="w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded">
          P
        </div>
      ),
    };
    return (
      platformIcons[platform?.toLowerCase()] || (
        <Globe className="w-5 h-5 text-gray-500" />
      )
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const calculateBudgetUtilization = () => {
    if (!campaign?.budget || !realtimeMetrics?.spend) return 0;
    return Math.min((realtimeMetrics.spend / campaign.budget) * 100, 100);
  };

  const calculateCostPerConversion = () => {
    if (
      !realtimeMetrics?.spend ||
      !realtimeMetrics?.conversions ||
      realtimeMetrics.conversions === 0
    )
      return 0;
    return realtimeMetrics.spend / realtimeMetrics.conversions;
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <div className="border-b border-gray-200">
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
                  id: "insights",
                  label: "Insights",
                  icon: <TrendingUpIcon className="w-4 h-4" />,
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: <LineChart className="w-4 h-4" />,
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
          <div className="space-y-6">
            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Impressions */}
              <div
                className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                  isUsingRealtime ? "border-blue-500" : "border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Impressions
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentMetrics?.impressions
                        ? formatNumber(currentMetrics.impressions)
                        : "0"}
                    </div>
                  </div>
                  {isUsingRealtime && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <RadioTower className="w-3 h-3" />
                      LIVE
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Total reach across all platforms
                </div>
              </div>

              {/* Clicks */}
              <div
                className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                  isUsingRealtime ? "border-green-500" : "border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Clicks</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentMetrics?.clicks
                        ? formatNumber(currentMetrics.clicks)
                        : "0"}
                    </div>
                  </div>
                  {isUsingRealtime && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <MousePointer className="w-3 h-3" />
                      LIVE
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Total clicks on campaign ads
                </div>
              </div>

              {/* Conversions */}
              <div
                className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                  isUsingRealtime ? "border-purple-500" : "border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Conversions
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentMetrics?.conversions
                        ? formatNumber(currentMetrics.conversions)
                        : "0"}
                    </div>
                  </div>
                  {isUsingRealtime && (
                    <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      <Target className="w-3 h-3" />
                      LIVE
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Total conversions achieved
                </div>
              </div>

              {/* Spend */}
              <div
                className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                  isUsingRealtime ? "border-amber-500" : "border-gray-400"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Total Spend
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentMetrics?.spend
                        ? formatCurrency(currentMetrics.spend)
                        : "$0"}
                    </div>
                  </div>
                  {isUsingRealtime && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <DollarSign className="w-3 h-3" />
                      LIVE
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Total campaign spend
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Campaign Details */}
              <div className="space-y-6">
                {/* Campaign Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Campaign Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Campaign ID
                        </label>
                        <div className="font-medium text-gray-900 font-mono">
                          {campaign.id}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Brand ID
                        </label>
                        <div className="font-medium text-gray-900 font-mono">
                          {campaign.brand_id}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <div className="mt-1">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                            campaign.status
                          )} flex items-center gap-2 w-fit`}
                        >
                          {getStatusIcon(campaign.status)}
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Platforms</label>
                      <div className="flex gap-2 mt-1">
                        {campaign.platforms.map((platform) => (
                          <div
                            key={platform}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                          >
                            {getPlatformIcon(platform)}
                            <span className="font-medium capitalize">
                              {platform}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Created Date
                      </label>
                      <div className="font-medium text-gray-900">
                        {formatDate(campaign.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Overview */}
                <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Budget Overview
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">
                          Total Budget
                        </label>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(campaign.budget)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          Daily Budget
                        </label>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(campaign.daily_budget)}
                        </div>
                      </div>
                    </div>

                    {currentMetrics?.spend && (
                      <>
                        <div>
                          <label className="text-sm text-gray-600">
                            Amount Spent
                          </label>
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(currentMetrics.spend)}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-blue-200">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">
                              Budget Utilization
                            </span>
                            <span className="font-medium text-gray-900">
                              {calculateBudgetUtilization().toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-linear-to-r from-blue-600 to-blue-700"
                              style={{
                                width: `${calculateBudgetUtilization()}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>
                              {formatCurrency(currentMetrics.spend)} spent
                            </span>
                            <span>
                              {formatCurrency(
                                campaign.budget - currentMetrics.spend
                              )}{" "}
                              remaining
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Performance Metrics */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Performance Metrics
                    </h2>
                    {currentMetrics?.timestamp && (
                      <div className="text-sm text-gray-500">
                        Updated: {formatDateTime(currentMetrics.timestamp)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* CTR */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                          Click-Through Rate (CTR)
                        </span>
                        <span className="text-lg font-bold text-gray-900 flex items-center gap-1">
                          {currentMetrics?.ctr
                            ? `${currentMetrics.ctr}%`
                            : "0%"}
                          {currentMetrics?.ctr && currentMetrics.ctr > 2 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600"
                          style={{
                            width: `${
                              currentMetrics?.ctr
                                ? Math.min(currentMetrics.ctr * 20, 100)
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Conversion Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Conversion Rate</span>
                        <span className="text-lg font-bold text-gray-900">
                          {currentMetrics?.conversion_rate
                            ? `${currentMetrics.conversion_rate}%`
                            : "0%"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-green-500 to-green-600"
                          style={{
                            width: `${
                              currentMetrics?.conversion_rate
                                ? Math.min(
                                    currentMetrics.conversion_rate * 10,
                                    100
                                  )
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* CPC */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                          Cost Per Click (CPC)
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          $
                          {currentMetrics?.cpc
                            ? currentMetrics.cpc.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-purple-500 to-purple-600"
                          style={{
                            width: `${
                              currentMetrics?.cpc
                                ? Math.min((currentMetrics.cpc / 5) * 100, 100)
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Cost Per Conversion */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                          Cost Per Conversion
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(calculateCostPerConversion())}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600"
                          style={{
                            width: `${Math.min(
                              (calculateCostPerConversion() / 50) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Stats
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {currentMetrics?.impressions && currentMetrics?.clicks
                          ? (
                              (currentMetrics.clicks /
                                currentMetrics.impressions) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                        %
                      </div>
                      <div className="text-xs text-gray-600">Click Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {currentMetrics?.clicks && currentMetrics?.conversions
                          ? (
                              (currentMetrics.conversions /
                                currentMetrics.clicks) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                        %
                      </div>
                      <div className="text-xs text-gray-600">
                        Conversion Rate
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {currentMetrics?.spend && currentMetrics?.impressions
                          ? (
                              (currentMetrics.spend /
                                currentMetrics.impressions) *
                              1000
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-xs text-gray-600">CPM</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {currentMetrics?.conversions && currentMetrics?.spend
                          ? (
                              (currentMetrics.conversions /
                                currentMetrics.spend) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </div>
                      <div className="text-xs text-gray-600">ROI %</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab Content */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {isInsightsLoading ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading insights...</p>
              </div>
            ) : insights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Insights Summary */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Campaign Insights
                    </h2>
                    <div
                      className={`flex items-center gap-2 ${
                        isUsingRealtime ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {isUsingRealtime ? (
                        <>
                          <RadioTower className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Live Stream Active
                          </span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Cached Data
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-blue-600 font-medium mb-1">
                            Performance Score
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {currentMetrics?.ctr &&
                            currentMetrics?.conversion_rate
                              ? Math.round(
                                  (currentMetrics.ctr * 0.4 +
                                    currentMetrics.conversion_rate * 0.6) *
                                    10
                                ) / 10
                              : "0"}
                            /10
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Avg. Session Value
                        </div>
                        <div className="font-bold text-gray-900">
                          {formatCurrency(calculateCostPerConversion() * 1.5)}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Engagement Rate
                        </div>
                        <div className="font-bold text-gray-900">
                          {currentMetrics?.impressions && currentMetrics?.clicks
                            ? (
                                (currentMetrics.clicks /
                                  currentMetrics.impressions) *
                                100
                              ).toFixed(2)
                            : "0.00"}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-3">
                        Key Observations
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                          <span className="text-sm text-gray-600">
                            CTR of {currentMetrics?.ctr || 0}% is{" "}
                            {currentMetrics?.ctr && currentMetrics.ctr > 2.5
                              ? "above"
                              : "below"}{" "}
                            industry average
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                          <span className="text-sm text-gray-600">
                            Conversion rate of{" "}
                            {currentMetrics?.conversion_rate || 0}% indicates{" "}
                            {currentMetrics?.conversion_rate &&
                            currentMetrics.conversion_rate > 4
                              ? "strong"
                              : "moderate"}{" "}
                            performance
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                          <span className="text-sm text-gray-600">
                            ${currentMetrics?.cpc?.toFixed(2) || "0.00"} CPC is{" "}
                            {currentMetrics?.cpc && currentMetrics.cpc < 3
                              ? "efficient"
                              : "moderate"}{" "}
                            for this vertical
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommendations
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Increase Daily Budget",
                        description:
                          "Consider increasing daily budget by 20% to capitalize on current performance",
                        icon: <DollarSign className="w-5 h-5 text-green-600" />,
                        priority: "high",
                      },
                      {
                        title: "Optimize Ad Creatives",
                        description:
                          "Test new ad creatives to improve click-through rate",
                        icon: <Eye className="w-5 h-5 text-blue-600" />,
                        priority: "medium",
                      },
                      {
                        title: "Expand Targeting",
                        description:
                          "Add similar audience segments to increase reach",
                        icon: <Users className="w-5 h-5 text-purple-600" />,
                        priority: "low",
                      },
                      {
                        title: "Schedule Optimization",
                        description:
                          "Adjust ad schedule based on peak conversion times",
                        icon: <Clock className="w-5 h-5 text-amber-600" />,
                        priority: "medium",
                      },
                    ].map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            {rec.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">
                                {rec.title}
                              </h4>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  rec.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {rec.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Insights Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Performance insights will appear after the campaign has been
                  running for some time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Metrics Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Real-time Performance
                  </h2>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isStreaming
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {isStreaming
                        ? "Streaming live data"
                        : "Connection paused"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentMetrics && (
                    <>
                      {/* Impressions Trend */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Impressions Trend
                          </span>
                          <span className="font-medium text-gray-900">
                            +{Math.round(currentMetrics.impressions * 0.05)}{" "}
                            today
                          </span>
                        </div>
                        <div className="h-2 bg-linear-to-r from-blue-400 to-blue-600 rounded-full"></div>
                      </div>

                      {/* Clicks Trend */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Clicks Trend</span>
                          <span className="font-medium text-gray-900">
                            +{Math.round(currentMetrics.clicks * 0.03)} today
                          </span>
                        </div>
                        <div className="h-2 bg-linear-to-r from-green-400 to-green-600 rounded-full"></div>
                      </div>

                      {/* Conversions Trend */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Conversions Trend
                          </span>
                          <span className="font-medium text-gray-900">
                            +{Math.round(currentMetrics.conversions * 0.02)}{" "}
                            today
                          </span>
                        </div>
                        <div className="h-2 bg-linear-to-r from-purple-400 to-purple-600 rounded-full"></div>
                      </div>

                      {/* Spend Trend */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Spend Trend</span>
                          <span className="font-medium text-gray-900">
                            +{formatCurrency(currentMetrics.spend * 0.04)}
                          </span>
                        </div>
                        <div className="h-2 bg-linear-to-r from-amber-400 to-amber-600 rounded-full"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Efficiency Metrics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Efficiency Metrics
                </h2>
                <div className="space-y-6">
                  {currentMetrics && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Click Efficiency
                          </span>
                          <span className="font-medium text-gray-900">
                            {(
                              (currentMetrics.clicks /
                                currentMetrics.impressions) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600"
                            style={{
                              width: `${
                                (currentMetrics.clicks /
                                  currentMetrics.impressions) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Conversion Efficiency
                          </span>
                          <span className="font-medium text-gray-900">
                            {(
                              (currentMetrics.conversions /
                                currentMetrics.clicks) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-green-500 to-green-600"
                            style={{
                              width: `${
                                (currentMetrics.conversions /
                                  currentMetrics.clicks) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Cost Efficiency</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(
                              currentMetrics.spend / currentMetrics.conversions
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-purple-500 to-purple-600"
                            style={{
                              width: `${Math.min(
                                (currentMetrics.spend /
                                  currentMetrics.conversions /
                                  10) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">ROI Potential</span>
                          <span className="font-medium text-gray-900">
                            {(
                              ((currentMetrics.conversions * 100) /
                                currentMetrics.spend) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600"
                            style={{
                              width: `${Math.min(
                                (currentMetrics.conversions * 100) /
                                  currentMetrics.spend,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center py-12">
                <LineChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Detailed analytics and trend analysis features are coming
                  soon.
                  {currentMetrics &&
                    ` Current data shows ${formatNumber(
                      currentMetrics.impressions
                    )} impressions and ${formatNumber(
                      currentMetrics.clicks
                    )} clicks.`}
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Export Data
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Schedule Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>
              Campaign ID: <span className="font-mono">{campaign.id}</span> •
              Last data update: {lastUpdated} • Status:{" "}
              <span
                className={`font-medium ${
                  isStreaming ? "text-green-600" : "text-gray-600"
                }`}
              >
                {isStreaming ? "Live" : "Static"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-blue-600 hover:text-blue-700">
                View API Documentation
              </button>
              <button className="text-blue-600 hover:text-blue-700">
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
