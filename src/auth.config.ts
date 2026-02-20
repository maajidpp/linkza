import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isUsernameSet = (auth?.user as any)?.isUsernameSet
            const role = (auth?.user as any)?.role
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnChooseUsername = nextUrl.pathname.startsWith("/choose-username")
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")
            const isOnAdminLogin = nextUrl.pathname.startsWith("/admin/login")

            if (isOnAdmin) {
                if (isOnAdminLogin) {
                    if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl))
                    return true
                }

                if (isLoggedIn && role !== "admin") {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }

                if (!isLoggedIn) {
                    return Response.redirect(new URL("/admin/login", nextUrl))
                }

                return true
            }

            if (isLoggedIn) {
                if (!isUsernameSet && !isOnChooseUsername) {
                    return Response.redirect(new URL("/choose-username", nextUrl))
                }
                if (isUsernameSet && isOnChooseUsername) {
                    return Response.redirect(new URL("/dashboard", nextUrl))
                }
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.sub
                session.user.username = token.username
                session.user.isUsernameSet = token.isUsernameSet
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.username = user.username
                token.isUsernameSet = (user as any).isUsernameSet
                token.role = (user as any).role
            }
            return token
        },
    },
    providers: [], // Providers with dependencies added in auth.ts
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days (Refresh Token lifetime)
    },
} satisfies NextAuthConfig
