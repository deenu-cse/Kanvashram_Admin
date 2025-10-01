"use client"

import { DashboardLayout } from "@/components/dashboard-ui/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Calendar, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalAdmins: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("ashramAdmin");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const roomStatsResponse = await api.get("/rooms/stats", config);
      const roomStats = roomStatsResponse.data;

      const bookingStatsResponse = await api.get("/bookings/stats", config);
      const bookingStats = bookingStatsResponse.data;

      const adminStatsResponse = await api.get("/admins/stats", config);
      const adminStats = adminStatsResponse.data;

      setStats({
        totalRooms: roomStats.totalRooms,
        availableRooms: roomStats.availableRooms,
        totalBookings: bookingStats.totalBookings,
        pendingBookings: bookingStats.pendingBookings,
        totalAdmins: adminStats.totalAdmins,
        revenue: bookingStats.revenue || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your ashram management system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.availableRooms} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingBookings} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stats.totalAdmins}</div>
              <p className="text-xs text-muted-foreground mt-1">Active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">₹{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From confirmed bookings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">New booking received</p>
                    <p className="text-xs text-muted-foreground">Peaceful Lotus Room - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Room updated</p>
                    <p className="text-xs text-muted-foreground">Twin Harmony Suite - 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Booking confirmed</p>
                    <p className="text-xs text-muted-foreground">Divine Family Retreat - 1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="/rooms"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Bed className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-sm font-medium text-secondary-foreground">Manage Rooms</span>
                </a>
                <a
                  href="/bookings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Calendar className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-sm font-medium text-secondary-foreground">View Bookings</span>
                </a>
                <a
                  href="/admins"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Users className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-sm font-medium text-secondary-foreground">Manage Admins</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}