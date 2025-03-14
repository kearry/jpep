import prisma from "@/lib/prisma";
import { ConstituencyType } from "@/types";

/**
 * Fetch all constituencies with basic info
 */
export async function getAllConstituencies(): Promise<ConstituencyType[]> {
    const constituencies = await prisma.constituency.findMany({
        include: {
            representative: {
                select: {
                    id: true,
                    title: true,
                    party: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return constituencies as unknown as ConstituencyType[];
}

/**
 * Fetch a constituency by ID with detailed info
 */
export async function getConstituencyById(id: string): Promise<ConstituencyType | null> {
    const constituency = await prisma.constituency.findUnique({
        where: {
            id,
        },
        include: {
            representative: {
                select: {
                    id: true,
                    title: true,
                    party: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            projects: {
                orderBy: {
                    startDate: "desc",
                },
                take: 5,
            },
        },
    });

    if (!constituency) {
        return null;
    }

    return constituency as unknown as ConstituencyType;
}

/**
 * Fetch constituencies by parish
 */
export async function getConstituenciesByParish(parish: string): Promise<ConstituencyType[]> {
    const constituencies = await prisma.constituency.findMany({
        where: {
            parish,
        },
        include: {
            representative: {
                select: {
                    id: true,
                    title: true,
                    party: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return constituencies as unknown as ConstituencyType[];
}

/**
 * Search constituencies by name
 */
export async function searchConstituencies(query: string): Promise<ConstituencyType[]> {
    const constituencies = await prisma.constituency.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    parish: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            representative: {
                select: {
                    id: true,
                    title: true,
                    party: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return constituencies as unknown as ConstituencyType[];
}

/**
 * Fetch projects for a constituency
 */
export async function getConstituencyProjects(constituencyId: string) {
    const projects = await prisma.project.findMany({
        where: {
            constituencyId,
        },
        include: {
            updates: {
                orderBy: {
                    date: "desc",
                },
            },
        },
        orderBy: [
            {
                status: "asc",
            },
            {
                startDate: "desc",
            },
        ],
    });

    return projects;
}

/**
 * Fetch project details by ID
 */
export async function getProjectById(id: string) {
    const project = await prisma.project.findUnique({
        where: {
            id,
        },
        include: {
            constituency: {
                select: {
                    id: true,
                    name: true,
                    parish: true,
                },
            },
            updates: {
                orderBy: {
                    date: "desc",
                },
            },
        },
    });

    return project;
}

/**
 * Fetch all parishes with constituency counts
 */
export async function getAllParishes() {
    const constituencies = await prisma.constituency.findMany({
        select: {
            parish: true,
        },
    });

    const parishes = constituencies.reduce((acc, curr) => {
        const parish = curr.parish;
        if (!acc[parish]) {
            acc[parish] = 0;
        }
        acc[parish]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(parishes).map(([name, count]) => ({
        name,
        constituencyCount: count,
    })).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get constituency statistics
 */
export async function getConstituencyStatistics() {
    const totalConstituencies = await prisma.constituency.count();

    const partyRepresentation = await prisma.representative.groupBy({
        by: ["party"],
        _count: {
            party: true,
        },
    });

    const constituenciesWithProjects = await prisma.constituency.count({
        where: {
            projects: {
                some: {},
            },
        },
    });

    const totalProjects = await prisma.project.count();

    const projectsByStatus = await prisma.project.groupBy({
        by: ["status"],
        _count: {
            status: true,
        },
    });

    return {
        totalConstituencies,
        partyRepresentation: partyRepresentation.map(party => ({
            party: party.party,
            count: party._count.party,
            percentage: Math.round((party._count.party / totalConstituencies) * 100),
        })),
        constituenciesWithProjects,
        totalProjects,
        projectsByStatus: projectsByStatus.map(status => ({
            status: status.status,
            count: status._count.status,
            percentage: Math.round((status._count.status / totalProjects) * 100),
        })),
    };
}