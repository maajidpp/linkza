import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        sessionId: string
        user: {
            id: string
            username: string
            isUsernameSet: boolean
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        username?: string
        isUsernameSet?: boolean
        role?: string
        sessionId?: string
        accessTokenExpires?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username?: string
        isUsernameSet?: boolean
        role?: string
        sessionId?: string
        accessTokenExpires?: number
    }
}
