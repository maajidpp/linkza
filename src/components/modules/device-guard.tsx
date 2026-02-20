"use client"

import { useEffect, useState } from "react"
import { Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DeviceGuardProps {
    children: React.ReactNode
}

export function DeviceGuard({ children }: DeviceGuardProps) {
    const [isDesktop, setIsDesktop] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const checkWidth = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }

        // Initial check
        checkWidth()

        // Event listener
        window.addEventListener("resize", checkWidth)

        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    if (!mounted) {
        return null // or a loading spinner
    }

    if (!isDesktop) {
        return (
            <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="relative mb-8">
                    <Monitor className="h-16 w-16 text-muted-foreground opacity-20 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4" />
                    <Smartphone className="h-12 w-12 text-primary relative z-10" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Desktop Experience Required
                </h2>

                <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                    The Bento editor is optimized for larger screens to give you the best design experience. Please open this page on a desktop or laptop (width &gt; 1024px).
                </p>

                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
