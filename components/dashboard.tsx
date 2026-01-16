"use client"

import { useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkMap } from "./network-map"
import { MetricsGrid } from "./metrics-grid"
import { AlertsList } from "./alerts-list"
import { SystemChart } from "./system-chart"
import { Header } from "./header"

export function Dashboard() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-6">
      <Header />

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Map and Zones */}
        <div className="lg:col-span-2 space-y-6">
          {/* GIS Map */}
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg">Network Map</CardTitle>
              <CardDescription>Real-time pipe network health and pressure zones</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <NetworkMap selectedZone={selectedZone} onZoneSelect={setSelectedZone} />
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <MetricsGrid selectedZone={selectedZone} />
        </div>

        {/* Right Column - Alerts and Critical Info */}
        <div className="space-y-6">
          <AlertsList />

          {/* System Status Summary */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Health</span>
                <span className="text-sm font-semibold text-accent">92%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[92%]" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>12 zones operational</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>3 zones under maintenance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span>1 zone requiring attention</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom - Performance Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>System Performance (24h)</CardTitle>
          <CardDescription>Flow rates and pressure distribution across network</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemChart />
        </CardContent>
      </Card>
    </div>
  )
}
