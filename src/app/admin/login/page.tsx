"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LayoutDashboard, Eye, EyeOff, Loader2, CheckCircle2, Trash2 } from "lucide-react"

export default function AdminLoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (res?.error) {
                setError("Invalid admin credentials")
                setIsLoading(false)
            } else {
                router.push("/admin")
                router.refresh()
            }
        } catch (e) {
            setError("Authentication failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 light">
            {/* Left Side - Login Form */}
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white text-zinc-900">
                <div className="w-full max-w-sm space-y-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-zinc-900 rounded-lg">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900">BentoAdmin</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Welcome back
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Enter your details to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-700 font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                    disabled={isLoading}
                                    className="bg-zinc-50 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-700 font-medium">Password</Label>
                                    <Button variant="link" className="p-0 h-auto text-xs text-zinc-500 hover:text-zinc-900" tabIndex={-1}>
                                        Forgot password?
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                        className="bg-zinc-50 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400 h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900" />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-500"
                            >
                                Remember me for 30 days
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : "Sign in"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Side - Visual Area */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-50 p-12 relative overflow-hidden">
                <div className="w-full max-w-lg">
                    <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                        New Features Available
                    </div>

                    <h2 className="text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
                        Build beautiful forms in minutes.
                    </h2>

                    <p className="text-lg text-zinc-600 mb-12">
                        Customize questions, branding, and sign-up options for your members with our intuitive builder.
                    </p>

                    {/* Mock Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-zinc-100 transform rotate-1 transition-transform hover:rotate-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                                    <div className="h-4 w-4 rounded-full border-2 border-zinc-300 grid grid-cols-2 gap-0.5 p-0.5">
                                        <div className="bg-zinc-300 rounded-[1px]"></div>
                                        <div className="bg-zinc-300 rounded-[1px]"></div>
                                        <div className="bg-zinc-300 rounded-[1px]"></div>
                                    </div>
                                </div>
                                <span className="font-semibold text-zinc-900">Question 01</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Required
                                </span>
                                <div className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between items-center text-zinc-500 text-sm">
                                <span>Short Question</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>

                            <div className="h-28 bg-white rounded-lg border-2 border-dashed border-zinc-200 p-4 text-zinc-400 text-sm">
                                Enter your full name
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
