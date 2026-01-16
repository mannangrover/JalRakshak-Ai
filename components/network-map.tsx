"use client"

import { useState, useEffect } from "react"

interface Zone {
  id: string
  name: string
  x: number
  y: number
  pressure: number
  flow: number
  status: "good" | "warning" | "critical"
  temperature: number
}

const MOCK_ZONES: Zone[] = [
  { id: "z1", name: "North District", x: 30, y: 20, pressure: 4.2, flow: 850, status: "good", temperature: 28 },
  { id: "z2", name: "Central Hub", x: 50, y: 45, pressure: 4.8, flow: 1200, status: "good", temperature: 27 },
  { id: "z3", name: "South Industrial", x: 70, y: 65, pressure: 3.8, flow: 920, status: "warning", temperature: 31 },
  { id: "z4", name: "East Residential", x: 75, y: 30, pressure: 4.1, flow: 650, status: "good", temperature: 26 },
  { id: "z5", name: "West Commercial", x: 25, y: 70, pressure: 3.2, flow: 580, status: "critical", temperature: 33 },
  { id: "z6", name: "Downtown", x: 50, y: 25, pressure: 4.5, flow: 1100, status: "good", temperature: 29 },
]

const PIPE_CONNECTIONS = [
  [
    [30, 20],
    [50, 45],
  ],
  [
    [50, 45],
    [70, 65],
  ],
  [
    [50, 45],
    [75, 30],
  ],
  [
    [50, 45],
    [25, 70],
  ],
  [
    [50, 25],
    [50, 45],
  ],
]

interface NetworkMapProps {
  selectedZone: string | null
  onZoneSelect: (zoneId: string | null) => void
}

export function NetworkMap({ selectedZone, onZoneSelect }: NetworkMapProps) {
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES)

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((zone) => ({
          ...zone,
          pressure: zone.pressure + (Math.random() - 0.5) * 0.3,
          flow: zone.flow + Math.random() * 50 - 25,
          temperature: zone.temperature + (Math.random() - 0.5) * 1,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return "#60d9f9"
      case "warning":
        return "#f59e0b"
      case "critical":
        return "#ef4444"
    }
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-card to-muted relative rounded-lg overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Pipe connections */}
        {PIPE_CONNECTIONS.map((connection, idx) => (
          <line
            key={`pipe-${idx}`}
            x1={connection[0][0]}
            y1={connection[0][1]}
            x2={connection[1][0]}
            y2={connection[1][1]}
            stroke="rgba(96, 217, 249, 0.3)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}

        {/* Zone nodes */}
        {zones.map((zone) => (
          <g
            key={zone.id}
            onClick={() => onZoneSelect(selectedZone === zone.id ? null : zone.id)}
            className="cursor-pointer"
          >
            {/* Node circle */}
            <circle
              cx={zone.x}
              cy={zone.y}
              r={selectedZone === zone.id ? 4.5 : 3.5}
              fill={getStatusColor(zone.status)}
              opacity={selectedZone === zone.id ? 1 : 0.8}
              className="transition-all duration-200"
            />

            {/* Glow effect for selected */}
            {selectedZone === zone.id && (
              <circle
                cx={zone.x}
                cy={zone.y}
                r="6"
                fill="none"
                stroke={getStatusColor(zone.status)}
                strokeWidth="1"
                opacity="0.3"
                className="animate-pulse"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#60d9f9" }} />
          <span className="text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
          <span className="text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ef4444" }} />
          <span className="text-muted-foreground">Critical</span>
        </div>
      </div>
    </div>
  )
}
