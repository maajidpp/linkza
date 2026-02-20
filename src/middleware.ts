import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// 1. Define your custom domain mapping here
// Format: "domain.com": "username"
const DOMAIN_MAPPING: Record<string, string> = {
    "maajid.in": "maajid", // Example: maajid.in -> /maajid
    // Add more domains here as needed
}

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl
    const hostname = req.headers.get("host") || ""

    // Remove port if present (e.g. localhost:3000)
    const currentDomain = hostname.split(":")[0]

    // 2. Check if the current domain is in our mapping
    const mappedUsername = DOMAIN_MAPPING[currentDomain]

    if (mappedUsername) {
        // If it's a verification/auth request or static file, let it pass through normally
        if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next") || url.pathname.includes(".")) {
            return auth(req as any)
        }

        // Otherwise, rewrite the root "/" to the user's profile
        if (url.pathname === "/") {
            return NextResponse.rewrite(new URL(`/${mappedUsername}`, req.url))
        }

        // If they visit /some-path, rewrite to /username/some-path (optional, depending on your needs)
        // For now, we'll mainly rewrite the homepage
    }

    // 3. Continue with standard connection/auth middleware
    return auth(req as any)
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
