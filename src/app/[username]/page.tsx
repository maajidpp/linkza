import { BentoGrid } from "@/components/grid/bento-grid"
import { Layout } from "@/lib/models/layout"
import { User } from "@/lib/models/user"
import dbConnect from "@/lib/db"
import { notFound } from "next/navigation"
import { PublicGridWrapper } from "@/components/modules/public-grid-wrapper"

interface PublicProfilePageProps {
    params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    await dbConnect()

    const { username } = await params
    const user = await User.findOne({ username })

    if (!user || user.status === "suspended") {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <main className="mx-auto max-w-[1400px]">
                <PublicGridWrapper username={username} />
            </main>
        </div>
    )
}
