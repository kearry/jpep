"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

interface PartyFilterProps {
    parties: string[];
    currentParty?: string;
}

export default function PartyFilter({ parties, currentParty }: PartyFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());

        if (e.target.value) {
            params.set("party", e.target.value);
        } else {
            params.delete("party");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
                name="party"
                className="border rounded-md p-2"
                defaultValue={currentParty}
                onChange={handlePartyChange}
            >
                <option value="">All Parties</option>
                {parties.map((party) => (
                    <option key={party} value={party}>
                        {party}
                    </option>
                ))}
            </select>
        </div>
    );
}