import { useState } from "react"
import { Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { EditTextDialog } from "@/components/modules/edit-text-dialog"

interface TextTileProps {
    content: string | { text: string; title?: string }
    tile?: Tile
}

export function TextTile({ content, tile }: TextTileProps) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    const text = typeof content === 'string' ? content : content.text
    const title = typeof content === 'object' ? content.title : null

    return (
        <div className="h-full w-full relative group">
            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Text"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <EditTextDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}
            <div className="h-full w-full p-6 flex flex-col justify-center bg-card text-card-foreground">
                {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {text || "Add your text here..."}
                </p>
            </div>
        </div>
    )
}
