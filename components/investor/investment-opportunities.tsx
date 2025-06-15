"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Star } from "lucide-react"

const opportunities = [
  {
    id: 1,
    name: "Tech Growth Fund",
    type: "Mutual Fund",
    risk: "Medium",
    expectedReturn: "12-15%",
    minInvestment: 1000,
    rating: 4.5,
    description: "Diversified technology sector fund focusing on growth companies",
    features: ["Low fees", "Professional management", "Quarterly dividends"],
  },
  {
    id: 2,
    name: "Green Energy ETF",
    type: "ETF",
    risk: "High",
    expectedReturn: "15-20%",
    minInvestment: 500,
    rating: 4.2,
    description: "Exchange-traded fund focused on renewable energy companies",
    features: ["ESG compliant", "High growth potential", "Liquid trading"],
  },
  {
    id: 3,
    name: "Corporate Bonds Portfolio",
    type: "Bonds",
    risk: "Low",
    expectedReturn: "6-8%",
    minInvestment: 5000,
    rating: 4.8,
    description: "High-grade corporate bonds with stable returns",
    features: ["Capital preservation", "Regular income", "Low volatility"],
  },
  {
    id: 4,
    name: "Real Estate Investment Trust",
    type: "REIT",
    risk: "Medium",
    expectedReturn: "10-12%",
    minInvestment: 2500,
    rating: 4.3,
    description: "Diversified real estate portfolio with monthly distributions",
    features: ["Monthly dividends", "Inflation hedge", "Professional management"],
  },
  {
    id: 5,
    name: "Cryptocurrency Index",
    type: "Crypto",
    risk: "Very High",
    expectedReturn: "20-40%",
    minInvestment: 100,
    rating: 3.8,
    description: "Diversified cryptocurrency portfolio tracking major digital assets",
    features: ["24/7 trading", "High volatility", "Emerging asset class"],
  },
  {
    id: 6,
    name: "Dividend Aristocrats Fund",
    type: "Equity Fund",
    risk: "Low-Medium",
    expectedReturn: "8-10%",
    minInvestment: 1500,
    rating: 4.6,
    description: "Companies with 25+ years of consecutive dividend increases",
    features: ["Consistent dividends", "Quality companies", "Long-term stability"],
  },
]

const riskColors = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Low-Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Very High": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export function InvestmentOpportunities() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const filteredOpportunities = opportunities
    .filter((opp) => filter === "all" || opp.type.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "return") return Number.parseFloat(b.expectedReturn) - Number.parseFloat(a.expectedReturn)
      if (sortBy === "risk") return a.risk.localeCompare(b.risk)
      return 0
    })

  const handleInvest = (opportunity) => {
    console.log(`Investing in ${opportunity.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investment Opportunities</h2>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fund">Funds</SelectItem>
              <SelectItem value="etf">ETFs</SelectItem>
              <SelectItem value="bonds">Bonds</SelectItem>
              <SelectItem value="reit">REITs</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="return">Expected Return</SelectItem>
              <SelectItem value="risk">Risk Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{opportunity.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{opportunity.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{opportunity.type}</Badge>
                <Badge className={riskColors[opportunity.risk]}>{opportunity.risk} Risk</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{opportunity.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Expected Return</p>
                  <p className="text-lg font-bold text-green-600">{opportunity.expectedReturn}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Min. Investment</p>
                  <p className="text-lg font-bold">${opportunity.minInvestment.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm">Key Features:</p>
                <ul className="space-y-1">
                  {opportunity.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => handleInvest(opportunity)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Invest Now
                </Button>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
