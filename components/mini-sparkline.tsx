"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface MiniSparklineProps {
  data: number[]
}

export function MiniSparkline({ data }: MiniSparklineProps) {
  const chartData = data.map((value, idx) => ({ idx, value }))

  return (
    <ResponsiveContainer width={60} height={25}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
