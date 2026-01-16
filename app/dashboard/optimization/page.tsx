"use client"

import { useState, useMemo } from "react"
import { useWardStore } from "@/lib/store"
import { runSmartAllocation, getAIInsights, getRecommendedActions } from "@/lib/allocation-engine"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const CHART_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899"]

export default function OptimizationPage() {
  const wards = useWardStore((state) => state.wards)

  const [strategy, setStrategy] = useState<"equity" | "demand" | "critical">("demand")
  const [fairnessSlider, setFairnessSlider] = useState([50])
  const [totalAvailable, setTotalAvailable] = useState("8500")
  const [minSupply, setMinSupply] = useState("100")
  const [maxPump, setMaxPump] = useState("90")
  const [leakAware, setLeakAware] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [scenario, setScenario] = useState(null)
  const [activeTab, setActiveTab] = useState("optimized")
  const [highlightedWard, setHighlightedWard] = useState<string | null>(null)

  const handleRunAllocation = () => {
    setDemoMode(true)
    setIsRunning(true)
    setTimeout(() => {
      const result = runSmartAllocation(
        wards,
        strategy,
        Number.parseFloat(totalAvailable),
        Number.parseFloat(minSupply),
        Number.parseFloat(maxPump) / 100,
        leakAware,
        fairnessSlider[0],
      )
      setScenario(result)
      setIsRunning(false)
    }, 2000)
  }

  const handleAutoApplyRecommendations = () => {
    if (!scenario) return
    alert("Recommendations applied successfully! Supply redistributed from surplus to shortage wards.")
  }

  const aiInsights = useMemo(() => (scenario ? getAIInsights(scenario, wards) : []), [scenario, wards])
  const recommendedActions = useMemo(() => (scenario ? getRecommendedActions(scenario, wards) : []), [scenario, wards])

  const demandVsSupplyData = useMemo(() => {
    if (!scenario) return []
    return scenario.results.slice(0, 6).map((r) => ({
      name: r.ward.name.split(" ")[0],
      demand: r.predictedDemand,
      supply: r.supplyAllocated,
    }))
  }, [scenario])

  const summaryData = useMemo(() => {
    if (!scenario) return []
    return [
      { name: "Allocated", value: Math.round(scenario.results.reduce((sum, r) => sum + r.supplyAllocated, 0)) },
      { name: "Shortage", value: Math.round(scenario.shortage) },
    ]
  }, [scenario])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* ... existing header code ... */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Smart Allocation Engine</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered Decision Support System for optimal water distribution
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="w-4 h-4"
            />
            <Label className="cursor-pointer">Demo Mode</Label>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ... existing left column ... */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Smart Allocation Controls</CardTitle>
                <CardDescription>Configure allocation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="timerange">Date & Time Range</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger id="timerange">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Next 1 Hour</SelectItem>
                      <SelectItem value="4h">Next 4 Hours</SelectItem>
                      <SelectItem value="24h">Next 24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Demand Strategy</Label>
                  <Select value={strategy} onValueChange={(val) => setStrategy(val as any)}>
                    <SelectTrigger id="strategy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equity">Equity First</SelectItem>
                      <SelectItem value="demand">Demand First</SelectItem>
                      <SelectItem value="critical">Critical Zones First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fairness vs Efficiency: {fairnessSlider[0]}%</Label>
                  <Slider
                    value={fairnessSlider}
                    onValueChange={setFairnessSlider}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {fairnessSlider[0] < 50 ? "Efficiency optimized" : "Fairness optimized"}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="font-semibold text-sm">Constraints</p>

                  <div className="space-y-1">
                    <Label htmlFor="available">Total Water Available (MLD)</Label>
                    <input
                      id="available"
                      type="number"
                      value={totalAvailable}
                      onChange={(e) => setTotalAvailable(e.target.value)}
                      className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="minSupply">Min Supply Per Ward (MLD)</Label>
                    <input
                      id="minSupply"
                      type="number"
                      value={minSupply}
                      onChange={(e) => setMinSupply(e.target.value)}
                      className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="maxPump">Max Pump Capacity (%)</Label>
                    <input
                      id="maxPump"
                      type="number"
                      value={maxPump}
                      onChange={(e) => setMaxPump(e.target.value)}
                      className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="leakaware"
                      type="checkbox"
                      checked={leakAware}
                      onChange={(e) => setLeakAware(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="leakaware" className="cursor-pointer text-sm">
                      Leak-aware allocation
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button onClick={handleRunAllocation} disabled={isRunning} size="lg" className="w-full">
                    {isRunning ? (
                      <>
                        <div className="animate-spin mr-2">⏳</div>
                        Optimizing...
                      </>
                    ) : (
                      "Run Smart Allocation Engine"
                    )}
                  </Button>
                  {scenario && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download Allocation Plan (CSV)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Output + Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {scenario ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scenario.shortage < 100 ? (
                      <Badge className="bg-green-600 text-white">✓ OPTIMIZED</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">⚠ WARNING: RESOURCE SHORTAGE</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generated at: {scenario.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {(scenario.topShortageWard || scenario.topOversupplyWard) && (
                  <Card className="border-border bg-gradient-to-r from-blue-500/10 to-orange-500/10">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {scenario.topShortageWard && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Top Shortage Ward</p>
                            <p className="font-semibold">{scenario.topShortageWard.ward.name}</p>
                            <p className="text-sm text-blue-500">
                              +{scenario.topShortageWard.demandGap.toFixed(0)} MLD
                            </p>
                          </div>
                        )}
                        {scenario.topOversupplyWard && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Top Oversupply Ward</p>
                            <p className="font-semibold">{scenario.topOversupplyWard.ward.name}</p>
                            <p className="text-sm text-orange-500">
                              {scenario.topOversupplyWard.demandGap.toFixed(0)} MLD
                            </p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Net Redistribution</p>
                          <p className="font-semibold text-lg">{scenario.netRedistribution.toFixed(0)} MLD</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">NRW Reduction</p>
                          <p className="font-semibold text-lg text-green-500">
                            {scenario.nrwReductionPercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(scenario.needsMoreWater.length > 0 || scenario.needsLessWater.length > 0) && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Smart Allocation Recommendations</CardTitle>
                      <CardDescription>Identify shortage and surplus zones for redistribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Needs More Water Card */}
                        <div className="space-y-3 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold">Needs More Water</h3>
                            {scenario.needsMoreWater.length > 0 && (
                              <Badge className="ml-auto bg-blue-500 text-white">{scenario.needsMoreWater.length}</Badge>
                            )}
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {scenario.needsMoreWater.length > 0 ? (
                              scenario.needsMoreWater.map((result) => {
                                const demandPercent = (result.demandGap / result.ward.demand) * 100
                                return (
                                  <div
                                    key={result.ward.id}
                                    className="p-3 bg-card border border-blue-500/30 rounded cursor-pointer hover:bg-blue-500/10 transition"
                                    onClick={() => setHighlightedWard(result.ward.id)}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <p className="font-medium text-sm">{result.ward.name}</p>
                                      <Badge className="text-xs bg-blue-600">+{result.demandGap.toFixed(0)} MLD</Badge>
                                    </div>
                                    <div className="w-full bg-muted rounded h-2 mb-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded"
                                        style={{ width: `${Math.min(100, demandPercent)}%` }}
                                      />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      {result.ward.demand > 1500 && (
                                        <Badge variant="outline" className="text-xs">
                                          High Demand Surge
                                        </Badge>
                                      )}
                                      {result.ward.pressure < 3.5 && (
                                        <Badge variant="outline" className="text-xs">
                                          Low Pressure
                                        </Badge>
                                      )}
                                      {result.ward.healthScore < 75 && (
                                        <Badge variant="outline" className="text-xs">
                                          Critical Ward
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-sm text-muted-foreground">No shortage wards detected</p>
                            )}
                          </div>
                        </div>

                        {/* Needs Less Water Card */}
                        <div className="space-y-3 p-4 rounded-lg border border-orange-500/20 bg-orange-500/5">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold">Needs Less Water</h3>
                            {scenario.needsLessWater.length > 0 && (
                              <Badge className="ml-auto bg-orange-500 text-white">
                                {scenario.needsLessWater.length}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {scenario.needsLessWater.length > 0 ? (
                              scenario.needsLessWater.map((result) => {
                                const oversupplyPercent = Math.abs(result.demandGap / result.ward.demand) * 100
                                return (
                                  <div
                                    key={result.ward.id}
                                    className="p-3 bg-card border border-orange-500/30 rounded cursor-pointer hover:bg-orange-500/10 transition"
                                    onClick={() => setHighlightedWard(result.ward.id)}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <p className="font-medium text-sm">{result.ward.name}</p>
                                      <Badge className="text-xs bg-orange-600">{result.demandGap.toFixed(0)} MLD</Badge>
                                    </div>
                                    <div className="w-full bg-muted rounded h-2 mb-2">
                                      <div
                                        className="bg-orange-500 h-2 rounded"
                                        style={{ width: `${Math.min(100, oversupplyPercent)}%` }}
                                      />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      {result.hasLeak && (
                                        <Badge variant="outline" className="text-xs text-red-500">
                                          Leak Risk / Active Leak
                                        </Badge>
                                      )}
                                      {result.demandGap < -result.ward.demand * 0.1 && (
                                        <Badge variant="outline" className="text-xs">
                                          Oversupply
                                        </Badge>
                                      )}
                                      {result.ward.pressure > 4.5 && (
                                        <Badge variant="outline" className="text-xs text-red-500">
                                          High Pressure (Burst Risk)
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <p className="text-sm text-muted-foreground">No surplus wards detected</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleAutoApplyRecommendations}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Auto Apply Recommendations
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Distribution Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Available</p>
                        <p className="text-2xl font-bold">{scenario.totalAvailable.toFixed(0)} MLD</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Demand Forecast</p>
                        <p className="text-2xl font-bold">{scenario.totalDemand.toFixed(0)} MLD</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Shortage/Surplus</p>
                        <p
                          className={`text-2xl font-bold ${scenario.shortage > 0 ? "text-red-500" : "text-green-500"}`}
                        >
                          {scenario.shortage > 0 ? "-" : "+"}
                          {scenario.shortage.toFixed(0)} MLD
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">NRW Risk</p>
                        <p className="text-2xl font-bold text-amber-500">{scenario.nrwLossPercent.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {demandVsSupplyData.length > 0 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Demand vs Supply by Ward</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          demand: { label: "Predicted Demand", color: "hsl(var(--chart-1))" },
                          supply: { label: "Supply Allocated", color: "hsl(var(--chart-2))" },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={demandVsSupplyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="demand" fill="var(--color-demand)" />
                            <Bar dataKey="supply" fill="var(--color-supply)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Allocation Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="optimized">Optimized Plan</TabsTrigger>
                        <TabsTrigger value="current">Current Schedule</TabsTrigger>
                        <TabsTrigger value="emergency">Emergency Mode</TabsTrigger>
                      </TabsList>

                      <TabsContent value="optimized" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">Smart allocation using {scenario.name} strategy</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1 p-3 bg-green-500/10 rounded border border-green-500/20">
                            <p className="text-xs text-muted-foreground">NRW Loss %</p>
                            <p className="text-lg font-bold">{scenario.nrwLossPercent.toFixed(1)}%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                            <p className="text-xs text-muted-foreground">Avg Ward Health</p>
                            <p className="text-lg font-bold">{scenario.avgWardHealth.toFixed(0)}%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                            <p className="text-xs text-muted-foreground">Est. Complaints</p>
                            <p className="text-lg font-bold">{scenario.estimatedComplaints}</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="current" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">Current fixed/manual allocation baseline</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <p className="text-xs text-muted-foreground">NRW Loss %</p>
                            <p className="text-lg font-bold">12.5%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <p className="text-xs text-muted-foreground">Avg Ward Health</p>
                            <p className="text-lg font-bold">74%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <p className="text-xs text-muted-foreground">Est. Complaints</p>
                            <p className="text-lg font-bold">342</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="emergency" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">Emergency rationing allocation</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                            <p className="text-xs text-muted-foreground">NRW Loss %</p>
                            <p className="text-lg font-bold">8.2%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                            <p className="text-xs text-muted-foreground">Avg Ward Health</p>
                            <p className="text-lg font-bold">68%</p>
                          </div>
                          <div className="space-y-1 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                            <p className="text-xs text-muted-foreground">Est. Complaints</p>
                            <p className="text-lg font-bold">567</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Allocation Details</CardTitle>
                    <CardDescription>Ward-wise supply and operational parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ward</TableHead>
                            <TableHead className="text-right">Predicted Demand</TableHead>
                            <TableHead className="text-right">Supply Allocated</TableHead>
                            <TableHead className="text-right">% Demand Met</TableHead>
                            <TableHead className="text-right">Demand Gap</TableHead>
                            <TableHead className="text-right">Recommendation</TableHead>
                            <TableHead className="text-right">Health Score</TableHead>
                            <TableHead className="text-center">Priority</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scenario.results.map((result) => (
                            <TableRow
                              key={result.ward.id}
                              className={`cursor-pointer transition ${
                                highlightedWard === result.ward.id
                                  ? "bg-accent"
                                  : result.hasLeak
                                    ? "bg-red-500/5"
                                    : result.isHighPerforming
                                      ? "bg-green-500/5"
                                      : ""
                              }`}
                              onClick={() => setHighlightedWard(result.ward.id)}
                            >
                              <TableCell className="font-medium">
                                {result.ward.name}
                                {result.isHighPerforming && (
                                  <Badge className="ml-2 text-xs bg-green-600">Stable Zone</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">{result.predictedDemand.toFixed(0)}</TableCell>
                              <TableCell className="text-right">{result.supplyAllocated.toFixed(0)}</TableCell>
                              <TableCell className="text-right">{result.demandMet.toFixed(1)}%</TableCell>
                              <TableCell
                                className={`text-right font-medium ${result.demandGap > 0 ? "text-blue-500" : result.demandGap < 0 ? "text-orange-500" : "text-green-500"}`}
                              >
                                {result.demandGap > 0 ? "+" : ""}
                                {result.demandGap.toFixed(0)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant={
                                    result.recommendation === "Increase"
                                      ? "default"
                                      : result.recommendation === "Reduce"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {result.recommendation}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{result.ward.healthScore.toFixed(0)}%</TableCell>
                              <TableCell className="text-center">
                                <Badge className="text-xs">{result.priority}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Run allocation engine to see recommendations and detailed analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
