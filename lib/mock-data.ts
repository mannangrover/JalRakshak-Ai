// Mock data for water distribution network
export interface Ward {
  id: string
  name: string
  polygon: [number, number][] // latitude, longitude coordinates
  healthScore: number
  pressure: number
  supplyDemandRatio: number
}

export interface Pipe {
  id: string
  coordinates: [number, number][]
}

export interface LeakAlert {
  id: string
  lat: number
  lng: number
  wardId: string
  severity: "high" | "medium" | "low"
  message: string
  detectedTime: string
}

// Mumbai center coordinates
const MUMBAI_CENTER: [number, number] = [19.076, 72.8777]

export const MOCK_WARDS: Ward[] = [
  {
    id: "w1",
    name: "North District",
    polygon: [
      [19.12, 72.85],
      [19.12, 72.9],
      [19.08, 72.9],
      [19.08, 72.85],
    ],
    healthScore: 94,
    pressure: 4.2,
    supplyDemandRatio: 0.96,
  },
  {
    id: "w2",
    name: "Central Hub",
    polygon: [
      [19.08, 72.82],
      [19.08, 72.88],
      [19.04, 72.88],
      [19.04, 72.82],
    ],
    healthScore: 96,
    pressure: 4.8,
    supplyDemandRatio: 0.97,
  },
  {
    id: "w3",
    name: "South Industrial",
    polygon: [
      [19.0, 72.8],
      [19.0, 72.9],
      [18.95, 72.9],
      [18.95, 72.8],
    ],
    healthScore: 87,
    pressure: 3.8,
    supplyDemandRatio: 0.97,
  },
  {
    id: "w4",
    name: "East Residential",
    polygon: [
      [19.08, 72.92],
      [19.08, 73.0],
      [19.02, 73.0],
      [19.02, 72.92],
    ],
    healthScore: 91,
    pressure: 4.1,
    supplyDemandRatio: 0.96,
  },
  {
    id: "w5",
    name: "West Commercial",
    polygon: [
      [19.04, 72.75],
      [19.04, 72.82],
      [18.98, 72.82],
      [18.98, 72.75],
    ],
    healthScore: 78,
    pressure: 3.2,
    supplyDemandRatio: 0.92,
  },
]

export const MOCK_PIPES: Pipe[] = [
  {
    id: "p1",
    coordinates: [
      [19.12, 72.85],
      [19.08, 72.82],
      [19.04, 72.85],
    ],
  },
  {
    id: "p2",
    coordinates: [
      [19.08, 72.88],
      [19.08, 72.92],
      [19.02, 72.96],
    ],
  },
  {
    id: "p3",
    coordinates: [
      [19.08, 72.82],
      [19.0, 72.8],
      [18.95, 72.85],
    ],
  },
  {
    id: "p4",
    coordinates: [
      [19.04, 72.82],
      [19.04, 72.75],
      [18.98, 72.78],
    ],
  },
]

export const MOCK_ALERTS: LeakAlert[] = [
  {
    id: "a1",
    lat: 19.1,
    lng: 72.87,
    wardId: "w1",
    severity: "high",
    message: "Major leak detected - pressure drop 2.1 bar",
    detectedTime: "2 hours ago",
  },
  {
    id: "a2",
    lat: 19.05,
    lng: 72.85,
    wardId: "w3",
    severity: "medium",
    message: "Moderate leak - flow anomaly detected",
    detectedTime: "30 mins ago",
  },
  {
    id: "a3",
    lat: 19.08,
    lng: 72.78,
    wardId: "w5",
    severity: "high",
    message: "Critical leak - rapid pressure loss",
    detectedTime: "15 mins ago",
  },
]

export const getWardColor = (healthScore: number): string => {
  if (healthScore >= 90) return "#22c55e" // Green - Healthy
  if (healthScore >= 80) return "#eab308" // Yellow - Moderate risk
  return "#ef4444" // Red - High leakage risk
}
