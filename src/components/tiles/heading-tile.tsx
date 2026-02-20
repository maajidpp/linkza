"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { EditHeadingDialog } from "@/components/modules/edit-heading-dialog"

interface HeadingTileProps {
    content: string | { text: string }
    tile?: Tile
}

export function HeadingTile({ content, tile }: HeadingTileProps) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    const text = typeof content === 'string' ? content : content.text

    return (
        <div className="h-full w-full relative group flex items-center">
            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-1/2 -translate-y-1/2 right-0 z-50 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Heading"
                    >
                        <Pencil className="h-3 w-3" />
                    </button>
                    <EditHeadingDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}
            <h2 className="text-2xl font-bold tracking-tight text-foreground w-full break-words">
                {text || "Section Title"}
            </h2>
        </div>
    )
}
