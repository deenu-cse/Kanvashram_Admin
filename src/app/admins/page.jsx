"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-ui/dashboard-layout"
import { AdminCard } from "@/components/dashboard-ui/admin-card"
import { InviteAdminDialog } from "@/components/dashboard-ui/invite-admin-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { toast } from 'sonner'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ashramAdmin');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function AdminsPage() {
    const [admins, setAdmins] = useState([])
    const [filteredAdmins, setFilteredAdmins] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAdmins()
    }, [])

    useEffect(() => {
        filterAdmins()
    }, [admins, searchQuery, statusFilter])

    const loadAdmins = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admins')
            setAdmins(response.data.admins || [])
        } catch (error) {
            console.error('Error loading admins:', error)
            toast.error('Failed to load admins')
        } finally {
            setLoading(false)
        }
    }

    const filterAdmins = () => {
        let filtered = admins

        if (searchQuery) {
            filtered = filtered.filter(
                (admin) =>
                    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((admin) => admin.status === statusFilter)
        }

        setFilteredAdmins(filtered)
    }

    const inviteAdmin = async (adminData) => {
        try {
            await api.post('/admins', adminData)
            toast.success('Admin invited successfully')
            loadAdmins()
        } catch (error) {
            console.error('Error inviting admin:', error)
            toast.error('Failed to invite admin')
        }
    }

    const bulkInviteAdmins = async (adminsData) => {
        try {
            await api.post('/admins/bulk', { admins: adminsData })
            toast.success('Admins invited successfully')
            loadAdmins()
        } catch (error) {
            console.error('Error bulk inviting admins:', error)
            toast.error('Failed to invite admins')
        }
    }

    const handleInviteAdmins = (newAdmins) => {
        if (newAdmins.length === 1) {
            inviteAdmin(newAdmins[0])
        } else {
            bulkInviteAdmins(newAdmins)
        }
    }

    const updateAdminStatus = async (id, status) => {
        try {
            await api.put(`/admins/${id}/status`, { status })
            toast.success('Admin status updated successfully')
            loadAdmins()
        } catch (error) {
            console.error('Error updating admin status:', error)
            toast.error('Failed to update admin status')
        }
    }

    const handleUpdateStatus = (id, status) => {
        updateAdminStatus(id, status)
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading admins...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Admin Users</h1>
                        <p className="text-muted-foreground mt-1">Manage admin access and permissions</p>
                    </div>
                    <InviteAdminDialog onInvite={handleInviteAdmins} />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {filteredAdmins.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No admin users found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAdmins.map((admin) => (
                            <AdminCard key={admin._id} admin={admin} onUpdateStatus={handleUpdateStatus} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}