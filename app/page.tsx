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
      {/* Header with Apple-style typography and dark purple */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight dashboard-heading">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back. Here&apos;s what&apos;s happening with your finances.
        </p>
      </div>

      {/* Database Connection Status with improved styling */}
      <div className="animate-fade-in">
        <DatabaseConnectionStatus />
      </div>

      {/* Main Content Grid with Apple-style layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="lg:col-span-1">
          <AccountsOverview />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1">
          <QuickBillPay />
        </div>
      </div>

      {/* Business Metrics with delay animation */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <BusinessMetrics />
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
