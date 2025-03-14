"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, AlertTriangle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }

        // Check for register param
        const register = searchParams.get("register");
        if (register === "true") {
            setIsRegister(true);
        }

        // Check for error
        const errorParam = searchParams.get("error");
        if (errorParam) {
            switch (errorParam) {
                case "CredentialsSignin":
                    setError("Invalid email or password");
                    break;
                default:
                    setError("An error occurred during authentication");
            }
        }
    }, [status, router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (isRegister) {
            // Registration validation
            if (!name || !email || !password || !confirmPassword) {
                setError("All fields are required");
                setIsLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            // In a real implementation, make a POST request to /api/auth/register
            // For now, simulate a successful registration
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Then sign in the user
                await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                router.push("/dashboard");
            } catch (error) {
                console.error("Registration error:", error);
                setError("Failed to register. Please try again.");
                setIsLoading(false);
            }
        } else {
            // Login
            try {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid email or password");
                    setIsLoading(false);
                    return;
                }

                router.push("/dashboard");
            } catch (error) {
                console.error("Login error:", error);
                setError("An error occurred during login");
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        {isRegister ? "Create an account" : "Welcome back"}
                    </CardTitle>
                    <CardDescription>
                        {isRegister
                            ? "Enter your information to create an account"
                            : "Enter your credentials to access your account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {isRegister && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            placeholder="Enter your name"
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m.brown@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {isRegister && (
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-green-700 hover:bg-green-800"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                        {isRegister ? "Creating account..." : "Signing in..."}
                                    </span>
                                ) : isRegister ? (
                                    "Create account"
                                ) : (
                                    "Sign in"
                                )}
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 mr-2"
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                                    />
                                    <path
                                        fill="#4A90E2"
                                        d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                                    />
                                </svg>
                                <span>Google</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-center text-gray-600">
                        {isRegister ? (
                            <>
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-green-700 hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsRegister(false);
                                        router.push("/login");
                                    }}
                                >
                                    Sign in
                                </Link>
                            </>
                        ) : (
                            <>
                                Don't have an account?{" "}
                                <Link
                                    href="/login?register=true"
                                    className="text-green-700 hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsRegister(true);
                                        router.push("/login?register=true");
                                    }}
                                >
                                    Create an account
                                </Link>
                            </>
                        )}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}