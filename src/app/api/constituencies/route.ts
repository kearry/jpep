import { NextRequest, NextResponse } from "next/server";
import {
    getAllConstituencies,
    getConstituenciesByParish,
    searchConstituencies,
    getConstituencyStatistics,
    getAllParishes
} from "@/services/constituency-service";

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const parish = searchParams.get("parish");
        const query = searchParams.get("q");
        const stats = searchParams.has("stats");
        const parishesOnly = searchParams.has("parishes");

        if (stats) {
            // Get constituency statistics
            const statistics = await getConstituencyStatistics();
            return NextResponse.json({ statistics });
        }

        if (parishesOnly) {
            // Get all parishes with constituency counts
            const parishes = await getAllParishes();
            return NextResponse.json({ parishes });
        }

        let constituencies;

        if (query) {
            // Search constituencies by query
            constituencies = await searchConstituencies(query);
        } else if (parish) {
            // Filter constituencies by parish
            constituencies = await getConstituenciesByParish(parish);
        } else {
            // Get all constituencies
            constituencies = await getAllConstituencies();
        }

        return NextResponse.json({ constituencies });
    } catch (error) {
        console.error("Error fetching constituencies:", error);
        return NextResponse.json(
            { error: "Failed to fetch constituencies" },
            { status: 500 }
        );
    }
}