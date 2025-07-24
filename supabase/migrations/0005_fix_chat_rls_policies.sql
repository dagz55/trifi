-- Fix missing RLS policies for chat system
-- This migration adds the missing INSERT policies that are preventing channel creation

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

-- Allow users to create channels in organizations they belong to
CREATE POLICY "Users can create channels in their organization" ON public.chat_channels
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = get_current_user_id()
        )
    );

-- Allow users to insert their own channel memberships
CREATE POLICY "Users can add themselves to channels" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        user_id = get_current_user_id()
    );

-- Allow channel admins to add other users to channels they admin
CREATE POLICY "Channel admins can add members" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT channel_id FROM public.chat_channel_members 
            WHERE user_id = get_current_user_id()
            AND role = 'admin'
        )
    );

-- Allow users to update their own channel memberships (for last_read_at, etc.)
CREATE POLICY "Users can update their own channel membership" ON public.chat_channel_members
    FOR UPDATE USING (
        user_id = get_current_user_id()
    );

-- Allow users to add reactions to messages they can see
CREATE POLICY "Users can add reactions to accessible messages" ON public.chat_message_reactions
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = get_current_user_id()
            )
        )
    );

-- Allow users to add mentions
CREATE POLICY "Users can create mentions" ON public.chat_mentions
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = get_current_user_id()
            )
        )
    );

-- Allow users to upload attachments to messages in channels they can access
CREATE POLICY "Users can upload attachments to accessible messages" ON public.chat_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = get_current_user_id()
            )
        )
    );