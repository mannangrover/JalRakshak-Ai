"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWardStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Power, AlertTriangle, Zap } from "lucide-react"

export function LiveControlPanel() {
  const { liveMode, leakProbability, setLiveMode, setLeakProbability, triggerManualLeak, wards } = useWardStore()
  const [selectedWard, setSelectedWard] = useState<string>("")

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Live Mode Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Live Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-sm">Live Mode</p>
              <p className="text-xs text-muted-foreground">Real-time ward updates</p>
            </div>
          </div>
          <Button variant={liveMode ? "default" : "outline"} onClick={() => setLiveMode(!liveMode)} className="w-20">
            {liveMode ? "ON" : "OFF"}
          </Button>
        </div>

        {/* Leak Probability Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Leak Probability</p>
              <p className="text-xs text-muted-foreground">Anomaly detection sensitivity</p>
            </div>
            <Badge variant="outline">{(leakProbability * 100).toFixed(0)}%</Badge>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={leakProbability * 100}
            onChange={(e) => setLeakProbability(Number.parseFloat(e.target.value) / 100)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--color-chart-1)) 0%, hsl(var(--color-chart-1)) ${leakProbability * 100}%, var(--color-muted) ${leakProbability * 100}%, var(--color-muted) 100%)`,
            }}
          />
        </div>

        {/* Manual Leak Trigger */}
        <div className="space-y-3 pt-3 border-t border-border">
          <p className="font-medium text-sm">Trigger Manual Leak</p>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
          >
            <option value="">Select a ward...</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              if (selectedWard) {
                triggerManualLeak(selectedWard)
                setSelectedWard("")
              }
            }}
            disabled={!selectedWard}
            className="w-full bg-destructive hover:bg-destructive/90"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Trigger Leak
          </Button>
        </div>

        {/* Status */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {liveMode ? (
              <>
                <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse mr-2"></span>
                Updating live
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mr-2"></span>
                Paused
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
