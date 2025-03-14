import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">About JPEP</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            The Jamaica Political Engagement Platform connects citizens with their elected representatives to enhance democratic accountability.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/representatives" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                    Representatives
                                </Link>
                            </li>
                            <li>
                                <Link href="/constituencies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                    Constituencies
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.japarliament.gov.jm/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                >
                                    Parliament of Jamaica
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ecj.com.jm/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                >
                                    Electoral Commission
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://mof.gov.jm/cdf/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                >
                                    Constituency Development Fund
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For support or inquiries, please contact us at:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            support@jpep.org.jm
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Jamaica Political Engagement Platform. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                Terms of Service
                            </Link>
                            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                                About
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}