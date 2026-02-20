"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsletterTileProps {
    content: {
        title?: string
        description?: string
        placeholder?: string
        buttonText?: string
    }
}

export function NewsletterTile({ content }: NewsletterTileProps) {
    return (
        <div className="flex flex-col justify-center h-full w-full p-6 bg-white dark:bg-zinc-900 text-center">
            <h3 className="text-lg font-bold mb-1">{content.title || "Get in touch"}</h3>
            <p className="text-xs text-zinc-500 mb-6">{content.description || "Have a project in mind? Let's talk."}</p>

            <Button
                onClick={() => window.location.href = "mailto:majimaajidpp@gmail.com"}
                className="w-full h-10 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
                <Mail className="mr-2 h-4 w-4" />
                {content.buttonText || "Get in touch"}
            </Button>
        </div>
    )
}
