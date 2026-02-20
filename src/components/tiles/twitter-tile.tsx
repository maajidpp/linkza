"use client"

import React from "react"
import { Tile, useLayoutStore } from "@/lib/store/use-layout-store"
import { cn } from "@/lib/utils"
// import Image from "next/image" // Using native img for unavatar compatibility simpler
import { Pencil, Twitter, Heart, MessageCircle, Repeat, Share, Maximize2 } from "lucide-react"
import { useState } from "react"
import { EditSocialDialog } from "@/components/modules/edit-social-dialog"

interface TwitterTileProps {
    tile: Tile
    content: {
        username?: string
        handle?: string
        followerCount?: string
        customTitle?: string
    }
}

export function TwitterTile({ tile, content }: TwitterTileProps) {
    const { updateTile } = useLayoutStore()
    const [open, setOpen] = useState(false)
    const username = content?.handle || content?.username || "twitter"

    // Determine size variant based on tile dimensions
    // Small: w=1 (col-span-3)
    // Medium: w=2 (col-span-6)
    // Large: w=4 (col-span-12)
    const isSmall = tile.w === 1
    const isMedium = tile.w === 2
    const isLarge = tile.w >= 3

    // Resize cycle handler: S -> M -> L -> S
    const handleResizeCycle = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        if (isSmall) {
            // S -> M (2x2)
            updateTile(tile.id, { w: 2, h: 2 })
        } else if (isMedium) {
            // M -> L (4x4)
            updateTile(tile.id, { w: 4, h: 4 })
        } else {
            // L -> S (1x2) - Reset
            updateTile(tile.id, { w: 1, h: 2 })
        }
    }

    // Mock Data
    const profile = {
        name: "Alex Rivera",
        handle: `@${username}`,
        followers: "12.5K",
        bio: "Digital Creator. Building digital gardens & styling the web.",
        avatar: `https://unavatar.io/twitter/${username}`
    }

    const tweets = [
        {
            id: 1,
            content: "Just shipped the new Bento Grid layout! 🍱 It's fully responsive and supports drag-and-drop. Check it out!",
            likes: "1.2K",
            retweets: "450",
            time: "2h"
        },
        {
            id: 2,
            content: "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs \n\nMinimalism is key to good UX.",
            likes: "890",
            retweets: "210",
            time: "5h"
        },
        {
            id: 3,
            content: "Working on some new 3D interactions with Spline and React. The web is getting more immersive every day. 🌐✨",
            likes: "2.5K",
            retweets: "800",
            time: "1d"
        },
        {
            id: 4,
            content: "Why do we fall? So we can learn to pick ourselves up.",
            likes: "5K",
            retweets: "1.2K",
            time: "2d"
        }
    ]

    return (
        <div className="group relative h-full w-full flex flex-col overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl transition-all hover:shadow-lg">

            {/* Edit Button (Visible in Edit Mode) */}
            {useLayoutStore.getState().isEditMode && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                        className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <EditSocialDialog tile={tile} open={open} onOpenChange={setOpen} />

                    {/* Resize Handle */}
                    <button
                        onClick={handleResizeCycle}
                        onPointerDown={(e) => e.stopPropagation()}
                        className={cn(
                            "absolute bottom-2 right-2 p-2 rounded-full",
                            "bg-zinc-900/10 dark:bg-white/10 text-zinc-500 dark:text-zinc-400",
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            "hover:scale-110 hover:bg-zinc-900/20 dark:hover:bg-white/20",
                            "backdrop-blur-sm z-50"
                        )}
                        title="Cycle Size (S/M/L)"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </>
            )}

            {/* Content Button */}
            <button
                onClick={() => {
                    if (!useLayoutStore.getState().isEditMode) {
                        window.open(`https://twitter.com/${username}`, "_blank")
                    }
                }}
                className={cn(
                    "flex flex-col h-full w-full",
                    isSmall ? "items-center justify-center p-6 gap-4 text-center" : "text-left"
                )}
            >
                {/* Small View (SocialTile Style) */}
                {isSmall && (
                    <>
                        {/* Platform Icon */}
                        <div className="p-3 rounded-xl bg-muted">
                            <Twitter className="h-6 w-6" />
                        </div>

                        {/* Profile Image */}
                        <img
                            src={profile.avatar}
                            alt={profile.handle}
                            className="w-16 h-16 rounded-full object-cover border"
                        />

                        {/* Username */}
                        <div className="w-full px-1" style={{ containerType: 'inline-size' }}>
                            <h3
                                className="font-semibold w-full text-center leading-tight whitespace-nowrap"
                                title={content.customTitle || username}
                                style={{ fontSize: 'clamp(0.75rem, 12cqw, 1.125rem)' }}
                            >
                                {content.customTitle || username}
                            </h3>
                            {useLayoutStore.getState().isEditMode && (
                                <p className="text-xs text-muted-foreground truncate">
                                    @{username}
                                </p>
                            )}
                            <p className="text-xs md:text-sm text-muted-foreground truncate w-full">
                                Twitter/X
                            </p>
                        </div>
                    </>
                )}

                {/* Medium/Large View (Classic Twitter Style with Tweets) */}
                {!isSmall && (
                    <>
                        {/* Header / Profile Section */}
                        <div className="flex items-start justify-between p-5 w-full">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm shrink-0">
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1" style={{ containerType: 'inline-size' }}>
                                    <span
                                        className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight block whitespace-nowrap"
                                        title={content.customTitle || profile.name}
                                        style={{ fontSize: 'clamp(0.875rem, 8cqw, 1rem)' }}
                                    >
                                        {content.customTitle || profile.name}
                                    </span>
                                    {useLayoutStore.getState().isEditMode && (
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate block">
                                            {profile.handle}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Followers Badge */}
                                <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                    {content.followerCount || profile.followers || "0"} Followers
                                </div>

                                <Twitter className="w-5 h-5 text-[#1DA1F2] fill-current" />
                            </div>
                        </div>

                        <div className={cn(
                            "flex-1 px-5 pb-5 overflow-hidden w-full",
                            "flex flex-col gap-4"
                        )}>
                            {/* Render Tweets */}
                            {tweets.slice(0, isMedium ? 1 : 10).map((tweet, i) => (
                                <div key={tweet.id} className={cn(
                                    "flex flex-col gap-2 p-3 rounded-xl",
                                    "bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800",
                                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                                )}>
                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                        {tweet.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                                        <span className="flex items-center gap-1 hover:text-[#F91880] transition-colors">
                                            <Heart className="w-3 h-3" /> {tweet.likes}
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-[#00BA7C] transition-colors">
                                            <Repeat className="w-3 h-3" /> {tweet.retweets}
                                        </span>
                                        <span className="ml-auto">{tweet.time}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Scroll fade for Large view */}
                            {isLarge && (
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
                            )}
                        </div>
                    </>
                )}
            </button>
        </div>
    )
}
