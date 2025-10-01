"use client"

import React from "react"

import { DashboardNav } from "./dashboard-nav"

export function DashboardLayout({children}) {

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
