import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllConstituencies, getConstituenciesByParish, getAllParishes } from "@/services/constituency-service";
import InfoCard from "@/components/constituencies/info-card";
import ConstituencyMap from "@/components/constituencies/map";
import { Map } from "lucide-react";
import SearchForm from "@/components/constituencies/search-form";
import ParishFilter from "@/components/constituencies/parish-filter";

export const metadata = {
    title: "Constituencies | Jamaica Political Engagement Platform",
    description: "Explore constituencies across Jamaica and find your representative",
};

export default async function ConstituenciesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get query parameters
    const parish = typeof searchParams.parish === "string" ? searchParams.parish : undefined;
    const search = typeof searchParams.q === "string" ? searchParams.q : undefined;

    // Fetch constituencies based on query parameters
    const constituencies = parish
        ? await getConstituenciesByParish(parish)
        : await getAllConstituencies();

    // Fetch all parishes for the filter
    const parishes = await getAllParishes();

    // Filter constituencies by search query if provided
    const filteredConstituencies = search
        ? constituencies.filter(
            (constituency) =>
                constituency.name.toLowerCase().includes(search.toLowerCase()) ||
                constituency.parish.toLowerCase().includes(search.toLowerCase()) ||
                constituency.representative?.user.name?.toLowerCase().includes(search.toLowerCase())
        )
        : constituencies;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Constituencies</h1>
                <Link href="/representatives">
                    <Button variant="outline">View Representatives</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Map */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Jamaica Constituencies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px]">
                                <ConstituencyMap interactive={true} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Search and Listing */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Find Your Constituency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <SearchForm defaultValue={search} placeholder="Search by name or parish" />
                                <ParishFilter parishes={parishes} currentParish={parish} />
                            </div>
                        </CardContent>
                    </Card>

                    <Suspense fallback={<div>Loading constituencies...</div>}>
                        <div className="space-y-6">
                            {filteredConstituencies.length > 0 ? (
                                filteredConstituencies.map((constituency) => (
                                    <InfoCard key={constituency.id} constituency={constituency} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-lg text-gray-500">No constituencies found matching your search criteria.</p>
                                    <Link href="/constituencies">
                                        <Button variant="link" className="mt-2">
                                            Clear filters
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}