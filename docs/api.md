# TriFi API Documentation

This document outlines the API structure and endpoints available in the TriFi application.

## 🏗️ API Architecture

TriFi uses a modern API architecture combining:
- **Next.js API Routes**: Server-side API endpoints
- **Clerk Authentication**: User management and authentication
- **Supabase**: Database operations and real-time subscriptions
- **tRPC**: Type-safe API layer (ready for implementation)

## 🔐 Authentication

All API endpoints require authentication through Clerk. Include the authentication token in your requests:

```typescript
// Client-side authentication
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const token = await getToken()

fetch('/api/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

## 📊 API Endpoints

### **Transactions**

#### Get Transactions
```typescript
GET /api/transactions

Query Parameters:
- limit?: number (default: 50)
- offset?: number (default: 0)
- type?: 'income' | 'expense' | 'transfer'
- status?: 'completed' | 'pending' | 'failed'
- dateFrom?: string (ISO date)
- dateTo?: string (ISO date)
- search?: string

Response:
{
  transactions: Transaction[],
  total: number,
  hasMore: boolean
}
```

#### Create Transaction
```typescript
POST /api/transactions

Body:
{
  type: 'income' | 'expense' | 'transfer',
  description: string,
  amount: number,
  date: string,
  category: string,
  account: string,
  reference?: string
}

Response:
{
  transaction: Transaction,
  success: boolean
}
```

#### Update Transaction
```typescript
PUT /api/transactions/:id

Body: Partial<Transaction>

Response:
{
  transaction: Transaction,
  success: boolean
}
```

#### Delete Transaction
```typescript
DELETE /api/transactions/:id

Response:
{
  success: boolean
}
```

### **Invoices**

#### Get Invoices
```typescript
GET /api/invoices

Query Parameters:
- status?: 'draft' | 'sent' | 'paid' | 'overdue'
- clientId?: string
- dateFrom?: string
- dateTo?: string

Response:
{
  invoices: Invoice[],
  total: number
}
```

#### Create Invoice
```typescript
POST /api/invoices

Body:
{
  clientId: string,
  items: InvoiceItem[],
  dueDate: string,
  notes?: string,
  terms?: string
}

Response:
{
  invoice: Invoice,
  success: boolean
}
```

#### Send Invoice
```typescript
POST /api/invoices/:id/send

Response:
{
  success: boolean,
  sentAt: string
}
```

### **Payments**

#### Get Payments
```typescript
GET /api/payments

Query Parameters:
- status?: 'completed' | 'pending' | 'scheduled' | 'failed'
- method?: string
- dateFrom?: string
- dateTo?: string

Response:
{
  payments: Payment[],
  total: number
}
```

#### Process Payment
```typescript
POST /api/payments

Body:
{
  amount: number,
  recipient: string,
  method: string,
  reference?: string,
  scheduledDate?: string
}

Response:
{
  payment: Payment,
  success: boolean
}
```

### **Analytics**

#### Get Financial Summary
```typescript
GET /api/analytics/summary

Query Parameters:
- period: 'week' | 'month' | 'quarter' | 'year'
- year?: number
- comparison?: boolean

Response:
{
  totalIncome: number,
  totalExpenses: number,
  netIncome: number,
  accountBalances: AccountBalance[],
  trends: TrendData[],
  comparison?: ComparisonData
}
```

#### Get Revenue Chart Data
```typescript
GET /api/analytics/revenue

Query Parameters:
- period: 'week' | 'month' | 'quarter' | 'year'
- granularity: 'day' | 'week' | 'month'

Response:
{
  data: ChartDataPoint[],
  period: string,
  total: number
}
```

### **Organization**

#### Get Organization Info
```typescript
GET /api/organization

Response:
{
  organization: Organization,
  departments: Department[],
  metrics: OrganizationMetrics
}
```

#### Update Organization
```typescript
PUT /api/organization

Body: Partial<Organization>

Response:
{
  organization: Organization,
  success: boolean
}
```

### **Projects**

#### Get Projects
```typescript
GET /api/projects

Query Parameters:
- status?: 'planning' | 'in-progress' | 'completed'
- memberId?: string

Response:
{
  projects: Project[],
  total: number
}
```

#### Create Project
```typescript
POST /api/projects

Body:
{
  name: string,
  description?: string,
  budget: number,
  startDate: string,
  endDate: string,
  teamMembers: string[],
  priority: 'low' | 'medium' | 'high'
}

Response:
{
  project: Project,
  success: boolean
}
```

### **Members**

#### Get Team Members
```typescript
GET /api/members

Response:
{
  members: Member[],
  total: number
}
```

#### Invite Member
```typescript
POST /api/members/invite

Body:
{
  email: string,
  role: string,
  department?: string
}

Response:
{
  invitation: Invitation,
  success: boolean
}
```

## 📋 Data Types

### Transaction
```typescript
interface Transaction {
  id: string
  type: 'income' | 'expense' | 'transfer'
  description: string
  amount: number
  date: string
  time: string
  status: 'completed' | 'pending' | 'failed'
  category: string
  account: string
  reference: string
  userId: string
  createdAt: string
  updatedAt: string
}
```

### Invoice
```typescript
interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  client: Client
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  terms?: string
  userId: string
  createdAt: string
  updatedAt: string
}
```

### Payment
```typescript
interface Payment {
  id: string
  amount: number
  recipient: string
  method: string
  status: 'completed' | 'pending' | 'scheduled' | 'failed'
  date: string
  reference: string
  category: string
  userId: string
  createdAt: string
  updatedAt: string
}
```

### Project
```typescript
interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'in-progress' | 'completed'
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  priority: 'low' | 'medium' | 'high'
  teamMembers: Member[]
  userId: string
  createdAt: string
  updatedAt: string
}
```

## 🔄 Real-time Updates

TriFi supports real-time updates using Supabase subscriptions:

```typescript
import { supabase } from '@/lib/supabase'

// Subscribe to transaction changes
const subscription = supabase
  .channel('transactions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'transactions',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Handle real-time updates
    console.log('Transaction updated:', payload)
  })
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## 🚨 Error Handling

All API endpoints return consistent error responses:

```typescript
// Error Response Format
{
  error: {
    code: string,
    message: string,
    details?: any
  },
  success: false
}

// Common Error Codes
- 'UNAUTHORIZED': Invalid or missing authentication
- 'FORBIDDEN': Insufficient permissions
- 'NOT_FOUND': Resource not found
- 'VALIDATION_ERROR': Invalid request data
- 'RATE_LIMIT': Too many requests
- 'SERVER_ERROR': Internal server error
```

## 📝 Request/Response Examples

### Creating a Transaction
```typescript
// Request
POST /api/transactions
{
  "type": "expense",
  "description": "Office supplies",
  "amount": 1500.00,
  "date": "2024-01-15",
  "category": "Office Expenses",
  "account": "Business Checking",
  "reference": "REF-001"
}

// Response
{
  "transaction": {
    "id": "txn_1234567890",
    "type": "expense",
    "description": "Office supplies",
    "amount": 1500.00,
    "date": "2024-01-15",
    "time": "14:30:00",
    "status": "completed",
    "category": "Office Expenses",
    "account": "Business Checking",
    "reference": "REF-001",
    "userId": "user_123",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  },
  "success": true
}
```

## 🔒 Rate Limiting

API endpoints are rate limited to ensure fair usage:

- **General endpoints**: 100 requests per minute
- **Analytics endpoints**: 50 requests per minute
- **File upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

### API Testing Tools
Use these tools to test the API:

```bash
# Using curl
curl -X GET "http://localhost:3000/api/transactions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Using httpie
http GET localhost:3000/api/transactions \
  Authorization:"Bearer YOUR_TOKEN"
```

### Test Data
Development endpoints for creating test data:

```typescript
POST /api/dev/seed-data  // Creates sample data (dev only)
DELETE /api/dev/reset    // Clears all data (dev only)
```

## 📖 Additional Resources

- [Clerk API Documentation](https://clerk.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [tRPC Documentation](https://trpc.io/docs)

---

For more detailed examples and advanced usage, see the [Component Library](components.md) documentation. 