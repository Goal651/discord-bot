"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeManager } from "@/lib/theme-manager"

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const themeManager = new ThemeManager()
  const themes = themeManager.getAvailableThemes()

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
      >
        🎨 {themes.find((t) => t.id === currentTheme)?.name || "Theme"}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 z-50 w-64 bg-background/95 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-2">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id)
                    setIsOpen(false)
                  }}
                  variant={currentTheme === theme.id ? "default" : "ghost"}
                  className={`justify-start text-left p-3 h-auto ${
                    currentTheme === theme.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${theme.preview}`}></div>
                    <div>
                      <div className="font-semibold">{theme.name}</div>
                      <div className="text-xs opacity-70">{theme.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
