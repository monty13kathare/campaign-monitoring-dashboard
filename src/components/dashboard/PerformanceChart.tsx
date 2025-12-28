import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  data: any[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214, 32%, 91%)",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="impressions"
            stroke="hsl(221, 83%, 53%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorImpressions)"
            name="Impressions"
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="hsl(262, 83%, 58%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorClicks)"
            name="Clicks"
          />
          <Area
            type="monotone"
            dataKey="conversions"
            stroke="hsl(142, 71%, 45%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorConversions)"
            name="Conversions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
