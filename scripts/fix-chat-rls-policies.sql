-- Fix missing RLS policies for chat channel creation
-- This addresses the issue where users can't create channels due to missing INSERT policy

-- Allow users to create channels in their organization
CREATE POLICY "Users can create channels in their organization" ON public.chat_channels
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.organization_members 
            WHERE user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
        )
    );

-- Allow users to insert their own channel memberships
CREATE POLICY "Users can add themselves to channels" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- Allow admins to add other users to channels they admin
CREATE POLICY "Channel admins can add members" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT channel_id FROM public.chat_channel_members 
            WHERE user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
            AND role = 'admin'
        )
    );

-- Allow users to update their own channel memberships (for last_read_at, etc.)
CREATE POLICY "Users can update their own channel membership" ON public.chat_channel_members
    FOR UPDATE USING (
        user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- Allow users to add reactions to messages they can see
CREATE POLICY "Users can add reactions to accessible messages" ON public.chat_message_reactions
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
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
                WHERE user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
            )
        )
    );