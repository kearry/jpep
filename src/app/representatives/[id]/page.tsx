import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard from "@/components/representatives/profile-card";
import VotingRecord from "@/components/representatives/voting-record";
import PerformanceMetrics from "@/components/representatives/performance-metrics";
import MessageForm from "@/components/representatives/message-form";
import {
    getRepresentativeById,
    getRepresentativeActivity,
    getRepresentativeVotingRecords,
    getRepresentativePerformanceMetrics,
    getRepresentativeStatements,
} from "@/services/representative-service";
import { ChevronLeft, Mail } from "lucide-react";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const representative = await getRepresentativeById(params.id);

    if (!representative) {
        return {
            title: "Representative Not Found | Jamaica Political Engagement Platform",
        };
    }

    return {
        title: `${representative.title} ${representative.user.name} | Jamaica Political Engagement Platform`,
        description: `View profile, voting record, and performance metrics for ${representative.title} ${representative.user.name}, representative for ${representative.constituency.name}`,
    };
}

export default async function RepresentativeDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const representative = await getRepresentativeById(params.id);

    if (!representative) {
        notFound();
    }

    // Fetch additional data
    const [votingRecords, performanceMetrics, activity, statements] = await Promise.all([
        getRepresentativeVotingRecords(params.id).then(records =>
            records.map(record => ({
                ...record,
                date: typeof record.date === 'object' ? record.date.toISOString() : record.date
            }))
        ),
        getRepresentativePerformanceMetrics(params.id),
        getRepresentativeActivity(params.id),
        getRepresentativeStatements(params.id),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href="/representatives">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Representatives
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">{representative.title} {representative.user.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <ProfileCard representative={representative} showActions={false} />
                    <div className="mt-4">
                        <Button className="w-full" asChild>
                            <Link href={`/representatives/${representative.id}/message`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Tabs defaultValue="overview">
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="voting">Voting Record</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="prose max-w-none">
                                <h2>About {representative.title} {representative.user.name}</h2>
                                <p>{representative.biography || "No biography available."}</p>
                            </div>

                            {representative.committees && representative.committees.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Committee Memberships</h3>
                                    <ul className="space-y-2">
                                        {representative.committees.map((committee) => (
                                            <li key={committee.committee.id} className="bg-gray-50 p-3 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{committee.committee.name}</span>
                                                    <span className="text-sm bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                                                        {committee.role}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {statements && statements.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Recent Statements</h3>
                                    <div className="space-y-4">
                                        {statements.slice(0, 3).map((statement) => (
                                            <div key={statement.id} className="border rounded-md p-4">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold">{statement.topic}</h4>
                                                    <span className="text-sm text-gray-500">{new Date(statement.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="mt-2 text-sm">{statement.content.substring(0, 200)}...</p>
                                                <div className="mt-2 text-xs text-gray-500">Source: {statement.source}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="voting">
                            {votingRecords && votingRecords.length > 0 ? (
                                <VotingRecord records={votingRecords} />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No voting records available for this representative.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="performance">
                            {performanceMetrics && performanceMetrics.length > 0 ? (
                                <PerformanceMetrics metrics={performanceMetrics} />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No performance metrics available for this representative.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="contact">
                            <MessageForm representative={representative} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}