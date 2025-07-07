"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { OrganizationEditModal } from "@/components/organization-edit-modal"
import { AddDepartmentModal } from "@/components/add-department-modal"
import { db } from "@/lib/database"
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Edit,
  Plus,
  TrendingUp,
  DollarSign,
  Loader2
} from "lucide-react"

export default function OrganizationPage() {
  const { currentOrganization, loading: authLoading, createOrganization } = useAuth()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Function to load departments from database
  const loadDepartments = async (organizationId: string) => {
    try {
      const { data: departmentsData, error: departmentsError } = await db.getDepartments(organizationId)
      if (departmentsError) {
        console.warn('Failed to load departments:', departmentsError)
      } else {
        setDepartments(departmentsData || [])
      }
    } catch (error) {
      console.error('Error loading departments:', error)
    }
  }

  // Load organization data when current organization changes
  useEffect(() => {
    async function loadOrganizationData() {
      if (!currentOrganization) {
        setDataLoading(false)
        return
      }

      setDataLoading(true)
      try {
        // Load accounts
        const { data: accountsData, error: accountsError } = await db.getAccounts(currentOrganization.id)
        if (accountsError) {
          console.warn('Failed to load accounts:', accountsError)
        } else {
          setAccounts(accountsData || [])
        }

        // Load recent transactions
        const { data: transactionsData, error: transactionsError } = await db.getRecentTransactions(currentOrganization.id, 10)
        if (transactionsError) {
          console.warn('Failed to load transactions:', transactionsError)
        } else {
          setTransactions(transactionsData || [])
        }

        // Load departments
        await loadDepartments(currentOrganization.id)

      } catch (error) {
        console.error('Error loading organization data:', error)
        toast.error('Failed to load organization data')
      } finally {
        setDataLoading(false)
      }
    }

    loadOrganizationData()
  }, [currentOrganization])

  const handleEditDetails = () => {
    setEditModalOpen(true)
  }

  const handleAddDepartment = () => {
    setAddDepartmentModalOpen(true)
  }

  const handleDepartmentAdded = async () => {
    // Reload departments from database to ensure we have the latest data
    if (currentOrganization) {
      await loadDepartments(currentOrganization.id)
    }
  }

  const handleCreateOrganization = async () => {
    const newOrg = await createOrganization({
      name: "My Organization",
      description: "A new organization",
      industry: "Technology",
      currency: "PHP",
      timezone: "UTC+8"
    })
    
    if (newOrg) {
      toast.success("Organization created successfully!")
    }
  }

  // Calculate metrics based on actual data
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  const incomeTransactions = transactions.filter(t => t.type === 'income')
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
  
  const metrics = [
    {
      title: "Total Balance",
      value: `₱${totalBalance.toLocaleString()}`,
      change: "0%",
      icon: DollarSign,
    },
    {
      title: "Monthly Income",
      value: `₱${totalIncome.toLocaleString()}`,
      change: "0%",
      icon: TrendingUp,
    },
    {
      title: "Active Accounts",
      value: accounts.length.toString(),
      change: "0",
      icon: Building2,
    },
    {
      title: "Recent Transactions",
      value: transactions.length.toString(),
      change: "0",
      icon: Users,
    },
  ]

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading organization data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No organization state
  if (!currentOrganization) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No organization found</h3>
              <p className="text-muted-foreground mb-4">
                You need to create an organization to get started
              </p>
              <Button onClick={handleCreateOrganization}>
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <Button onClick={handleEditDetails}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </div>

        {/* Organization Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-4">{currentOrganization.name}</h3>
                <div className="space-y-3">
                  {currentOrganization.industry && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{currentOrganization.industry}</span>
                    </div>
                  )}
                  {currentOrganization.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{typeof currentOrganization.address === 'string' ? currentOrganization.address : 'Address on file'}</span>
                    </div>
                  )}
                  {currentOrganization.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{currentOrganization.phone}</span>
                    </div>
                  )}
                  {currentOrganization.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentOrganization.email}</span>
                    </div>
                  )}
                  {currentOrganization.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{currentOrganization.website}</span>
                    </div>
                  )}
                  {currentOrganization.description && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{currentOrganization.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.title} className="text-center p-4 bg-muted rounded-lg">
                    <metric.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.title}</div>
                    <Badge variant="secondary" className="mt-1">
                      {metric.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Departments</CardTitle>
            <Button size="sm" onClick={handleAddDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {departments.length > 0 ? (
                departments.map((dept: any) => (
                <Card key={dept.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{dept.name}</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      {dept.user_profiles && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {dept.user_profiles.full_name ? 
                                dept.user_profiles.full_name.split(' ').map((n: string) => n[0]).join('') : 
                                'N/A'
                              }
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {dept.user_profiles.full_name || 'No head assigned'}
                          </span>
                        </div>
                      )}
                      {dept.budget && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Budget: </span>
                          <span className="font-medium">₱{dept.budget.toLocaleString()}</span>
                        </div>
                      )}
                      {dept.description && (
                        <div className="text-sm text-muted-foreground">
                          {dept.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(dept.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add departments to organize your company structure
                  </p>
                  <Button onClick={handleAddDepartment}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <OrganizationEditModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
      />

      <AddDepartmentModal 
        open={addDepartmentModalOpen} 
        onOpenChange={setAddDepartmentModalOpen} 
        onDepartmentAdded={handleDepartmentAdded}
      />
    </>
  )
} 