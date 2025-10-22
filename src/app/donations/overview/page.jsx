"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-ui/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, IndianRupee, Users, TrendingUp } from "lucide-react"
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

export default function DonationsOverviewPage() {
    const [donations, setDonations] = useState([])
    const [filteredDonations, setFilteredDonations] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalDonations: 0,
        activeDonations: 0,
        totalSuggestedAmounts: 0,
        totalPossibleCombinations: 0
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
                    donation.englishTitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((donation) =>
                statusFilter === "active" ? donation.isActive : !donation.isActive
            )
        }

        setFilteredDonations(filtered)
    }

    const exportToCSV = () => {
        const headers = ['Title', 'English Title', 'Status', 'Suggested Amounts', 'Created Date']
        const csvData = filteredDonations.map(donation => [
            donation.title,
            donation.englishTitle,
            donation.isActive ? 'Active' : 'Inactive',
            donation.suggested.join(', '),
            new Date(donation.createdAt).toLocaleDateString()
        ])

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'donations-overview.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading donations overview...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Enhanced Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalDonations}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeDonations} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeDonations}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently available
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suggested Amounts</CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSuggestedAmounts}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all categories
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle className="text-sm font-medium">Total Options</CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPossibleCombinations}</div>
                            <p className="text-xs text-muted-foreground">
                                Donation combinations
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Donations Overview</h1>
                        <p className="text-muted-foreground mt-1">Complete overview of all donation categories</p>
                    </div>
                    <Button onClick={exportToCSV} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search donation categories..."
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
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>English Title</TableHead>
                                    <TableHead>Suggested Amounts</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDonations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No donation categories found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDonations.map((donation) => (
                                        <TableRow key={donation._id}>
                                            <TableCell className="font-medium font-serif">{donation.title}</TableCell>
                                            <TableCell>{donation.englishTitle}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {donation.suggested.map((amount, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            ₹{amount.toLocaleString()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={donation.isActive ? "default" : "secondary"}>
                                                    {donation.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(donation.updatedAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}