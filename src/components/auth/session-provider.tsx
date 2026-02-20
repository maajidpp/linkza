"use client"

import { useEffect, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const INACTIVITY_LIMIT = 15 * 60 * 1000 // 15 minutes

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const handleLogout = useCallback(async () => {
        await signOut({ redirect: false })
        router.push("/login")
    }, [router])

    useEffect(() => {
        if (status !== "authenticated") return

        let timeoutId: NodeJS.Timeout

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(handleLogout, INACTIVITY_LIMIT)
        }

        // Initial set
        resetTimer()

        // Listeners for activity
        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"]

        // Debounce the event listener to avoid performance issues
        let lastActivity = Date.now()
        const handleActivity = () => {
            const now = Date.now()
            if (now - lastActivity > 1000) { // Throttle resets to once per second
                resetTimer()
                lastActivity = now
            }
        }

        events.forEach((event) => {
            window.addEventListener(event, handleActivity)
        })

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity)
            })
        }
    }, [status, handleLogout])

    return <>{children}</>
}
