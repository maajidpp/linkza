"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider as AutoLogoutProvider } from "@/components/auth/session-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AutoLogoutProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </AutoLogoutProvider>
        </SessionProvider>
    )
}
