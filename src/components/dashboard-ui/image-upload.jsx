"use client"

import React from "react"

import { useState } from "react"
import { X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"


export function ImageUpload({ images, onChange, maxImages = 5 }) {
  const [previews, setPreviews] = useState(images)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length + previews.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...previews, reader.result]
        setPreviews(newPreviews)
        onChange(newPreviews)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    onChange(newPreviews)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
            <img
              src={preview || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {previews.length < maxImages && (
          <label
            className={cn(
              "relative aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50",
              "flex flex-col items-center justify-center gap-2 cursor-pointer",
              "hover:bg-muted transition-colors",
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload Image</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {previews.length} / {maxImages} images uploaded
      </p>
    </div>
  )
}
