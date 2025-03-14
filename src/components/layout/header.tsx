"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Representatives", href: "/representatives" },
        { name: "Constituencies", href: "/constituencies" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "About", href: "/about" },
    ];

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-200",
                isScrolled
                    ? "bg-white/95 backdrop-blur-sm dark:bg-gray-950/95 border-gray-200 dark:border-gray-800"
                    : "bg-white dark:bg-gray-950 border-transparent"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
                            <div className="relative h-8 w-8">
                                {/* Replace with actual logo */}
                                <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
                                    J
                                </div>
                            </div>
                            <span className="hidden sm:inline-block font-bold text-lg">
                                JPEP
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href
                                        ? "text-black dark:text-white"
                                        : "text-gray-500 dark:text-gray-400"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                    asChild
                                >
                                    <Link href="/profile">
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-green-700 hover:bg-green-800"
                                    onClick={() => signOut()}
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button className="bg-green-700 hover:bg-green-800" asChild>
                                    <Link href="/login?register=true">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="inline-flex items-center justify-center p-2 rounded-md md:hidden text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        <div className="space-y-1 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "block px-3 py-2 rounded-md text-base font-medium",
                                        pathname === item.href
                                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    )}
                                    onClick={closeMenu}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                            {session ? (
                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-sm font-medium text-gray-500">
                                        Signed in as {session.user?.name || session.user?.email}
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={closeMenu}
                                    >
                                        <User size={18} className="inline-block mr-2" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            signOut();
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <LogOut size={18} className="inline-block mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={closeMenu}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/login?register=true"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-green-700 dark:text-green-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}