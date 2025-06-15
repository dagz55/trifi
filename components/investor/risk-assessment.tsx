"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, TrendingUp, PieChart } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

const riskMetrics = [
  { category: "Market Risk", score: 75, description: "Exposure to market volatility" },
  { category: "Credit Risk", score: 25, description: "Risk of default on investments" },
  { category: "Liquidity Risk", score: 40, description: "Ability to quickly convert to cash" },
  { category: "Concentration Risk", score: 60, description: "Diversification across assets" },
  { category: "Currency Risk", score: 30, description: "Foreign exchange exposure" },
  { category: "Interest Rate Risk", score: 45, description: "Sensitivity to rate changes" },
]

const portfolioRisk = {
  overall: 52,
  volatility: "Medium",
  sharpeRatio: 1.25,
  maxDrawdown: "-12.5%",
  beta: 0.95,
  var: "-₱15,420",
}

const riskRecommendations = [
  {
    type: "warning",
    title: "High Concentration in Tech Sector",
    description: "45% of your portfolio is in technology stocks. Consider diversifying into other sectors.",
    priority: "High",
  },
  {
    type: "info",
    title: "Low Bond Allocation",
    description: "Only 15% in bonds. Consider increasing fixed-income allocation for stability.",
    priority: "Medium",
  },
  {
    type: "success",
    title: "Good Geographic Diversification",
    description: "Your international exposure of 25% provides good geographic diversification.",
    priority: "Low",
  },
]

const scenarioAnalysis = [
  { scenario: "Market Crash (-30%)", impact: "-₱180,000", recovery: "18 months" },
  { scenario: "Interest Rate Spike (+3%)", impact: "-₱45,000", recovery: "8 months" },
  { scenario: "Sector Rotation", impact: "-₱25,000", recovery: "4 months" },
  { scenario: "Currency Devaluation", impact: "-₱15,000", recovery: "6 months" },
]

export function RiskAssessment() {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "High Risk"
    if (score >= 60) return "Medium-High Risk"
    if (score >= 40) return "Medium Risk"
    return "Low Risk"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioRisk.overall}/100</div>
            <p className="text-xs text-muted-foreground">
              <span className={getRiskColor(portfolioRisk.overall)}>{getRiskLevel(portfolioRisk.overall)} Risk</span>
            </p>
            <Progress value={portfolioRisk.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioRisk.sharpeRatio}</div>
            <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{portfolioRisk.maxDrawdown}</div>
            <p className="text-xs text-muted-foreground">Worst decline from peak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{portfolioRisk.var}</div>
            <p className="text-xs text-muted-foreground">1-day potential loss</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Risk Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMetrics.map((metric) => (
                <div key={metric.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.category}</span>
                    <Badge className={`${getRiskColor(metric.score)} bg-transparent border`}>{metric.score}/100</Badge>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskRecommendations.map((rec, index) => (
              <Alert
                key={index}
                className={
                  rec.type === "warning"
                    ? "border-yellow-500"
                    : rec.type === "success"
                      ? "border-green-500"
                      : "border-blue-500"
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stress Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {scenarioAnalysis.map((scenario, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium">{scenario.scenario}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Potential Impact:</span>
                    <span className="ml-2 font-medium text-red-500">{scenario.impact}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Est. Recovery:</span>
                    <span className="ml-2 font-medium">{scenario.recovery}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
