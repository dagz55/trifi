import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const transactions = [
  {
    id: 1,
    description: "Online Store Payment",
    amount: "+₱350.00",
    date: "2023-10-15",
    status: "completed",
  },
  {
    id: 2,
    description: "Subscription Fee",
    amount: "-₱120.50",
    date: "2023-10-14",
    status: "pending",
  },
  {
    id: 3,
    description: "Freelance Payment",
    amount: "+₱1,000.00",
    date: "2023-10-13",
    status: "completed",
  },
  {
    id: 4,
    description: "Coffee Shop",
    amount: "-₱50.75",
    date: "2023-10-12",
    status: "completed",
  },
  {
    id: 5,
    description: "Investment Return",
    amount: "+₱720.00",
    date: "2023-10-11",
    status: "completed",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
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
      ))}
    </div>
  )
}
