"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PortfolioOverview } from "@/components/investor/portfolio-overview"
import { InvestmentOpportunities } from "@/components/investor/investment-opportunities"
import { MarketAnalysis } from "@/components/investor/market-analysis"
import { InvestorProfile } from "@/components/investor/investor-profile"
import { TransactionHistory } from "@/components/investor/transaction-history"
import { RiskAssessment } from "@/components/investor/risk-assessment"
import { Plus, Download } from "lucide-react"
import { toast } from "sonner"

export default function InvestorPage() {
  const [activeTab, setActiveTab] = useState("portfolio")

  const handleExportData = () => {
    toast.info("Exporting investor portfolio data...")
  }

  const handleNewInvestment = () => {
    toast.info("Opening new investment form...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Investor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Portfolio
          </Button>
          <Button onClick={handleNewInvestment}>
            <Plus className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <PortfolioOverview />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <InvestmentOpportunities />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <MarketAnalysis />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskAssessment />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <InvestorProfile />
        </TabsContent>
      </Tabs>
    </div>
  )
}
