"use client"

import { ArrowRight, Link as LinkIcon, Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { useState } from "react"
import { EditLinkDialog } from "@/components/modules/edit-link-dialog"

interface LinkTileProps {
    content: {
        label?: string
        url?: string
        description?: string
        previewImage?: string
    }
    tile?: Tile
}

export function LinkTile({ content, tile }: LinkTileProps) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    return (
        <div className="h-full w-full relative group bg-white dark:bg-zinc-900 flex flex-col p-6 justify-between">
            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-zinc-100 hover:bg-zinc-200 text-black rounded-full p-2 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <EditLinkDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}

            <div className="flex flex-col gap-1 items-start min-w-0 w-full">
                <h3 className="text-xl font-bold tracking-tight text-left truncate w-full" title={content.label || "My Portfolio"}>{content.label || "My Portfolio"}</h3>
            </div>

            {/* Preview Image / Large Icon Area */}
            <div className="flex-1 w-full my-4 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative group-hover:shadow-md transition-shadow">
                {content.previewImage ? (
                    <img src={content.previewImage} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center flex-col gap-2 text-zinc-300">
                        <div className="h-20 w-32 bg-zinc-200 rounded-lg" />
                        <div className="h-3 w-20 bg-zinc-200 rounded-lg" />
                    </div>
                )}
            </div>

            {content.description && (
                <p className="text-xs font-medium text-zinc-500 line-clamp-2 mb-4 text-left">
                    {content.description}
                </p>
            )}

            <div className="flex justify-end">
                <a
                    href={content.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => isEditMode && e.preventDefault()}
                    className="h-10 w-10 bg-black text-white hover:bg-zinc-800 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                >
                    <ArrowRight className="h-5 w-5" />
                </a>
            </div>
        </div>
    )
}
