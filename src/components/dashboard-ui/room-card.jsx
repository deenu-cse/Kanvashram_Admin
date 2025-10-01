"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Bed, Users, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export function RoomCard({ room, onEdit, onDelete }) {
  const finalPrice = room.price - (room.price * room.discount) / 100

  const statusColors = {
    available: "bg-green-100 text-green-800 border-green-200",
    occupied: "bg-blue-100 text-blue-800 border-blue-200",
    maintenance: "bg-orange-100 text-orange-800 border-orange-200",
  }

  const statusIcons = {
    available: "🟢",
    occupied: "🔵", 
    maintenance: "🟠"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 py-0 pb-2">
      <div className="relative aspect-video bg-muted">
        {room.images && room.images.length > 0 ? (
          <img 
            src={room.images[0] || "/placeholder.svg"} 
            alt={room.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg"
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Bed className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <Badge className={cn("absolute top-2 right-2 border", statusColors[room.status])}>
          {statusIcons[room.status]} {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
        </Badge>
        
        {room.discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            {room.discount}% OFF
          </Badge>
        )}
      </div>

      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground leading-tight">{room.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(room)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(room._id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>
              {room.beds} bed{room.beds > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Max {room.maxGuests}</span>
          </div>
        </div>

        {room.createdBy && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            <span>Created by {room.createdBy.name} • {formatDate(room.createdAt)}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {room.amenities && room.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{room.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div>
            {room.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">₹{finalPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">₹{room.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-foreground">₹{room.price.toFixed(2)}</span>
            )}
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
          
          {room.updatedAt && (
            <div className="text-xs text-muted-foreground text-right">
              Updated: {formatDate(room.updatedAt)}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}