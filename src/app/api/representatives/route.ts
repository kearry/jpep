import { NextRequest, NextResponse } from "next/server";
import {
    getAllRepresentatives,
    getRepresentativesByParty,
    searchRepresentatives
} from "@/services/representative-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const party = searchParams.get("party");
        const query = searchParams.get("q");

        let representatives;

        if (query) {
            // Search representatives by query
            representatives = await searchRepresentatives(query);
        } else if (party) {
            // Filter representatives by party
            representatives = await getRepresentativesByParty(party);
        } else {
            // Get all representatives
            representatives = await getAllRepresentatives();
        }

        return NextResponse.json({ representatives });
    } catch (error) {
        console.error("Error fetching representatives:", error);
        return NextResponse.json(
            { error: "Failed to fetch representatives" },
            { status: 500 }
        );
    }
}