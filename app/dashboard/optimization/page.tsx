"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const OPTIMIZATION_RESULTS = [
  { zone: "North District", valve: "82%", pump: "72%", priority: 85 },
  { zone: "Central Hub", valve: "88%", pump: "78%", priority: 92 },
  { zone: "South Industrial", valve: "75%", pump: "65%", priority: 78 },
  { zone: "East Residential", valve: "80%", pump: "70%", priority: 88 },
  { zone: "West Commercial", valve: "70%", pump: "60%", priority: 65 },
  { zone: "Downtown", valve: "85%", pump: "75%", priority: 90 },
]

export default function OptimizationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const handleRunOptimization = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setHasRun(true)
    }, 2000)
  }

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
            <h1 className="text-3xl font-bold">Smart Allocation Engine</h1>
            <p className="text-muted-foreground mt-1">Optimize valve positions and pump speeds</p>
          </div>
        </div>

        {/* Input Form */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Optimization Parameters</CardTitle>
            <CardDescription>Set constraints and preferences for allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timerange">Time Range</Label>
                <Select>
                  <SelectTrigger id="timerange">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Next 1 Hour</SelectItem>
                    <SelectItem value="4h">Next 4 Hours</SelectItem>
                    <SelectItem value="24h">Next 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint">Constraints</Label>
                <Select>
                  <SelectTrigger id="constraint">
                    <SelectValue placeholder="Select constraint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="pressure">Pressure Priority</SelectItem>
                    <SelectItem value="efficiency">Efficiency First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Demand Priority</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Distribution</SelectItem>
                    <SelectItem value="peak">Peak Hours</SelectItem>
                    <SelectItem value="conservation">Conservation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleRunOptimization} disabled={isRunning} size="lg" className="w-full">
              {isRunning ? "Running Smart Allocation Engine..." : "Run Smart Allocation Engine"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {hasRun && (
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Allocation Plan</CardTitle>
                <CardDescription>Recommended valve and pump settings by zone</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead className="text-right">Valve Position</TableHead>
                      <TableHead className="text-right">Pump Speed</TableHead>
                      <TableHead className="text-right">Priority Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OPTIMIZATION_RESULTS.map((result) => (
                      <TableRow key={result.zone}>
                        <TableCell className="font-medium">{result.zone}</TableCell>
                        <TableCell className="text-right">{result.valve}</TableCell>
                        <TableCell className="text-right">{result.pump}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={result.priority >= 85 ? "default" : "secondary"}>{result.priority}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
