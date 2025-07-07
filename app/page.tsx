import { SignedIn, SignedOut } from '@clerk/nextjs'
import { AccountsOverview } from "@/components/accounts-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { QuickBillPay } from "@/components/quick-bill-pay"
import { BusinessMetrics } from "@/components/business-metrics"
import { DatabaseConnectionStatus } from "@/components/database-connection-status"
import { LandingPage } from "@/components/landing-page"

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Modern Financial Dashboard Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-fintech-primary via-fintech-accent to-fintech-secondary bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-fintech-neutral-600 dark:text-fintech-neutral-400 text-lg font-medium">
              Comprehensive overview of your financial ecosystem
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-fintech-neutral-500 dark:text-fintech-neutral-400">
                Last updated
              </p>
              <p className="text-sm font-semibold text-fintech-neutral-700 dark:text-fintech-neutral-300">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="w-2 h-2 bg-fintech-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-fintech-primary/10 to-fintech-primary/5 rounded-xl p-4 border border-fintech-primary/20">
            <div className="text-2xl font-bold text-fintech-primary">↗</div>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">Growth Trend</p>
          </div>
          <div className="bg-gradient-to-br from-fintech-secondary/10 to-fintech-secondary/5 rounded-xl p-4 border border-fintech-secondary/20">
            <div className="text-2xl font-bold text-fintech-secondary">✓</div>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">All Systems</p>
          </div>
          <div className="bg-gradient-to-br from-fintech-accent/10 to-fintech-accent/5 rounded-xl p-4 border border-fintech-accent/20">
            <div className="text-2xl font-bold text-fintech-accent">★</div>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">Premium</p>
          </div>
          <div className="bg-gradient-to-br from-fintech-warning/10 to-fintech-warning/5 rounded-xl p-4 border border-fintech-warning/20">
            <div className="text-2xl font-bold text-fintech-warning">⚡</div>
            <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400">Real-time</p>
          </div>
        </div>
      </div>

      {/* Enhanced Database Connection Status */}
      <div className="animate-fade-in">
        <DatabaseConnectionStatus />
      </div>

      {/* Modern Financial Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Primary Financial Overview - Takes more space */}
        <div className="lg:col-span-5">
          <AccountsOverview />
        </div>
        
        {/* Transaction Activity */}
        <div className="lg:col-span-4">
          <RecentTransactions />
        </div>
        
        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <QuickBillPay />
        </div>
      </div>

      {/* Enhanced Business Metrics with full width */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <BusinessMetrics />
      </div>
      
      {/* Financial Performance Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-gradient-to-br from-fintech-primary/5 to-fintech-primary/10 rounded-2xl p-6 border border-fintech-primary/20">
          <h3 className="text-lg font-semibold text-fintech-primary mb-2">Portfolio Performance</h3>
          <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400 mb-4">
            Your investments are performing above market average
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-fintech-secondary rounded-full"></div>
            <span className="text-sm font-medium text-fintech-secondary">+12.5% this quarter</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-fintech-secondary/5 to-fintech-secondary/10 rounded-2xl p-6 border border-fintech-secondary/20">
          <h3 className="text-lg font-semibold text-fintech-secondary mb-2">Cash Flow Health</h3>
          <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400 mb-4">
            Strong positive cash flow with optimal liquidity ratios
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-fintech-primary rounded-full"></div>
            <span className="text-sm font-medium text-fintech-primary">Excellent rating</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-fintech-accent/5 to-fintech-accent/10 rounded-2xl p-6 border border-fintech-accent/20">
          <h3 className="text-lg font-semibold text-fintech-accent mb-2">Risk Assessment</h3>
          <p className="text-sm text-fintech-neutral-600 dark:text-fintech-neutral-400 mb-4">
            Balanced risk profile with diversified asset allocation
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-fintech-warning rounded-full"></div>
            <span className="text-sm font-medium text-fintech-warning">Moderate risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  )
}
