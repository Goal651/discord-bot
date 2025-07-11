export interface GameTheme {
  id: string
  name: string
  description: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
}

export class ThemeManager {
  private themes: GameTheme[] = [
    {
      id: "cyberpunk",
      name: "Cyberpunk 2077",
      description: "Neon pink and cyan vibes",
      preview: "bg-gradient-to-r from-pink-500 to-cyan-400",
      colors: {
        primary: "#ff0080",
        secondary: "#00ffff",
        accent: "#ffff00",
        background: "#0a0a0a",
        foreground: "#ffffff",
        muted: "#666666",
        border: "#333333",
      },
    },
    {
      id: "matrix",
      name: "Matrix Code",
      description: "Green digital rain aesthetic",
      preview: "bg-gradient-to-r from-green-400 to-green-600",
      colors: {
        primary: "#00ff41",
        secondary: "#008f11",
        accent: "#39ff14",
        background: "#000000",
        foreground: "#00ff41",
        muted: "#004400",
        border: "#008800",
      },
    },
    {
      id: "rgb-gaming",
      name: "RGB Gaming",
      description: "Rainbow RGB lighting",
      preview: "bg-gradient-to-r from-red-500 via-blue-500 to-purple-500",
      colors: {
        primary: "#ff6b6b",
        secondary: "#4ecdc4",
        accent: "#a8e6cf",
        background: "#1a1a1a",
        foreground: "#ffffff",
        muted: "#888888",
        border: "#444444",
      },
    },
    {
      id: "neon-purple",
      name: "Neon Purple",
      description: "Electric purple gaming setup",
      preview: "bg-gradient-to-r from-purple-500 to-pink-500",
      colors: {
        primary: "#8b5cf6",
        secondary: "#a855f7",
        accent: "#c084fc",
        background: "#0f0f0f",
        foreground: "#ffffff",
        muted: "#6b7280",
        border: "#374151",
      },
    },
    {
      id: "toxic-green",
      name: "Toxic Waste",
      description: "Radioactive green glow",
      preview: "bg-gradient-to-r from-lime-400 to-green-500",
      colors: {
        primary: "#84cc16",
        secondary: "#65a30d",
        accent: "#a3e635",
        background: "#0c0c0c",
        foreground: "#ffffff",
        muted: "#525252",
        border: "#404040",
      },
    },
    {
      id: "fire-orange",
      name: "Fire Storm",
      description: "Blazing orange and red",
      preview: "bg-gradient-to-r from-orange-500 to-red-500",
      colors: {
        primary: "#f97316",
        secondary: "#ea580c",
        accent: "#fb923c",
        background: "#1a0a00",
        foreground: "#ffffff",
        muted: "#78716c",
        border: "#57534e",
      },
    },
  ]

  getAvailableThemes(): GameTheme[] {
    return this.themes
  }

  getTheme(id: string): GameTheme | undefined {
    return this.themes.find((theme) => theme.id === id)
  }

  applyTheme(themeId: string): void {
    const theme = this.getTheme(themeId)
    if (!theme) return

    const root = document.documentElement

    // Apply CSS custom properties
    root.style.setProperty("--primary", theme.colors.primary)
    root.style.setProperty("--secondary", theme.colors.secondary)
    root.style.setProperty("--accent", theme.colors.accent)
    root.style.setProperty("--background", theme.colors.background)
    root.style.setProperty("--foreground", theme.colors.foreground)
    root.style.setProperty("--muted", theme.colors.muted)
    root.style.setProperty("--border", theme.colors.border)

    // Update body background
    document.body.style.background = `linear-gradient(135deg, ${theme.colors.background} 0%, ${this.darken(theme.colors.background, 0.3)} 100%)`
  }

  getThemeClasses(themeId: string): string {
    const theme = this.getTheme(themeId)
    if (!theme) return ""

    return `theme-${themeId}`
  }

  private darken(color: string, amount: number): string {
    // Simple color darkening utility
    const hex = color.replace("#", "")
    const r = Math.max(0, Number.parseInt(hex.substr(0, 2), 16) * (1 - amount))
    const g = Math.max(0, Number.parseInt(hex.substr(2, 2), 16) * (1 - amount))
    const b = Math.max(0, Number.parseInt(hex.substr(4, 2), 16) * (1 - amount))

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`
  }
}
