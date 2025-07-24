-- Simple fix for chat channel creation RLS issue
-- This creates a more permissive policy to allow authenticated users to create channels

-- Remove existing restrictive policies
DROP POLICY IF EXISTS "Users can view channels they're members of" ON public.chat_channels;
DROP POLICY IF EXISTS "Users can create channels in their organization" ON public.chat_channels;
DROP POLICY IF EXISTS "Enable channel creation for organization members" ON public.chat_channels;

-- Create simple policies that work
-- Allow authenticated users to view all channels (for now)
CREATE POLICY "Allow viewing channels" ON public.chat_channels
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create channels
CREATE POLICY "Allow creating channels" ON public.chat_channels
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow channel creators to update their channels
CREATE POLICY "Allow updating own channels" ON public.chat_channels
    FOR UPDATE USING (created_by = (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Fix chat_channel_members policies
DROP POLICY IF EXISTS "Users can view their own channel memberships" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can add themselves to channels" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Channel admins can add members" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Enable channel membership insertion" ON public.chat_channel_members;

-- Simple policies for channel members
CREATE POLICY "Allow viewing channel memberships" ON public.chat_channel_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow adding channel memberships" ON public.chat_channel_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow updating channel memberships" ON public.chat_channel_members
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Test query to verify current user context
SELECT 
    auth.jwt() ->> 'sub' as clerk_user_id,
    auth.role() as auth_role,
    (SELECT id FROM public.user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub') as user_profile_id;