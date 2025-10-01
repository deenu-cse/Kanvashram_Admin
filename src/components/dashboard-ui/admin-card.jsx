"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Mail, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminCard({ admin, onUpdateStatus }) {
  const statusColors = {
    active: "bg-accent text-accent-foreground",
    pending: "bg-muted text-muted-foreground",
    inactive: "bg-destructive text-destructive-foreground",
  }

  const roleColors = {
    "super-admin": "bg-primary text-primary-foreground",
    admin: "bg-secondary text-secondary-foreground",
  }

  const lastLoginDate = admin.lastLogin
    ? new Date(admin.lastLogin).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Never"

  const invitedDate = new Date(admin.createdAt).toLocaleDateString("en-IN", {
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
              <h3 className="font-semibold text-lg text-foreground">{admin.name}</h3>
              <Badge className={cn("text-xs", statusColors[admin.status])}>{admin.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{admin.email}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {admin.status !== "active" && (
                <DropdownMenuItem onClick={() => onUpdateStatus(admin._id, "active")}>Set as Active</DropdownMenuItem>
              )}
              {admin.status !== "inactive" && (
                <DropdownMenuItem onClick={() => onUpdateStatus(admin._id, "inactive")}>
                  Set as Inactive
                </DropdownMenuItem>
              )}
              {admin.status === "pending" && (
                <DropdownMenuItem onClick={() => onUpdateStatus(admin._id, "pending")}>
                  Resend Invitation
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <Badge className={cn("text-xs", roleColors[admin.role])}>{admin.role.replace("-", " ")}</Badge>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Invited</span>
            <span className="text-foreground font-medium">{invitedDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Login</span>
            <span className="text-foreground font-medium">{lastLoginDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}