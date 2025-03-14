import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActivity from "@/components/dashboard/activity-feed";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Dashboard | Jamaica Political Engagement Platform",
    description: "View parliamentary activities, performance metrics, and more",
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // If user is not logged in, redirect to login page
    if (!session) {
        redirect("/login?returnUrl=/dashboard");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div>
                    <Button variant="outline" size="sm" asChild className="mr-2">
                        <Link href="/messages">Messages</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/profile">Profile</Link>
                    </Button>
                </div>
            </div>

            {/* Welcome Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {session.user.name || "Citizen"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Stay informed about parliamentary activities and connect with your elected representatives.
                    </p>
                </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Representatives"
                    value="63"
                    description="Members of Parliament"
                    trend="+2 since last election"
                    positive={true}
                />
                <StatsCard
                    title="Bills Tracked"
                    value="124"
                    description="Parliamentary bills"
                    trend="+18 in the last 6 months"
                    positive={true}
                />
                <StatsCard
                    title="Citizen Engagements"
                    value="5.2K"
                    description="Messages and petitions"
                    trend="+12% this quarter"
                    positive={true}
                />
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Recent Parliamentary Activity</h2>
                <Suspense fallback={<div>Loading activity...</div>}>
                    <RecentActivity limit={5} />
                </Suspense>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Find Your Representative</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            Connect with your local Member of Parliament.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/representatives">View Representatives</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Explore Constituencies</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            Learn about constituencies and local projects.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/constituencies">View Constituencies</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Track Bills</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            Monitor bills and legislative activities.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/bills">View Bills</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Petitions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            Sign or create petitions for important issues.
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/petitions">View Petitions</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}