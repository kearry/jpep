import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/representatives/profile-card";
import { getAllRepresentatives, getRepresentativesByParty } from "@/services/representative-service";
import SearchForm from "@/components/constituencies/search-form";
import PartyFilter from "@/components/representatives/party-filter";

export const metadata = {
    title: "Representatives | Jamaica Political Engagement Platform",
    description: "View and connect with your elected representatives in Jamaica",
};

export default async function RepresentativesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get query parameters
    const party = typeof searchParams.party === "string" ? searchParams.party : undefined;
    const search = typeof searchParams.q === "string" ? searchParams.q : undefined;

    // Fetch representatives based on query parameters
    const representatives = party
        ? await getRepresentativesByParty(party)
        : await getAllRepresentatives();

    // Filter representatives by search query if provided
    const filteredRepresentatives = search
        ? representatives.filter(
            (rep) =>
                rep.user.name?.toLowerCase().includes(search.toLowerCase()) ||
                rep.constituency.name.toLowerCase().includes(search.toLowerCase()) ||
                rep.constituency.parish.toLowerCase().includes(search.toLowerCase())
        )
        : representatives;

    // Group representatives by party for the filter
    const parties = Array.from(new Set(representatives.map((rep) => rep.party))).sort();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Representatives</h1>
                <Link href="/constituencies">
                    <Button variant="outline">View by Constituency</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Find Your Representative</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <SearchForm defaultValue={search} placeholder="Search by name or constituency" />
                        <PartyFilter parties={parties} currentParty={party} />
                    </div>
                </CardContent>
            </Card>

            <Suspense fallback={<div>Loading representatives...</div>}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRepresentatives.length > 0 ? (
                        filteredRepresentatives.map((representative) => (
                            <ProfileCard key={representative.id} representative={representative} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg text-gray-500">No representatives found matching your search criteria.</p>
                            <Link href="/representatives">
                                <Button variant="link" className="mt-2">
                                    Clear filters
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
}