-- Function to create an organization and add the creator as the owner
CREATE OR REPLACE FUNCTION public.create_organization_and_add_owner(
    org_name TEXT,
    creator_user_id UUID,
    org_description TEXT DEFAULT NULL,
    org_industry TEXT DEFAULT NULL,
    org_logo_url TEXT DEFAULT NULL,
    org_website TEXT DEFAULT NULL,
    org_phone TEXT DEFAULT NULL,
    org_email TEXT DEFAULT NULL,
    org_address JSONB DEFAULT NULL,
    org_tax_id TEXT DEFAULT NULL,
    org_currency TEXT DEFAULT 'PHP',
    org_timezone TEXT DEFAULT 'UTC+8'
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    industry TEXT,
    logo_url TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address JSONB,
    tax_id TEXT,
    currency TEXT,
    timezone TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    new_org_id UUID;
    new_org public.organizations;
BEGIN
    -- Insert the new organization
    INSERT INTO public.organizations (
        name, created_by, description, industry, logo_url, website, phone, email, address, tax_id, currency, timezone
    ) VALUES (
        org_name, creator_user_id, org_description, org_industry, org_logo_url, org_website, org_phone, org_email, org_address, org_tax_id, org_currency, org_timezone
    ) RETURNING * INTO new_org;

    new_org_id := new_org.id;

    -- Insert the creator as the owner in organization_members
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (new_org_id, creator_user_id, 'owner');

    -- Return the newly created organization
    RETURN QUERY SELECT * FROM public.organizations WHERE organizations.id = new_org_id;
END;
$$ LANGUAGE plpgsql; 