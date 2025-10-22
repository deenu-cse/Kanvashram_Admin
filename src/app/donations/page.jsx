"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-ui/dashboard-layout"
import { DonationCard } from "@/components/dashboard-ui/donation-card"
import { DonationFormDialog } from "@/components/dashboard-ui/donation-form-dialog"
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
import { Search, Plus, TrendingUp } from "lucide-react"
import axios from 'axios'
import { toast } from 'sonner'
import Link from "next/link"

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

export default function DonationsPage() {
    const [donations, setDonations] = useState([])
    const [filteredDonations, setFilteredDonations] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [editingDonation, setEditingDonation] = useState()
    const [deletingDonationId, setDeletingDonationId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalDonations: 0,
        activeDonations: 0,
        inactiveDonations: 0
    })

    useEffect(() => {
        loadDonations()
        loadStats()
    }, [])

    useEffect(() => {
        filterDonations()
    }, [donations, searchQuery, statusFilter])

    const loadDonations = async () => {
        try {
            setLoading(true)
            const response = await api.get('/donations')
            setDonations(response.data.data || [])
        } catch (error) {
            console.error('Error loading donations:', error)
            toast.error("Failed to load donations")
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const response = await api.get('/donations/stats')
            setStats(response.data)
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    const filterDonations = () => {
        let filtered = donations

        if (searchQuery) {
            filtered = filtered.filter(
                (donation) =>
                    donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    donation.englishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    donation.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((donation) =>
                statusFilter === "active" ? donation.isActive : !donation.isActive
            )
        }

        setFilteredDonations(filtered)
    }

    const createDonation = async (formData) => {
        try {
            const response = await api.post('/donations', formData)
            toast.success("Donation category created successfully")
            loadDonations()
            loadStats()
            return response.data
        } catch (error) {
            console.error('Error creating donation:', error)
            toast.error(error.response?.data?.message || "Failed to create donation category")
            throw error
        }
    }

    const updateDonation = async (id, formData) => {
        try {
            const response = await api.put(`/donations/${id}`, formData)
            toast.success("Donation category updated successfully")
            loadDonations()
            loadStats()
            return response.data
        } catch (error) {
            console.error('Error updating donation:', error)
            toast.error(error.response?.data?.message || "Failed to update donation category")
            throw error
        }
    }

    const deleteDonation = async (id) => {
        try {
            await api.delete(`/donations/${id}`)
            toast.success("Donation category deleted successfully")
            loadDonations()
            loadStats()
        } catch (error) {
            console.error('Error deleting donation:', error)
            toast.error(error.response?.data?.message || "Failed to delete donation category")
            throw error
        }
    }

    const toggleDonationStatus = async (id) => {
        try {
            await api.patch(`/donations/${id}/status`)
            toast.success("Donation status updated successfully")
            loadDonations()
            loadStats()
        } catch (error) {
            console.error('Error toggling donation status:', error)
            toast.error(error.response?.data?.message || "Failed to update donation status")
            throw error
        }
    }

    const handleAddDonation = async (donationData) => {
        try {
            await createDonation(donationData)
        } catch (error) {
            // Error handled in createDonation
        }
    }

    const handleUpdateDonation = async (donationData) => {
        try {
            if (editingDonation) {
                await updateDonation(editingDonation._id, donationData)
                setEditingDonation(undefined)
            }
        } catch (error) {
            // Error handled in updateDonation
        }
    }

    const handleDeleteDonation = async () => {
        try {
            if (deletingDonationId) {
                await deleteDonation(deletingDonationId)
                setDeletingDonationId(null)
            }
        } catch (error) {
            // Error handled in deleteDonation
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading donations...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-lg p-4 border">
                        <div className="text-2xl font-bold text-foreground">{stats.totalDonations}</div>
                        <div className="text-sm text-muted-foreground">Total Categories</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                        <div className="text-2xl font-bold text-green-600">{stats.activeDonations}</div>
                        <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                        <div className="text-2xl font-bold text-orange-600">{stats.inactiveDonations}</div>
                        <div className="text-sm text-muted-foreground">Inactive</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalSuggestedAmounts || 0}</div>
                        <div className="text-sm text-muted-foreground">Suggested Amounts</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Donation Categories</h1>
                        <p className="text-muted-foreground mt-1">Manage donation categories for your ashram</p>
                    </div>
                    <DonationFormDialog onSave={handleAddDonation} />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search donations..."
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
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <div>
                        <Link href="/donations/overview">
                            <Button className="p-2 mb-2 text-lg font-semibold cursor-pointer">
                                Donation Overview
                                <TrendingUp />
                            </Button>
                        </Link>
                    </div>
                </div>

                {filteredDonations.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No donation categories found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDonations.map((donation) => (
                            <DonationCard
                                key={donation._id}
                                donation={donation}
                                onEdit={(donation) => setEditingDonation(donation)}
                                onDelete={(id) => setDeletingDonationId(id)}
                                onToggleStatus={(id) => toggleDonationStatus(id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {editingDonation && (
                <DonationFormDialog
                    donation={editingDonation}
                    onSave={handleUpdateDonation}
                    onOpenChange={(open) => !open && setEditingDonation(undefined)}
                />
            )}

            <AlertDialog open={!!deletingDonationId} onOpenChange={() => setDeletingDonationId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Donation Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this donation category? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDonation} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}