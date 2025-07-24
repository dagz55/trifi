-- Additional Tables Migration
-- Creates missing tables for full application functionality

-- Payment Methods (for managing payment options)
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- bank_account, credit_card, digital_wallet, crypto
    provider TEXT, -- Stripe, PayPal, Bank Name, etc.
    account_details JSONB DEFAULT '{}', -- encrypted account details
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Attachments (for document management)
CREATE TABLE IF NOT EXISTS public.file_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'supabase', -- supabase, aws, gcp, etc.
    related_table TEXT, -- invoices, projects, transactions, etc.
    related_id UUID, -- foreign key to related record
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Export Jobs (to track data export operations)
CREATE TABLE IF NOT EXISTS public.export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    export_type TEXT NOT NULL, -- invoices, transactions, payments, full_data
    filters JSONB DEFAULT '{}', -- date ranges, categories, etc.
    format TEXT DEFAULT 'csv', -- csv, xlsx, pdf, json
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    file_url TEXT, -- URL to download the export
    file_size BIGINT,
    progress_percentage INTEGER DEFAULT 0,
    error_message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE, -- when the file expires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions (for session management and security)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    location TEXT, -- derived from IP
    device_type TEXT, -- mobile, desktop, tablet
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys (for API access management)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL, -- hashed API key
    permissions JSONB DEFAULT '{}', -- specific API permissions
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences (extended settings)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}', -- dashboard layout, notification settings, etc.
    dashboard_widgets JSONB DEFAULT '[]', -- widget configuration
    notification_settings JSONB DEFAULT '{}', -- email, push, in-app settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- System Settings (for application-wide settings)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type TEXT DEFAULT 'json', -- json, string, number, boolean
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- can non-admin users see this?
    updated_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, setting_key)
);

-- Recurring Transactions (for automated transactions)
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES transaction_categories(id),
    type TEXT NOT NULL, -- income, expense
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL, -- daily, weekly, monthly, quarterly, yearly
    frequency_value INTEGER DEFAULT 1, -- every X days/weeks/months
    start_date DATE NOT NULL,
    end_date DATE, -- optional end date
    next_execution DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_execute BOOLEAN DEFAULT false, -- if true, creates transactions automatically
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction Templates (for quick transaction creation)
CREATE TABLE IF NOT EXISTS public.transaction_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    account_id UUID REFERENCES accounts(id),
    category_id UUID REFERENCES transaction_categories(id),
    type TEXT NOT NULL, -- income, expense, transfer
    amount DECIMAL(15,2),
    description TEXT,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Reports (for saved reports)
CREATE TABLE IF NOT EXISTS public.financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    report_type TEXT NOT NULL, -- profit_loss, balance_sheet, cash_flow, custom
    parameters JSONB DEFAULT '{}', -- date ranges, accounts, categories
    schedule TEXT, -- daily, weekly, monthly, or null for one-time
    is_active BOOLEAN DEFAULT true,
    last_generated TIMESTAMP WITH TIME ZONE,
    next_generation TIMESTAMP WITH TIME ZONE,
    email_recipients TEXT[], -- email addresses to send to
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_organization_id ON public.payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON public.payment_methods(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_file_attachments_organization_id ON public.file_attachments(organization_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_related ON public.file_attachments(related_table, related_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_organization_id ON public.export_jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_user_id ON public.export_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status ON public.export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON public.api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public.api_keys(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_org ON public.user_preferences(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_org_key ON public.system_settings(organization_id, setting_key);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_org_active ON public.recurring_transactions(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_exec ON public.recurring_transactions(next_execution, is_active);
CREATE INDEX IF NOT EXISTS idx_transaction_templates_organization_id ON public.transaction_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_transaction_templates_favorite ON public.transaction_templates(organization_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_financial_reports_organization_id ON public.financial_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_financial_reports_schedule ON public.financial_reports(organization_id, schedule, is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic for now - customize based on your auth needs)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Allow payment method access') THEN
        CREATE POLICY "Allow payment method access" ON public.payment_methods FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_attachments' AND policyname = 'Allow file attachment access') THEN
        CREATE POLICY "Allow file attachment access" ON public.file_attachments FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'export_jobs' AND policyname = 'Allow export job access') THEN
        CREATE POLICY "Allow export job access" ON public.export_jobs FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_sessions' AND policyname = 'Allow user session access') THEN
        CREATE POLICY "Allow user session access" ON public.user_sessions FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'api_keys' AND policyname = 'Allow API key access') THEN
        CREATE POLICY "Allow API key access" ON public.api_keys FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Allow user preferences access') THEN
        CREATE POLICY "Allow user preferences access" ON public.user_preferences FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Allow system settings access') THEN
        CREATE POLICY "Allow system settings access" ON public.system_settings FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recurring_transactions' AND policyname = 'Allow recurring transaction access') THEN
        CREATE POLICY "Allow recurring transaction access" ON public.recurring_transactions FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transaction_templates' AND policyname = 'Allow transaction template access') THEN
        CREATE POLICY "Allow transaction template access" ON public.transaction_templates FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_reports' AND policyname = 'Allow financial report access') THEN
        CREATE POLICY "Allow financial report access" ON public.financial_reports FOR ALL USING (true);
    END IF;
END
$$;

-- Add updated_at triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payment_methods_updated_at') THEN
        CREATE TRIGGER update_payment_methods_updated_at 
        BEFORE UPDATE ON public.payment_methods 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_export_jobs_updated_at') THEN
        CREATE TRIGGER update_export_jobs_updated_at 
        BEFORE UPDATE ON public.export_jobs 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_api_keys_updated_at') THEN
        CREATE TRIGGER update_api_keys_updated_at 
        BEFORE UPDATE ON public.api_keys 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_preferences_updated_at') THEN
        CREATE TRIGGER update_user_preferences_updated_at 
        BEFORE UPDATE ON public.user_preferences 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_system_settings_updated_at') THEN
        CREATE TRIGGER update_system_settings_updated_at 
        BEFORE UPDATE ON public.system_settings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_recurring_transactions_updated_at') THEN
        CREATE TRIGGER update_recurring_transactions_updated_at 
        BEFORE UPDATE ON public.recurring_transactions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_transaction_templates_updated_at') THEN
        CREATE TRIGGER update_transaction_templates_updated_at 
        BEFORE UPDATE ON public.transaction_templates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_financial_reports_updated_at') THEN
        CREATE TRIGGER update_financial_reports_updated_at 
        BEFORE UPDATE ON public.financial_reports 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Insert default payment methods for existing organizations
INSERT INTO public.payment_methods (organization_id, name, type, provider, is_default) 
SELECT 
    id as organization_id,
    'Bank Transfer' as name,
    'bank_account' as type,
    'Manual Bank Transfer' as provider,
    true as is_default
FROM public.organizations
WHERE NOT EXISTS (
    SELECT 1 FROM public.payment_methods 
    WHERE organization_id = organizations.id 
    AND name = 'Bank Transfer' 
    AND type = 'bank_account'
);

-- Insert default system settings for existing organizations
INSERT INTO public.system_settings (organization_id, setting_key, setting_value, description, is_public) 
SELECT 
    id as organization_id,
    'default_currency' as setting_key,
    '"PHP"'::jsonb as setting_value,
    'Default currency for transactions and reports' as description,
    true as is_public
FROM public.organizations
WHERE NOT EXISTS (
    SELECT 1 FROM public.system_settings 
    WHERE organization_id = organizations.id 
    AND setting_key = 'default_currency'
);

INSERT INTO public.system_settings (organization_id, setting_key, setting_value, description, is_public) 
SELECT 
    id as organization_id,
    'tax_rate' as setting_key,
    '12'::jsonb as setting_value,
    'Default tax rate percentage' as description,
    true as is_public
FROM public.organizations
WHERE NOT EXISTS (
    SELECT 1 FROM public.system_settings 
    WHERE organization_id = organizations.id 
    AND setting_key = 'tax_rate'
);

INSERT INTO public.system_settings (organization_id, setting_key, setting_value, description, is_public) 
SELECT 
    id as organization_id,
    'fiscal_year_start' as setting_key,
    '"01-01"'::jsonb as setting_value,
    'Fiscal year start date (MM-DD)' as description,
    true as is_public
FROM public.organizations
WHERE NOT EXISTS (
    SELECT 1 FROM public.system_settings 
    WHERE organization_id = organizations.id 
    AND setting_key = 'fiscal_year_start'
);

-- Create function to generate next execution date for recurring transactions
CREATE OR REPLACE FUNCTION calculate_next_execution_date(
    input_date DATE,
    frequency TEXT,
    frequency_value INTEGER
) RETURNS DATE AS $$
BEGIN
    CASE frequency
        WHEN 'daily' THEN
            RETURN input_date + (frequency_value || ' days')::INTERVAL;
        WHEN 'weekly' THEN
            RETURN input_date + (frequency_value || ' weeks')::INTERVAL;
        WHEN 'monthly' THEN
            RETURN input_date + (frequency_value || ' months')::INTERVAL;
        WHEN 'quarterly' THEN
            RETURN input_date + (frequency_value * 3 || ' months')::INTERVAL;
        WHEN 'yearly' THEN
            RETURN input_date + (frequency_value || ' years')::INTERVAL;
        ELSE
            RETURN input_date + INTERVAL '1 month'; -- default to monthly
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create function to process recurring transactions
CREATE OR REPLACE FUNCTION process_recurring_transactions()
RETURNS INTEGER AS $$
DECLARE
    recurring_rec RECORD;
    transaction_id UUID;
    processed_count INTEGER := 0;
BEGIN
    -- Loop through all active recurring transactions that are due
    FOR recurring_rec IN 
        SELECT * FROM public.recurring_transactions 
        WHERE is_active = true 
        AND auto_execute = true 
        AND next_execution <= CURRENT_DATE
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    LOOP
        -- Create the transaction
        INSERT INTO public.transactions (
            organization_id,
            account_id,
            category_id,
            type,
            amount,
            description,
            transaction_date,
            status,
            created_by
        ) VALUES (
            recurring_rec.organization_id,
            recurring_rec.account_id,
            recurring_rec.category_id,
            recurring_rec.type,
            recurring_rec.amount,
            recurring_rec.description || ' (Recurring)',
            CURRENT_DATE,
            'completed',
            recurring_rec.created_by
        ) RETURNING id INTO transaction_id;

        -- Update the next execution date
        UPDATE public.recurring_transactions
        SET next_execution = calculate_next_execution_date(
            next_execution, 
            frequency, 
            frequency_value
        )
        WHERE id = recurring_rec.id;

        processed_count := processed_count + 1;
    END LOOP;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;