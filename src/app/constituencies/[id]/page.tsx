import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoCard from "@/components/constituencies/info-card";
import ConstituencyMap from "@/components/constituencies/map";
import ProfileCard from "@/components/representatives/profile-card";
import { getConstituencyById, getConstituencyProjects } from "@/services/constituency-service";
import { getRepresentativeByConstituency } from "@/services/representative-service";
import { ChevronLeft, MapPin, Users, FileText, Building, User } from "lucide-react";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const constituency = await getConstituencyById(params.id);

    if (!constituency) {
        return {
            title: "Constituency Not Found | Jamaica Political Engagement Platform",
        };
    }

    return {
        title: `${constituency.name} Constituency | Jamaica Political Engagement Platform`,
        description: `Explore ${constituency.name} constituency in ${constituency.parish}, Jamaica. View demographics, projects, and representative information.`,
    };
}

export default async function ConstituencyDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const constituency = await getConstituencyById(params.id);

    if (!constituency) {
        notFound();
    }

    // Fetch additional data
    const projects = await getConstituencyProjects(params.id);
    const representative = constituency.representative || await getRepresentativeByConstituency(params.id);

    // Parse constituency demographics if available
    const demographics = constituency.demographics ? JSON.parse(constituency.demographics) : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href="/constituencies">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Constituencies
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">{constituency.name} Constituency</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info and Map */}
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard constituency={constituency} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Constituency Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ConstituencyMap selectedConstituencyId={constituency.id} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Tabs with Details */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview">
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="demographics">Demographics</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="representative">Representative</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {constituency.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                                        <span><strong>Parish:</strong> {constituency.parish}</span>
                                    </div>

                                    {constituency.population && (
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 mr-2 text-gray-500" />
                                            <span><strong>Population:</strong> {constituency.population.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {constituency.registeredVoters && (
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 mr-2 text-gray-500" />
                                            <span>
                                                <strong>Registered Voters:</strong> {constituency.registeredVoters.toLocaleString()}
                                                {constituency.population && (
                                                    <span className="text-gray-500 text-sm ml-2">
                                                        ({Math.round((constituency.registeredVoters / constituency.population) * 100)}% of population)
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-gray-500" />
                                        <span><strong>Projects:</strong> {projects.length}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {projects.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Projects</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {projects.slice(0, 3).map((project) => (
                                                <li key={project.id} className="border-b pb-2">
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
                                                    <p className="text-sm text-gray-600 mt-1">{project.description.substring(0, 100)}...</p>
                                                </li>
                                            ))}
                                        </ul>

                                        {projects.length > 3 && (
                                            <div className="mt-4 text-center">
                                                <Button variant="outline" asChild>
                                                    <Link href={`/constituencies/${constituency.id}/projects`}>
                                                        View All Projects
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="demographics">
                            {demographics ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Demographics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Age Demographics */}
                                            {demographics.age && (
                                                <div>
                                                    <h3 className="font-semibold mb-2">Age Distribution</h3>
                                                    <ul className="space-y-2">
                                                        {Object.entries(demographics.age).map(([range, percentage]: [string, any]) => (
                                                            <li key={range} className="flex justify-between">
                                                                <span>{range}</span>
                                                                <div className="flex items-center">
                                                                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                                                                        <div
                                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                                            style={{ width: `${percentage * 100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span>{Math.round(percentage * 100)}%</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Gender Demographics */}
                                            {demographics.gender && (
                                                <div>
                                                    <h3 className="font-semibold mb-2">Gender Distribution</h3>
                                                    <ul className="space-y-2">
                                                        {Object.entries(demographics.gender).map(([gender, percentage]: [string, any]) => (
                                                            <li key={gender} className="flex justify-between">
                                                                <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                                                                <div className="flex items-center">
                                                                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                                                                        <div
                                                                            className={`${gender === 'male' ? 'bg-blue-600' : 'bg-pink-500'} h-2.5 rounded-full`}
                                                                            style={{ width: `${percentage * 100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span>{Math.round(percentage * 100)}%</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No demographic information available for this constituency.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="projects">
                            {projects.length > 0 ? (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Projects in {constituency.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Project Status Summary */}
                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    {['COMPLETED', 'IN_PROGRESS', 'APPROVED', 'PROPOSED'].map(status => {
                                                        const count = projects.filter(p => p.status === status).length;
                                                        if (count === 0) return null;

                                                        return (
                                                            <div
                                                                key={status}
                                                                className={`px-3 py-1 rounded-full text-sm ${status === "COMPLETED"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : status === "IN_PROGRESS"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : status === "APPROVED"
                                                                                ? "bg-purple-100 text-purple-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                                    }`}
                                                            >
                                                                {status.replace("_", " ")}: {count}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Projects List */}
                                                <ul className="divide-y">
                                                    {projects.map((project) => (
                                                        <li key={project.id} className="py-4">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-medium">{project.title}</h3>
                                                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                                                    <div className="flex gap-2 mt-2">
                                                                        <span className="text-xs text-gray-500">
                                                                            Budget: J${project.budget.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            Started: {new Date(project.startDate).toLocaleDateString()}
                                                                        </span>
                                                                        {project.endDate && (
                                                                            <span className="text-xs text-gray-500">
                                                                                Ends: {new Date(project.endDate).toLocaleDateString()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-xs ${project.status === "COMPLETED"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : project.status === "IN_PROGRESS"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : project.status === "APPROVED"
                                                                                ? "bg-purple-100 text-purple-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                                    }`}>
                                                                    {project.status.replace("_", " ")}
                                                                </span>
                                                            </div>

                                                            {/* Project Updates */}
                                                            {project.updates && project.updates.length > 0 && (
                                                                <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                                                    <h4 className="text-sm font-medium">Recent Updates</h4>
                                                                    <ul className="mt-1 space-y-2">
                                                                        {project.updates.slice(0, 2).map(update => (
                                                                            <li key={update.id} className="text-sm">
                                                                                <span className="text-gray-500 text-xs">{new Date(update.date).toLocaleDateString()}: </span>
                                                                                {update.description}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No projects available for this constituency.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="representative">
                            {representative ? (
                                <ProfileCard
                                    representative={{
                                        id: representative.id,
                                        userId: representative.id, // Fallback for missing properties
                                        title: representative.title,
                                        party: representative.party,
                                        biography: "",
                                        constituencyId: constituency.id,
                                        constituency: constituency,
                                        user: {
                                            name: representative.user.name,
                                            email: "", // Add missing email property
                                            image: representative.user.image
                                        },
                                        phoneNumber: null,
                                        officeAddress: null,
                                        website: null
                                    }}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No representative information available for this constituency.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}