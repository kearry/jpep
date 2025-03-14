import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import ConstituencyMap from "@/components/constituencies/map";
import RecentActivity from "@/components/dashboard/activity-feed";
import StatsCard from "@/components/dashboard/stats-card";

export default async function Home() {
    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-black/5 dark:bg-white/5 rounded-xl">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                                Connect with your elected representatives
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300">
                                The Jamaica Political Engagement Platform helps you stay informed about your representatives,
                                track their performance, and make your voice heard.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
                                    <Link href="/constituencies">
                                        Find Your Representative
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="/about">
                                        Learn More
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative h-64 md:h-80 w-full">
                            <ConstituencyMap interactive={false} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Representatives"
                        value="63"
                        description="Members of Parliament"
                        trend="+2 since last election"
                    />
                    <StatsCard
                        title="Bills Tracked"
                        value="124"
                        description="Parliamentary bills"
                        trend="+18 in the last 6 months"
                    />
                    <StatsCard
                        title="Citizen Engagements"
                        value="5.2K"
                        description="Messages and petitions"
                        trend="+12% this quarter"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Representative Profiles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Access comprehensive information about your elected officials, including biographical data, voting records, and committee assignments.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Track attendance, bills sponsored, constituency development fund utilization, and other key performance indicators.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Direct Communication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Send messages, sign petitions, and participate in discussions about issues that matter to your community.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="py-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Recent Parliamentary Activity</h2>
                <RecentActivity limit={5} />
                <div className="text-center mt-6">
                    <Button asChild variant="outline">
                        <Link href="/dashboard">
                            View All Activity
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}