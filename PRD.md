# Product Requirements Document (PRD): Project Pathayam

**Version:** 1.0 (MVP)  
**Status:** Draft  
**Author:** Gemini AI  

---

## 1. Executive Summary
**Pathayam** is a modular, grid-based web application designed to help users organize information, tasks, and live data into a visually pleasing "Bento-style" dashboard. The MVP focuses on a "Layout-First" approach, prioritizing a highly tactile and customizable user interface.

## 2. Target Audience
- **Productivity Enthusiasts:** Users who want a centralized "Command Center."
- **Developers/Creatives:** Users who appreciate high-aesthetic, modular UI/UX.
- **Minimalists:** Users looking for a cleaner alternative to cluttered browser bookmarks or heavy dashboards.

---

## 3. Functional Requirements

### 3.1 Layout & Customization (The "Grid")
| Feature | Description |
| :--- | :--- |
| **Drag-and-Drop Editor** | Users can grab any tile and move it to a new grid position. The layout must reflow automatically to accommodate the move. |
| **Variable Tile Sizes** | Tiles must support multiple span configurations (e.g., $1 \times 1$, $2 \times 1$, $2 \times 2$, $4 \times 2$). |
| **Dynamic Resizing** | Active handles on the corner of tiles allow users to stretch or shrink modules within the grid constraints. |
| **Theme Engine** | A global state manager for "Light," "Dark," and "High-Contrast" modes, including a user-selectable accent color for borders/highlights. |

### 3.2 Interaction & Content (The "Modules")
| Feature | Description |
| :--- | :--- |
| **Command Palette** | A global shortcut (`Cmd/Ctrl + K`) that opens a fuzzy-search menu to add tiles, switch themes, or trigger app actions. |
| **Progressive Disclosure** | A "Focus Mode" for tiles. Clicking an expansion icon opens a modal or overlay showing detailed information without leaving the dashboard. |
| **Live Data Fetchers** | Default widgets (e.g., Weather, Crypto Price, or RSS Feed) that fetch and cache data from external APIs. |
| **Interactive Input Tiles** | Specific modules designed for data entry, specifically a "Quick Note" text area and a "Task Checklist." |

### 3.3 LOGIN SYSTEM
**LOGIN** - Users can login using thier email and password
**REGISTER** - users can register  using their email and  password
**logout** - users can logout
---

## 4. Technical Stack
- **Frontend:** Next.js 15 (React), Tailwind CSS.
- **Interactions:** `dnd-kit` (Drag & Drop), Framer Motion (Animations).
- **State/Storage:** Zustand (Client State), MongoDB.
- **Components:** shadcn/ui (Command Palette, Modals, Sliders).

---

## 5. User Experience (UX) & Design
- **Visual Style:** Rounded corners (recommended `24px` to `32px`), subtle border-glows, and "Glassmorphism" backgrounds.
- **Responsiveness:** - **Desktop:** 12-column grid.
  - **Tablet:** 6-column grid.
  - **Mobile:** 2-column or single-stack grid (Drag/Resize disabled for UX clarity).
- **Feedback:** Haptic-like visual feedback (subtle scaling) when a tile is grabbed.

---

## 6. Success Metrics
1. **Layout Retention:** User successfully saves at least one custom layout.
2. **Engagement:** At least 30% of sessions involve an interaction with an "Interactive Input Tile."
3. **Performance:** Maintaining a 60fps frame rate during tile dragging and resizing.

---

## 7. Out of Scope for MVP
- Multi-page dashboards.
- Third-party OAuth integrations (Google Calendar, Slack, etc.).
- Publicly shareable URLs/Public Profiles.
- Custom CSS injection for tiles.