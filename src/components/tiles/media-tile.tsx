"use client"

import { useState, useEffect } from "react"
import { Play, SkipBack, SkipForward, Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { EditMediaDialog } from "@/components/modules/edit-media-dialog"

interface MediaTileProps {
    content: {
        type: string
        title?: string
        description?: string
        track?: string
        artist?: string
        cover?: string
    }
    tile?: Tile
}

export function MediaTile({ content, tile }: MediaTileProps) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    return (
        <div className="relative h-full w-full group overflow-hidden bg-zinc-900">
            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <EditMediaDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}

            {/* Background Image or Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                {content.cover ? (
                    (content.type === 'Video' || content.cover.endsWith('.mp4') || content.cover.endsWith('.webm') || content.cover.endsWith('.mov')) ? (
                        <video
                            src={content.cover}
                            className="h-full w-full object-cover opacity-90"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <img
                            src={content.cover}
                            alt="Media Cover"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        />
                    )
                ) : (
                    <div className="text-zinc-500 flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-zinc-700/50">
                            <Play className="h-6 w-6 opacity-50" />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider opacity-70">No Media</span>
                    </div>
                )}
                {content.cover && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />}
            </div>

            {/* Content */}
            {content.title && (
                <div className="relative h-full w-full flex flex-col justify-end p-5">
                    <div className="flex flex-col gap-1 text-left z-10">
                        {content.description && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                                {content.description}
                            </span>
                        )}
                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                            {content.title}
                        </h3>
                    </div>
                </div>
            )}
        </div>
    )
}
