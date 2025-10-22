"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "./image-upload"
import { Plus } from "lucide-react"

const AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Hot Water",
  "Ceiling Fan",
  "TV ",
  "Safe",
  "Balcony",
  "Garden View",
  "River View",
  "Yoga Mat",
  "Meditation Cushion",
  "Prayer Hall Access",
  "Incense & Lamps",
  "Ayurvedic Toiletries",
  "Herbal Tea",
  "Library with Spiritual Books",
  "Silence Zone",
  "Vegetarian Meals",
  "Organic Food Options",
  "Ayurvedic Kitchen",
  "Filtered Drinking Water",
  "Laundry Service",
  "Room Service",
  "Daily Satsang / Bhajan",
  "Kirtan Hall",
  "Guru Darshan / Temple Access",
  "Cow Shelter (Gaushala) Visit",
  "Seva Opportunities (Volunteering)",
  "Gardening Area",
  "Walking Paths",
  "Morning & Evening Aarti",
  "Open Courtyard",
  "Traditional Floor Seating",
  "Outdoor Meditation Spaces",
  "Ayurvedic Massage (on request)",
  "Healing/Detox Programs"
];

export function RoomFormDialog({ room, onSave, trigger, onOpenChange }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [], // This will now store File objects
    price: 0,
    discount: 0,
    beds: 1,
    maxGuests: 1,
    amenities: [],
    status: "available",
  })

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        description: room.description || "",
        images: room.images || [], // For editing, this will be existing image URLs
        price: room.price || 0,
        discount: room.discount || 0,
        beds: room.beds || 1,
        maxGuests: room.maxGuests || 1,
        amenities: room.amenities || [],
        status: room.status || "available",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        images: [],
        price: 0,
        discount: 0,
        beds: 1,
        maxGuests: 1,
        amenities: [],
        status: "available",
      })
    }
  }, [room, open])

  // In your RoomFormDialog handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Create FormData object
    const formDataToSend = new FormData()
    
    // Append all form fields
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('discount', formData.discount.toString())
    formDataToSend.append('beds', formData.beds.toString())
    formDataToSend.append('maxGuests', formData.maxGuests.toString())
    formDataToSend.append('status', formData.status)

    // Append amenities as individual fields
    formData.amenities.forEach((amenity) => {
      formDataToSend.append('amenities', amenity)
    })

    // Append image files
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append('images', image)
        }
      })
    }

    await onSave(formDataToSend)
    setOpen(false)
    if (onOpenChange) {
      onOpenChange(false)
    }
  } catch (error) {
    console.error('Error saving room:', error)
  } finally {
    setLoading(false)
  }
}

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
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
            Add Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
              placeholder="Enter room name"
            />
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
              placeholder="Enter room description"
            />
          </div>

          <div className="space-y-2">
            <Label>Room Images</Label>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                step="0.01"
                disabled={loading}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                min="0"
                max="100"
                disabled={loading}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Number of Beds *</Label>
              <Input
                id="beds"
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                required
                min="1"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Maximum Guests *</Label>
              <Input
                id="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                required
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto">
              {AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    disabled={loading}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
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
              {loading ? "Saving..." : room ? "Update Room" : "Add Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}