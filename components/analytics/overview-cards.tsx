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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Loading...</CardTitle>
              <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded animate-pulse mb-3" />
              <div className="h-4 bg-gray-300 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const { percentage, isPositive } = calculateChange(card.current, card.previous)
        const Icon = card.icon
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle 
                className="text-sm font-semibold"
                style={{ color: '#374151' }}
              >
                {card.title}
              </CardTitle>
              <Icon 
                className="h-5 w-5" 
                style={{ color: '#6b7280' }}
              />
            </CardHeader>
            <CardContent>
              <div 
                className="text-3xl font-bold mb-3"
                style={{ 
                  color: '#111827',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.1'
                }}
              >
                {card.amount}
              </div>
              {percentage > 0 && (
                <p 
                  className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"} flex items-center gap-2`}
                  style={{ marginTop: '8px' }}
                >
                  <TrendIcon className="h-4 w-4" />
                  <span>{percentage.toFixed(1)}% {comparisonLabel}</span>
                </p>
              )}
              {percentage === 0 && (
                <p 
                  className="text-sm font-medium"
                  style={{ 
                    color: '#6b7280',
                    marginTop: '8px'
                  }}
                >
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
