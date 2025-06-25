import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const transactions: any[] = []

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <CardContent className="flex items-center p-0">
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="ml-auto font-medium">
                <span
                  className={`text-sm font-medium ${transaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {transaction.amount}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground mt-1">Transaction data will appear here once you start making transactions</p>
        </div>
      )}
    </div>
  )
}
