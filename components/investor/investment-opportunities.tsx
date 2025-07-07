"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, Plus, DollarSign, Calendar, MoreHorizontal } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSettings } from "@/contexts/settings-context"
import { db, Investment } from "@/lib/database"
import { toast } from "sonner"

interface InvestmentFormData {
  name: string
  type: 'stocks' | 'bonds' | 'real_estate' | 'crypto' | 'business'
  description: string
  initial_investment: number
  current_value: number
  expected_return: number
  risk_level: 'low' | 'medium' | 'high'
  investment_date: string
  maturity_date: string
}

function AddInvestmentModal({ onInvestmentAdded }: { onInvestmentAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<InvestmentFormData>({
    name: "",
    type: "stocks",
    description: "",
    initial_investment: 0,
    current_value: 0,
    expected_return: 0,
    risk_level: "medium",
    investment_date: new Date().toISOString().split('T')[0],
    maturity_date: ""
  })
  const { organizationData } = useSettings()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organizationData?.id) {
      toast.error("No organization selected")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await db.createInvestment({
        organization_id: organizationData.id,
        ...formData
      })

      if (error) {
        toast.error("Failed to create investment")
        console.error("Error creating investment:", error)
      } else {
        toast.success("Investment created successfully")
        setFormData({
          name: "",
          type: "stocks",
          description: "",
          initial_investment: 0,
          current_value: 0,
          expected_return: 0,
          risk_level: "medium",
          investment_date: new Date().toISOString().split('T')[0],
          maturity_date: ""
        })
        setIsOpen(false)
        onInvestmentAdded()
      }
    } catch (error) {
      toast.error("Failed to create investment")
      console.error("Error creating investment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Investment
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Add New Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Investment Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Apple Stock, Bitcoin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Initial Investment</label>
                <Input
                  type="number"
                  value={formData.initial_investment}
                  onChange={(e) => setFormData({ ...formData, initial_investment: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Value</label>
                <Input
                  type="number"
                  value={formData.current_value}
                  onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expected Return (%)</label>
                <Input
                  type="number"
                  value={formData.expected_return}
                  onChange={(e) => setFormData({ ...formData, expected_return: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Risk Level</label>
                <Select value={formData.risk_level} onValueChange={(value: any) => setFormData({ ...formData, risk_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Investment Date</label>
                <Input
                  type="date"
                  value={formData.investment_date}
                  onChange={(e) => setFormData({ ...formData, investment_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maturity Date</label>
                <Input
                  type="date"
                  value={formData.maturity_date}
                  onChange={(e) => setFormData({ ...formData, maturity_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Investment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function InvestmentOpportunities() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const { organizationData } = useSettings()

  const loadInvestments = async () => {
    if (!organizationData?.id) return

    setIsLoading(true)
    try {
      const { data, error } = await db.getInvestments(organizationData.id)
      if (error) {
        toast.error("Failed to load investments")
        console.error("Error loading investments:", error)
      } else {
        setInvestments(data || [])
      }
    } catch (error) {
      toast.error("Failed to load investments")
      console.error("Error loading investments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInvestments()
  }, [organizationData?.id])

  useEffect(() => {
    let filtered = investments.filter(investment => {
      const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (investment.description && investment.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = typeFilter === "all" || investment.type === typeFilter
      const matchesRisk = riskFilter === "all" || investment.risk_level === riskFilter
      
      return matchesSearch && matchesType && matchesRisk
    })
    setFilteredInvestments(filtered)
  }, [investments, searchTerm, typeFilter, riskFilter])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'sold': return 'bg-gray-100 text-gray-800'
      case 'matured': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateReturn = (initial: number, current: number) => {
    if (!initial || initial === 0) return 0
    return ((current - initial) / initial) * 100
  }

  const handleDeleteInvestment = async (investment: Investment) => {
    try {
      const { error } = await db.deleteInvestment(investment.id)
      if (error) {
        toast.error("Failed to delete investment")
        console.error("Error deleting investment:", error)
      } else {
        toast.success(`${investment.name} deleted`)
        loadInvestments()
      }
    } catch (error) {
      toast.error("Failed to delete investment")
      console.error("Error deleting investment:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investment Portfolio</h2>
        <AddInvestmentModal onInvestmentAdded={loadInvestments} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search investments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="bonds">Bonds</SelectItem>
            <SelectItem value="real_estate">Real Estate</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card className="h-[400px]">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading investments...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredInvestments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvestments.map((investment) => {
            const currentReturn = calculateReturn(investment.initial_investment, investment.current_value || investment.initial_investment)
            const isPositive = currentReturn >= 0
            
            return (
              <Card key={investment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{investment.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{investment.type.replace('_', ' ')}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteInvestment(investment)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {investment.description && (
                    <p className="text-sm text-muted-foreground mb-3">{investment.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Initial Investment</span>
                      <span className="font-medium">${investment.initial_investment.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Value</span>
                      <span className="font-medium">
                        ${(investment.current_value || investment.initial_investment).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Return</span>
                      <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{currentReturn.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected Return</span>
                      <span className="font-medium">{investment.expected_return}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskColor(investment.risk_level || 'medium')}>
                        {investment.risk_level || 'Medium'} Risk
                      </Badge>
                      <Badge className={getStatusColor(investment.status || 'active')}>
                        {investment.status || 'Active'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(investment.investment_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="h-[400px]">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="space-y-4">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold">No Investments Found</h3>
                  <p className="text-muted-foreground mt-2">
                    {investments.length === 0 
                      ? "Start building your investment portfolio by adding your first investment."
                      : "No investments match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                </div>
              </div>
              
              {investments.length === 0 && (
                <AddInvestmentModal onInvestmentAdded={loadInvestments} />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
