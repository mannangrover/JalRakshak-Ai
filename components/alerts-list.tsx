"use client"

import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Alert {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  timestamp: string
}

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Pressure Drop",
    description: "West Commercial zone pressure below threshold",
    severity: "critical",
    timestamp: "2 min ago",
  },
  {
    id: "a2",
    title: "Maintenance Required",
    description: "South Industrial zone valve service due",
    severity: "warning",
    timestamp: "15 min ago",
  },
  {
    id: "a3",
    title: "Temperature Alert",
    description: "Water temperature elevated in Downtown zone",
    severity: "warning",
    timestamp: "32 min ago",
  },
  {
    id: "a4",
    title: "System Update",
    description: "Scheduled maintenance completed successfully",
    severity: "info",
    timestamp: "1 hour ago",
  },
]

export function AlertsList() {
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
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs opacity-90 mt-1">{alert.description}</p>
                <p className="text-xs opacity-70 mt-2">{alert.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
