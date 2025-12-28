// components/AnalyticsTab.tsx
import React, { useState, useMemo, useEffect } from 'react';
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
  Cell,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target,
  DollarSign,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Share2,
  DownloadCloud,
  ChevronDown,
  Calendar as CalendarIcon,
  Users,
  Globe,
  Clock,
  Zap
} from 'lucide-react';
import { format} from 'date-fns';




interface AnalyticsTabProps {
  currentMetrics?: any;
  historicalData?: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    conversion_rate: number;
    cpc: number;
  }>;
  onExport?: (format: 'csv' | 'json' | 'pdf') => void;
  onScheduleReport?: () => void;
  onRefresh?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  currentMetrics,
  onExport,
  onScheduleReport,
  onShare,
  isLoading = false
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('7d');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'composed'>('line');
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['impressions', 'clicks', 'conversions']);
  const [realtimeHistory, setRealtimeHistory] = useState<any[]>([]);

   useEffect(() => {
    if (!currentMetrics) return;

    setRealtimeHistory(prev => [
      ...prev.slice(-29), // keep last 30 points
      {
        date: format(new Date(currentMetrics.timestamp), 'MMM dd'),
        time: format(new Date(currentMetrics.timestamp), 'HH:mm'),

        impressions: currentMetrics.impressions,
        clicks: currentMetrics.clicks,
        conversions: currentMetrics.conversions,
        spend: currentMetrics.spend,
        ctr: currentMetrics.ctr,
        conversion_rate: currentMetrics.conversion_rate,
        cpc: currentMetrics.cpc,

        revenue: currentMetrics.conversions * 100,
        roi:
          ((currentMetrics.conversions * 100 - currentMetrics.spend) /
            currentMetrics.spend) *
          100,

        engagement:
          (currentMetrics.clicks / currentMetrics.impressions) * 100
      }
    ]);
  }, [currentMetrics]);


   const filteredData = useMemo(() => {
    let limit = 7;
    if (timeRange === '30d') limit = 30;
    if (timeRange === '90d') limit = 90;

    return realtimeHistory.slice(-limit);
  }, [realtimeHistory, timeRange]);


 


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
        100
    };
  }, [currentMetrics]);

  // Performance metrics over time
  const performanceMetrics = useMemo(() => {
    if (!summaryStats) return [];
    
    return [
      {
        label: 'Impression Growth',
        current: summaryStats.totalImpressions,
        previous: summaryStats.totalImpressions * 0.85, // Mock previous period
        change: '+15%',
        trend: 'up',
        icon: Eye,
        color: 'blue'
      },
      {
        label: 'Click Growth',
        current: summaryStats.totalClicks,
        previous: summaryStats.totalClicks * 0.9,
        change: '+10%',
        trend: 'up',
        icon: MousePointer,
        color: 'green'
      },
      {
        label: 'Conversion Growth',
        current: summaryStats.totalConversions,
        previous: summaryStats.totalConversions * 0.88,
        change: '+12%',
        trend: 'up',
        icon: Target,
        color: 'purple'
      },
      {
        label: 'Revenue Growth',
        current: summaryStats.totalRevenue,
        previous: summaryStats.totalRevenue * 0.82,
        change: '+18%',
        trend: 'up',
        icon: DollarSign,
        color: 'amber'
      }
    ];
  }, [summaryStats]);

  // Platform distribution data
  const platformData = useMemo(() => [
    { name: 'Google Ads', value: 45, color: '#4285F4', cost: 4500, conversions: 225 },
    { name: 'Facebook', value: 30, color: '#1877F2', cost: 3200, conversions: 160 },
    { name: 'Instagram', value: 15, color: '#E4405F', cost: 1800, conversions: 90 },
    { name: 'LinkedIn', value: 7, color: '#0A66C2', cost: 900, conversions: 45 },
    { name: 'Twitter', value: 3, color: '#1DA1F2', cost: 400, conversions: 20 }
  ], []);

  // Time of day performance
  const timeOfDayData = useMemo(() => [
    { hour: '12 AM', impressions: 1200, clicks: 24, conversions: 2 },
    { hour: '3 AM', impressions: 800, clicks: 16, conversions: 1 },
    { hour: '6 AM', impressions: 1800, clicks: 54, conversions: 8 },
    { hour: '9 AM', impressions: 4500, clicks: 158, conversions: 24 },
    { hour: '12 PM', impressions: 5200, clicks: 182, conversions: 32 },
    { hour: '3 PM', impressions: 4800, clicks: 168, conversions: 28 },
    { hour: '6 PM', impressions: 3800, clicks: 114, conversions: 18 },
    { hour: '9 PM', impressions: 2200, clicks: 66, conversions: 10 }
  ], []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-600 capitalize">{entry.dataKey}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {entry.dataKey === 'spend' || entry.dataKey === 'revenue' 
                  ? `$${entry.value.toLocaleString()}`
                  : entry.dataKey === 'ctr' || entry.dataKey === 'conversion_rate' || entry.dataKey === 'engagement'
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

  // Format currency
  const formatCurrency = (amount: any): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with abbreviations
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
        (currentMetrics.ctr * 0.4 +
          currentMetrics.conversion_rate * 0.6) *
          10
      ) / 10
    );
  }, [currentMetrics?.ctr, currentMetrics?.conversion_rate]);

  if (isLoading) {
    return (
      <div className="min-h-150 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Analytics</h3>
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
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Deep dive into campaign performance and trends</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
            <button
              onClick={() => setTimeRange('custom')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                timeRange === 'custom'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Custom
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Bar Chart"
            >
              <BarChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Area Chart"
            >
              {/* <Area type="area" className="w-4 h-4" /> */}
            </button>
            <button
              onClick={() => setChartType('composed')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'composed'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Composed Chart"
            >
              <BarChartIcon className="w-4 h-4" />
              <LineChartIcon className="w-3 h-3 -ml-2" />
            </button>
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
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 invisible group-hover:visible z-10">
                <button
                  onClick={() => onExport?.('csv')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  CSV Format
                </button>
                <button
                  onClick={() => onExport?.('json')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  JSON Format
                </button>
                <button
                  onClick={() => onExport?.('pdf')}
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
            const percentageChange = ((metric.current - metric.previous) / metric.previous) * 100;
            
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    metric.color === 'blue' ? 'bg-blue-50' :
                    metric.color === 'green' ? 'bg-green-50' :
                    metric.color === 'purple' ? 'bg-purple-50' : 'bg-amber-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {percentageChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(percentageChange).toFixed(1)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.label.includes('Revenue') 
                    ? formatCurrency(metric.current)
                    : formatNumber(metric.current)}
                </div>
                <div className="text-sm font-medium text-gray-600">{metric.label}</div>
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
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <p className="text-sm text-gray-600">Daily metrics over time</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Metric Toggles */}
            <div className="flex flex-wrap gap-2">
              {['impressions', 'clicks', 'conversions', 'spend', 'revenue'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => {
                    setSelectedMetrics(prev =>
                      prev.includes(metric)
                        ? prev.filter(m => m !== metric)
                        : [...prev, metric]
                    );
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                    selectedMetrics.includes(metric)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes('impressions') && (
                  <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('clicks') && (
                  <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('conversions') && (
                  <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('spend') && (
                  <Line type="monotone" dataKey="spend" stroke="#F59E0B" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('revenue') && (
                  <Line type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            ) : chartType === 'bar' ? (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes('impressions') && (
                  <Bar dataKey="impressions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes('clicks') && (
                  <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes('conversions') && (
                  <Bar dataKey="conversions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            ) : chartType === 'area' ? (
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes('impressions') && (
                  <Area type="monotone" dataKey="impressions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                )}
                {selectedMetrics.includes('clicks') && (
                  <Area type="monotone" dataKey="clicks" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                )}
                {selectedMetrics.includes('conversions') && (
                  <Area type="monotone" dataKey="conversions" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                )}
              </AreaChart>
            ) : (
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes('impressions') && (
                  <Bar dataKey="impressions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes('clicks') && (
                  <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetrics.includes('conversions') && (
                  <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                )}
                {selectedMetrics.includes('ctr') && (
                  <Line type="monotone" dataKey="ctr" stroke="#F59E0B" strokeWidth={2} dot={false} />
                )}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
              <p className="text-sm text-gray-600">Distribution by advertising platform</p>
            </div>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'value') return [`${value}%`, 'Share'];
                    if (name === 'cost') return [formatCurrency(value), 'Cost'];
                    if (name === 'conversions') return [value, 'Conversions'];
                    return [value, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {platformData.map((platform, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Cost: {formatCurrency(platform.cost)} • Conversions: {platform.conversions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time of Day Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Time of Day Analysis</h3>
              <p className="text-sm text-gray-600">Performance by hour of day</p>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Impressions" />
                <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} name="Clicks" />
                <Bar dataKey="conversions" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Peak Performance Hours</span>
            </div>
            <p className="text-sm text-blue-700">
              Best performing times: 12 PM - 3 PM with {timeOfDayData[4].impressions.toLocaleString()} impressions
              and {timeOfDayData[4].conversions} conversions
            </p>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ROI Analysis</h3>
              <p className="text-sm text-gray-600">Return on investment metrics</p>
            </div>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={filteredData.slice(-7)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="date" />
                <PolarRadiusAxis />
                <Radar name="ROI" dataKey="roi" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                <Radar name="CTR" dataKey="ctr" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {summaryStats && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 mb-1">Average ROI</div>
                <div className="text-xl font-bold text-green-900">
                  {summaryStats.avgROI.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Total Revenue</div>
                <div className="text-xl font-bold text-blue-900">
                  {formatCurrency(summaryStats.totalRevenue)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
              <p className="text-sm text-gray-600">User interaction analysis</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {filteredData.slice(-5).map((day, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{day.date}</span>
                  <span className="text-sm text-gray-600">
                    CTR: {day.ctr.toFixed(2)}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Engagement Rate</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${Math.min(day.engagement, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {day.engagement.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">
                Average engagement increased by 8.2% this week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onScheduleReport}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
        >
          <Calendar className="w-5 h-5" />
          Schedule Weekly Report
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
        >
          <Share2 className="w-5 h-5" />
          Share Analytics Dashboard
        </button>
      </div>
    </div>
  );
};