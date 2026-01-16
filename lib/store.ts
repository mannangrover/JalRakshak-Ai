import { create } from "zustand"

export interface Ward {
  id: string
  name: string
  pressure: number
  flow: number
  demand: number
  supply: number
  healthScore: number
  nrwLossPercent: number
  status: "good" | "warning" | "critical"
  trendData: number[]
  isHighPerforming?: boolean
}

export interface Alert {
  id: string
  wardId: string
  wardName: string
  severity: "critical" | "warning" | "info"
  message: string
  timestamp: Date
}

interface WardStore {
  wards: Ward[]
  alerts: Alert[]
  liveMode: boolean
  leakProbability: number
  initializeWards: () => void
  updateWards: (leakProbability: number) => void
  addAlert: (alert: Alert) => void
  clearOldAlerts: () => void
  setLiveMode: (enabled: boolean) => void
  setLeakProbability: (probability: number) => void
  triggerManualLeak: (wardId: string) => void
}

const INITIAL_WARDS: Ward[] = [
  {
    id: "w1",
    name: "North District",
    pressure: 4.2,
    flow: 1200,
    demand: 1200,
    supply: 1150,
    healthScore: 94,
    nrwLossPercent: 4.2,
    status: "good",
    trendData: [94, 94, 93, 94, 94],
    isHighPerforming: true,
  },
  {
    id: "w2",
    name: "Central Hub",
    pressure: 4.8,
    flow: 1800,
    demand: 1800,
    supply: 1750,
    healthScore: 96,
    nrwLossPercent: 2.8,
    status: "good",
    trendData: [96, 96, 96, 96, 96],
    isHighPerforming: true,
  },
  {
    id: "w3",
    name: "South Industrial",
    pressure: 3.8,
    flow: 950,
    demand: 950,
    supply: 920,
    healthScore: 87,
    nrwLossPercent: 3.2,
    status: "warning",
    trendData: [89, 88, 87, 87, 87],
  },
  {
    id: "w4",
    name: "East Residential",
    pressure: 4.1,
    flow: 750,
    demand: 750,
    supply: 720,
    healthScore: 91,
    nrwLossPercent: 4.0,
    status: "good",
    trendData: [92, 92, 91, 91, 91],
  },
  {
    id: "w5",
    name: "West Commercial",
    pressure: 3.2,
    flow: 650,
    demand: 650,
    supply: 600,
    healthScore: 78,
    nrwLossPercent: 7.7,
    status: "warning",
    trendData: [82, 80, 79, 78, 78],
  },
]

export const useWardStore = create<WardStore>((set, get) => ({
  wards: INITIAL_WARDS,
  alerts: [],
  liveMode: true,
  leakProbability: 0.1,

  initializeWards: () => {
    set({ wards: INITIAL_WARDS, alerts: [] })
  },

  setLiveMode: (enabled: boolean) => {
    set({ liveMode: enabled })
  },

  setLeakProbability: (probability: number) => {
    set({ leakProbability: Math.min(1, Math.max(0, probability)) })
  },

  triggerManualLeak: (wardId: string) => {
    set((state) => {
      const updatedWards = state.wards.map((ward) => {
        if (ward.id === wardId && !ward.isHighPerforming) {
          const newPressure = ward.pressure - 1.5
          const newFlow = ward.flow * 0.7
          const pressureDrop = ward.pressure - newPressure
          const flowSpike = ((ward.flow - newFlow) / ward.flow) * 100
          const nrwLoss = (ward.supply - ward.demand) / ward.supply
          const healthScore = Math.max(20, 100 - pressureDrop * 20 - nrwLoss * 100 * 0.3 - flowSpike * 0.2)

          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            wardId: ward.id,
            wardName: ward.name,
            severity: "critical",
            message: `Major leak triggered - pressure drop ${pressureDrop.toFixed(1)} bar`,
            timestamp: new Date(),
          }
          state.addAlert(newAlert)

          return {
            ...ward,
            pressure: newPressure,
            flow: newFlow,
            healthScore,
            nrwLossPercent: nrwLoss * 100,
            status: "critical",
            trendData: [...ward.trendData.slice(1), healthScore],
          }
        }
        return ward
      })

      return { wards: updatedWards }
    })
  },

  addAlert: (alert: Alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 20),
    }))
  },

  clearOldAlerts: () => {
    set((state) => {
      const now = new Date()
      return {
        alerts: state.alerts.filter((a) => now.getTime() - a.timestamp.getTime() < 3600000),
      }
    })
  },

  updateWards: (leakProbability: number) => {
    set((state) => {
      const getTimeOfDayFactor = () => {
        const hour = new Date().getHours()
        if (hour >= 6 && hour < 9) return 1.4 // morning peak
        if (hour >= 9 && hour < 17) return 1.1 // daytime
        if (hour >= 17 && hour < 21) return 1.3 // evening peak
        return 0.6 // night low
      }

      const timeOfDayFactor = getTimeOfDayFactor()

      const updatedWards = state.wards.map((ward) => {
        if (ward.isHighPerforming) {
          // High performing wards: maintain stable, healthy metrics
          let newPressure = ward.pressure + (Math.random() - 0.5) * 0.2
          newPressure = Math.max(45, Math.min(60, newPressure)) // Keep in psi range

          let newDemand = ward.demand * (0.98 + Math.random() * 0.04)
          newDemand = Math.max(500, Math.min(2000, newDemand))

          const newFlow = newDemand * 0.98
          const newSupply = ward.supply * (0.99 + Math.random() * 0.01)

          // Keep NRW loss very low for high performing wards
          const nrwLossPercent = Math.min(9, ward.nrwLossPercent + (Math.random() - 0.5) * 0.5)

          // Health score always high (>85)
          const healthScore = Math.max(88, ward.healthScore + (Math.random() - 0.5) * 1.5)

          const newWard = {
            ...ward,
            pressure: newPressure,
            flow: newFlow,
            demand: newDemand,
            supply: newSupply,
            healthScore: Math.min(100, Math.round(healthScore * 10) / 10),
            nrwLossPercent: Math.round(nrwLossPercent * 10) / 10,
            status: "good" as const,
            trendData: [...ward.trendData.slice(1), healthScore],
          }

          // No leak alerts for high performing wards
          return newWard
        }

        // Regular simulation for other wards
        let newPressure = ward.pressure + (Math.random() - 0.5) * 0.3
        newPressure = Math.max(2.5, Math.min(5.5, newPressure))

        let newDemand = ward.demand * timeOfDayFactor * (0.95 + Math.random() * 0.1)
        newDemand = Math.max(500, Math.min(2000, newDemand))

        const newFlow = newDemand * 0.98
        const newSupply = ward.supply * (0.98 + Math.random() * 0.04)

        const expectedLoss = ward.supply * 0.03
        let nrwLoss = newSupply - newDemand - expectedLoss
        if (nrwLoss < 0) nrwLoss = 0
        const nrwLossPercent = (nrwLoss / newSupply) * 100

        const pressureHealth = (newPressure / 4.5) * 100
        const nrwHealth = Math.max(0, 100 - nrwLossPercent * 3)
        let healthScore = pressureHealth * 0.4 + nrwHealth * 0.6
        healthScore = Math.max(20, Math.min(100, healthScore))

        let hasLeak = false
        const pressureDrop = ward.pressure - newPressure
        const flowChange = ((ward.flow - newFlow) / ward.flow) * 100

        if (pressureDrop > 0.8 && Math.abs(flowChange) > 15 && Math.random() < leakProbability) {
          hasLeak = true
          healthScore *= 0.7
        }

        let status: "good" | "warning" | "critical" = "good"
        if (healthScore < 60) status = "critical"
        else if (healthScore < 80) status = "warning"

        const newWard = {
          ...ward,
          pressure: newPressure,
          flow: newFlow,
          demand: newDemand,
          supply: newSupply,
          healthScore: Math.round(healthScore * 10) / 10,
          nrwLossPercent: Math.round(nrwLossPercent * 10) / 10,
          status,
          trendData: [...ward.trendData.slice(1), healthScore],
        }

        if (hasLeak) {
          const alert: Alert = {
            id: `alert-${Date.now()}-${ward.id}`,
            wardId: ward.id,
            wardName: ward.name,
            severity: "critical",
            message: `Anomaly detected - pressure drop ${pressureDrop.toFixed(1)} bar, flow change ${flowChange.toFixed(0)}%`,
            timestamp: new Date(),
          }
          state.addAlert(alert)
        }

        return newWard
      })

      return { wards: updatedWards }
    })
  },
}))
