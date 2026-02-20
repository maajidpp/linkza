import NextAuth from "next-auth"
import { z } from "zod"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"
import { User } from "@/lib/models/user"
import { Session } from "@/lib/models/session"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    await dbConnect()
                    const user = await User.findOne({ email });
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        // Update lastLogin
                        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

                        // Create a new session
                        // Session expires in 7 days (Refresh Token)
                        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                        const session = await Session.create({
                            userId: user._id,
                            expiresAt,
                            ipAddress: "127.0.0.1",
                            userAgent: "Unknown",
                        });

                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            username: user.username,
                            sessionId: session._id.toString(),
                            // Access token expires in 15 minutes
                            accessTokenExpires: Date.now() + 15 * 60 * 1000,
                            isUsernameSet: user.isUsernameSet || !!user.username,
                            role: user.role,
                        };
                    }
                }
                return null;
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }: any) {
            if (account?.provider === "google") {
                await dbConnect()
                const existingUser = await User.findOne({ email: user.email })

                if (!existingUser) {
                    // Create new user
                    const newUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: user.id,
                        isUsernameSet: false,
                        role: user.email === process.env.ADMIN_EMAIL ? "admin" : "user",
                    })
                    user.id = newUser._id.toString()
                    user.isUsernameSet = false
                    user.role = newUser.role
                } else {
                    // Existing user

                    // Block suspended users
                    if (existingUser.status === "suspended") {
                        return false;
                    }

                    user.id = existingUser._id.toString()
                    user.username = existingUser.username
                    user.isUsernameSet = existingUser.isUsernameSet
                    user.role = existingUser.role

                    // Ensure admin role if email matches (in case it changed or wasn't set)
                    if (user.email === process.env.ADMIN_EMAIL && user.role !== "admin") {
                        await User.findByIdAndUpdate(existingUser._id, { role: "admin" })
                        user.role = "admin"
                    }

                    if (!existingUser.googleId) {
                        await User.findByIdAndUpdate(existingUser._id, { googleId: user.id })
                    }

                    // Update lastLogin
                    await User.findByIdAndUpdate(existingUser._id, { lastLogin: new Date() })
                }

                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const session = await Session.create({
                    userId: user.id,
                    expiresAt,
                    ipAddress: "127.0.0.1",
                    userAgent: "Unknown",
                });

                user.sessionId = session._id.toString()
                user.accessTokenExpires = Date.now() + 15 * 60 * 1000;
            }
            return true
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.username = user.username
                token.sessionId = user.sessionId
                token.accessTokenExpires = user.accessTokenExpires
                token.isUsernameSet = user.isUsernameSet
                token.role = user.role
            }

            if (trigger === "update" && session) {
                token.isUsernameSet = session.isUsernameSet;
                token.username = session.username;
            }

            if (Date.now() < (token.accessTokenExpires as number)) {
                return token
            }

            if (token.sessionId) {
                await dbConnect();
                const sessionStr = await Session.findById(token.sessionId);

                if (!sessionStr || sessionStr.isRevoked || new Date() > sessionStr.expiresAt) {
                    return null;
                }

                // Fetch latest user data to check for role/status changes
                const dbUser = await User.findById(sessionStr.userId);
                if (!dbUser || dbUser.status === "suspended") return null;

                return {
                    ...token,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                    role: dbUser.role, // Refresh role in case it changed
                }
            }

            return null
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.sub
                session.user.username = token.username
                session.sessionId = token.sessionId
                session.error = token.error
                session.user.isUsernameSet = token.isUsernameSet
                session.user.role = token.role
            }
            return session
        },
    },
    events: {
        async signOut(message) {
            if ('token' in message && message.token?.sessionId) {
                await dbConnect()
                // Revoke session on logout
                await Session.findByIdAndUpdate(message.token.sessionId, { isRevoked: true })
            }
        }
    }
})
