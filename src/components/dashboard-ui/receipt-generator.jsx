"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

export function ReceiptGenerator({ booking }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("Receipt download functionality would be implemented here")
  }

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:p-8" id="receipt">
          <div className="text-center border-b border-border pb-4">
            <h2 className="text-2xl font-semibold text-foreground">Ashram Receipt</h2>
            <p className="text-sm text-muted-foreground mt-1">Booking ID: {booking.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Guest Information</h3>
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Name:</span> {booking.guestName}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Email:</span> {booking.guestEmail}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Phone:</span> {booking.guestPhone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Booking Details</h3>
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Room:</span> {booking.roomName}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Guests:</span> {booking.guests}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{booking.status.replace("-", " ")}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Stay Duration</h3>
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">Check-in:</span> {checkInDate}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">Check-out:</span> {checkOutDate}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">Total Nights:</span> {nights}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm text-foreground">{booking.notes}</p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Thank you for choosing our ashram</p>
            <p className="mt-1">For any queries, please contact us at admin@ashram.com</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>Print Receipt</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
