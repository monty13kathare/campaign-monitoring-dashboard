// components/CampaignOverview.tsx
import React, { useMemo } from 'react';
import {
  RadioTower,
  MousePointer,
  Target,
  DollarSign,
  Smartphone,
  Monitor,
  Globe,
  Calendar,
  Wallet,
  BarChart,
  Zap
} from 'lucide-react';
import { MetricCard } from './MatricCard';
import { ProgressBar } from './ProgressBar';
import { QuickStatCard } from './QuickStatCard';
import { formatCurrency, formatDate, formatDateTime } from '../lib/formatters';

interface Campaign {
  id: string;
  brand_id: string;
  status: string;
  platforms: string[];
  created_at: string;
  budget: number;
  daily_budget: number;
}



interface CampaignOverviewProps {
  campaign: Campaign;
  currentMetrics?: any;
  isUsingRealtime?: boolean;
  className?: string;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  campaign,
  currentMetrics,
  isUsingRealtime = false,
  className = ''
}) => {
 



  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-200',
      paused: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      draft: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      facebook: <Globe className="w-4 h-4" />,
      google: <Globe className="w-4 h-4" />,
      instagram: <Smartphone className="w-4 h-4" />,
      twitter: <Globe className="w-4 h-4" />,
      linkedin: <Monitor className="w-4 h-4" />
    };
    return icons[platform.toLowerCase()] || <Globe className="w-4 h-4" />;
  };

  // Calculations
  const calculateBudgetUtilization = () => {
    if (!currentMetrics?.spend) return 0;
    return (currentMetrics.spend / campaign.budget) * 100;
  };

  const calculateCostPerConversion = () => {
    if (!currentMetrics?.spend || !currentMetrics?.conversions) return 0;
    return currentMetrics.spend / currentMetrics.conversions;
  };

  const calculateCTR = () => {
    if (!currentMetrics?.impressions || !currentMetrics?.clicks) return 0;
    return (currentMetrics.clicks / currentMetrics.impressions) * 100;
  };

  const calculateConversionRate = () => {
    if (!currentMetrics?.clicks || !currentMetrics?.conversions) return 0;
    return (currentMetrics.conversions / currentMetrics.clicks) * 100;
  };

  const calculateCPM = () => {
    if (!currentMetrics?.spend || !currentMetrics?.impressions) return 0;
    return (currentMetrics.spend / currentMetrics.impressions) * 1000;
  };

  const calculateROI = () => {
    if (!currentMetrics?.conversions || !currentMetrics?.spend) return 0;
    return (currentMetrics.conversions / currentMetrics.spend) * 100;
  };

  // Metrics data for reusable cards
  const metricsCards = useMemo(() => [
    {
      title: 'Impressions',
      value: currentMetrics?.impressions || 0,
      description: 'Total reach across all platforms',
      borderColor: isUsingRealtime ? 'border-blue-500' : 'border-gray-200',
      icon: RadioTower,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
      showLive: isUsingRealtime,
      format: 'number' as const
    },
    {
      title: 'Clicks',
      value: currentMetrics?.clicks || 0,
      description: 'Total clicks on campaign ads',
      borderColor: isUsingRealtime ? 'border-green-500' : 'border-gray-200',
      icon: MousePointer,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
      showLive: isUsingRealtime,
      format: 'number' as const
    },
    {
      title: 'Conversions',
      value: currentMetrics?.conversions || 0,
      description: 'Total conversions achieved',
      borderColor: isUsingRealtime ? 'border-purple-500' : 'border-gray-200',
      icon: Target,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
      showLive: isUsingRealtime,
      format: 'number' as const
    },
    {
      title: 'Total Spend',
      value: currentMetrics?.spend || 0,
      description: 'Total campaign spend',
      borderColor: isUsingRealtime ? 'border-amber-500' : 'border-gray-200',
      icon: DollarSign,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-50',
      showLive: isUsingRealtime,
      format: 'currency' as const
    }
  ], [currentMetrics, isUsingRealtime]);

  const quickStats = useMemo(() => [
    {
      title: 'Click Rate',
      value: calculateCTR().toFixed(2),
      subtitle: 'Clicks ÷ Impressions',
      accentColor: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: calculateConversionRate().toFixed(2),
      subtitle: 'Conversions ÷ Clicks',
      accentColor: 'text-green-600'
    },
    {
      title: 'CPM',
      value: calculateCPM().toFixed(2),
      subtitle: 'Cost per 1000 impressions',
      accentColor: 'text-purple-600'
    },
    {
      title: 'ROI %',
      value: calculateROI().toFixed(2),
      subtitle: 'Return on investment',
      accentColor: 'text-amber-600'
    }
  ], [currentMetrics]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metricsCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Campaign Details */}
        <div className="space-y-6">
          {/* Campaign Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Campaign Information
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Campaign ID
                  </label>
                  <div className="font-medium text-gray-900 font-mono bg-gray-50 p-2 rounded text-sm truncate">
                    {campaign.id}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Brand ID
                  </label>
                  <div className="font-medium text-gray-900 font-mono bg-gray-50 p-2 rounded text-sm truncate">
                    {campaign.brand_id}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(campaign.status)} flex items-center gap-2 w-fit capitalize`}>
                    {campaign.status === 'active' && <Zap className="w-3 h-3" />}
                    {campaign.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {campaign.platforms.map((platform) => (
                    <div
                      key={platform}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {getPlatformIcon(platform)}
                      <span className="font-medium capitalize text-sm">
                        {platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Created Date
                </label>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatDate(campaign.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Budget Overview
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Total Budget
                  </label>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">
                    Daily Budget
                  </label>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(campaign.daily_budget)}
                  </div>
                </div>
              </div>

              {currentMetrics?.spend && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Amount Spent
                    </label>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(currentMetrics.spend)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <ProgressBar
                      label="Budget Utilization"
                      value={calculateBudgetUtilization()}
                      valueDisplay={calculateBudgetUtilization().toFixed(1)}
                      maxValue={100}
                      showPercentage
                      color="blue"
                      showValueBar
                    />
                    <div className="flex justify-between mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {formatCurrency(currentMetrics.spend)} spent
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                        {formatCurrency(campaign.budget - currentMetrics.spend)} remaining
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance Metrics
                </h2>
              </div>
              {currentMetrics?.timestamp && (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  Updated: {formatDateTime(currentMetrics.timestamp)}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <ProgressBar
                label="Click-Through Rate (CTR)"
                value={currentMetrics?.ctr || 0}
                valueDisplay={currentMetrics?.ctr ? `${currentMetrics.ctr}%` : '0%'}
                maxValue={10}
                showTrend
                trendDirection={currentMetrics?.ctr && currentMetrics.ctr > 2 ? 'up' : 'down'}
                color="blue"
              />

              <ProgressBar
                label="Conversion Rate"
                value={currentMetrics?.conversion_rate || 0}
                valueDisplay={currentMetrics?.conversion_rate ? `${currentMetrics.conversion_rate}%` : '0%'}
                maxValue={20}
                color="green"
              />

              <ProgressBar
                label="Cost Per Click (CPC)"
                value={currentMetrics?.cpc || 0}
                valueDisplay={`$${currentMetrics?.cpc ? currentMetrics.cpc.toFixed(2) : '0.00'}`}
                maxValue={10}
                color="purple"
              />

              <ProgressBar
                label="Cost Per Conversion"
                value={calculateCostPerConversion()}
                valueDisplay={formatCurrency(calculateCostPerConversion())}
                maxValue={100}
                color="amber"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickStats.map((stat, index) => (
                <QuickStatCard key={index} {...stat} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};