-- Final fix for chat RLS policies - comprehensive solution
-- This migration removes overly restrictive policies and creates working ones

-- Helper function to get current user ID from Clerk JWT (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_current_user_id') THEN
        CREATE FUNCTION get_current_user_id() 
        RETURNS UUID AS $FUNC$
        BEGIN
            RETURN (
                SELECT id FROM public.user_profiles 
                WHERE clerk_user_id = COALESCE(auth.jwt() ->> 'sub', '')
                LIMIT 1
            );
        END;
        $FUNC$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END;
$$;

-- ========================================
-- CHAT CHANNELS POLICIES
-- ========================================

-- Drop all existing chat_channels policies to start fresh
DROP POLICY IF EXISTS "Users can view channels they're members of" ON public.chat_channels;
DROP POLICY IF EXISTS "Users can create channels in their organization" ON public.chat_channels; 
DROP POLICY IF EXISTS "Enable channel creation for organization members" ON public.chat_channels;
DROP POLICY IF EXISTS "Allow viewing channels" ON public.chat_channels;
DROP POLICY IF EXISTS "Allow creating channels" ON public.chat_channels;
DROP POLICY IF EXISTS "Allow updating own channels" ON public.chat_channels;

-- Create new, working policies for chat_channels
CREATE POLICY "chat_channels_select_policy" ON public.chat_channels
    FOR SELECT USING (
        -- Users can see channels in organizations they belong to
        organization_id IN (
            SELECT om.organization_id 
            FROM public.organization_members om
            WHERE om.user_id = get_current_user_id()
        )
        OR
        -- Or public channels
        type = 'public'
    );

CREATE POLICY "chat_channels_insert_policy" ON public.chat_channels
    FOR INSERT WITH CHECK (
        -- Users can create channels in organizations they belong to
        organization_id IN (
            SELECT om.organization_id 
            FROM public.organization_members om
            WHERE om.user_id = get_current_user_id()
        )
        AND
        -- The created_by field must match the current user
        created_by = get_current_user_id()
    );

CREATE POLICY "chat_channels_update_policy" ON public.chat_channels
    FOR UPDATE USING (
        -- Users can only update channels they created
        created_by = get_current_user_id()
    );

-- ========================================
-- CHAT CHANNEL MEMBERS POLICIES  
-- ========================================

-- Drop existing chat_channel_members policies
DROP POLICY IF EXISTS "Users can view their own channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can add themselves to channels" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Channel admins can add members" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Enable channel membership insertion" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Enable channel membership updates" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can update their own channel membership" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Allow viewing channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Allow adding channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Allow updating channel memberships" ON public.chat_channel_members;

-- Create new policies for chat_channel_members
CREATE POLICY "chat_members_select_policy" ON public.chat_channel_members
    FOR SELECT USING (
        -- Users can see memberships for channels they have access to
        channel_id IN (
            SELECT id FROM public.chat_channels 
            WHERE organization_id IN (
                SELECT om.organization_id 
                FROM public.organization_members om
                WHERE om.user_id = get_current_user_id()
            )
        )
    );

CREATE POLICY "chat_members_insert_policy" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        -- Users can add themselves to channels
        user_id = get_current_user_id()
        OR
        -- Channel admins can add others
        channel_id IN (
            SELECT ccm.channel_id 
            FROM public.chat_channel_members ccm
            WHERE ccm.user_id = get_current_user_id()
            AND ccm.role = 'admin'
        )
    );

CREATE POLICY "chat_members_update_policy" ON public.chat_channel_members
    FOR UPDATE USING (
        -- Users can update their own membership (for last_read_at, etc.)
        user_id = get_current_user_id()
        OR
        -- Channel admins can update others
        channel_id IN (
            SELECT ccm.channel_id 
            FROM public.chat_channel_members ccm
            WHERE ccm.user_id = get_current_user_id()
            AND ccm.role = 'admin'
        )
    );

-- ========================================
-- CHAT MESSAGES POLICIES (Update existing)
-- ========================================

-- Update the existing messages policies to be more permissive
DROP POLICY IF EXISTS "Users can view messages in their channels" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages in their channels" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can edit their own messages" ON public.chat_messages;

CREATE POLICY "chat_messages_select_policy" ON public.chat_messages
    FOR SELECT USING (
        channel_id IN (
            SELECT id FROM public.chat_channels 
            WHERE organization_id IN (
                SELECT om.organization_id 
                FROM public.organization_members om
                WHERE om.user_id = get_current_user_id()
            )
        )
    );

CREATE POLICY "chat_messages_insert_policy" ON public.chat_messages
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT id FROM public.chat_channels 
            WHERE organization_id IN (
                SELECT om.organization_id 
                FROM public.organization_members om
                WHERE om.user_id = get_current_user_id()
            )
        )
        AND
        user_id = get_current_user_id()
    );

CREATE POLICY "chat_messages_update_policy" ON public.chat_messages
    FOR UPDATE USING (
        user_id = get_current_user_id()
    );

-- ========================================
-- TEST THE POLICIES
-- ========================================

-- This query should show the organizations the current user can create channels in
SELECT 
    o.id,
    o.name,
    'User can create channels in this organization' as access_level
FROM public.organizations o
WHERE o.id IN (
    SELECT om.organization_id 
    FROM public.organization_members om
    WHERE om.user_id = get_current_user_id()
);

-- Show current user info for debugging
SELECT 
    auth.jwt() ->> 'sub' as current_clerk_user_id,
    get_current_user_id() as current_user_profile_id,
    (SELECT full_name FROM public.user_profiles WHERE id = get_current_user_id()) as current_user_name;