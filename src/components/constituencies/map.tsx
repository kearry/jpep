"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ConstituencyMapProps {
    interactive?: boolean;
    selectedConstituencyId?: string;
    onConstituencySelect?: (constituencyId: string) => void;
}

interface Constituency {
    id: string;
    name: string;
    boundaries: string; // GeoJSON
    representative?: {
        party: string;
    } | null;
}

export default function ConstituencyMap({
    interactive = true,
    selectedConstituencyId,
    onConstituencySelect,
}: ConstituencyMapProps) {
    const [constituencies, setConstituencies] = useState<Constituency[]>([]);
    const [hoveredConstituency, setHoveredConstituency] = useState<Constituency | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchConstituencies() {
            try {
                // In a real implementation, fetch from API
                // const response = await fetch('/api/constituencies');
                // const data = await response.json();

                // Mock data for demonstration
                const mockConstituencies: Constituency[] = [
                    {
                        id: "kingston-central",
                        name: "Kingston Central",
                        boundaries: "M100,100 L150,100 L150,150 L100,150 Z",
                        representative: { party: "JLP" }
                    },
                    {
                        id: "kingston-eastern",
                        name: "Kingston Eastern",
                        boundaries: "M150,100 L200,100 L200,150 L150,150 Z",
                        representative: { party: "PNP" }
                    },
                    {
                        id: "st-andrew-western",
                        name: "St. Andrew Western",
                        boundaries: "M100,150 L150,150 L150,200 L100,200 Z",
                        representative: { party: "PNP" }
                    },
                    {
                        id: "st-andrew-eastern",
                        name: "St. Andrew Eastern",
                        boundaries: "M150,150 L200,150 L200,200 L150,200 Z",
                        representative: { party: "JLP" }
                    },
                    {
                        id: "st-thomas-western",
                        name: "St. Thomas Western",
                        boundaries: "M200,100 L250,100 L250,150 L200,150 Z",
                        representative: null
                    }
                ];

                setConstituencies(mockConstituencies);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching constituencies:", error);
                setLoading(false);
            }
        }

        fetchConstituencies();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltipRef.current) {
            tooltipRef.current.style.left = `${e.clientX + 10}px`;
            tooltipRef.current.style.top = `${e.clientY + 10}px`;
        }
    };

    const handleConstituencyClick = (constituency: Constituency) => {
        if (!interactive) return;

        if (onConstituencySelect) {
            onConstituencySelect(constituency.id);
        } else {
            router.push(`/constituencies/${constituency.id}`);
        }
    };

    const getPartyColor = (party: string | undefined) => {
        if (party === "JLP") return "#0F8318"; // Green for JLP
        if (party === "PNP") return "#FF8C00"; // Orange for PNP
        return "#CCCCCC"; // Gray for independents or unknown
    };

    return (
        <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            ) : (
                <>
                    <svg
                        ref={mapRef}
                        viewBox="50 50 250 200"
                        className="w-full h-full"
                        style={{ backgroundColor: "#f0f0f0", borderRadius: "8px" }}
                    >
                        {constituencies.map((constituency) => (
                            <path
                                key={constituency.id}
                                d={constituency.boundaries}
                                fill={
                                    selectedConstituencyId === constituency.id
                                        ? "#FFD700" // Highlight selected
                                        : getPartyColor(constituency.representative?.party)
                                }
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                className={`transition-colors duration-200 ${interactive ? "cursor-pointer hover:opacity-80" : ""
                                    }`}
                                onMouseEnter={() => setHoveredConstituency(constituency)}
                                onMouseLeave={() => setHoveredConstituency(null)}
                                onClick={() => handleConstituencyClick(constituency)}
                            />
                        ))}
                        {/* Add Jamaica outline or additional features */}
                    </svg>

                    {hoveredConstituency && (
                        <div
                            ref={tooltipRef}
                            className="absolute bg-white p-2 rounded shadow-md text-sm z-10 pointer-events-none"
                        >
                            <p className="font-semibold">{hoveredConstituency.name}</p>
                            <p>
                                {hoveredConstituency.representative
                                    ? `${hoveredConstituency.representative.party} Representative`
                                    : "No representative data"}
                            </p>
                        </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-white rounded p-2 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="block w-3 h-3 bg-[#0F8318]"></span>
                            <span>JLP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="block w-3 h-3 bg-[#FF8C00]"></span>
                            <span>PNP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="block w-3 h-3 bg-[#CCCCCC]"></span>
                            <span>Independent/Unknown</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}