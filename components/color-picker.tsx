"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

type ColorPickerProps = {
  currentColor: string
  onColorChange: (color: string) => void
  onClose: () => void
}

export default function ColorPicker({ currentColor, onColorChange, onClose }: ColorPickerProps) {
  const colorOptions = [
    { name: "Amber", value: "bg-amber-50" },
    { name: "Orange Light", value: "bg-orange-50" },
    { name: "Orange", value: "bg-orange-100" },
    { name: "Yellow Light", value: "bg-yellow-50" },
    { name: "Yellow", value: "bg-yellow-100" },
    { name: "White", value: "bg-white" },
    { name: "Gray Light", value: "bg-gray-50" },
    { name: "Gray", value: "bg-gray-100" },
    { name: "Orange Dark", value: "bg-orange-200" },
    { name: "Yellow Dark", value: "bg-yellow-200" },
  ]

  return (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="text-orange-700">Background Color</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`p-4 rounded-md border-2 transition-all ${
                currentColor === color.value
                  ? "border-orange-500 shadow-md"
                  : "border-transparent hover:border-orange-300"
              } ${color.value}`}
              onClick={() => onColorChange(color.value)}
            >
              <span className="text-xs font-medium text-center block truncate">{color.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

