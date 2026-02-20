"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthLayout } from "@/components/auth/auth-layout"
import { signIn } from "next-auth/react"

export default function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)
    const [username, setUsername] = useState(searchParams.get("username") || "")
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [validatingUsername, setValidatingUsername] = useState(false)

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        if (usernameAvailable === false) {
            setError("Please choose a different username")
            return
        }

        const formData = new FormData(event.currentTarget)
        const name = formData.get("first-name") + " " + formData.get("last-name")
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, username }),
            })

            if (res.ok) {
                // Auto-login
                const signInRes = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (signInRes?.error) {
                    router.push("/login")
                } else {
                    router.push("/dashboard")
                }
            } else {
                const data = await res.json()
                setError(data.message || "Registration failed")
            }
        } catch (e) {
            setError("An error occurred")
        }
    }

    return (
        <AuthLayout>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to create your account
                    </p>
                </div>
                <div className={cn("grid gap-6")}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" name="first-name" placeholder="Max" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" name="last-name" placeholder="Robinson" required />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    required
                                    className={cn(
                                        usernameAvailable === true && "border-green-500 focus-visible:ring-green-500",
                                        usernameAvailable === false && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                                {username && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Your profile URL: <span className="font-mono text-primary">http://localhost:3000/{username}</span>
                                    </p>
                                )}
                                {username.length >= 3 && !validatingUsername && (
                                    <p className={cn("text-xs", usernameAvailable ? "text-green-600" : "text-red-600")}>
                                        {usernameAvailable ? "Username available ✅" : "Username already taken ❌"}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" disabled={usernameAvailable === false || validatingUsername}>
                                Create Account
                            </Button>
                        </div>
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" type="button" onClick={() => signIn("google")}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                </div>
                <div className="px-8 text-center text-sm text-muted-foreground">
                    <Link href="/login" className="hover:text-brand underline underline-offset-4">
                        Already have an account? Login
                    </Link>
                </div>
            </div >
        </AuthLayout >
    )
}
