"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-ui/dashboard-layout"
import { RoomCard } from "@/components/dashboard-ui/room-card"
import { RoomFormDialog } from "@/components/dashboard-ui/room-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search } from "lucide-react"
import axios from 'axios'
import { toast } from 'sonner'

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ashramAdmin');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingRoom, setEditingRoom] = useState()
  const [deletingRoomId, setDeletingRoomId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0
  })

  useEffect(() => {
    loadRooms()
    loadStats()
  }, [])

  useEffect(() => {
    filterRooms()
  }, [rooms, searchQuery, statusFilter])

  const loadRooms = async () => {
    try {
      setLoading(true)
      const response = await api.get('/rooms')
      setRooms(response.data.rooms || [])
    } catch (error) {
      console.error('Error loading rooms:', error)
      toast.error("Failed to load rooms")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await api.get('/rooms/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterRooms = () => {
    let filtered = rooms

    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((room) => room.status === statusFilter)
    }

    setFilteredRooms(filtered)
  }

  // In your RoomsPage component, update the createRoom and updateRoom functions:

  const createRoom = async (formData) => {
    try {
      const response = await api.post('/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success("Room created successfully")
      loadRooms()
      loadStats()
      return response.data
    } catch (error) {
      console.error('Error creating room:', error)
      toast.error(error.response?.data?.message || "Failed to create room")
      throw error
    }
  }

  const updateRoom = async (id, formData) => {
    try {
      const response = await api.put(`/rooms/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success("Room updated successfully")
      loadRooms()
      loadStats()
      return response.data
    } catch (error) {
      console.error('Error updating room:', error)
      toast.error(error.response?.data?.message || "Failed to update room")
      throw error
    }
  }

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/rooms/${id}`)
      toast.success("Room deleted successfully")
      loadRooms()
      loadStats()
    } catch (error) {
      console.error('Error deleting room:', error)
      toast.error(error.response?.data?.message || "Failed to delete room")
      throw error
    }
  }

  const handleAddRoom = async (roomData) => {
    try {
      await createRoom(roomData)
    } catch (error) {
      // Error handled in createRoom
    }
  }

  const handleUpdateRoom = async (roomData) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, roomData)
        setEditingRoom(undefined)
      }
    } catch (error) {
      // Error handled in updateRoom
    }
  }

  const handleDeleteRoom = async () => {
    try {
      if (deletingRoomId) {
        await deleteRoom(deletingRoomId)
        setDeletingRoomId(null)
      }
    } catch (error) {
      // Error handled in deleteRoom
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-foreground">{stats.totalRooms}</div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{stats.availableRooms}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">{stats.occupiedRooms}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-orange-600">{stats.maintenanceRooms}</div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Rooms</h1>
            <p className="text-muted-foreground mt-1">Manage your ashram rooms and accommodations</p>
          </div>
          <RoomFormDialog onSave={handleAddRoom} />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onEdit={(room) => setEditingRoom(room)}
                onDelete={(id) => setDeletingRoomId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {editingRoom && (
        <RoomFormDialog
          room={editingRoom}
          onSave={handleUpdateRoom}
          onOpenChange={(open) => !open && setEditingRoom(undefined)}
        />
      )}

      <AlertDialog open={!!deletingRoomId} onOpenChange={() => setDeletingRoomId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}