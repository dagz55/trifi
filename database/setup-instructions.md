# TriFi Database Setup Instructions

## Overview
This guide will help you set up the complete database schema for the TriFi financial management system in Supabase.

## Prerequisites
- Supabase account and project created
- Database connection working (verified via dashboard)
- Admin access to Supabase SQL Editor

## 📋 Setup Steps

### 1. Access Supabase SQL Editor
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your TriFi project
3. Navigate to **SQL Editor** in the left sidebar

### 2. Run the Schema Script
1. Copy the entire contents of `database/schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

⚠️ **Note**: If you previously encountered a permission denied error with `app.jwt_secret`, this has been fixed in the updated schema.

### 3. Verify Installation
After running the script, you should see these tables created:

#### Core Tables:
- ✅ `user_profiles` - User profile data (extends Clerk auth)
- ✅ `organizations` - Companies/businesses
- ✅ `organization_members` - Team membership
- ✅ `departments` - Organizational structure

#### Financial Tables:
- ✅ `account_types` - Types of financial accounts
- ✅ `accounts` - Bank accounts, credit cards, etc.
- ✅ `transaction_categories` - Income/expense categories  
- ✅ `transactions` - Financial transactions
- ✅ `budget_goals` - Savings and budget goals

#### Business Tables:
- ✅ `projects` - Business projects
- ✅ `project_members` - Project team members
- ✅ `invoices` - Client invoicing
- ✅ `invoice_items` - Invoice line items
- ✅ `payments` - Payment records

#### Additional Tables:
- ✅ `meetings` - Meeting management
- ✅ `meeting_attendees` - Meeting participants
- ✅ `investments` - Investment tracking
- ✅ `notifications` - System notifications
- ✅ `audit_logs` - Activity logging

### 4. Default Data Verification
The script automatically inserts default data:

#### Account Types:
- Checking Account
- Savings Account  
- Credit Card
- Investment Account
- Cash
- Cryptocurrency
- Loan Account

#### Transaction Categories:
**Income:**
- Salary, Freelance, Investment Returns, Sales Revenue, Other Income

**Expenses:**
- Office Supplies, Marketing, Travel, Utilities, Software, Meals & Entertainment, Professional Services, Equipment, Insurance, Taxes, Other Expenses

## 🔐 Security Features

### Row Level Security (RLS)
The schema includes RLS policies that are currently **permissive** to get you started quickly:
- All users can access all data (for now)
- This allows you to test functionality immediately
- **Important**: You should customize these policies based on your authentication needs

### Recommended Security Customization
Once your app is working, update the RLS policies to be more restrictive:

```sql
-- Example: Restrict user profiles to own data
DROP POLICY "Users can manage own profile" ON public.user_profiles;
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Example: Restrict organizations to members only
DROP POLICY "Allow organization access" ON public.organizations;
CREATE POLICY "Allow organization access" ON public.organizations
    FOR ALL USING (
        id IN (
            SELECT organization_id 
            FROM public.organization_members 
            WHERE user_id = (
                SELECT id FROM public.user_profiles 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );
```

### Data Protection
- All sensitive tables have RLS enabled
- Audit logging for data changes
- Automatic timestamps for all records

## 🚀 Next Steps

### 1. Test Database Connection
Visit your TriFi dashboard and verify the Database Connection Status shows "Connected".

### 2. Seed Sample Data (Optional)
You can add sample data for testing:

```sql
-- Create a sample organization
INSERT INTO organizations (name, description, industry) 
VALUES ('Sample Company', 'A demo organization for testing', 'Technology');

-- Add more sample data as needed
```

### 3. Configure API Endpoints
The database is now ready for your application to:
- Create and manage transactions
- Track projects and invoices
- Manage team members
- Store financial data

## 📊 Database Schema Overview

```
user_profiles (Clerk integration)
├── organizations (Companies)
│   ├── organization_members (Team)
│   ├── departments (Structure)
│   ├── accounts (Financial accounts)
│   │   └── transactions (Financial data)
│   ├── projects (Business projects)
│   │   ├── project_members
│   │   └── invoices (Billing)
│   │       └── invoice_items
│   ├── payments (Payment tracking)
│   ├── meetings (Meeting management)
│   ├── investments (Investment tracking)
│   └── notifications (System alerts)
```

## 🛠️ Troubleshooting

### Common Issues:

**Error: "uuid-ossp extension not found"**
- Enable the UUID extension in Supabase Extensions tab

**Error: "permission denied to set parameter"**
- ✅ **Fixed**: This error has been resolved in the updated schema

**RLS Policy Issues**
- The current policies are permissive (allow all) for easier setup
- Customize them once your authentication is working
- Test with actual user sessions after customization

### Verification Queries:

```sql
-- Check if all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify default account types
SELECT * FROM account_types;

-- Check transaction categories
SELECT * FROM transaction_categories ORDER BY type, name;

-- Test basic functionality
SELECT 'Database setup successful!' as status;
```

## 📝 Notes

- **Currency**: Default set to PHP (Philippine Peso)
- **Timezone**: Default set to UTC+8 (Philippines)
- **UUIDs**: All primary keys use UUID v4
- **Timestamps**: Automatic created_at and updated_at fields
- **JSON Fields**: Used for flexible data like addresses and metadata
- **Security**: RLS policies are permissive initially - customize as needed

## 🔄 Updates and Migrations

When you need to modify the schema:
1. Always backup your data first
2. Test changes on a development database
3. Use Supabase migrations for production changes
4. Update the schema.sql file for future deployments

## 🎯 Security Recommendations

1. **Customize RLS Policies**: Update the permissive policies once your auth is working
2. **Enable Audit Logging**: Use the audit_logs table for compliance
3. **Regular Backups**: Set up automated backups in Supabase
4. **Monitor Access**: Review database logs regularly

Your TriFi database is now ready for full financial management functionality! 🎉 