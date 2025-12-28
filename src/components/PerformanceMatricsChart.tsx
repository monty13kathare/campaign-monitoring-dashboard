import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PerformanceChartProps = {
  ctr: number;
  conversionRate: number;
  cpc: number;
};

const timeSeriesData = [
  { name: "Jan", impressions: 4000, clicks: 2400, conversions: 400 },
  { name: "Feb", impressions: 3000, clicks: 1398, conversions: 210 },
  { name: "Mar", impressions: 5000, clicks: 3800, conversions: 590 },
  { name: "Apr", impressions: 4780, clicks: 3908, conversions: 600 },
  { name: "May", impressions: 5890, clicks: 4800, conversions: 810 },
  { name: "Jun", impressions: 6390, clicks: 5200, conversions: 950 },
  { name: "Jul", impressions: 7490, clicks: 5900, conversions: 1100 },
];

export default function PerformanceChart({
  ctr,
  conversionRate,
  cpc,
}: PerformanceChartProps) {
  const performanceMetricsData = [
    {
      label: "Performance",
      CTR: ctr,
      Conversion: conversionRate,
      CPC: cpc,
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6 space-y-10">

      {/* ===================== */}
      {/* AREA CHART (VOLUME) */}
      {/* ===================== */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Campaign Performance
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Impressions, clicks & conversions over time
        </p>

        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip />

              <Area
                dataKey="impressions"
                stroke="#22c55e"
                fillOpacity={0.3}
                fill="#22c55e"
              />
              <Area
                dataKey="clicks"
                stroke="#6366f1"
                fillOpacity={0.3}
                fill="#6366f1"
              />
              <Area
                dataKey="conversions"
                stroke="#f59e0b"
                fillOpacity={0.3}
                fill="#f59e0b"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================== */}
      {/* LINE CHART (METRICS) */}
      {/* ===================== */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Performance Metrics
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          CTR, Conversion Rate & CPC
        </p>

        <div className="h-55">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                dataKey="CTR"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                dataKey="Conversion"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                dataKey="CPC"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
