"use client"

import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWardStore } from "@/lib/store"

export function AlertsList() {
  const { alerts } = useWardStore()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "warning":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
      case "info":
        return "bg-accent/20 text-accent border-accent/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "warning":
        return <AlertCircle className="w-4 h-4" />
      case "info":
        return <Info className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border animate-in slide-in-from-top-2 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alert.wardName}</p>
                  <p className="text-xs opacity-90 mt-1">{alert.message}</p>
                  <p className="text-xs opacity-70 mt-2">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
