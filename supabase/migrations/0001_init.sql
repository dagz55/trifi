-- TriFi Database Schema
-- Comprehensive schema for financial management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Profile (extends Clerk authentication)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC+8',
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'PHP',
    date_format TEXT DEFAULT 'mm-dd-yyyy',
    theme TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations/Companies
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    logo_url TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address JSONB,
    tax_id TEXT,
    currency TEXT DEFAULT 'PHP',
    timezone TEXT DEFAULT 'UTC+8',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization Members
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
    department TEXT,
    position TEXT,
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Departments
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    head_user_id UUID REFERENCES user_profiles(id),
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account Types (Bank, Credit Card, Investment, etc.)
CREATE TABLE public.account_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- bank, credit_card, investment, cash, crypto
    description TEXT,
    icon TEXT
);

-- Financial Accounts
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    account_type_id UUID REFERENCES account_types(id),
    name TEXT NOT NULL,
    account_number TEXT,
    bank_name TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    currency TEXT DEFAULT 'PHP',
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction Categories
CREATE TABLE public.transaction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- income, expense, transfer
    color TEXT DEFAULT '#3B82F6',
    icon TEXT,
    parent_category_id UUID REFERENCES transaction_categories(id),
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES transaction_categories(id),
    type TEXT NOT NULL, -- income, expense, transfer
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_number TEXT,
    transaction_date DATE NOT NULL,
    status TEXT DEFAULT 'completed', -- pending, completed, cancelled
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active', -- active, completed, on_hold, cancelled
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    project_manager_id UUID REFERENCES user_profiles(id),
    department_id UUID REFERENCES departments(id),
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Members
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- manager, member, viewer
    hourly_rate DECIMAL(10,2),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address JSONB,
    subtotal DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'PHP',
    status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    notes TEXT,
    terms TEXT,
    project_id UUID REFERENCES projects(id),
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id),
    account_id UUID REFERENCES accounts(id),
    amount DECIMAL(15,2) NOT NULL,
    payment_method TEXT, -- bank_transfer, credit_card, cash, check, etc.
    reference_number TEXT,
    payment_date DATE NOT NULL,
    status TEXT DEFAULT 'completed', -- pending, completed, failed
    notes TEXT,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Goals/Savings Goals
CREATE TABLE public.budget_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    target_date DATE,
    category_id UUID REFERENCES transaction_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings
CREATE TABLE public.meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    meeting_url TEXT,
    type TEXT DEFAULT 'general', -- general, project, financial, board
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
    project_id UUID REFERENCES projects(id),
    organizer_id UUID REFERENCES user_profiles(id),
    agenda JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting Attendees
CREATE TABLE public.meeting_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'invited', -- invited, accepted, declined, attended
    response_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(meeting_id, user_id)
);

-- Investment Opportunities
CREATE TABLE public.investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- stocks, bonds, real_estate, crypto, business
    description TEXT,
    initial_investment DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2),
    expected_return DECIMAL(5,2), -- percentage
    risk_level TEXT DEFAULT 'medium', -- low, medium, high
    investment_date DATE NOT NULL,
    maturity_date DATE,
    status TEXT DEFAULT 'active', -- active, sold, matured
    account_id UUID REFERENCES accounts(id),
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, warning, error, success
    category TEXT, -- transaction, invoice, payment, meeting, system
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default account types
INSERT INTO public.account_types (name, category, description, icon) VALUES
('Checking Account', 'bank', 'Regular checking account', 'CreditCard'),
('Savings Account', 'bank', 'Savings account', 'PiggyBank'),
('Credit Card', 'credit_card', 'Credit card account', 'CreditCard'),
('Investment Account', 'investment', 'Investment portfolio', 'TrendingUp'),
('Cash', 'cash', 'Physical cash', 'Banknote'),
('Cryptocurrency', 'crypto', 'Digital currency', 'Bitcoin'),
('Loan Account', 'loan', 'Loan or mortgage', 'Receipt');

-- Insert default transaction categories
INSERT INTO public.transaction_categories (name, type, color, icon, is_system) VALUES
-- Income categories
('Salary', 'income', '#10B981', 'Briefcase', true),
('Freelance', 'income', '#10B981', 'Code', true),
('Investment Returns', 'income', '#10B981', 'TrendingUp', true),
('Sales Revenue', 'income', '#10B981', 'ShoppingCart', true),
('Other Income', 'income', '#10B981', 'Plus', true),

-- Expense categories
('Office Supplies', 'expense', '#EF4444', 'Package', true),
('Marketing', 'expense', '#EF4444', 'Megaphone', true),
('Travel', 'expense', '#EF4444', 'Plane', true),
('Utilities', 'expense', '#EF4444', 'Zap', true),
('Software', 'expense', '#EF4444', 'Monitor', true),
('Meals & Entertainment', 'expense', '#EF4444', 'Coffee', true),
('Professional Services', 'expense', '#EF4444', 'Users', true),
('Equipment', 'expense', '#EF4444', 'HardDrive', true),
('Insurance', 'expense', '#EF4444', 'Shield', true),
('Taxes', 'expense', '#EF4444', 'Receipt', true),
('Other Expenses', 'expense', '#EF4444', 'Minus', true);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_clerk_user_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_organizations_created_by ON public.organizations(created_by);
CREATE INDEX idx_organization_members_org_user ON public.organization_members(organization_id, user_id);
CREATE INDEX idx_accounts_organization_id ON public.accounts(organization_id);
CREATE INDEX idx_transactions_organization_id ON public.transactions(organization_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_projects_organization_id ON public.projects(organization_id);
CREATE INDEX idx_invoices_organization_id ON public.invoices(organization_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_payments_organization_id ON public.payments(organization_id);
CREATE INDEX idx_meetings_organization_id ON public.meetings(organization_id);
CREATE INDEX idx_meetings_date ON public.meetings(meeting_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
-- Note: These are basic policies - you may need to customize them based on your auth setup

-- Users can view and edit their own profile
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (true); -- Allow all for now - customize based on your auth

-- Allow read access to account types and transaction categories (system data)
CREATE POLICY "Allow read access to account types" ON public.account_types
    FOR SELECT USING (true);

CREATE POLICY "Allow read access to system transaction categories" ON public.transaction_categories
    FOR SELECT USING (is_system = true);

-- Organizations - allow all for now (customize based on your auth needs)
CREATE POLICY "Allow organization access" ON public.organizations
    FOR ALL USING (true);

CREATE POLICY "Allow organization member access" ON public.organization_members
    FOR ALL USING (true);

-- Financial data - allow all for now (customize based on your auth needs)
CREATE POLICY "Allow account access" ON public.accounts
    FOR ALL USING (true);

CREATE POLICY "Allow transaction access" ON public.transactions
    FOR ALL USING (true);

CREATE POLICY "Allow project access" ON public.projects
    FOR ALL USING (true);

CREATE POLICY "Allow invoice access" ON public.invoices
    FOR ALL USING (true);

CREATE POLICY "Allow payment access" ON public.payments
    FOR ALL USING (true);

CREATE POLICY "Allow meeting access" ON public.meetings
    FOR ALL USING (true);

CREATE POLICY "Allow investment access" ON public.investments
    FOR ALL USING (true);

CREATE POLICY "Allow notification access" ON public.notifications
    FOR ALL USING (true);

CREATE POLICY "Allow budget goal access" ON public.budget_goals
    FOR ALL USING (true);

CREATE POLICY "Allow department access" ON public.departments
    FOR ALL USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_goals_updated_at BEFORE UPDATE ON public.budget_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 