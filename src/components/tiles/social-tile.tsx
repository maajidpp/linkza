"use client"

import { Pencil } from "lucide-react"
import { useLayoutStore, Tile } from "@/lib/store/use-layout-store"
import { useState, useEffect } from "react"
import { EditSocialDialog } from "@/components/modules/edit-social-dialog"
import { SOCIAL_PLATFORMS, DEFAULT_PLATFORM } from "@/lib/config/social-platforms"
import { cn } from "@/lib/utils"

interface SocialTileProps {
    content: {
        platform: string
        handle?: string
        url?: string
        followerCount?: string
        customImage?: string
    }
    tile?: Tile
}

// export function SocialTile({ content, tile }: { content: any, tile?: Tile }) {
//     const { isEditMode } = useLayoutStore()
//     const [open, setOpen] = useState(false)
//     const [imgError, setImgError] = useState(false)

//     useEffect(() => {
//         setImgError(false)
//     }, [content.handle, content.platform, content.customImage])

//     const platformKey = content.platform || "Twitter"
//     const platform = SOCIAL_PLATFORMS[platformKey] || DEFAULT_PLATFORM

//     const Icon = platform.icon

//     // We want a clean white card for all, or maybe slight branding context if needed.
//     // User requested "Small card showing Platform Icon, Username, Profile Image".
//     // Let's stick to a clean card design.

//     const handle = content.handle || ""
//     const url = `https://${platform.baseUrl}${handle}`

//     return (
//         <div className={cn(
//             "group relative h-full w-full flex flex-col overflow-hidden transition-all duration-300",
//             "bg-white dark:bg-zinc-900 hover:border-border/80"
//         )}>
//             {isEditMode && tile && (
//                 <>
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation()
//                             e.preventDefault()
//                             setOpen(true)
//                         }}
//                         onPointerDown={(e) => e.stopPropagation()}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
//                         title="Edit Social Link"
//                     >
//                         <Pencil className="h-4 w-4" />
//                     </button>
//                     <EditSocialDialog tile={tile} open={open} onOpenChange={setOpen} />
//                 </>
//             )}

//             <button
//                 onClick={(e) => {
//                     if (isEditMode) {
//                         e.preventDefault()
//                     } else {
//                         window.open(url, "_blank")
//                     }
//                 }}
//                 className="flex flex-col h-full w-full p-5 justify-between items-start text-left hover:bg-muted/30 transition-colors cursor-pointer"
//             >
//                 {/* Header: Icon */}
//                 <div className="flex items-start justify-between w-full">
//                     <div className={cn("p-2 rounded-lg",
//                         platform.key === 'Twitter' ? "bg-sky-100 text-sky-500 dark:bg-sky-900/30 dark:text-sky-400" :
//                             platform.key === 'Instagram' ? "bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-400" :
//                                 platform.key === 'Linkedin' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
//                                     "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
//                     )}>
//                         {Icon && <Icon className="h-5 w-5" />}
//                     </div>
//                     {content.customTitle && (
//                         <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[50%]">
//                             {content.customTitle}
//                         </span>
//                     )}
//                 </div>

//                 {/* Profile Image (Unavatar) */}
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-sm">
//                     <img
//                         src={`https://unavatar.io/${platform.key.toLowerCase()}/${handle}`}
//                         alt={handle}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                             // Hide image on error (or show fallback?)
//                             e.currentTarget.style.display = 'none'
//                         }}
//                     />
//                 </div>

//                 {/* Footer: Stats */}
//                 <div>
//                     <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
//                         {content.followerCount || "0"}
//                     </h3>
//                     <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
//                         FOLLOWERS
//                     </p>
//                 </div>
//             </button>
//         </div>
//     )
// }
export function SocialTile({ content, tile }: { content: any, tile?: Tile }) {
    const { isEditMode } = useLayoutStore()
    const [open, setOpen] = useState(false)

    const platformKey = content.platform || "Instagram"
    const platform = SOCIAL_PLATFORMS[platformKey] || DEFAULT_PLATFORM
    const Icon = platform.icon

    const handle = content.handle || ""
    const url = `https://${platform.baseUrl}${handle}`

    return (
        <div className="group relative h-full w-full flex flex-col overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl transition-all hover:shadow-lg">

            {isEditMode && tile && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background rounded-full p-2 opacity-0 group-hover:opacity-100"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    <EditSocialDialog tile={tile} open={open} onOpenChange={setOpen} />
                </>
            )}

            <button
                onClick={() => {
                    if (!isEditMode) {
                        window.open(url, "_blank")
                    }
                }}
                className="flex flex-col items-center justify-center h-full w-full p-6 gap-4 text-center"
            >
                {/* Platform Icon */}
                <div className="p-3 rounded-xl bg-muted">
                    {Icon && <Icon className="h-6 w-6" />}
                </div>

                {/* Profile Image */}
                <img
                    src={`https://unavatar.io/${platform.key.toLowerCase()}/${handle}`}
                    alt={handle}
                    className="w-16 h-16 rounded-full object-cover border"
                />

                {/* Username */}
                <div className="w-full px-1" style={{ containerType: 'inline-size' }}>
                    <h3
                        className="font-semibold w-full text-center leading-tight break-all"
                        title={`@${handle}`}
                        style={{ fontSize: 'clamp(0.65rem, 10cqw, 1.125rem)' }}
                    >
                        @{handle}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate w-full mt-0.5">
                        {platform.label}
                    </p>
                </div>
            </button>
        </div>
    )
}

