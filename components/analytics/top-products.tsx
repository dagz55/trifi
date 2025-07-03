import { CheckCircle2 } from "lucide-react"

// TODO: Replace with real product performance data fetched from your database/API
const products: any[] = []

export function TopProducts() {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        <div className="text-center">
          <p className="text-sm font-medium">No product data available</p>
          <p className="text-xs">Connect your database to see top product performance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.name} className="flex items-center">
          <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.revenue}</p>
          </div>
          <div className="ml-auto font-medium text-green-500">{product.growth}</div>
        </div>
      ))}
    </div>
  )
}
