import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConstituencyType } from "@/types";
import { formatNumber, getPartyInfo } from "@/lib/utils";
import { Users, UserCheck, Map } from "lucide-react";

interface InfoCardProps {
    constituency: ConstituencyType;
}

export default function InfoCard({ constituency }: InfoCardProps) {
    const { name, parish, population, registeredVoters, representative } = constituency;

    const partyInfo = representative ? getPartyInfo(representative.party) : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{name} Constituency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                        <Map className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm font-medium">Parish</p>
                        <p className="text-lg font-bold">{parish}</p>
                    </div>

                    {population && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <Users className="h-8 w-8 text-gray-500 mb-2" />
                            <p className="text-sm font-medium">Population</p>
                            <p className="text-lg font-bold">{formatNumber(population)}</p>
                        </div>
                    )}

                    {registeredVoters && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                            <UserCheck className="h-8 w-8 text-gray-500 mb-2" />
                            <p className="text-sm font-medium">Registered Voters</p>
                            <p className="text-lg font-bold">{formatNumber(registeredVoters)}</p>
                            {population && (
                                <p className="text-xs text-gray-500">
                                    ({Math.round((registeredVoters / population) * 100)}% of population)
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-3">Current Representative</h3>

                    {representative ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                    {representative.user.image ? (
                                        <img
                                            src={representative.user.image}
                                            alt={representative.user.name || "Representative"}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-semibold text-gray-500">
                                            {representative.user.name ? representative.user.name.charAt(0).toUpperCase() : "R"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{representative.title} {representative.user.name}</p>
                                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${partyInfo?.color}`}>
                                        {representative.party}
                                    </div>
                                </div>
                            </div>

                            <Button asChild size="sm">
                                <Link href={`/representatives/${representative.id}`}>
                                    View Profile
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No representative information available</p>
                    )}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">Constituency Projects</h3>
                        <Button variant="link" size="sm" asChild>
                            <Link href={`/constituencies/${constituency.id}/projects`}>
                                View All
                            </Link>
                        </Button>
                    </div>

                    {constituency.projects && constituency.projects.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                            {constituency.projects.slice(0, 3).map((project) => (
                                <li key={project.id} className="text-sm border-b pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{project.title}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${project.status === "COMPLETED"
                                                ? "bg-green-100 text-green-800"
                                                : project.status === "IN_PROGRESS"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {project.status.replace("_", " ")}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic mt-2">No projects available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}