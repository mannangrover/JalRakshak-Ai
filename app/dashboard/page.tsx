"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, AlertTriangle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NetworkMap } from "@/components/network-map"
import { MetricsGrid } from "@/components/metrics-grid"
import { AlertsList } from "@/components/alerts-list"
import { SystemChart } from "@/components/system-chart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Ward {
  id: string
  name: string
  demand: number
  supply: number
  pressure: number
  health: number
}

const MOCK_WARDS: Ward[] = [
  { id: "w1", name: "North District", demand: 1200, supply: 1150, pressure: 4.2, health: 94 },
  { id: "w2", name: "Central Hub", demand: 1800, supply: 1750, pressure: 4.8, health: 96 },
  { id: "w3", name: "South Industrial", demand: 950, supply: 920, pressure: 3.8, health: 87 },
  { id: "w4", name: "East Residential", demand: 750, supply: 720, pressure: 4.1, health: 91 },
  { id: "w5", name: "West Commercial", demand: 650, supply: 600, pressure: 3.2, health: 78 },
  { id: "w6", name: "Downtown", demand: 1400, supply: 1380, pressure: 4.5, health: 93 },
]

export default function DashboardPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [kpis, setKpis] = useState({
    totalSupply: 8520,
    nrwLoss: 7.8,
    activeLeaks: 3,
    wardHealth: 90,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setKpis((prev) => ({
        totalSupply: prev.totalSupply + Math.random() * 100 - 50,
        nrwLoss: Math.max(5, prev.nrwLoss + (Math.random() - 0.5) * 2),
        activeLeaks: Math.max(0, prev.activeLeaks + Math.floor(Math.random() * 3 - 1)),
        wardHealth: Math.min(100, Math.max(70, prev.wardHealth + (Math.random() - 0.5) * 3)),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring of water distribution network</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4 text-accent" />
                Total Supply Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpis.totalSupply.toFixed(0)} MLD</p>
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
              <p className="text-2xl font-bold text-destructive">{kpis.nrwLoss.toFixed(1)}%</p>
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
              <p className="text-2xl font-bold text-orange-500">{kpis.activeLeaks}</p>
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
              <p className="text-2xl font-bold">{kpis.wardHealth.toFixed(0)}%</p>
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
                <NetworkMap selectedZone={selectedZone} onZoneSelect={setSelectedZone} />
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <MetricsGrid selectedZone={selectedZone} />
          </div>

          {/* Right Column - Alerts */}
          <div className="space-y-6">
            <AlertsList />
          </div>
        </div>

        {/* Ward Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Ward Performance</CardTitle>
            <CardDescription>Demand, supply, pressure, and health metrics by ward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead className="text-right">Demand (MLD)</TableHead>
                    <TableHead className="text-right">Supply (MLD)</TableHead>
                    <TableHead className="text-right">Pressure (bar)</TableHead>
                    <TableHead className="text-right">Health</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_WARDS.map((ward) => (
                    <TableRow key={ward.id}>
                      <TableCell className="font-medium">{ward.name}</TableCell>
                      <TableCell className="text-right">{ward.demand}</TableCell>
                      <TableCell className="text-right">{ward.supply}</TableCell>
                      <TableCell className="text-right">{ward.pressure.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={ward.health >= 90 ? "default" : ward.health >= 80 ? "secondary" : "destructive"}
                        >
                          {ward.health}%
                        </Badge>
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
            <CardTitle>System Performance (24h)</CardTitle>
            <CardDescription>Flow rates and pressure distribution across network</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemChart />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
