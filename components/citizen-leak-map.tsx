"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"

interface CitizenLeakMapProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation?: { lat: number; lng: number } | null
}

export function CitizenLeakMap({ onLocationSelect, selectedLocation }: CitizenLeakMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map centered on Mumbai
    map.current = L.map(mapContainer.current).setView([19.076, 72.8777], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    // Handle map click to set marker
    map.current.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng

      // Remove existing marker
      if (marker.current) {
        marker.current.remove()
      }

      // Add new marker
      marker.current = L.marker([lat, lng])
        .addTo(map.current!)
        .bindPopup(`<strong>Leak Location</strong><br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}`)
        .openPopup()

      onLocationSelect(lat, lng)
    })

    return () => {
      map.current?.remove()
    }
  }, [onLocationSelect])

  // Update marker if selectedLocation changes from outside
  useEffect(() => {
    if (!map.current || !selectedLocation) return

    if (marker.current) {
      marker.current.remove()
    }

    marker.current = L.marker([selectedLocation.lat, selectedLocation.lng])
      .addTo(map.current)
      .bindPopup(
        `<strong>Leak Location</strong><br/>Lat: ${selectedLocation.lat.toFixed(4)}<br/>Lng: ${selectedLocation.lng.toFixed(4)}`,
      )
      .openPopup()
  }, [selectedLocation])

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border bg-muted">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-card border border-border rounded px-2 py-1 text-xs text-muted-foreground z-10">
        Click on map to set leak location
      </div>
    </div>
  )
}
