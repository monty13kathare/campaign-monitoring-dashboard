import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis,
} from "recharts";

interface Metrics {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
}

interface EfficiencyMetricsChartProps {
    metrics: Metrics;
    formatCurrency: (value: number) => string;
}

interface EfficiencyItem {
    name: string;
    value: number;
    displayValue: string;
    fill: string;
    bg: string;
}

export default function EfficiencyMetricsChart({
    metrics,
    formatCurrency,
}: EfficiencyMetricsChartProps) {
    const clickEfficiency = (metrics.clicks / metrics.impressions) * 100;
    const conversionEfficiency = (metrics.conversions / metrics.clicks) * 100;
    const costEfficiency = Math.min((metrics.spend / metrics.conversions / 10) * 100, 100);
    const roiPotential = Math.min((metrics.conversions * 100) / metrics.spend, 100);

    const efficiencyData: EfficiencyItem[] = [
        {
            name: "Click Efficiency",
            value: clickEfficiency,
            displayValue: `${clickEfficiency.toFixed(2)}%`,
            fill: "hsl(var(--chart-blue))",
            bg: "bg-chart-blue/10",
        },
        {
            name: "Conversion Efficiency",
            value: conversionEfficiency,
            displayValue: `${conversionEfficiency.toFixed(2)}%`,
            fill: "hsl(var(--chart-green))",
            bg: "bg-chart-green/10",
        },
        {
            name: "Cost Efficiency",
            value: costEfficiency,
            displayValue: formatCurrency(metrics.spend / metrics.conversions),
            fill: "hsl(var(--chart-purple))",
            bg: "bg-chart-purple/10",
        },
        {
            name: "ROI Potential",
            value: roiPotential,
            displayValue: `${((metrics.conversions * 100) / metrics.spend * 100).toFixed(1)}%`,
            fill: "hsl(var(--chart-amber))",
            bg: "bg-chart-amber/10",
        },
    ];

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
                Efficiency Metrics
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {efficiencyData.map((item) => (
                    <div key={item.name} className={`rounded-xl ${item.bg} p-4`}>
                        <div className="h-24 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="100%"
                                    barSize={8}
                                    data={[{ value: item.value, fill: item.fill }]}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0, 100]}
                                        angleAxisId={0}
                                        tick={false}
                                    />
                                    <RadialBar
                                        background={{ fill: "hsl(var(--muted))" }}
                                        dataKey="value"
                                        cornerRadius={10}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-foreground">
                                    {item.value.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-xs text-muted-foreground">{item.name}</p>
                            <p className="text-sm font-semibold text-foreground mt-1">
                                {item.displayValue}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}