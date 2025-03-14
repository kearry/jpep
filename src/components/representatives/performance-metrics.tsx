"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetricType } from "@/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

interface PerformanceMetricsProps {
    metrics: PerformanceMetricType[];
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(
        metrics.length > 0 ? metrics[0].period : undefined
    );

    // Filter metrics for the selected period
    const filteredMetrics = selectedPeriod
        ? metrics.filter((metric) => metric.period === selectedPeriod)
        : [];

    // Get unique periods for the dropdown
    const periods = [...new Set(metrics.map((metric) => metric.period))];

    // Format metric type for display
    const formatMetricType = (type: string) => {
        return type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Get colors for different metric types
    const getMetricColor = (type: string) => {
        const colors: Record<string, string> = {
            ATTENDANCE_RATE: "#4CAF50",
            BILLS_SPONSORED: "#2196F3",
            QUESTIONS_ASKED: "#FFC107",
            CONSTITUENCY_VISITS: "#9C27B0",
            RESPONSE_RATE: "#FF5722",
        };
        return colors[type] || "#757575";
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle>Performance Metrics</CardTitle>
                {periods.length > 0 && (
                    <div className="mt-2 sm:mt-0">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="p-2 border rounded text-sm"
                        >
                            {periods.map((period) => (
                                <option key={period} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {filteredMetrics.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No metrics available for this period</p>
                ) : (
                    <div className="space-y-8">
                        {/* Bar Chart */}
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={filteredMetrics.map(metric => ({
                                        name: formatMetricType(metric.metricType),
                                        value: metric.value,
                                        fill: getMetricColor(metric.metricType)
                                    }))}
                                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        tick={{ fontSize: 12 }}
                                        height={60}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`${value}`, "Value"]}
                                        labelFormatter={(label) => label}
                                    />
                                    <Bar dataKey="value" fill="#8884d8">
                                        {filteredMetrics.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getMetricColor(entry.metricType)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMetrics.map((metric) => (
                                <div
                                    key={metric.id}
                                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">{formatMetricType(metric.metricType)}</h3>
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: getMetricColor(metric.metricType) }}
                                        ></span>
                                    </div>
                                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                                    {metric.description && (
                                        <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pie Chart comparing with averages */}
                        {filteredMetrics.length >= 3 && (
                            <div className="h-72">
                                <h3 className="text-sm font-medium mb-4 text-center">Metric Distribution</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={filteredMetrics.map(metric => ({
                                                name: formatMetricType(metric.metricType),
                                                value: metric.value
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {filteredMetrics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, "Value"]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}