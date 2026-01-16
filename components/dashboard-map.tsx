"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import { MOCK_WARDS, MOCK_PIPES, MOCK_ALERTS, getWardColor } from "@/lib/mock-data"
import { useWardStore } from "@/lib/store"

interface DashboardMapProps {
  selectedWard: string | null
  onWardSelect: (wardId: string | null) => void
}

export function DashboardMap({ selectedWard, onWardSelect }: DashboardMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const wardLayers = useRef<Map<string, L.Polygon>>(new Map())
  const pipeLayer = useRef<L.FeatureGroup | null>(null)
  const alertLayer = useRef<L.FeatureGroup | null>(null)
  const { wards } = useWardStore()

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map centered on Mumbai
    map.current = L.map(mapContainer.current).setView([19.076, 72.8777], 11)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    // Create feature groups
    pipeLayer.current = L.featureGroup().addTo(map.current)
    alertLayer.current = L.featureGroup().addTo(map.current)

    // Add ward polygons
    MOCK_WARDS.forEach((ward) => {
      const color = getWardColor(ward.healthScore)
      const polygon = L.polygon(ward.polygon, {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
      })
        .on("click", () => onWardSelect(selectedWard === ward.id ? null : ward.id))
        .addTo(map.current!)

      wardLayers.current.set(ward.id, polygon)

      const liveWard = wards.find((w) => w.id === ward.id)
      const statusText = liveWard?.isHighPerforming
        ? "Status: High Performing (Stable Zone)"
        : `Health: ${ward.healthScore}%`

      polygon.bindPopup(
        `<div class="p-2 text-sm">
          <strong>${ward.name}</strong><br/>
          ${statusText}<br/>
          Pressure: ${ward.pressure} bar<br/>
          Supply/Demand: ${(ward.supplyDemandRatio * 100).toFixed(1)}%
        </div>`,
      )
    })

    // Add pipes
    MOCK_PIPES.forEach((pipe) => {
      L.polyline(pipe.coordinates, {
        color: "#06b6d4",
        weight: 3,
        opacity: 0.6,
        dashArray: "5, 5",
      }).addTo(pipeLayer.current!)
    })

    // Add leak alert markers
    const redIcon = L.icon({
      iconUrl:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%23ef4444'/%3E%3C/svg%3E",
      iconSize: [20, 20],
      popupAnchor: [0, -10],
    })

    MOCK_ALERTS.forEach((alert) => {
      const marker = L.marker([alert.lat, alert.lng], { icon: redIcon }).addTo(alertLayer.current!)

      marker.bindPopup(
        `<div class="p-2 text-sm">
          <strong>Leak Alert - ${alert.severity.toUpperCase()}</strong><br/>
          Ward: ${MOCK_WARDS.find((w) => w.id === alert.wardId)?.name}<br/>
          ${alert.message}<br/>
          <em>${alert.detectedTime}</em>
        </div>`,
      )
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  // Handle ward selection highlighting
  useEffect(() => {
    wardLayers.current.forEach((polygon, wardId) => {
      if (wardId === selectedWard) {
        polygon.setStyle({ weight: 4, opacity: 1, fillOpacity: 0.5 })
      } else {
        polygon.setStyle({ weight: 2, opacity: 0.8, fillOpacity: 0.3 })
      }
    })
  }, [selectedWard])

  useEffect(() => {
    wards.forEach((liveWard) => {
      const polygon = wardLayers.current.get(liveWard.id)
      if (polygon) {
        const color = getWardColor(liveWard.healthScore)
        polygon.setStyle({ color })
      }
    })
  }, [wards])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
        <p className="text-xs font-semibold mb-2">Ward Health Status</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Healthy (&gt;= 90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Moderate (80-89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>High Risk (&lt; 80%)</span>
          </div>
        </div>
        <hr className="my-2 border-border" />
        <p className="text-xs font-semibold mb-1">Network</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500" />
            <span>Pipe Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Leak Alerts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
