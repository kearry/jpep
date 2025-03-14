"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
    defaultValue?: string;
    placeholder?: string;
}

export default function SearchForm({ defaultValue, placeholder = "Search by name or constituency" }: SearchFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const searchTerm = formData.get("q")?.toString() || "";

        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm) {
            params.set("q", searchTerm);
        } else {
            params.delete("q");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <form onSubmit={handleSubmit}>
                <Input
                    type="search"
                    name="q"
                    placeholder={placeholder}
                    className="pl-10"
                    defaultValue={defaultValue}
                />
            </form>
        </div>
    );
}