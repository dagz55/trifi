import { CreditCard, ShoppingCart, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"

const transactions: any[] = []

export function List02() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Recent Transactions
        </h2>
      </div>
      <div className="space-y-4 mb-6">
        {transactions.length > 0 ? (
          transactions.map((transaction: any) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                <transaction.icon
                  className={`h-4 w-4 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
              >
                {transaction.type === "income" ? "+" : "-"}₱{Math.abs(transaction.amount).toFixed(2)}
              </span>
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
              )}
            </div>
          </div>
          ))
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">Your transactions will appear here</p>
          </div>
        )}
      </div>
      <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        View All Transactions
      </button>
    </div>
  )
}
