"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"

interface StreamData {
  time: string
  pressure: number
  flow: number
  anomaly: boolean
}

export default function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [leakIntensity, setLeakIntensity] = useState([0])
  const [pressureDrop, setPressureDrop] = useState([0])
  const [streamData, setStreamData] = useState<StreamData[]>([])
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = (prev + 1) % 60
        const basePressure = 4.5 - (pressureDrop[0] / 100) * 2
        const baseFlow = 1000 - (leakIntensity[0] / 100) * 400

        const newData: StreamData = {
          time: `${newTime}s`,
          pressure: Math.max(2, basePressure + (Math.random() - 0.5) * 0.5),
          flow: Math.max(0, baseFlow + (Math.random() - 0.5) * 100),
          anomaly: leakIntensity[0] > 30 && Math.random() > 0.7,
        }

        setStreamData((prev) => [...prev.slice(-19), newData])
        return newTime
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isRunning, leakIntensity, pressureDrop])

  const handleGenerateAnomaly = () => {
    setLeakIntensity([75 + Math.random() * 25])
    setPressureDrop([50 + Math.random() * 30])
    setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setLeakIntensity([0])
    setPressureDrop([0])
    setStreamData([])
    setCurrentTime(0)
  }

  const avgPressure =
    streamData.length > 0 ? (streamData.reduce((sum, d) => sum + d.pressure, 0) / streamData.length).toFixed(2) : "0"
  const avgFlow =
    streamData.length > 0 ? (streamData.reduce((sum, d) => sum + d.flow, 0) / streamData.length).toFixed(0) : "0"
  const anomaliesDetected = streamData.filter((d) => d.anomaly).length

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Data Simulation</h1>
          <p className="text-muted-foreground mt-2">Test leak detection with simulated sensor data</p>
        </div>

        {/* Controls */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
            <CardDescription>Adjust parameters to test anomaly detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Leak Intensity */}
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Leak Intensity</span>
                <span className="text-accent font-semibold">{leakIntensity[0]}%</span>
              </Label>
              <Slider value={leakIntensity} onValueChange={setLeakIntensity} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground">Simulates water loss through pipe breaks</p>
            </div>

            {/* Pressure Drop */}
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Pressure Drop</span>
                <span className="text-accent font-semibold">{pressureDrop[0]}%</span>
              </Label>
              <Slider value={pressureDrop} onValueChange={setPressureDrop} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground">Simulates system pressure reduction</p>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start
                  </>
                )}
              </Button>

              <Button onClick={handleGenerateAnomaly} variant="outline" className="gap-2 bg-transparent">
                <Zap className="w-4 h-4" />
                Generate Anomaly
              </Button>

              <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Stream */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="relative w-3 h-3">
                <span
                  className={`absolute inset-0 rounded-full ${isRunning ? "bg-accent animate-pulse" : "bg-muted"}`}
                />
              </span>
              Live Sensor Stream
            </CardTitle>
            <CardDescription>Real-time pressure and flow readings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Avg Pressure</p>
                <p className="text-2xl font-bold text-accent">{avgPressure} bar</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Avg Flow</p>
                <p className="text-2xl font-bold text-accent">{avgFlow} L/s</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Anomalies</p>
                <p className="text-2xl font-bold text-destructive">{anomaliesDetected}</p>
              </div>
            </div>

            {/* Data Stream */}
            <div className="border border-border rounded-lg bg-muted/30 p-4 font-mono text-xs space-y-1 max-h-80 overflow-y-auto">
              {streamData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No data yet. Start simulation to begin streaming sensor data.
                </p>
              ) : (
                streamData.map((data, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between ${data.anomaly ? "text-destructive font-semibold" : "text-foreground"}`}
                  >
                    <span>[{data.time}]</span>
                    <span>Pressure: {data.pressure.toFixed(2)} bar</span>
                    <span>Flow: {data.flow.toFixed(0)} L/s</span>
                    {data.anomaly && (
                      <Badge variant="destructive" className="h-5">
                        ANOMALY
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>About This Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This simulation demonstrates how JalRakshak AI detects anomalies in water distribution networks. Increase
              leak intensity to simulate pipe breaks and pressure drops to trigger anomaly detection.
            </p>
            <p>
              The system monitors real-time sensor data and identifies deviations from normal patterns. Detected
              anomalies are flagged for further investigation by water authorities.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
