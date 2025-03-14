import { NextRequest, NextResponse } from "next/server";
import { getConstituencyById, getConstituencyProjects } from "@/services/constituency-service";
import { getRepresentativeByConstituency } from "@/services/representative-service";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const includeProjects = searchParams.has("projects");
        const includeRepresentative = searchParams.has("representative");

        // Get constituency data
        const constituency = await getConstituencyById(id);

        if (!constituency) {
            return NextResponse.json(
                { error: "Constituency not found" },
                { status: 404 }
            );
        }

        // Build response object
        const response: any = { constituency };

        // Include additional data if requested
        if (includeProjects) {
            const projects = await getConstituencyProjects(id);
            response.projects = projects;
        }

        if (includeRepresentative && !constituency.representative) {
            const representative = await getRepresentativeByConstituency(id);
            if (representative) {
                response.representative = representative;
            }
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching constituency:", error);
        return NextResponse.json(
            { error: "Failed to fetch constituency data" },
            { status: 500 }
        );
    }
}