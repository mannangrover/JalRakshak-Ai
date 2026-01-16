"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const CHART_DATA = [
  { time: "00:00", pressure: 4.2, flow: 850, temp: 24 },
  { time: "02:00", pressure: 4.1, flow: 780, temp: 23 },
  { time: "04:00", pressure: 3.9, flow: 650, temp: 22 },
  { time: "06:00", pressure: 4.3, flow: 920, temp: 23 },
  { time: "08:00", pressure: 4.6, flow: 1100, temp: 26 },
  { time: "10:00", pressure: 4.8, flow: 1300, temp: 28 },
  { time: "12:00", pressure: 4.9, flow: 1450, temp: 30 },
  { time: "14:00", pressure: 4.7, flow: 1380, temp: 31 },
  { time: "16:00", pressure: 4.5, flow: 1250, temp: 29 },
  { time: "18:00", pressure: 4.4, flow: 1100, temp: 28 },
  { time: "20:00", pressure: 4.2, flow: 950, temp: 26 },
  { time: "22:00", pressure: 4.0, flow: 850, temp: 25 },
]

export function SystemChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={CHART_DATA}>
        <defs>
          <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            color: "var(--color-foreground)",
          }}
        />
        <Area
          type="monotone"
          dataKey="pressure"
          stroke="var(--color-chart-1)"
          fillOpacity={1}
          fill="url(#colorPressure)"
          name="Pressure (bar)"
        />
        <Area
          type="monotone"
          dataKey="flow"
          stroke="var(--color-chart-2)"
          fillOpacity={1}
          fill="url(#colorFlow)"
          name="Flow (L/s)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
