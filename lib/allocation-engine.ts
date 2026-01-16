"use client"

import type { Ward } from "./store"

export interface AllocationResult {
  ward: Ward
  predictedDemand: number
  supplyAllocated: number
  demandMet: number
  valvePosition: number
  pumpSpeed: number
  priority: "HIGH" | "MED" | "LOW"
  hasLeak: boolean
  isHighPerforming: boolean
  demandGap: number
  recommendation: "Increase" | "Reduce" | "Stable"
}

export interface AllocationScenario {
  name: string
  strategy: "equity" | "demand" | "critical"
  results: AllocationResult[]
  totalAvailable: number
  totalDemand: number
  shortage: number
  nrwLossPercent: number
  avgWardHealth: number
  estimatedComplaints: number
  timestamp: Date
  needsMoreWater: AllocationResult[]
  needsLessWater: AllocationResult[]
  topShortageWard?: AllocationResult
  topOversupplyWard?: AllocationResult
  netRedistribution: number
  nrwReductionPercent: number
}

export function runSmartAllocation(
  wards: Ward[],
  strategy: "equity" | "demand" | "critical",
  totalAvailable: number,
  minSupply: number,
  maxPumpCapacity: number,
  leakAware: boolean,
  fairnessSlider: number,
): AllocationScenario {
  const totalDemand = wards.reduce((sum, w) => sum + w.demand, 0)
  const hasLeaks = wards.filter((w) => w.status === "critical").length > 0

  let allocations: AllocationResult[] = []

  if (strategy === "equity") {
    const supplyPerWard = totalAvailable / wards.length
    allocations = wards.map((ward) => {
      const allocated = Math.max(minSupply, supplyPerWard)
      const demandGap = ward.demand - allocated
      return {
        ward,
        predictedDemand: ward.demand,
        supplyAllocated: allocated,
        demandMet: Math.min(100, (allocated / ward.demand) * 100),
        valvePosition: 45 + Math.random() * 40,
        pumpSpeed: 50 + Math.random() * 35,
        priority: allocated >= ward.demand * 0.9 ? "HIGH" : "MED",
        hasLeak: ward.status === "critical",
        isHighPerforming: ward.isHighPerforming || false,
        demandGap,
        recommendation:
          demandGap > ward.demand * 0.1 ? "Increase" : demandGap < -ward.demand * 0.1 ? "Reduce" : "Stable",
      }
    })
  } else if (strategy === "demand") {
    allocations = wards.map((ward) => {
      const demandFraction = ward.demand / totalDemand
      let allocated = totalAvailable * demandFraction
      allocated = leakAware && ward.status === "critical" ? allocated * 0.85 : allocated
      allocated = Math.max(minSupply, allocated)
      const demandGap = ward.demand - allocated
      return {
        ward,
        predictedDemand: ward.demand,
        supplyAllocated: allocated,
        demandMet: Math.min(100, (allocated / ward.demand) * 100),
        valvePosition: 50 + Math.random() * 35,
        pumpSpeed: 55 + Math.random() * 30,
        priority: allocated >= ward.demand * 0.95 ? "HIGH" : allocated >= ward.demand * 0.8 ? "MED" : "LOW",
        hasLeak: ward.status === "critical",
        isHighPerforming: ward.isHighPerforming || false,
        demandGap,
        recommendation:
          demandGap > ward.demand * 0.1 ? "Increase" : demandGap < -ward.demand * 0.1 ? "Reduce" : "Stable",
      }
    })
  } else {
    const sortedByHealth = [...wards].sort((a, b) => a.healthScore - b.healthScore)
    const criticalWards = sortedByHealth.slice(0, Math.ceil(wards.length / 3))
    const normalWards = sortedByHealth.slice(Math.ceil(wards.length / 3))

    allocations = wards.map((ward) => {
      let allocated: number
      if (criticalWards.find((w) => w.id === ward.id)) {
        allocated = (totalAvailable * 0.6) / criticalWards.length
      } else {
        allocated = (totalAvailable * 0.4) / normalWards.length
      }
      allocated = leakAware && ward.status === "critical" ? allocated * 0.8 : allocated
      allocated = Math.max(minSupply, allocated)
      const demandGap = ward.demand - allocated
      return {
        ward,
        predictedDemand: ward.demand,
        supplyAllocated: allocated,
        demandMet: Math.min(100, (allocated / ward.demand) * 100),
        valvePosition: ward.healthScore < 80 ? 65 + Math.random() * 25 : 40 + Math.random() * 35,
        pumpSpeed: ward.healthScore < 80 ? 70 + Math.random() * 25 : 50 + Math.random() * 30,
        priority: ward.healthScore < 80 ? "HIGH" : "MED",
        hasLeak: ward.status === "critical",
        isHighPerforming: ward.isHighPerforming || false,
        demandGap,
        recommendation:
          demandGap > ward.demand * 0.1 ? "Increase" : demandGap < -ward.demand * 0.1 ? "Reduce" : "Stable",
      }
    })
  }

  const needsMoreWater = allocations
    .filter((r) => r.demandGap > r.ward.demand * 0.1 && !r.isHighPerforming)
    .sort((a, b) => b.demandGap - a.demandGap)

  const needsLessWater = allocations
    .filter((r) => (r.hasLeak || r.demandGap < -r.ward.demand * 0.1) && !r.isHighPerforming)
    .sort((a, b) => {
      const aReduction = Math.max(0, -b.demandGap)
      const bReduction = Math.max(0, -a.demandGap)
      return aReduction - bReduction
    })

  const topShortageWard = needsMoreWater[0]
  const topOversupplyWard = needsLessWater[0]
  const netRedistribution = needsMoreWater.reduce((sum, r) => sum + r.demandGap, 0)
  const currentNRWLoss = wards.reduce((sum, w) => sum + w.nrwLossPercent, 0) / wards.length
  const optimizedNRWLoss =
    allocations.reduce((sum, r) => sum + Math.min(15, r.ward.nrwLossPercent + Math.random() * 2), 0) /
    allocations.length
  const nrwReductionPercent = Math.max(0, currentNRWLoss - optimizedNRWLoss)

  const totalAllocated = allocations.reduce((sum, a) => sum + a.supplyAllocated, 0)
  const shortage = Math.max(0, totalDemand - totalAllocated)
  const nrwLossPercent = (shortage / totalAvailable) * 100
  const avgWardHealth = wards.reduce((sum, w) => sum + w.healthScore, 0) / wards.length
  const estimatedComplaints = shortage > 0 ? Math.ceil(shortage * 10) : 0

  return {
    name: strategy === "equity" ? "Equity First" : strategy === "demand" ? "Demand First" : "Critical Zones First",
    strategy,
    results: allocations,
    totalAvailable,
    totalDemand,
    shortage,
    nrwLossPercent,
    avgWardHealth,
    estimatedComplaints,
    timestamp: new Date(),
    needsMoreWater,
    needsLessWater,
    topShortageWard,
    topOversupplyWard,
    netRedistribution: Math.round(netRedistribution),
    nrwReductionPercent: Math.round(nrwReductionPercent * 10) / 10,
  }
}

export function getAIInsights(scenario: AllocationScenario, wards: Ward[]): string[] {
  const insights: string[] = []

  const highDemandWards = wards.filter((w) => w.demand > 1500)
  if (highDemandWards.length > 0) {
    insights.push(
      `${highDemandWards[0].name} shows high demand surge (${highDemandWards[0].demand.toFixed(0)} MLD) in current window.`,
    )
  }

  const leakWards = wards.filter((w) => w.status === "critical")
  if (leakWards.length > 0) {
    insights.push(`${leakWards[0].name} has leakage risk — recommend avoiding over-supply to prevent burst.`)
  }

  if (scenario.shortage > 100) {
    insights.push(`Current strategy results in ${scenario.shortage.toFixed(0)} MLD shortage — consider emergency mode.`)
  } else if (scenario.shortage === 0) {
    insights.push(`All ward demands can be met with current allocation strategy.`)
  }

  const equityBaseline = (scenario.totalDemand / wards.length / scenario.totalDemand) * 100
  const improvement = Math.max(0, scenario.avgWardHealth - equityBaseline)
  if (improvement > 5) {
    insights.push(`${scenario.name} mode improved allocation fairness by ~${improvement.toFixed(1)}% vs baseline.`)
  }

  return insights.slice(0, 3)
}

export function getRecommendedActions(scenario: AllocationScenario, wards: Ward[]): string[] {
  const actions: string[] = []

  const leakWards = wards.filter((w) => w.status === "critical")
  if (leakWards.length > 0) {
    actions.push(`Dispatch repair team to ${leakWards[0].name} for emergency leak mitigation.`)
  }

  const lowHealthWards = wards.filter((w) => w.healthScore < 75)
  if (lowHealthWards.length > 0) {
    const increase = Math.ceil((lowHealthWards[0].demand * 0.1) / 10) * 10
    actions.push(`Increase supply to ${lowHealthWards[0].name} by +${increase} MLD to improve health score.`)
  }

  const highPressureWards = wards.filter((w) => w.pressure > 4.5)
  if (highPressureWards.length > 0) {
    actions.push(`Reduce pressure in ${highPressureWards[0].name} to prevent pipe burst risk.`)
  }

  return actions.slice(0, 3)
}
