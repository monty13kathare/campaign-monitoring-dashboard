import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CampaignDonutChartProps {
  active: number;
  paused: number;
  completed: number;
}

const COLORS = [
  "hsl(142, 71%, 45%)",  // green - active
  "hsl(38, 92%, 50%)",   // amber - paused
  "hsl(221, 83%, 53%)",  // blue - completed
];

export default function CampaignDonutChart({
  active,
  paused,
  completed,
}: CampaignDonutChartProps) {
  const data = [
    { name: "Active", value: active },
    { name: "Paused", value: paused },
    { name: "Completed", value: completed },
  ];

  const total = active + paused + completed;

  return (
    <div className="relative h-50 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(214, 32%, 91%)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{total}</span>
        <span className="text-sm text-muted-foreground">Total</span>
      </div>
    </div>
  );
}
