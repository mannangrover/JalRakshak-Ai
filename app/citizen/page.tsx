"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, AlertCircle, CheckCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Leak {
  id: string
  location: string
  status: "reported" | "investigating" | "resolved"
  date: string
}

const MOCK_REPORTS: Leak[] = [
  { id: "l1", location: "Main Street Junction", status: "resolved", date: "2 days ago" },
  { id: "l2", location: "Park Avenue", status: "investigating", date: "4 hours ago" },
  { id: "l3", location: "Hospital Road", status: "reported", date: "30 mins ago" },
]

const WARD_SCHEDULE = [
  { ward: "North District", monday: "6AM-9AM", friday: "6PM-9PM" },
  { ward: "Central Hub", monday: "9AM-12PM", friday: "3PM-6PM" },
  { ward: "South Industrial", monday: "12PM-3PM", friday: "12PM-3PM" },
  { ward: "East Residential", monday: "3PM-6PM", friday: "9AM-12PM" },
  { ward: "West Commercial", monday: "6PM-9PM", friday: "6AM-9AM" },
  { ward: "Downtown", monday: "9AM-12PM", friday: "3PM-6PM" },
]

export default function CitizenPortalPage() {
  const [reports, setReports] = useState<Leak[]>(MOCK_REPORTS)
  const [waterUsage] = useState(285) // liters
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReport = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setReports([
        ...reports,
        {
          id: `l${reports.length + 1}`,
          location: "New Location",
          status: "reported",
          date: "just now",
        },
      ])
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-accent" />
      case "investigating":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "reported":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-accent/20 text-accent border-accent/30">Resolved</Badge>
      case "investigating":
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">Investigating</Badge>
      case "reported":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Reported</Badge>
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Citizen Portal</h1>
          <p className="text-muted-foreground mt-2">Track water supply, report leaks, and manage usage</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Supply Schedule */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-accent" />
                Water Supply Schedule
              </CardTitle>
              <CardDescription>Your ward's scheduled supply timings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {WARD_SCHEDULE.slice(0, 3).map((item) => (
                  <div key={item.ward} className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="font-semibold text-sm">{item.ward}</p>
                    <p className="text-xs text-muted-foreground mt-1">Monday: {item.monday}</p>
                    <p className="text-xs text-muted-foreground">Friday: {item.friday}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Water Footprint */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-accent" />
                Daily Water Footprint
              </CardTitle>
              <CardDescription>Your household water consumption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium">Today's Usage</span>
                  <span className="text-2xl font-bold text-accent">{waterUsage}L</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: "65%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Target: 450L/day</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Toilets</p>
                  <p className="font-semibold">45%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Washing</p>
                  <p className="font-semibold">28%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Cooking</p>
                  <p className="font-semibold">15%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Other</p>
                  <p className="font-semibold">12%</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold">💡 Conservation Tips</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fix leaking taps to save 10L/day</li>
                  <li>• Use efficient shower heads</li>
                  <li>• Collect rainwater for gardening</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report a Leak Form */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Report a Leak
            </CardTitle>
            <CardDescription>Help us identify and fix water leaks in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Report Leak</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Water Leak</DialogTitle>
                  <DialogDescription>Provide details about the leak location and upload a photo</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location Description</Label>
                    <Textarea id="location" placeholder="Where is the leak? (e.g., Main Street near corner)" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Leak Severity</Label>
                    <select className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm">
                      <option>Mild drip</option>
                      <option>Moderate flow</option>
                      <option>Severe gush</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Upload Photo</Label>
                    <Input id="photo" type="file" accept="image/*" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" type="tel" placeholder="Your phone number" />
                  </div>

                  <Button onClick={handleSubmitReport} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* My Reports */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>My Leak Reports</CardTitle>
            <CardDescription>Track the status of your submitted reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getStatusIcon(report.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{report.location}</p>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
