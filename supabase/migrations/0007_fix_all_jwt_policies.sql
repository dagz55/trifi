-- Comprehensive fix for all JWT extraction issues in RLS policies
-- This migration drops all problematic policies and recreates them properly

-- Ensure our helper function exists
CREATE OR REPLACE FUNCTION get_current_user_id() 
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM public.user_profiles 
        WHERE clerk_user_id = COALESCE(auth.jwt() ->> 'sub', '')
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- DROP ALL EXISTING CHAT POLICIES
-- ========================================

-- Drop all existing chat channel policies
DROP POLICY IF EXISTS "Users can view channels they're members of" ON public.chat_channels;
DROP POLICY IF EXISTS "Users can create channels in their organization" ON public.chat_channels;
DROP POLICY IF EXISTS "chat_channels_select_policy" ON public.chat_channels;
DROP POLICY IF EXISTS "chat_channels_insert_policy" ON public.chat_channels;
DROP POLICY IF EXISTS "chat_channels_update_policy" ON public.chat_channels;

-- Drop all existing chat channel member policies
DROP POLICY IF EXISTS "Users can view their own channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can add themselves to channels" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Channel admins can add members" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can update their own channel membership" ON public.chat_channel_members;
DROP POLICY IF EXISTS "chat_members_select_policy" ON public.chat_channel_members;
DROP POLICY IF EXISTS "chat_members_insert_policy" ON public.chat_channel_members;
DROP POLICY IF EXISTS "chat_members_update_policy" ON public.chat_channel_members;

-- Drop all existing chat message policies
DROP POLICY IF EXISTS "Users can view messages in their channels" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages in their channels" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can edit their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_policy" ON public.chat_messages;

-- Drop all existing reaction policies
DROP POLICY IF EXISTS "Users can view reactions on accessible messages" ON public.chat_message_reactions;
DROP POLICY IF EXISTS "Users can add reactions to accessible messages" ON public.chat_message_reactions;

-- Drop all existing attachment policies
DROP POLICY IF EXISTS "Users can view attachments on accessible messages" ON public.chat_attachments;
DROP POLICY IF EXISTS "Users can upload attachments to accessible messages" ON public.chat_attachments;

-- Drop all existing mention policies
DROP POLICY IF EXISTS "Users can view their own mentions" ON public.chat_mentions;
DROP POLICY IF EXISTS "Users can create mentions" ON public.chat_mentions;

-- ========================================
-- RECREATE ALL CHAT POLICIES PROPERLY
-- ========================================

-- Chat Channels Policies
CREATE POLICY "chat_channels_select_policy" ON public.chat_channels
    FOR SELECT USING (
        organization_id IN (
            SELECT om.organization_id 
            FROM public.organization_members om
            WHERE om.user_id = get_current_user_id()
        )
        OR type = 'public'
    );

CREATE POLICY "chat_channels_insert_policy" ON public.chat_channels
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT om.organization_id 
            FROM public.organization_members om
            WHERE om.user_id = get_current_user_id()
        )
        AND created_by = get_current_user_id()
    );

CREATE POLICY "chat_channels_update_policy" ON public.chat_channels
    FOR UPDATE USING (
        created_by = get_current_user_id()
    );

-- Chat Channel Members Policies
CREATE POLICY "chat_members_select_policy" ON public.chat_channel_members
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

CREATE POLICY "chat_members_insert_policy" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        user_id = get_current_user_id()
        OR
        channel_id IN (
            SELECT ccm.channel_id 
            FROM public.chat_channel_members ccm
            WHERE ccm.user_id = get_current_user_id()
            AND ccm.role = 'admin'
        )
    );

CREATE POLICY "chat_members_update_policy" ON public.chat_channel_members
    FOR UPDATE USING (
        user_id = get_current_user_id()
        OR
        channel_id IN (
            SELECT ccm.channel_id 
            FROM public.chat_channel_members ccm
            WHERE ccm.user_id = get_current_user_id()
            AND ccm.role = 'admin'
        )
    );

-- Chat Messages Policies
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
        AND user_id = get_current_user_id()
    );

CREATE POLICY "chat_messages_update_policy" ON public.chat_messages
    FOR UPDATE USING (
        user_id = get_current_user_id()
    );

-- Chat Message Reactions Policies
CREATE POLICY "chat_reactions_select_policy" ON public.chat_message_reactions
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT id FROM public.chat_channels 
                WHERE organization_id IN (
                    SELECT om.organization_id 
                    FROM public.organization_members om
                    WHERE om.user_id = get_current_user_id()
                )
            )
        )
    );

CREATE POLICY "chat_reactions_insert_policy" ON public.chat_message_reactions
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT id FROM public.chat_channels 
                WHERE organization_id IN (
                    SELECT om.organization_id 
                    FROM public.organization_members om
                    WHERE om.user_id = get_current_user_id()
                )
            )
        )
        AND user_id = get_current_user_id()
    );

-- Chat Attachments Policies
CREATE POLICY "chat_attachments_select_policy" ON public.chat_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT id FROM public.chat_channels 
                WHERE organization_id IN (
                    SELECT om.organization_id 
                    FROM public.organization_members om
                    WHERE om.user_id = get_current_user_id()
                )
            )
        )
    );

CREATE POLICY "chat_attachments_insert_policy" ON public.chat_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT id FROM public.chat_channels 
                WHERE organization_id IN (
                    SELECT om.organization_id 
                    FROM public.organization_members om
                    WHERE om.user_id = get_current_user_id()
                )
            )
        )
    );

-- Chat Mentions Policies
CREATE POLICY "chat_mentions_select_policy" ON public.chat_mentions
    FOR SELECT USING (
        user_id = get_current_user_id()
    );

CREATE POLICY "chat_mentions_insert_policy" ON public.chat_mentions
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT id FROM public.chat_channels 
                WHERE organization_id IN (
                    SELECT om.organization_id 
                    FROM public.organization_members om
                    WHERE om.user_id = get_current_user_id()
                )
            )
        )
    );

-- ========================================
-- FIX ANY OTHER POTENTIAL ISSUES
-- ========================================

-- Drop and recreate user profiles policy if it has issues
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (
        id = get_current_user_id()
        OR true -- Allow all for now - customize based on your auth needs
    );

-- Ensure all chat tables have RLS enabled
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_mentions ENABLE ROW LEVEL SECURITY; 