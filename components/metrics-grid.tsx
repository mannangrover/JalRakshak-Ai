"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Gauge, Droplets, Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Metric {
  label: string
  value: number
  unit: string
  icon: React.ReactNode
  color: string
  trend: "+" | "-"
}

interface MetricsGridProps {
  selectedZone: string | null
}

export function MetricsGrid({ selectedZone }: MetricsGridProps) {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: "System Pressure",
      value: 4.2,
      unit: "bar",
      icon: <Gauge className="w-5 h-5" />,
      color: "text-accent",
      trend: "+",
    },
    {
      label: "Flow Rate",
      value: 850,
      unit: "L/s",
      icon: <Droplets className="w-5 h-5" />,
      color: "text-accent",
      trend: "+",
    },
    {
      label: "Water Temp",
      value: 28,
      unit: "°C",
      icon: <Thermometer className="w-5 h-5" />,
      color: "text-accent",
      trend: "-",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: m.value + (Math.random() - 0.5) * (m.unit === "bar" ? 0.2 : m.unit === "°C" ? 1 : 30),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className={metric.color}>{metric.icon}</span>
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">{metric.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className={metric.trend === "+" ? "text-accent" : "text-orange-500"}>
                {metric.trend} {(Math.random() * 2).toFixed(1)}%
              </span>
              from average
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
