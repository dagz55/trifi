# 🗄️ TriFi Database Setup - Complete Guide

## 🎯 Overview

This guide provides everything you need to set up a complete database backend for your TriFi financial management application. After following this guide, all your buttons and forms will save real data to Supabase instead of showing demo data.

## 📋 What You'll Get

### ✅ **Complete Database Schema**
- **User Profiles** - Extends Clerk authentication
- **Organizations** - Multi-tenant company structure  
- **Financial Accounts** - Bank accounts, credit cards, investments
- **Transactions** - Income, expenses, and transfers
- **Projects** - Business project management
- **Invoices & Payments** - Billing and payment tracking
- **Meetings** - Meeting management and scheduling
- **Investments** - Investment opportunity tracking
- **Analytics & Reporting** - Built-in financial summaries

### ✅ **Functional Components**
All your existing buttons will actually work:
- ➕ **Add Transaction** - Saves to `transactions` table
- 🏢 **Create Organization** - Saves to `organizations` table
- 💳 **Add Account** - Saves to `accounts` table
- 📋 **Create Project** - Saves to `projects` table
- 🧾 **Generate Invoice** - Saves to `invoices` table
- 💰 **Record Payment** - Saves to `payments` table
- 📅 **Schedule Meeting** - Saves to `meetings` table
- 📊 **Dashboard Analytics** - Real data from database

### ✅ **Security Features**
- 🔐 **Row Level Security (RLS)** - Users only see their data
- 🛡️ **Organization Isolation** - Multi-tenant security
- 📝 **Audit Logging** - Track all data changes
- 🔒 **Clerk Integration** - Seamless authentication

## 🚀 Quick Start (5 Steps)

### Step 1: Verify Database Connection
Make sure your database connection is working:
1. Check your `.env.local` file has Supabase keys
2. Visit your TriFi dashboard
3. Confirm **Database Connection Status** shows "🟢 Connected"

### Step 2: Run Database Schema
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Copy the entire contents of [`database/schema.sql`](database/schema.sql)
3. Paste and click **Run**
4. Wait for "Success. No rows returned" message

### Step 3: Verify Installation
Check that tables were created successfully:
```sql
-- Run this in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- ✅ `account_types`, `accounts`
- ✅ `audit_logs`, `budget_goals`
- ✅ `departments`, `investments`
- ✅ `invoice_items`, `invoices`
- ✅ `meeting_attendees`, `meetings`
- ✅ `notifications`, `organization_members`
- ✅ `organizations`, `payments`
- ✅ `project_members`, `projects`
- ✅ `transaction_categories`, `transactions`
- ✅ `user_profiles`

### Step 4: Test Database Integration
The database service is ready to use:
```typescript
import { db } from '@/lib/database'

// Test if database is available
if (db.isAvailable()) {
  console.log('✅ Database ready!')
} else {
  console.log('❌ Database not configured')
}
```

### Step 5: Update Your Components
Follow the [Database Integration Guide](docs/database-integration.md) to connect your buttons to real data.

## 📊 Database Schema Overview

```
👤 user_profiles (Clerk integration)
├── 🏢 organizations (Companies)
│   ├── 👥 organization_members (Team)
│   ├── 🏗️ departments (Structure)
│   ├── 💳 accounts (Financial accounts)
│   │   └── 💸 transactions (Financial data)
│   ├── 📋 projects (Business projects)
│   │   ├── 👥 project_members
│   │   └── 🧾 invoices (Billing)
│   │       └── 📝 invoice_items
│   ├── 💰 payments (Payment tracking)
│   ├── 📅 meetings (Meeting management)
│   ├── 📈 investments (Investment tracking)
│   └── 🔔 notifications (System alerts)
```

## 💡 Key Features

### 🌐 **Multi-Tenant Architecture**
- Each organization has isolated data
- Users can belong to multiple organizations
- Role-based permissions (owner, admin, member, viewer)

### 💰 **Philippine Peso Support**
- Default currency set to PHP (₱)
- All financial calculations in Philippine Peso
- Timezone set to UTC+8 (Philippines time)

### 📱 **Real-time Updates**
- Live transaction updates
- Real-time balance changes
- Instant notifications

### 🔍 **Advanced Analytics**
Built-in queries for:
- Account balance totals
- Income vs expense summaries
- Project budget tracking
- Investment performance
- Financial reporting

## 🛠️ File Structure

```
database/
├── schema.sql                 # Complete database schema
└── setup-instructions.md      # Detailed setup guide

lib/
├── database.ts               # Database service with all CRUD operations
└── supabase.ts              # Supabase client configuration

docs/
└── database-integration.md   # Component integration guide

README-DATABASE.md            # This file
```

## 🔧 Using the Database Service

### Import and Use
```typescript
import { db } from '@/lib/database'

// Create a transaction
const { data, error } = await db.createTransaction({
  organization_id: 'org-id',
  account_id: 'account-id',
  type: 'expense',
  amount: 1500.00,
  description: 'Office supplies',
  transaction_date: '2025-01-20'
})

// Get recent transactions
const { data: transactions } = await db.getRecentTransactions('org-id', 10)

// Get account balance total
const { data: total } = await db.getAccountBalanceTotal('org-id')
```

### Available Operations
- **User Profiles**: Create, read, update user data
- **Organizations**: Create, read, update organizations
- **Accounts**: Create, read, update financial accounts
- **Transactions**: Create, read transaction records
- **Projects**: Create, read, update business projects
- **Invoices**: Create, read, update invoicing
- **Payments**: Create, read payment records
- **Meetings**: Create, read, update meetings
- **Analytics**: Get financial summaries and totals

## 🎨 Default Data Included

### Account Types
- Checking Account, Savings Account
- Credit Card, Investment Account
- Cash, Cryptocurrency, Loan Account

### Transaction Categories
**Income:**
- Salary, Freelance, Investment Returns, Sales Revenue

**Expenses:**
- Office Supplies, Marketing, Travel, Utilities, Software
- Meals & Entertainment, Professional Services, Equipment
- Insurance, Taxes

## 🔐 Security & Permissions

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users only see their own data
- Organization data is isolated between companies
- Role-based access within organizations

### Data Protection
- Automatic audit logging for all changes
- Encrypted connections to database
- No sensitive data exposed in client code

## 🌟 Sample Usage Examples

### Dashboard Data Loading
```typescript
const loadDashboardData = async () => {
  const [accounts, transactions, meetings] = await Promise.all([
    db.getAccounts(organizationId),
    db.getRecentTransactions(organizationId, 10),
    db.getUpcomingMeetings(organizationId, 5)
  ])
  
  setDashboardData({ accounts, transactions, meetings })
}
```

### Add Transaction Form
```typescript
const handleAddTransaction = async (formData) => {
  const { data, error } = await db.createTransaction({
    organization_id: organizationId,
    account_id: formData.accountId,
    type: formData.type,
    amount: parseFloat(formData.amount),
    description: formData.description,
    transaction_date: formData.date,
    created_by: userId
  })
  
  if (!error) {
    toast.success('Transaction added successfully!')
    refreshTransactions()
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**"Database not configured" error**
- Check `.env.local` has correct Supabase keys
- Verify database connection status on dashboard

**"Permission denied" errors**
- Ensure RLS policies are correctly configured
- Check user authentication with Clerk

**Tables not found**
- Re-run the `database/schema.sql` script
- Check Supabase project is active

### Getting Help

1. **Check Database Connection Status** on your dashboard
2. **Review setup instructions** in `database/setup-instructions.md`
3. **Follow integration guide** in `docs/database-integration.md`
4. **Test with simple operations** first before complex queries

## 🎉 You're Ready!

Your TriFi application now has:
- ✅ **Complete database backend**
- ✅ **All tables and relationships**
- ✅ **Security and permissions**
- ✅ **Database service functions**
- ✅ **Integration examples**
- ✅ **Real-time capabilities**

Start by updating one component at a time to use real database operations instead of mock data. Your financial management system is now enterprise-ready! 🚀

---

**Next Steps:**
1. Follow the [Database Integration Guide](docs/database-integration.md)
2. Update your components to use `db.*` functions
3. Test all functionality with real data
4. Add more custom features as needed

Happy coding! 💻✨ 