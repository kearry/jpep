"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

interface Parish {
    name: string;
    constituencyCount: number;
}

interface ParishFilterProps {
    parishes: Parish[];
    currentParish?: string;
}

export default function ParishFilter({ parishes, currentParish }: ParishFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleParishChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());

        if (e.target.value) {
            params.set("parish", e.target.value);
        } else {
            params.delete("parish");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
                name="parish"
                className="border rounded-md p-2"
                defaultValue={currentParish}
                onChange={handleParishChange}
            >
                <option value="">All Parishes</option>
                {parishes.map((parish) => (
                    <option key={parish.name} value={parish.name}>
                        {parish.name} ({parish.constituencyCount})
                    </option>
                ))}
            </select>
        </div>
    );
}