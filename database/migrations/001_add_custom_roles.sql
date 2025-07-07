-- Add custom roles table and update organization_members
-- This migration adds the custom roles system that's referenced in the codebase

-- Custom Roles Table
CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    is_system BOOLEAN DEFAULT false,
    color TEXT DEFAULT '#3B82F6',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, name)
);

-- Add custom_role_id to organization_members
ALTER TABLE public.organization_members 
ADD COLUMN IF NOT EXISTS custom_role_id UUID REFERENCES custom_roles(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_custom_roles_organization ON custom_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_custom_role ON organization_members(custom_role_id);

-- Insert default system roles
INSERT INTO public.custom_roles (name, description, permissions, is_system, color) 
VALUES 
    ('Owner', 'Organization owner with full access', 
     '{"dashboard": {"read": true, "write": true, "delete": true}, "analytics": {"read": true, "write": true, "delete": true}, "projects": {"read": true, "write": true, "delete": true}, "finances": {"read": true, "write": true, "delete": true}, "settings": {"read": true, "write": true, "delete": true}}', 
     true, '#EF4444'),
    ('Admin', 'Administrator with most permissions', 
     '{"dashboard": {"read": true, "write": true, "delete": false}, "analytics": {"read": true, "write": true, "delete": false}, "projects": {"read": true, "write": true, "delete": true}, "finances": {"read": true, "write": true, "delete": false}, "settings": {"read": true, "write": false, "delete": false}}', 
     true, '#F59E0B'),
    ('Manager', 'Manager with read/write access to most features', 
     '{"dashboard": {"read": true, "write": true, "delete": false}, "analytics": {"read": true, "write": false, "delete": false}, "projects": {"read": true, "write": true, "delete": false}, "finances": {"read": true, "write": false, "delete": false}, "settings": {"read": false, "write": false, "delete": false}}', 
     true, '#3B82F6'),
    ('Member', 'Basic member with limited access', 
     '{"dashboard": {"read": true, "write": false, "delete": false}, "analytics": {"read": true, "write": false, "delete": false}, "projects": {"read": true, "write": false, "delete": false}, "finances": {"read": false, "write": false, "delete": false}, "settings": {"read": false, "write": false, "delete": false}}', 
     true, '#10B981'),
    ('Viewer', 'View-only access to basic features', 
     '{"dashboard": {"read": true, "write": false, "delete": false}, "analytics": {"read": false, "write": false, "delete": false}, "projects": {"read": true, "write": false, "delete": false}, "finances": {"read": false, "write": false, "delete": false}, "settings": {"read": false, "write": false, "delete": false}}', 
     true, '#6B7280')
ON CONFLICT (name) DO NOTHING;