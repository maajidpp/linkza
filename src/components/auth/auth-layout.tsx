"use client"

import Link from "next/link"
import { LandingGrid } from "@/components/landing/landing-grid"

interface AuthLayoutProps {
    children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/">
                        Linkza
                    </Link>
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Organize your digital life with a beautiful, drag-and-drop Bento grid. Share your profile with the world.&rdquo;
                        </p>
                    </blockquote>
                </div>

                {/* Decorative Grid in Background */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
                    <div className="scale-75 transform rotate-12">
                        <LandingGrid />
                    </div>
                </div>
            </div>
            <div className="relative flex h-full items-center justify-center p-8 lg:p-8">
                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <Link href="/" className="text-sm font-medium hover:underline">
                        Back to Home
                    </Link>
                </div>
                {children}
            </div>
        </div>
    )
}
