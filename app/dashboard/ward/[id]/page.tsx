"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const WARD_DATA: Record<string, any> = {
  w1: { name: "North District", health: 94, pressure: 4.2 },
  w2: { name: "Central Hub", health: 96, pressure: 4.8 },
  w3: { name: "South Industrial", health: 87, pressure: 3.8 },
  w4: { name: "East Residential", health: 91, pressure: 4.1 },
  w5: { name: "West Commercial", health: 78, pressure: 3.2 },
  w6: { name: "Downtown", health: 93, pressure: 4.5 },
}

const PRESSURE_TREND = [
  { time: "00:00", pressure: 4.2 },
  { time: "02:00", pressure: 4.1 },
  { time: "04:00", pressure: 3.9 },
  { time: "06:00", pressure: 4.3 },
  { time: "08:00", pressure: 4.6 },
  { time: "10:00", pressure: 4.8 },
  { time: "12:00", pressure: 4.9 },
  { time: "14:00", pressure: 4.7 },
  { time: "16:00", pressure: 4.5 },
  { time: "18:00", pressure: 4.4 },
  { time: "20:00", pressure: 4.2 },
  { time: "22:00", pressure: 4.0 },
]

const DEMAND_FORECAST = [
  { hour: "0", demand: 850, forecast: 870 },
  { hour: "2", demand: 650, forecast: 680 },
  { hour: "4", demand: 450, forecast: 470 },
  { hour: "6", demand: 950, forecast: 920 },
  { hour: "8", demand: 1200, forecast: 1150 },
  { hour: "10", demand: 1400, forecast: 1380 },
  { hour: "12", demand: 1500, forecast: 1480 },
  { hour: "14", demand: 1350, forecast: 1320 },
  { hour: "16", demand: 1100, forecast: 1080 },
  { hour: "18", demand: 1000, forecast: 1020 },
  { hour: "20", demand: 900, forecast: 880 },
  { hour: "22", demand: 750, forecast: 770 },
]

export default function WardDetailsPage({ params }: { params: { id: string } }) {
  const wardId = (params as any).id
  const ward = WARD_DATA[wardId] || { name: "Unknown Ward", health: 90, pressure: 4.0 }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{ward.name}</h1>
            <p className="text-muted-foreground mt-1">Ward performance analysis and optimization</p>
          </div>
        </div>

        {/* Ward Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{ward.health}%</p>
              <Badge className="mt-2">Good</Badge>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{ward.pressure} bar</p>
              <p className="text-xs text-muted-foreground mt-2">Normal range</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">NRW Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">7.2%</p>
              <p className="text-xs text-muted-foreground mt-2">Below target</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Pressure Trend (24h)</CardTitle>
              <CardDescription>Real-time pressure readings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={PRESSURE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line type="monotone" dataKey="pressure" stroke="var(--color-accent)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Demand Forecast (Next 24h)</CardTitle>
              <CardDescription>Predicted vs actual demand</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={DEMAND_FORECAST}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Area type="monotone" dataKey="demand" fill="var(--color-chart-1)" stroke="var(--color-chart-1)" />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    fill="var(--color-chart-2)"
                    stroke="var(--color-chart-2)"
                    opacity={0.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Suggested Actions</CardTitle>
            <CardDescription>AI-powered optimization recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Valve Position</h4>
                <p className="text-2xl font-bold text-accent">78%</p>
                <p className="text-xs text-muted-foreground mt-2">Recommended: Increase to 85% for optimal flow</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pump Speed</h4>
                <p className="text-2xl font-bold text-accent">68%</p>
                <p className="text-xs text-muted-foreground mt-2">Recommended: Increase to 75% during peak hours</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Priority Score</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div className="bg-accent h-full" style={{ width: "65%" }} />
                </div>
                <span className="text-sm font-semibold">Medium</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
