import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        const html = await response.text()
        const $ = cheerio.load(html)

        const title = $('meta[property="og:title"]').attr("content") || $('title').text() || ""
        const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || ""
        const image = $('meta[property="og:image"]').attr("content") || ""

        return NextResponse.json({ title, description, image })
    } catch (error) {
        console.error("Error fetching link preview:", error)
        return NextResponse.json({ error: "Failed to fetch link preview" }, { status: 500 })
    }
}
