"use client"

import { Droplets, TrendingDown, AlertTriangle, Zap, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const stats = [
    { label: "Up to 40% NRW loss", icon: TrendingDown, color: "text-destructive" },
    { label: "Manual scheduling inefficiency", icon: AlertTriangle, color: "text-orange-500" },
    { label: "Reactive maintenance costs", icon: Zap, color: "text-yellow-500" },
  ]

  const features = [
    {
      title: "Demand Forecasting",
      description: "AI-powered prediction of water demand patterns across zones",
      icon: TrendingDown,
    },
    {
      title: "Leakage Detection",
      description: "Automated anomaly detection in pipe networks using sensor data",
      icon: AlertTriangle,
    },
    {
      title: "Smart Allocation Engine",
      description: "Optimized water distribution with valve & pump recommendations",
      icon: Zap,
    },
    {
      title: "GIS Dashboard",
      description: "Real-time visualization of network health and pressure zones",
      icon: MapPin,
    },
    {
      title: "Citizen Reporting",
      description: "Engage citizens in leak detection and water conservation",
      icon: Users,
    },
    {
      title: "Decision Support System",
      description: "Data-driven insights for authority operations & maintenance",
      icon: Droplets,
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-28 max-w-7xl mx-auto">
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full">
            <Droplets className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            Transforming dumb pipelines into a responsive smart grid
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            JalRakshak AI combines digital twin technology with decision support systems to reduce water losses and
            optimize urban distribution networks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Open Authority Dashboard
              </Button>
            </Link>
            <Link href="/citizen">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Citizen Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Stats */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-card/30 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8">The Challenge</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="border-border bg-card">
                <CardContent className="pt-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
                  <p className="font-semibold text-lg">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Solution Overview */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Solution</h3>
            <p className="text-muted-foreground mb-4">
              JalRakshak AI is a comprehensive Digital Twin and Decision Support System (DSS) that combines real-time
              sensor data, predictive analytics, and optimization algorithms to transform water distribution networks.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">✓</span>
                <span>Real-time monitoring of pressure, flow, and temperature</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">✓</span>
                <span>AI-powered anomaly detection for leakage identification</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">✓</span>
                <span>Smart allocation engine for optimal resource distribution</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent flex-shrink-0 mt-1">✓</span>
                <span>Citizen engagement platform for collaborative management</span>
              </li>
            </ul>
          </div>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Key Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-1">Data Acquisition</p>
                <p className="text-xs text-muted-foreground">IoT sensors for real-time monitoring</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Analytics Engine</p>
                <p className="text-xs text-muted-foreground">Machine learning for anomaly detection</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Optimization Algorithm</p>
                <p className="text-xs text-muted-foreground">Smart allocation & pressure management</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Visualization Platform</p>
                <p className="text-xs text-muted-foreground">GIS-based authority dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-card/30 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="border-border bg-card hover:bg-card/80 transition-colors">
                <CardHeader>
                  <Icon className="w-6 h-6 text-accent mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h3 className="text-3xl font-bold">Expected Impact</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            By implementing JalRakshak AI, water authorities can achieve significant operational improvements
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">20%+</p>
              <p className="font-semibold">Reduce NRW Loss</p>
              <p className="text-xs text-muted-foreground mt-2">Non-Revenue Water reduction through leak detection</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">30%</p>
              <p className="font-semibold">Cost Savings</p>
              <p className="text-xs text-muted-foreground mt-2">Operational efficiency from smart scheduling</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">24/7</p>
              <p className="font-semibold">Monitoring</p>
              <p className="text-xs text-muted-foreground mt-2">Real-time system oversight and alert management</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
