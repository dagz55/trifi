"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useUser } from '@clerk/nextjs'

interface OverviewCardsProps {
  comparisonPeriod: string
}

const formatCurrency = (amount: number) => {
  return `₱${amount.toLocaleString()}`
}

const getComparisonLabel = (period: string) => {
  switch (period) {
    case "previous_month":
      return "vs last month"
    case "previous_quarter":
      return "vs last quarter"
    case "previous_year":
      return "vs last year"
    default:
      return "vs last month"
  }
}

export function OverviewCards({ comparisonPeriod }: OverviewCardsProps) {
  const { user } = useUser()

  // TODO: Replace with actual data from your database/API
  // For now, showing placeholder data - connect to your Supabase database
  const currentData = {
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  }

  const comparisonData = {
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  }

  const comparisonLabel = getComparisonLabel(comparisonPeriod)

  const cards = [
    {
      title: "Total Balance",
      icon: DollarSign,
      amount: formatCurrency(currentData.totalBalance),
      current: currentData.totalBalance,
      previous: comparisonData.totalBalance,
    },
    {
      title: "Income",
      icon: DollarSign,
      amount: formatCurrency(currentData.income),
      current: currentData.income,
      previous: comparisonData.income,
    },
    {
      title: "Expenses",
      icon: DollarSign,
      amount: formatCurrency(currentData.expenses),
      current: currentData.expenses,
      previous: comparisonData.expenses,
    },
    {
      title: "Savings",
      icon: DollarSign,
      amount: formatCurrency(currentData.savings),
      current: currentData.savings,
      previous: comparisonData.savings,
    },
  ]

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, isPositive: true }
    const change = ((current - previous) / previous) * 100
    return { percentage: Math.abs(change), isPositive: change >= 0 }
  }

  if (!user) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const { percentage, isPositive } = calculateChange(card.current, card.previous)
        const Icon = card.icon
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.amount}</div>
              {percentage > 0 && (
                <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                  <TrendIcon className="h-3 w-3" />
                  {percentage.toFixed(1)}% {comparisonLabel}
                </p>
              )}
              {percentage === 0 && (
                <p className="text-xs text-muted-foreground">
                  No data for comparison
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
