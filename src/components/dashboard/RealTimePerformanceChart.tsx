import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Metrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

interface RealTimePerformanceChartProps {
  metrics: Metrics;
  isStreaming: boolean;
  formatCurrency: (value: number) => string;
}

export default function RealTimePerformanceChart({
  metrics,
  isStreaming,
  formatCurrency,
}: RealTimePerformanceChartProps) {
  const data = [
    {
      name: "Impressions",
      value: Math.round(metrics.impressions * 0.05),
      color: "hsl(var(--chart-blue))",
      total: metrics.impressions,
    },
    {
      name: "Clicks",
      value: Math.round(metrics.clicks * 0.03),
      color: "hsl(var(--chart-green))",
      total: metrics.clicks,
    },
    {
      name: "Conversions",
      value: Math.round(metrics.conversions * 0.02),
      color: "hsl(var(--chart-purple))",
      total: metrics.conversions,
    },
    {
      name: "Spend",
      value: Math.round(metrics.spend * 0.04),
      color: "hsl(var(--chart-amber))",
      total: metrics.spend,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Real-time Performance
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isStreaming ? "bg-chart-green animate-pulse" : "bg-muted-foreground"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isStreaming ? "Streaming live data" : "Connection paused"}
          </span>
        </div>
      </div>

      <div className="h-62.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 500 }}
              width={90}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        +{item.name === "Spend" ? formatCurrency(item.value) : item.value.toLocaleString()} today
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with values */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">
              +{item.name === "Spend" ? formatCurrency(item.value) : item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}