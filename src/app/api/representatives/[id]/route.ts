import { NextRequest, NextResponse } from "next/server";
import { getRepresentativeById, getRepresentativeActivity, getRepresentativeVotingRecords, getRepresentativePerformanceMetrics, getRepresentativeStatements } from "@/services/representative-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = params;

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const includeActivity = searchParams.has("activity");
        const includeVoting = searchParams.has("voting");
        const includeMetrics = searchParams.has("metrics");
        const includeStatements = searchParams.has("statements");

        // Get representative data
        const representative = await getRepresentativeById(id);

        if (!representative) {
            return NextResponse.json(
                { error: "Representative not found" },
                { status: 404 }
            );
        }

        // Build response object
        const response: any = { representative };

        // Include additional data if requested
        if (includeActivity) {
            const activity = await getRepresentativeActivity(id);
            response.activity = activity;
        }

        if (includeVoting) {
            const votingRecords = await getRepresentativeVotingRecords(id);
            response.votingRecords = votingRecords;
        }

        if (includeMetrics) {
            const metrics = await getRepresentativePerformanceMetrics(id);
            response.performanceMetrics = metrics;
        }

        if (includeStatements) {
            const statements = await getRepresentativeStatements(id);
            response.statements = statements;
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching representative:", error);
        return NextResponse.json(
            { error: "Failed to fetch representative data" },
            { status: 500 }
        );
    }
}