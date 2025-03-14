"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, timeAgo, getPartyInfo } from "@/lib/utils";
import { ParliamentaryActivityType } from "@/types";
import { FileText, MessageSquare, Vote, Calendar, AlertCircle } from "lucide-react";
import * as React from "react";

interface RecentActivityProps {
    limit?: number;
    representativeId?: string;
    type?: string;
}

export default function RecentActivity({
    limit = 5,
    representativeId,
    type,
}: RecentActivityProps) {
    const [activities, setActivities] = useState<ParliamentaryActivityType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, fetch from API
        // For now, use mock data
        const mockActivities: ParliamentaryActivityType[] = [
            {
                id: "1",
                representativeId: "rep1",
                representative: {
                    title: "Hon.",
                    party: "JLP",
                    user: {
                        name: "Andrew Holness",
                    },
                },
                activityType: "SPEECH",
                date: new Date(2025, 2, 10).toISOString(),
                description: "Speech on climate change resilience in the Caribbean",
                documentUrl: "/documents/speech-123",
            },
            {
                id: "2",
                representativeId: "rep2",
                representative: {
                    title: "Dr.",
                    party: "PNP",
                    user: {
                        name: "Peter Phillips",
                    },
                },
                activityType: "MOTION",
                date: new Date(2025, 2, 8).toISOString(),
                description: "Motion to increase funding for rural healthcare facilities",
                documentUrl: null,
            },
            {
                id: "3",
                representativeId: "rep3",
                representative: {
                    title: "Hon.",
                    party: "JLP",
                    user: {
                        name: "Olivia Grange",
                    },
                },
                activityType: "COMMITTEE_WORK",
                date: new Date(2025, 2, 7).toISOString(),
                description: "Chaired meeting of the Culture and Entertainment Committee",
                documentUrl: "/documents/minutes-456",
            },
            {
                id: "4",
                representativeId: "rep4",
                representative: {
                    title: "Mr.",
                    party: "PNP",
                    user: {
                        name: "Mark Golding",
                    },
                },
                activityType: "QUESTION",
                date: new Date(2025, 2, 5).toISOString(),
                description: "Question to Minister of Finance regarding inflation control measures",
                documentUrl: null,
            },
            {
                id: "5",
                representativeId: "rep5",
                representative: {
                    title: "Mrs.",
                    party: "JLP",
                    user: {
                        name: "Juliet Holness",
                    },
                },
                activityType: "OTHER",
                date: new Date(2025, 2, 3).toISOString(),
                description: "Meeting with constituency representatives to discuss infrastructure development",
                documentUrl: null,
            },
            {
                id: "6",
                representativeId: "rep1",
                representative: {
                    title: "Hon.",
                    party: "JLP",
                    user: {
                        name: "Andrew Holness",
                    },
                },
                activityType: "SPEECH",
                date: new Date(2025, 2, 1).toISOString(),
                description: "Address on economic recovery post-pandemic",
                documentUrl: "/documents/speech-789",
            },
        ];

        // Filter activities based on props
        let filteredActivities = [...mockActivities];

        if (representativeId) {
            filteredActivities = filteredActivities.filter(
                (activity) => activity.representativeId === representativeId
            );
        }

        if (type) {
            filteredActivities = filteredActivities.filter(
                (activity) => activity.activityType === type
            );
        }

        // Limit the number of activities
        filteredActivities = filteredActivities.slice(0, limit);

        setActivities(filteredActivities);
        setLoading(false);
    }, [limit, representativeId, type]);

    const getActivityIcon = (activityType: string) => {
        switch (activityType) {
            case "SPEECH":
                return <FileText className="h-4 w-4" />;
            case "QUESTION":
                return <MessageSquare className="h-4 w-4" />;
            case "MOTION":
                return <Vote className="h-4 w-4" />;
            case "COMMITTEE_WORK":
                return <Calendar className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getActivityTypeLabel = (activityType: string) => {
        switch (activityType) {
            case "SPEECH":
                return "Speech";
            case "QUESTION":
                return "Question";
            case "MOTION":
                return "Motion";
            case "COMMITTEE_WORK":
                return "Committee Work";
            default:
                return "Other Activity";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Parliamentary Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                    </div>
                ) : activities.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No activities found</p>
                ) : (
                    <div className="space-y-6">
                        {activities.map((activity) => {
                            const partyInfo = getPartyInfo(activity.representative.party);

                            return (
                                <div key={activity.id} className="flex items-start space-x-4">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        {getActivityIcon(activity.activityType)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">
                                                <Link href={`/representatives/${activity.representativeId}`} className="hover:underline">
                                                    {activity.representative.title} {activity.representative.user.name}
                                                </Link>
                                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${partyInfo.color}`}>
                                                    {activity.representative.party}
                                                </span>
                                            </p>
                                            <span className="text-xs text-gray-500">{timeAgo(new Date(activity.date))}</span>
                                        </div>
                                        <p className="text-sm">
                                            <span className="font-medium">{getActivityTypeLabel(activity.activityType)}:</span>{" "}
                                            {activity.description}
                                        </p>
                                        {activity.documentUrl && (
                                            <Link
                                                href={activity.documentUrl}
                                                className="text-xs text-green-700 hover:underline flex items-center"
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                View Document
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}