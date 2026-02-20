import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TileType = 'profile' | 'social' | 'text' | 'media' | 'link' | 'hero' | 'heading' | 'twitter' | 'newsletter' | 'map'

export interface Tile {
    id: string
    type: TileType
    content: any
    // Grid-based positioning (react-grid-layout format)
    x: number  // Column position (0-11 for 12-col grid)
    y: number  // Row position (0-based)
    w: number  // Column span (width in columns)
    h: number  // Row span (height in rows)
    // Optional constraints
    minW?: number  // Minimum column span
    maxW?: number  // Maximum column span (default: 12)
    minH?: number  // Minimum row span
    maxH?: number  // Maximum row span
    static?: boolean  // If true, cannot be dragged or resized (for profile tile)
}

interface LayoutState {
    tiles: Tile[]
    isEditMode: boolean
    updateLayout: (tiles: Tile[]) => void
    addTile: (tile: Tile) => void
    updateTile: (id: string, updates: Partial<Tile>) => void
    removeTile: (id: string) => void
    setEditMode: (isEdit: boolean) => void
    fetchLayout: (username?: string) => Promise<void>
    saveLayout: () => Promise<void>
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
    tiles: [],
    isEditMode: false,

    updateLayout: (newTiles) => {
        set({ tiles: newTiles })
        get().saveLayout()
    },

    addTile: (tile) => {
        set((state) => {
            const newTiles = [...state.tiles, tile]
            return { tiles: newTiles }
        })
        get().saveLayout()
    },

    updateTile: (id, updates) => {
        set((state) => {
            const newTiles = state.tiles.map((t) => (t.id === id ? { ...t, ...updates } : t))
            return { tiles: newTiles }
        })
        get().saveLayout()
    },

    setEditMode: (isEdit) => set({ isEditMode: isEdit }),

    removeTile: (id: string) => {
        set((state) => {
            const newTiles = state.tiles.filter((t) => t.id !== id)
            return { tiles: newTiles }
        })
        get().saveLayout()
    },

    fetchLayout: async (username?: string) => {
        try {
            const url = username ? `/api/layout?username=${username}` : `/api/layout`
            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                if (data.tiles) {
                    set({ tiles: data.tiles })
                } else {
                    // If no layout found (404 for user, or just empty), set empty or keep default?
                    // For public profile 404, we might want to show empty.
                    if (username) set({ tiles: [] })
                }
            }
        } catch (error) {
            console.error("Failed to fetch layout:", error)
        }
    },

    saveLayout: async () => {
        const { tiles } = get()
        // Don't save if we are viewing someone else's profile (checked via edit mode or generally)
        // Actually, saveLayout is called by updateLayout/addTile.
        // We should probably add a check or rely on the API to reject it if not owner.
        // API checks session.
        try {
            await fetch("/api/layout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tiles }),
            })
        } catch (error) {
            console.error("Failed to save layout:", error)
        }
    },
}))
