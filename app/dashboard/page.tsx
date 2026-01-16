"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, AlertTriangle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MetricsGrid } from "@/components/metrics-grid"
import { AlertsList } from "@/components/alerts-list"
import { SystemChart } from "@/components/system-chart"
import { LiveControlPanel } from "@/components/live-control-panel"
import { MiniSparkline } from "@/components/mini-sparkline"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWardStore } from "@/lib/store"

const DashboardMap = dynamic(
  () => import("@/components/dashboard-map").then((mod) => ({ default: mod.DashboardMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        Loading map...
      </div>
    ),
  },
)

export default function DashboardPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const { wards, alerts, liveMode, leakProbability, initializeWards, updateWards } = useWardStore()

  useEffect(() => {
    initializeWards()
  }, [initializeWards])

  useEffect(() => {
    if (!liveMode) return

    const interval = setInterval(() => {
      updateWards(leakProbability)
    }, 2000)

    return () => clearInterval(interval)
  }, [liveMode, leakProbability, updateWards])

  // Calculate KPIs from live data
  const totalSupply = wards.reduce((sum, w) => sum + w.supply, 0)
  const totalNrwLoss = (wards.reduce((sum, w) => sum + (w.nrwLossPercent * w.supply) / 100, 0) / totalSupply) * 100
  const activeLeaks = alerts.filter((a) => a.severity === "critical").length
  const avgHealthScore = Math.round(wards.reduce((sum, w) => sum + w.healthScore, 0) / wards.length)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring of water distribution network</p>
        </div>

        {/* KPI Cards - Live Updates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4 text-accent" />
                Total Supply Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalSupply.toFixed(0)} MLD</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                NRW Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{totalNrwLoss.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Active Leak Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-500">{activeLeaks}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Ward Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{avgHealthScore}%</p>
            </CardContent>
          </Card>
        </div>

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
                <DashboardMap selectedWard={selectedZone} onWardSelect={setSelectedZone} />
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <MetricsGrid selectedZone={selectedZone} />
          </div>

          {/* Right Column - Alerts and Controls */}
          <div className="space-y-6">
            <AlertsList />
            <LiveControlPanel />
          </div>
        </div>

        {/* Ward Table - Live Updates */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Ward Performance</CardTitle>
            <CardDescription>Live demand, supply, pressure, and health metrics by ward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead className="text-right">Pressure (bar)</TableHead>
                    <TableHead className="text-right">Flow (L/s)</TableHead>
                    <TableHead className="text-right">Demand (MLD)</TableHead>
                    <TableHead className="text-right">Supply (MLD)</TableHead>
                    <TableHead className="text-right">NRW %</TableHead>
                    <TableHead className="text-right">Health</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wards.map((ward) => (
                    <TableRow
                      key={ward.id}
                      className={
                        ward.status === "critical"
                          ? "bg-destructive/10"
                          : ward.status === "warning"
                            ? "bg-orange-500/10"
                            : ""
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{ward.name}</span>
                          {ward.isHighPerforming && (
                            <Badge className="bg-green-600 text-white text-xs">High Performing</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{ward.pressure.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{ward.flow.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{ward.demand.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{ward.supply.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{ward.nrwLossPercent.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            ward.healthScore >= 90 ? "default" : ward.healthScore >= 80 ? "secondary" : "destructive"
                          }
                        >
                          {ward.healthScore.toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <MiniSparkline data={ward.trendData} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/dashboard/ward/${ward.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* System Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Live Ward Performance</CardTitle>
            <CardDescription>Real-time trends and historical performance patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemChart />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
