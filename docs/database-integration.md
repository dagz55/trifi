# Database Integration Guide

## Overview
This guide shows how to integrate the database with your existing TriFi components to make buttons actually save data to Supabase.

## Setup Checklist

### 1. Database Schema Setup
- ✅ Run `database/schema.sql` in Supabase SQL Editor
- ✅ Verify tables are created successfully
- ✅ Confirm database connection works (green status on dashboard)

### 2. Import Database Service
Add this import to any component that needs database access:

```typescript
import { db } from '@/lib/database'
```

## 🔄 Converting Existing Components

### Example: Add Transaction Modal

**Before (Mock Data):**
```typescript
const handleSubmit = async (data) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  toast.success("Transaction added successfully")
}
```

**After (Real Database):**
```typescript
import { db } from '@/lib/database'

const handleSubmit = async (data) => {
  try {
    const transactionData = {
      organization_id: 'your-org-id', // Get from context/auth
      account_id: data.accountId,
      category_id: data.categoryId,
      type: data.type, // 'income' | 'expense' | 'transfer'
      amount: parseFloat(data.amount),
      description: data.description,
      transaction_date: data.date,
      created_by: 'user-id' // Get from Clerk auth
    }

    const { data: transaction, error } = await db.createTransaction(transactionData)
    
    if (error) {
      toast.error(`Failed to add transaction: ${error.message}`)
      return
    }

    toast.success("Transaction added successfully")
    onClose() // Close modal
    // Optionally refresh data
  } catch (error) {
    toast.error(`Unexpected error: ${error}`)
  }
}
```

## 📝 Common Integration Patterns

### 1. Create Operations
```typescript
// Add Organization
const createOrg = async (orgData) => {
  const { data, error } = await db.createOrganization({
    name: orgData.name,
    description: orgData.description,
    industry: orgData.industry,
    created_by: userId
  })
  
  if (error) {
    console.error('Error creating organization:', error)
    return
  }
  
  console.log('Organization created:', data)
}

// Add Project
const createProject = async (projectData) => {
  const { data, error } = await db.createProject({
    organization_id: orgId,
    name: projectData.name,
    description: projectData.description,
    budget: parseFloat(projectData.budget),
    start_date: projectData.startDate,
    end_date: projectData.endDate,
    created_by: userId
  })
}
```

### 2. Read Operations
```typescript
// Load Dashboard Data
const loadDashboardData = async () => {
  try {
    setLoading(true)
    
    // Get accounts
    const { data: accounts } = await db.getAccounts(organizationId)
    setAccounts(accounts)
    
    // Get recent transactions
    const { data: transactions } = await db.getRecentTransactions(organizationId, 10)
    setTransactions(transactions)
    
    // Get upcoming meetings
    const { data: meetings } = await db.getUpcomingMeetings(organizationId, 5)
    setMeetings(meetings)
    
  } catch (error) {
    toast.error('Failed to load dashboard data')
  } finally {
    setLoading(false)
  }
}

// Use in useEffect
useEffect(() => {
  if (organizationId) {
    loadDashboardData()
  }
}, [organizationId])
```

### 3. Update Operations
```typescript
// Update Account Balance
const updateBalance = async (accountId, newBalance) => {
  const { data, error } = await db.updateAccountBalance(accountId, newBalance)
  
  if (error) {
    toast.error('Failed to update balance')
    return
  }
  
  // Update local state
  setAccounts(prev => prev.map(account => 
    account.id === accountId 
      ? { ...account, balance: newBalance }
      : account
  ))
}

// Update Project Status
const updateProjectStatus = async (projectId, status) => {
  const { data, error } = await db.updateProject(projectId, { status })
  
  if (error) {
    toast.error('Failed to update project')
    return
  }
  
  toast.success('Project updated successfully')
}
```

## 🔧 Component-Specific Integration

### Transaction Management
```typescript
// components/add-transaction-modal.tsx
import { db } from '@/lib/database'

const AddTransactionModal = ({ organizationId, onSuccess }) => {
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      const [accountsRes, categoriesRes] = await Promise.all([
        db.getAccounts(organizationId),
        db.getTransactionCategories(organizationId)
      ])
      
      setAccounts(accountsRes.data || [])
      setCategories(categoriesRes.data || [])
    }
    
    loadData()
  }, [organizationId])

  const handleSubmit = async (formData) => {
    const { data, error } = await db.createTransaction({
      organization_id: organizationId,
      account_id: formData.accountId,
      category_id: formData.categoryId,
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      transaction_date: formData.date,
      created_by: userId
    })

    if (!error) {
      onSuccess?.(data)
      toast.success('Transaction added successfully')
    }
  }
}
```

### Account Overview
```typescript
// components/accounts-overview.tsx
import { db } from '@/lib/database'

export function AccountsOverview() {
  const [accounts, setAccounts] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const { data: accountsData } = await db.getAccounts(organizationId)
        const { data: total } = await db.getAccountBalanceTotal(organizationId)
        
        setAccounts(accountsData || [])
        setTotalBalance(total || 0)
      } catch (error) {
        toast.error('Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [organizationId])

  if (loading) return <AccountsSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>Total Balance: ₱{totalBalance.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.map(account => (
          <div key={account.id} className="flex justify-between py-2">
            <span>{account.name}</span>
            <span>₱{account.balance.toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

### Recent Transactions
```typescript
// components/recent-transactions.tsx
import { db } from '@/lib/database'

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const loadTransactions = async () => {
      const { data } = await db.getRecentTransactions(organizationId, 10)
      setTransactions(data || [])
    }

    loadTransactions()
  }, [organizationId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex justify-between py-2">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </p>
            </div>
            <span className={`font-medium ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
```

## 🔐 Authentication Integration

### Getting User Context
```typescript
// Use Clerk for authentication
import { useUser } from '@clerk/nextjs'

const { user } = useUser()
const userId = user?.id
const userEmail = user?.emailAddresses[0]?.emailAddress

// Create/get user profile
const ensureUserProfile = async () => {
  if (!user) return null
  
  let { data: profile } = await db.getUserProfile(user.id)
  
  if (!profile) {
    // Create profile if it doesn't exist
    const { data: newProfile } = await db.createUserProfile({
      clerk_user_id: user.id,
      full_name: user.fullName,
      email: userEmail,
      avatar_url: user.imageUrl
    })
    profile = newProfile
  }
  
  return profile
}
```

### Organization Context
```typescript
// Create a context for organization data
const OrganizationContext = createContext()

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}

// Use in components
const { organizationId, organization } = useOrganization()
```

## 🚨 Error Handling

### Database Availability Check
```typescript
const handleDatabaseOperation = async () => {
  if (!db.isAvailable()) {
    toast.error('Database not configured. Please check your connection.')
    return
  }

  try {
    const { data, error } = await db.someOperation()
    
    if (error) {
      console.error('Database error:', error)
      toast.error(`Operation failed: ${error.message}`)
      return
    }
    
    // Success case
    toast.success('Operation completed successfully')
  } catch (error) {
    console.error('Unexpected error:', error)
    toast.error('An unexpected error occurred')
  }
}
```

### Graceful Degradation
```typescript
const [isOnline, setIsOnline] = useState(true)

const loadData = async () => {
  if (!db.isAvailable()) {
    setIsOnline(false)
    // Show offline UI or cached data
    return
  }

  try {
    const { data, error } = await db.getData()
    setIsOnline(true)
    // Use real data
  } catch (error) {
    setIsOnline(false)
    // Fallback to mock data or offline mode
  }
}
```

## 📊 Real-time Updates

### Supabase Realtime
```typescript
import { useEffect } from 'react'

const useRealtimeTransactions = (organizationId) => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (!organizationId || !db.isAvailable()) return

    // Subscribe to transaction changes
    const subscription = db.supabase
      .channel('transactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `organization_id=eq.${organizationId}`
        }, 
        (payload) => {
          console.log('Transaction update:', payload)
          // Update local state based on change
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new, ...prev])
          }
          // Handle UPDATE and DELETE similarly
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [organizationId])

  return transactions
}
```

## 🎯 Next Steps

1. **Set up your database schema** using the provided SQL file
2. **Update one component at a time** to use real data
3. **Test thoroughly** with database connection status monitoring
4. **Add error handling** and loading states
5. **Implement real-time updates** where needed

Your TriFi application is now ready for production with full database integration! 🚀 