"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, TrendingUp, PieChart, Plus, BarChart3 } from "lucide-react"

export function RiskAssessment() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--/100</div>
            <p className="text-xs text-muted-foreground">No portfolio to assess</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Add investments to calculate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">No historical data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Start investing to calculate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center space-y-4">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No Risk Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build a portfolio to see risk analysis
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Start Investing
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">No Risk Metrics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your risk metrics will appear here
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>We'll analyze:</p>
                    <ul className="text-left space-y-1">
                      <li>• Market risk exposure</li>
                      <li>• Credit risk assessment</li>
                      <li>• Liquidity considerations</li>
                      <li>• Concentration risk</li>
                      <li>• Currency risk</li>
                      <li>• Interest rate sensitivity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">No Recommendations Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll provide personalized risk recommendations based on your portfolio
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Build Portfolio
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stress Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">No Stress Test Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stress testing will be available once you have investments
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>We'll simulate scenarios like:</p>
                  <ul className="text-left space-y-1">
                    <li>• Market crashes</li>
                    <li>• Interest rate changes</li>
                    <li>• Sector rotations</li>
                    <li>• Currency fluctuations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
