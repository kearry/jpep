"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    Filter,
    SlidersHorizontal
} from "lucide-react";

interface VotingRecord {
    id: string;
    billId: string;
    bill: {
        title: string;
        status: string;
        category: string;
    };
    vote: string;
    date: string;
    explanation?: string | null;
}

interface VotingRecordProps {
    records: VotingRecord[];
}

export default function VotingRecord({ records }: VotingRecordProps) {
    const [filter, setFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    // Get unique categories for filtering
    const categoriesSet = new Set<string>();
    records.forEach(record => {
        categoriesSet.add(record.bill.category);
    });
    const categories = Array.from(categoriesSet);

    // Filter records based on selected filters
    const filteredRecords = records.filter((record) => {
        if (filter && record.vote !== filter) return false;
        if (categoryFilter && record.bill.category !== categoryFilter) return false;
        return true;
    });

    // Get vote icon based on vote type
    const getVoteIcon = (vote: string) => {
        switch (vote) {
            case "YES":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "NO":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "ABSTAIN":
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case "ABSENT":
                return <Calendar className="h-5 w-5 text-gray-500" />;
            default:
                return null;
        }
    };

    // Get vote class based on vote type
    const getVoteClass = (vote: string) => {
        switch (vote) {
            case "YES":
                return "bg-green-100 text-green-800";
            case "NO":
                return "bg-red-100 text-red-800";
            case "ABSTAIN":
                return "bg-yellow-100 text-yellow-800";
            case "ABSENT":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Calculate voting statistics
    const totalVotes = records.length;
    const yesVotes = records.filter((record) => record.vote === "YES").length;
    const noVotes = records.filter((record) => record.vote === "NO").length;
    const abstainVotes = records.filter((record) => record.vote === "ABSTAIN").length;
    const absentVotes = records.filter((record) => record.vote === "ABSENT").length;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle>Voting Record</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={filter || ""}
                            onChange={(e) => setFilter(e.target.value || null)}
                            className="text-xs border rounded p-1"
                        >
                            <option value="">All Votes</option>
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="ABSTAIN">Abstain</option>
                            <option value="ABSENT">Absent</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                        <select
                            value={categoryFilter || ""}
                            onChange={(e) => setCategoryFilter(e.target.value || null)}
                            className="text-xs border rounded p-1"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Voting Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Yes Votes</span>
                        </div>
                        <p className="text-xl font-bold mt-1">{yesVotes}</p>
                        <p className="text-xs text-gray-500">{Math.round((yesVotes / totalVotes) * 100)}% of total</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm font-medium">No Votes</span>
                        </div>
                        <p className="text-xl font-bold mt-1">{noVotes}</p>
                        <p className="text-xs text-gray-500">{Math.round((noVotes / totalVotes) * 100)}% of total</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-sm font-medium">Abstentions</span>
                        </div>
                        <p className="text-xl font-bold mt-1">{abstainVotes}</p>
                        <p className="text-xs text-gray-500">{Math.round((abstainVotes / totalVotes) * 100)}% of total</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Absences</span>
                        </div>
                        <p className="text-xl font-bold mt-1">{absentVotes}</p>
                        <p className="text-xs text-gray-500">{Math.round((absentVotes / totalVotes) * 100)}% of total</p>
                    </div>
                </div>

                {/* Voting Records List */}
                {filteredRecords.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No voting records match the selected filters</p>
                ) : (
                    <div className="space-y-4">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="border rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-medium">
                                            <Link href={`/bills/${record.billId}`} className="hover:underline">
                                                {record.bill.title}
                                            </Link>
                                        </h3>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                {record.bill.category}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                                {record.bill.status.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-gray-500">
                                                {formatDate(record.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium flex items-center ${getVoteClass(record.vote)}`}>
                                        {getVoteIcon(record.vote)}
                                        <span className="ml-1">{record.vote}</span>
                                    </div>
                                </div>
                                {record.explanation && (
                                    <div className="mt-3 pt-3 border-t text-sm">
                                        <p className="text-gray-600">{record.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}