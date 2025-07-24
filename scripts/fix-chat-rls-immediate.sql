-- Immediate fix for chat RLS policies
-- Run this in Supabase SQL Editor to fix the channel creation error

-- First, let's check if the INSERT policy already exists
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'chat_channels' AND cmd = 'INSERT';

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can create channels in their organization" ON public.chat_channels;
DROP POLICY IF EXISTS "Users can create channels" ON public.chat_channels;
DROP POLICY IF EXISTS "Allow channel creation" ON public.chat_channels;

-- Create a simple INSERT policy that allows authenticated users to create channels
-- in organizations where they are members
CREATE POLICY "Enable channel creation for organization members" ON public.chat_channels
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            JOIN public.user_profiles up ON up.id = om.user_id
            WHERE up.clerk_user_id = auth.jwt() ->> 'sub'
            AND om.organization_id = chat_channels.organization_id
        )
    );

-- Also ensure we have proper INSERT policies for chat_channel_members
DROP POLICY IF EXISTS "Users can add themselves to channels" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Channel admins can add members" ON public.chat_channel_members;

-- Allow users to insert channel memberships
CREATE POLICY "Enable channel membership insertion" ON public.chat_channel_members
    FOR INSERT WITH CHECK (
        -- Users can add themselves to channels
        user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
        OR
        -- Or if they are admin of the channel
        EXISTS (
            SELECT 1 FROM public.chat_channel_members existing
            WHERE existing.channel_id = chat_channel_members.channel_id
            AND existing.user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
            AND existing.role = 'admin'
        )
    );

-- Allow users to update their own channel memberships (for last_read_at, etc.)
DROP POLICY IF EXISTS "Users can update their own channel membership" ON public.chat_channel_members;
CREATE POLICY "Enable channel membership updates" ON public.chat_channel_members
    FOR UPDATE USING (
        user_id = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    );

-- Test the policy by showing what organizations the current user can create channels in
SELECT 
    o.id,
    o.name,
    'Current user can create channels here' as status
FROM public.organizations o
WHERE EXISTS (
    SELECT 1 FROM public.organization_members om
    JOIN public.user_profiles up ON up.id = om.user_id
    WHERE up.clerk_user_id = auth.jwt() ->> 'sub'
    AND om.organization_id = o.id
);