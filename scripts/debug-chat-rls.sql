-- Debug script to check RLS policies and user permissions for chat system

-- 1. Check current RLS policies on chat_channels
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_channels';

-- 2. Check if user_profiles table has data and structure
SELECT 
    id,
    clerk_user_id,
    full_name,
    email,
    created_at
FROM user_profiles 
LIMIT 5;

-- 3. Check if organizations table has data
SELECT 
    id,
    name,
    description,
    created_at
FROM organizations 
LIMIT 5;

-- 4. Check organization_members table
SELECT 
    om.id,
    om.organization_id,
    om.user_id,
    om.role,
    up.full_name,
    up.clerk_user_id,
    o.name as org_name
FROM organization_members om
JOIN user_profiles up ON up.id = om.user_id
JOIN organizations o ON o.id = om.organization_id
LIMIT 5;

-- 5. Check current auth.jwt() functionality (this will show current user context)
SELECT 
    auth.jwt() ->> 'sub' as current_clerk_user_id,
    (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub') as current_user_profile_id;

-- 6. Test the RLS policy condition for chat_channels insert
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    'Can create channels in this org?' as check_result
FROM organizations o
WHERE o.id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
);