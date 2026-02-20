import { Twitter, Instagram, Linkedin, Github, Youtube, Twitch, Globe, ArrowUpRight } from "lucide-react"

export interface SocialPlatform {
    key: string
    label: string
    baseUrl: string
    regex: RegExp
    icon: any
    color: string
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
    Instagram: {
        key: "Instagram",
        label: "Instagram",
        baseUrl: "instagram.com/",
        regex: /^[a-zA-Z0-9._]{1,30}$/,
        icon: Instagram,
        color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white"
    },
    Twitter: {
        key: "Twitter",
        label: "Twitter/X",
        baseUrl: "twitter.com/",
        regex: /^[a-zA-Z0-9_]{1,15}$/,
        icon: Twitter,
        color: "bg-black text-white hover:bg-black/90 dark:bg-zinc-800"
    },
    Linkedin: {
        key: "Linkedin",
        label: "LinkedIn",
        baseUrl: "linkedin.com/in/",
        regex: /^[a-zA-Z0-9-]{3,100}$/,
        icon: Linkedin,
        color: "bg-[#0077b5] text-white hover:bg-[#0077b5]/90"
    },
    Github: {
        key: "Github",
        label: "GitHub",
        baseUrl: "github.com/",
        regex: /^[a-zA-Z0-9-]+$/,
        icon: Github,
        color: "bg-[#24292e] text-white hover:bg-[#24292e]/90"
    },
    Youtube: {
        key: "Youtube",
        label: "YouTube",
        baseUrl: "youtube.com/@",
        regex: /^[a-zA-Z0-9._-]{3,50}$/,
        icon: Youtube,
        color: "bg-[#FF0000] text-white hover:bg-[#FF0000]/90"
    },
    Twitch: {
        key: "Twitch",
        label: "Twitch",
        baseUrl: "twitch.tv/",
        regex: /^[a-zA-Z0-9_]{4,25}$/,
        icon: Twitch,
        color: "bg-[#9146FF] text-white hover:bg-[#9146FF]/90"
    }
}

export const DEFAULT_PLATFORM = SOCIAL_PLATFORMS.Twitter
