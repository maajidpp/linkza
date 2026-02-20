"use client"

import { MapPin } from "lucide-react"

interface MapTileProps {
    content: {
        location?: string
        lat?: number
        lng?: number
    }
}

export function MapTile({ content }: MapTileProps) {
    const location = content.location || "New York, US"
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    return (
        <div className="relative h-full w-full bg-slate-100 overflow-hidden group">
            <iframe
                width="100%"
                height="100%"
                src={mapSrc}
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
                title="Map"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium truncate shadow-sm">{location}</span>
                </div>
            </div>
        </div>
    )
}
