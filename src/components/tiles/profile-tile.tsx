"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface ProfileTileProps {
    content: {
        name?: string
        role?: string
        bio?: string
        location?: string
        avatar?: string
        available?: boolean
    }
}

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { EditProfileDialog } from "@/components/modules/edit-profile-dialog"

export function ProfileTile({ content, tile }: { content: any, tile?: Tile }) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full text-center p-8">
            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-sm transition-colors"
                        title="Edit Profile"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <EditProfileDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}

            <div className="relative mb-5">
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-xl">
                    <AvatarImage src={content.avatar || "https://github.com/shadcn.png"} alt={content.name} className="object-cover" />
                    <AvatarFallback className="text-3xl font-bold bg-zinc-100 text-zinc-900">{content.name?.slice(0, 2).toUpperCase() || "ME"}</AvatarFallback>
                </Avatar>
                {content.available && (
                    <span className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white bg-[#00C16A]" title="Available for projects" />
                )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1 truncate w-full px-4" title={content.name || "Your Name"}>{content.name || "Your Name"}</h2>
            <p className="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide truncate w-full px-4">{content.role || "Creator"}</p>

            <div className="max-w-[320px] space-y-4">
                <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {content.bio || "Digital Creator & Product Designer based in NYC."}
                </p>

                {content.location && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">{content.location}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
