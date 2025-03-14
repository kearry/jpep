import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    trend?: string;
    icon?: React.ReactNode;
    positive?: boolean;
    className?: string;
}

export default function StatsCard({
    title,
    value,
    description,
    trend,
    icon,
    positive,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <CardDescription className="text-xs">{description}</CardDescription>
                {trend && (
                    <div
                        className={cn(
                            "mt-2 flex items-center text-xs font-medium",
                            positive !== undefined
                                ? positive
                                    ? "text-green-700"
                                    : "text-red-700"
                                : ""
                        )}
                    >
                        {positive !== undefined ? (
                            positive ? (
                                <ArrowUpIcon className="mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownIcon className="mr-1 h-4 w-4" />
                            )
                        ) : null}
                        {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}