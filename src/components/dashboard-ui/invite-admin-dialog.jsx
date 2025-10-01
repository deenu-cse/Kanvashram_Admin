"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus } from "lucide-react"

export function InviteAdminDialog({ onInvite }) {
  const [open, setOpen] = useState(false)
  const [inviteMode, setInviteMode] = useState("single")
  const [singleInvite, setSingleInvite] = useState({
    name: "",
    email: "",
    role: "admin",
  })
  const [bulkEmails, setBulkEmails] = useState("")

  const handleSingleInvite = (e) => {
    e.preventDefault()
    onInvite([{ ...singleInvite, status: "pending" }])
    setSingleInvite({ name: "", email: "", role: "admin" })
    setOpen(false)
  }

  const handleBulkInvite = (e) => {
    e.preventDefault()
    const emails = bulkEmails
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("@"))

    const admins = emails.map((email) => ({
      name: email.split("@")[0],
      email,
      role: "admin",
      status: "pending",
    }))

    if (admins.length > 0) {
      onInvite(admins)
      setBulkEmails("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Admin Users</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={inviteMode === "single" ? "default" : "outline"}
            onClick={() => setInviteMode("single")}
            className="flex-1"
          >
            Single Invite
          </Button>
          <Button
            variant={inviteMode === "bulk" ? "default" : "outline"}
            onClick={() => setInviteMode("bulk")}
            className="flex-1"
          >
            Bulk Invite
          </Button>
        </div>

        {inviteMode === "single" ? (
          <form onSubmit={handleSingleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={singleInvite.name}
                onChange={(e) => setSingleInvite({ ...singleInvite, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={singleInvite.email}
                onChange={(e) => setSingleInvite({ ...singleInvite, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={singleInvite.role}
                onValueChange={(value) => setSingleInvite({ ...singleInvite, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBulkInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-emails">Email Addresses</Label>
              <Textarea
                id="bulk-emails"
                placeholder="Enter email addresses (one per line)&#10;example1@email.com&#10;example2@email.com&#10;example3@email.com"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter one email address per line. All will be invited as Admin role.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Invitations</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
