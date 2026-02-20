"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function ChooseUsernamePage() {
    const router = useRouter()
    const { data: session, update } = useSession()

    const [username, setUsername] = useState("")
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [validatingUsername, setValidatingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setUsernameAvailable(null)
                return
            }

            setValidatingUsername(true)
            try {
                const res = await fetch(`/api/username/check?username=${username}`)
                const data = await res.json()
                setUsernameAvailable(data.available)
            } catch (error) {
                console.error("Error checking username:", error)
            } finally {
                setValidatingUsername(false)
            }
        }

        const timeoutId = setTimeout(checkUsername, 500)
        return () => clearTimeout(timeoutId)
    }, [username])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username || usernameAvailable === false) return

        setIsSubmitting(true)

        try {
            const res = await fetch("/api/users/set-username", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || "Failed to set username")
                return
            }

            toast.success("Username set successfully!")

            // Force update session to reflect new user state
            await update({ isUsernameSet: true, username })

            router.push("/dashboard")
            router.refresh()

        } catch (error) {
            console.error("Error setting username:", error)
            toast.error("Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Choose your username</h1>
                    <p className="text-muted-foreground mt-2">
                        Create a unique username for your public profile.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                                linkza.pro/
                            </div>
                            <input
                                name="username"
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                className={`flex h-12 w-full rounded-md border bg-background pl-32 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${usernameAvailable === true ? "border-green-500 focus-visible:ring-green-500" :
                                    usernameAvailable === false ? "border-red-500 focus-visible:ring-red-500" :
                                        "border-input"
                                    }`}
                                autoComplete="off"
                                disabled={isSubmitting}
                            />
                        </div>

                        {username.length >= 3 && !validatingUsername && (
                            <p className={`text-sm ${usernameAvailable ? "text-green-600" : "text-red-600"}`}>
                                {usernameAvailable ? "Username available ✅" : "Username already taken ❌"}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Lowercase letters, numbers, and hyphens only.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting || usernameAvailable === false || validatingUsername || username.length < 3}
                    >
                        {isSubmitting ? "Saving..." : "Continue to Dashboard"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
