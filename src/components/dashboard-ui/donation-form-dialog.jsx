"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { toast } from 'sonner'

const ICON_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'flame', label: 'Flame' },
  { value: 'book-open', label: 'Book' },
  { value: 'heart', label: 'Heart' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'users', label: 'Users' },
]

const COLOR_OPTIONS = [
  { value: 'from-amber-500 to-orange-600', label: 'Orange' },
  { value: 'from-rose-500 to-pink-600', label: 'Pink' },
  { value: 'from-blue-500 to-indigo-600', label: 'Blue' },
  { value: 'from-green-500 to-emerald-600', label: 'Green' },
  { value: 'from-purple-500 to-violet-600', label: 'Purple' },
  { value: 'from-red-500 to-rose-600', label: 'Red' },
]

export function DonationFormDialog({ donation, onSave, trigger, onOpenChange }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    englishTitle: "",
    description: "",
    suggested: [1000, 5000, 10000],
    icon: "heart",
    color: "from-amber-500 to-orange-600",
  })
  const [newAmount, setNewAmount] = useState("")

  useEffect(() => {
    if (donation) {
      setFormData({
        title: donation.title || "",
        englishTitle: donation.englishTitle || "",
        description: donation.description || "",
        suggested: donation.suggested || [1000, 5000, 10000],
        icon: donation.icon || "heart",
        color: donation.color || "from-amber-500 to-orange-600",
      })
    } else {
      setFormData({
        title: "",
        englishTitle: "",
        description: "",
        suggested: [1000, 5000, 10000],
        icon: "heart",
        color: "from-amber-500 to-orange-600",
      })
    }
  }, [donation, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      if (!formData.title || !formData.englishTitle || !formData.description) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.suggested.length === 0) {
        toast.error("Please add at least one suggested amount")
        return
      }

      await onSave(formData)
      setOpen(false)
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error saving donation:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSuggestedAmount = () => {
    if (newAmount && !isNaN(newAmount) && Number(newAmount) > 0) {
      const amount = Number(newAmount)
      if (!formData.suggested.includes(amount)) {
        setFormData(prev => ({
          ...prev,
          suggested: [...prev.suggested, amount].sort((a, b) => a - b)
        }))
        setNewAmount("")
      } else {
        toast.error("Amount already exists")
      }
    }
  }

  const removeSuggestedAmount = (amountToRemove) => {
    setFormData(prev => ({
      ...prev,
      suggested: prev.suggested.filter(amount => amount !== amountToRemove)
    }))
  }

  const handleOpenChange = (open) => {
    setOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Donation Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{donation ? "Edit Donation Category" : "Add New Donation Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (Hindi/Devnagari) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
                placeholder="e.g., भोजन भंडार"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="englishTitle">English Title *</Label>
              <Input
                id="englishTitle"
                value={formData.englishTitle}
                onChange={(e) => setFormData({ ...formData, englishTitle: e.target.value })}
                required
                disabled={loading}
                placeholder="e.g., Food Storage"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              disabled={loading}
              placeholder="Describe this donation category..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color Theme</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Suggested Amounts (₹) *</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addSuggestedAmount}
                  disabled={!newAmount || loading}
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.suggested.map((amount, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                  >
                    <span>₹{amount.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => removeSuggestedAmount(amount)}
                      disabled={loading}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {formData.suggested.length === 0 && (
                <p className="text-sm text-muted-foreground">No suggested amounts added yet</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : donation ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}