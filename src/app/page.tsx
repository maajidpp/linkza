"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingGrid } from "@/components/landing/landing-grid"
import { useState, useEffect } from "react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <header className="p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pathayam</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Your Personal Command Center.
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          Organize your digital life with a beautiful, drag-and-drop Bento grid.
          Share your profile with the world.
        </p>

        <div className="w-full max-w-md mx-auto space-y-4">
          <UsernameForm />
          <p className="text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>

        {/* Demo Grid Preview */}
        <div className="mt-12 w-full flex justify-center perspective-[1200px]">
          <div className="relative w-full transform rotate-x-12 scale-90 opacity-90 hover:opacity-100 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out">
            <LandingGrid />
            {/* Gradient overlay for fade effect at bottom */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        © 2026 Linkza by Maajid. All rights reserved.
      </footer>
    </div>
  )
}

function UsernameForm() {
  const [username, setUsername] = useState("")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username) {
      window.location.href = `/register?username=${username}`
    } else {
      window.location.href = "/register"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            pathayam.com/
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
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8 text-lg" disabled={usernameAvailable === false || validatingUsername}>
          Claim Link
        </Button>
      </div>
      {username.length >= 3 && !validatingUsername && (
        <p className={`text-sm text-left pl-1 ${usernameAvailable ? "text-green-600" : "text-red-600"}`}>
          {usernameAvailable ? "Username available ✅" : "Username already taken ❌"}
        </p>
      )}
    </form>
  )
}
