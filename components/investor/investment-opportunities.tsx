"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Search, Plus } from "lucide-react"
import { toast } from "sonner"

export function InvestmentOpportunities() {
  const handleExploreInvestments = () => {
    toast.info("Investment opportunities will be available soon!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investment Opportunities</h2>
        <div className="flex items-center space-x-4">
          <Select disabled>
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
          <Select disabled>
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

      <Card className="h-[400px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-4">
              <Search className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-2xl font-bold">No Investment Opportunities</h3>
                <p className="text-muted-foreground mt-2">
                  We're working on bringing you the best investment opportunities. 
                  Check back soon for curated investment options.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={handleExploreInvestments} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Get Notified When Available
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Learn About Investing
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>When available, you'll find:</p>
              <ul className="text-left space-y-1">
                <li>• Mutual funds and ETFs</li>
                <li>• Government and corporate bonds</li>
                <li>• Real estate investment trusts</li>
                <li>• Cryptocurrency options</li>
                <li>• Risk-adjusted recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
