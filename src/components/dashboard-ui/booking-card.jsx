"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingStatusDialog } from "./booking-status-dialog"
import { ReceiptGenerator } from "./receipt-generator"
import { Calendar, User, Users, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookingCard({ booking, onUpdateStatus }) {
  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-accent text-accent-foreground",
    "checked-in": "bg-primary text-primary-foreground",
    "checked-out": "bg-secondary text-secondary-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  }

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground">{booking.room?.name || 'Room'}</h3>
              <Badge className={cn("text-xs", statusColors[booking.status])}>{booking.status.replace("-", " ")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Booking ID: {booking._id}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{booking.guestName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{booking.guestEmail}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{booking.guestPhone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {booking.guests} guest{booking.guests > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {checkInDate} - {checkOutDate}
          </span>
        </div>

        {booking.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes:</span> {booking.notes}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="text-2xl font-semibold text-foreground">₹{booking.totalPrice.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total amount</p>
        </div>
        <div className="flex gap-2">
          <BookingStatusDialog booking={booking} onUpdate={onUpdateStatus} />
          <ReceiptGenerator booking={booking} />
        </div>
      </CardFooter>
    </Card>
  )
}