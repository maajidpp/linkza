"use client"

import { useEffect } from "react"
import { BentoGrid } from "@/components/grid/bento-grid"
import { useLayoutStore } from "@/lib/store/use-layout-store"

export function PublicGridWrapper({ username }: { username: string }) {
    const { fetchLayout, setEditMode } = useLayoutStore()

    useEffect(() => {
        setEditMode(false) // Force read-only
        fetchLayout(username) // Fetch specific user's layout
    }, [fetchLayout, username, setEditMode])

    return <BentoGrid disableAutoFetch={true} />
}
