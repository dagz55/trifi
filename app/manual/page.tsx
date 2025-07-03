"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen } from "lucide-react"

const sections = [
  { slug: "getting-started", title: "Getting Started", description: "Account setup, onboarding, and first-time configuration." },
  { slug: "dashboard-overview", title: "Dashboard Overview", description: "Navigating the main dashboard and widgets." },
  { slug: "managing-projects", title: "Managing Projects", description: "Create, track, and collaborate on projects." },
  { slug: "financial-operations", title: "Financial Operations", description: "Transactions, invoices, and payments workflow." },
  { slug: "analytics-reporting", title: "Analytics & Reporting", description: "Generate reports and monitor KPIs." },
  { slug: "settings-security", title: "Settings & Security", description: "Customize preferences and manage account security." },
]

export default function ManualPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <BookOpen className="h-6 w-6" /> User Manual
      </h1>
      <p className="text-muted-foreground mb-4 max-w-2xl">
        Welcome to the TriFi User Manual. Select a section below to learn how to get the most out of the platform.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.slug} className="hover:bg-muted/50 transition-colors">
            <Link href={`/manual/${s.slug}`} className="block p-6 h-full">
              <CardHeader className="p-0 mb-2">
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-muted-foreground">
                {s.description}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
} 