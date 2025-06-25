import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const accounts: { name: string; balance: number }[] = []

export function AccountOverview() {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold mb-4">₱{totalBalance.toFixed(2)}</div>
        <div className="space-y-2">
          {accounts.map((account) => (
            <div key={account.name} className="flex justify-between">
              <span className="text-sm text-gray-600">{account.name}</span>
              <span className="font-medium">₱{account.balance.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
