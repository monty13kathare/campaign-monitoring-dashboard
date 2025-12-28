// components/PerformanceTab.tsx
import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
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
  Pause
} from 'lucide-react';
import { formatCurrency } from '../lib/formatters';



interface PerformanceTabProps {
  currentMetrics?: any;
  isStreaming?: boolean;
  onToggleStream?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  historicalData?: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
  }>;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  currentMetrics,
  isStreaming = false,
  onToggleStream,
  onExport,
  historicalData = []
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeMetric, setActiveMetric] = useState<'impressions' | 'clicks' | 'conversions' | 'spend'>('impressions');

  // Mock historical data if none provided
  const chartData = useMemo(() => {
    if (historicalData.length > 0) {
      return historicalData.slice(-7); // Last 7 days
    }

    // Generate sample data
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.floor(Math.random() * 10000) + 5000,
        clicks: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 50) + 20,
        spend: Math.floor(Math.random() * 1000) + 500,
        ctr: Math.random() * 5 + 1,
      };
    });
  }, [historicalData, timeRange]);

  // Efficiency metrics data
  const efficiencyData = useMemo(() => {
    if (!currentMetrics) return [];

    return [
      {
        name: 'Click Efficiency',
        value: ((currentMetrics.clicks / currentMetrics.impressions) * 100) || 0,
        target: 2.5,
        color: '#3B82F6'
      },
      {
        name: 'Conversion Efficiency',
        value: ((currentMetrics.conversions / currentMetrics.clicks) * 100) || 0,
        target: 10,
        color: '#10B981'
      },
      {
        name: 'Cost Efficiency',
        value: currentMetrics.spend / currentMetrics.conversions || 0,
        target: 50,
        color: '#8B5CF6'
      },
      {
        name: 'ROI Potential',
        value: ((currentMetrics.conversions * 100) / currentMetrics.spend) || 0,
        target: 200,
        color: '#F59E0B'
      }
    ];
  }, [currentMetrics]);

  // KPI cards data
  const kpiCards = useMemo(() => [
    {
      title: 'Current CTR',
      value: currentMetrics?.ctr ? `${currentMetrics.ctr.toFixed(2)}%` : '0.00%',
      change: currentMetrics?.ctr && currentMetrics.ctr > 2 ? '+12.5%' : '-5.2%',
      trend: currentMetrics?.ctr && currentMetrics.ctr > 2 ? 'up' : 'down',
      icon: MousePointer,
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: currentMetrics?.conversion_rate ? `${currentMetrics.conversion_rate.toFixed(2)}%` : '0.00%',
      change: currentMetrics?.conversion_rate && currentMetrics.conversion_rate > 5 ? '+8.3%' : '-2.1%',
      trend: currentMetrics?.conversion_rate && currentMetrics.conversion_rate > 5 ? 'up' : 'down',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Avg. CPC',
      value: currentMetrics?.cpc ? `$${currentMetrics.cpc.toFixed(2)}` : '$0.00',
      change: currentMetrics?.cpc && currentMetrics.cpc < 1.5 ? '-15.2%' : '+22.5%',
      trend: currentMetrics?.cpc && currentMetrics.cpc < 1.5 ? 'down' : 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Cost per Conv.',
      value: currentMetrics?.spend && currentMetrics?.conversions 
        ? formatCurrency(currentMetrics.spend / currentMetrics.conversions)
        : '$0.00',
      change: '-7.8%',
      trend: 'down',
      icon: Zap,
      color: 'amber'
    }
  ], [currentMetrics]);

  // Platform distribution (mock data)
  const platformData = [
    { name: 'Google', value: 45, color: '#4285F4' },
    { name: 'Facebook', value: 30, color: '#1877F2' },
    { name: 'Instagram', value: 15, color: '#E4405F' },
    { name: 'LinkedIn', value: 7, color: '#0A66C2' },
    { name: 'Twitter', value: 3, color: '#1DA1F2' }
  ];

  // Custom tooltip for charts
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
                {entry.dataKey === 'spend' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
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
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
          <p className="text-sm text-gray-600">Real-time insights and trends</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Time range filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
          </div>

          {/* Metric selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['impressions', 'clicks', 'conversions', 'spend'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-3 py-1.5 text-sm font-medium capitalize rounded-md transition-colors ${
                  activeMetric === metric
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onToggleStream}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                isStreaming
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Stream
                </>
              )}
            </button>
            
            {/* <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button> */}
            
            <button
              onClick={onExport}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Streaming Status */}
      <div className={`rounded-xl p-4 border ${
        isStreaming 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isStreaming ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <RadioTower className={`w-5 h-5 ${
                isStreaming ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {isStreaming ? 'Live Data Streaming Active' : 'Data Streaming Paused'}
              </h3>
              <p className="text-sm text-gray-600">
                {isStreaming 
                  ? 'Receiving real-time updates from all platforms' 
                  : 'Click "Stream" to enable real-time updates'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {isStreaming ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorClasses = {
            blue: 'border-blue-200 bg-blue-50',
            green: 'border-green-200 bg-green-50',
            purple: 'border-purple-200 bg-purple-50',
            amber: 'border-amber-200 bg-amber-50'
          };
          
          return (
            <div
              key={index}
              className={`rounded-xl border p-4 ${colorClasses[kpi.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  kpi.color === 'blue' ? 'bg-blue-100' :
                  kpi.color === 'green' ? 'bg-green-100' :
                  kpi.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    kpi.color === 'blue' ? 'text-blue-600' :
                    kpi.color === 'green' ? 'text-green-600' :
                    kpi.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {kpi.change}
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
        {/* Main Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {activeMetric} Trend ({timeRange})
              </h3>
              <p className="text-sm text-gray-600">Daily performance over time</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-200" />
                <span className="text-gray-600">Target</span>
              </div>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (activeMetric === 'spend') return `$${value}`;
                    return value.toLocaleString();
                  }}
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
                  name={activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}
                />
                <Line
                  type="monotone"
                  dataKey={`${activeMetric}Target`}
                  stroke="#93C5FD"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Metrics Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Efficiency Metrics
            </h3>
            <p className="text-sm text-gray-600">Performance vs targets</p>
          </div>

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
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'value') return [value, 'Current'];
                    return [value, 'Target'];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Current Performance"
                  radius={[4, 4, 0, 0]}
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="target" 
                  name="Target"
                  fill="#d1d5db"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Platform Distribution
            </h3>
            <p className="text-sm text-gray-600">Traffic share by platform</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }:any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Metric Comparison
            </h3>
            <p className="text-sm text-gray-600">All metrics over time</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  name="Impressions"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                  name="Clicks"
                />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stackId="3"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                  name="Conversions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Summary */}
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Best Performing Day
              </span>
              <span className="font-medium text-gray-900">
                {chartData.reduce((max, day) => 
                  day[activeMetric] > max[activeMetric] ? day : max
                ).date}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Avg. Daily Growth
              </span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.2%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Forecasted Next 7 Days
              </span>
              <span className="font-medium text-gray-900">
                {currentMetrics 
                  ? Math.round(currentMetrics[activeMetric] * 1.08).toLocaleString()
                  : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-linear-to-r from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Engagement Rate
              </span>
              <span className="font-medium text-gray-900">
                {currentMetrics 
                  ? ((currentMetrics.clicks / currentMetrics.impressions) * 100).toFixed(2)
                  : '0.00'}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Avg. Session Duration
              </span>
              <span className="font-medium text-gray-900">
                2m 34s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Bounce Rate
              </span>
              <span className="font-medium text-red-600">
                32.1%
              </span>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-linear-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Daily Avg. Spend
              </span>
              <span className="font-medium text-gray-900">
                {currentMetrics 
                  ? formatCurrency(currentMetrics.spend / 7)
                  : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Budget Utilization
              </span>
              <span className="font-medium text-gray-900">
                78.5%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Cost Efficiency Score
              </span>
              <span className="font-medium text-green-600">
                8.4/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};