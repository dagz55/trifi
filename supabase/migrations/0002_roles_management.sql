-- Add Role Management Tables
-- This migration adds comprehensive role management functionality

-- Custom Roles Table
CREATE TABLE public.custom_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    is_system BOOLEAN DEFAULT false, -- true for built-in roles like admin, member
    color TEXT DEFAULT 'bg-blue-100 text-blue-800',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, name) -- Prevent duplicate role names within organization
);

-- User Role Assignments (extends organization_members)
-- We'll add a custom_role_id to link to our new custom roles
ALTER TABLE public.organization_members 
ADD COLUMN custom_role_id UUID REFERENCES custom_roles(id);

-- Create indexes for better performance
CREATE INDEX idx_custom_roles_organization_id ON public.custom_roles(organization_id);
CREATE INDEX idx_custom_roles_name ON public.custom_roles(organization_id, name);
CREATE INDEX idx_organization_members_custom_role ON public.organization_members(custom_role_id);

-- Enable RLS for custom_roles
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for custom roles
CREATE POLICY "Allow custom role access" ON public.custom_roles
    FOR ALL USING (true); -- Customize based on your auth needs

-- Insert default custom roles for organizations
INSERT INTO public.custom_roles (organization_id, name, description, permissions, is_system, color) 
SELECT 
    id as organization_id,
    'Admin' as name,
    'Full access to all features and settings' as description,
    '{"dashboard":{"read":true,"write":true,"delete":true},"analytics":{"read":true,"write":true,"delete":true},"projects":{"read":true,"write":true,"delete":true},"finances":{"read":true,"write":true,"delete":true},"settings":{"read":true,"write":true,"delete":true}}' as permissions,
    true as is_system,
    'bg-red-100 text-red-800' as color
FROM public.organizations;

INSERT INTO public.custom_roles (organization_id, name, description, permissions, is_system, color) 
SELECT 
    id as organization_id,
    'Manager' as name,
    'Manage projects and view financial data' as description,
    '{"dashboard":{"read":true,"write":true,"delete":false},"analytics":{"read":true,"write":false,"delete":false},"projects":{"read":true,"write":true,"delete":true},"finances":{"read":true,"write":true,"delete":false},"settings":{"read":true,"write":false,"delete":false}}' as permissions,
    true as is_system,
    'bg-blue-100 text-blue-800' as color
FROM public.organizations;

INSERT INTO public.custom_roles (organization_id, name, description, permissions, is_system, color) 
SELECT 
    id as organization_id,
    'Member' as name,
    'Basic access to assigned projects' as description,
    '{"dashboard":{"read":true,"write":false,"delete":false},"analytics":{"read":false,"write":false,"delete":false},"projects":{"read":true,"write":true,"delete":false},"finances":{"read":false,"write":false,"delete":false},"settings":{"read":false,"write":false,"delete":false}}' as permissions,
    true as is_system,
    'bg-green-100 text-green-800' as color
FROM public.organizations;

INSERT INTO public.custom_roles (organization_id, name, description, permissions, is_system, color) 
SELECT 
    id as organization_id,
    'Viewer' as name,
    'Read-only access to basic features' as description,
    '{"dashboard":{"read":true,"write":false,"delete":false},"analytics":{"read":false,"write":false,"delete":false},"projects":{"read":true,"write":false,"delete":false},"finances":{"read":false,"write":false,"delete":false},"settings":{"read":false,"write":false,"delete":false}}' as permissions,
    true as is_system,
    'bg-gray-100 text-gray-800' as color
FROM public.organizations;

-- Add trigger for updated_at
CREATE TRIGGER update_custom_roles_updated_at 
    BEFORE UPDATE ON public.custom_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add audit trigger for role changes
CREATE OR REPLACE FUNCTION audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        organization_id,
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        COALESCE(NEW.organization_id, OLD.organization_id),
        NEW.created_by,
        TG_OP,
        'custom_roles',
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_roles_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.custom_roles
    FOR EACH ROW EXECUTE FUNCTION audit_role_changes();