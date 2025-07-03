"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    id: 1,
    title: "Create Your Account",
    description: "Sign up using your work email or social login."
  },
  {
    id: 2,
    title: "Set Up Your Organization",
    description: "Enter company details, currency, and timezone."
  },
  {
    id: 3,
    title: "Add Your First Project",
    description: "Create a project and invite team members."
  },
  {
    id: 4,
    title: "Connect Financial Accounts",
    description: "Link bank accounts or import opening balances."
  },
  {
    id: 5,
    title: "Track Transactions",
    description: "Record income and expenses or enable auto-sync."
  },
  {
    id: 6,
    title: "Explore Analytics",
    description: "View dashboards to monitor performance in real-time."
  },
]

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <PlayCircle className="h-6 w-6" /> Quick Start Tutorial
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Follow these six short steps to get up and running with TriFi.
      </p>

      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.id} className="relative pl-10">
            {/* timeline dot */}
            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary"></span>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Step {step.id}</Badge>
                  <CardTitle>{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0 text-sm text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <div className="text-center mt-8">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
} 