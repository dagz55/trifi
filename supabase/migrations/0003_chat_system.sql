-- Chat System Migration
-- Comprehensive messaging system for organization communication

-- Chat Channels/Rooms
CREATE TABLE IF NOT EXISTS public.chat_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'public', -- public, private, direct, group
    is_archived BOOLEAN DEFAULT false,
    project_id UUID REFERENCES projects(id), -- Optional: link to project
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Channel Members
CREATE TABLE IF NOT EXISTS public.chat_channel_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- admin, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_muted BOOLEAN DEFAULT false,
    UNIQUE(channel_id, user_id)
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- text, image, file, system
    reply_to_id UUID REFERENCES chat_messages(id), -- For threaded replies
    metadata JSONB DEFAULT '{}', -- For file attachments, mentions, etc.
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Message Reactions
CREATE TABLE IF NOT EXISTS public.chat_message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL, -- emoji or reaction type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction)
);

-- Chat File Attachments
CREATE TABLE IF NOT EXISTS public.chat_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Message Mentions
CREATE TABLE IF NOT EXISTS public.chat_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    mention_type TEXT DEFAULT 'user', -- user, channel, everyone
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default channels for demonstration
INSERT INTO public.chat_channels (name, description, type)
SELECT 'General', 'General discussion for all organization members', 'public'
WHERE NOT EXISTS (SELECT 1 FROM public.chat_channels WHERE name = 'General');

INSERT INTO public.chat_channels (name, description, type)
SELECT 'Random', 'Random conversations and casual chat', 'public'
WHERE NOT EXISTS (SELECT 1 FROM public.chat_channels WHERE name = 'Random');

INSERT INTO public.chat_channels (name, description, type)
SELECT 'Announcements', 'Important organization announcements', 'public'
WHERE NOT EXISTS (SELECT 1 FROM public.chat_channels WHERE name = 'Announcements');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_channels_organization_id ON public.chat_channels(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_channels_type ON public.chat_channels(type);
CREATE INDEX IF NOT EXISTS idx_chat_channel_members_channel_id ON public.chat_channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_channel_members_user_id ON public.chat_channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_reply_to_id ON public.chat_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_message_id ON public.chat_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_attachments_message_id ON public.chat_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_mentions_user_id ON public.chat_mentions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_mentions_unread ON public.chat_mentions(user_id, is_read);

-- Enable Row Level Security (RLS)
-- Note: These statements will error if RLS is already enabled, which is fine.
-- The migration will continue, and RLS will remain enabled.
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_mentions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat system
-- Helper function to get current user ID from Clerk JWT
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

-- Users can only see channels they're members of
CREATE POLICY "Users can view channels they're members of" ON public.chat_channels
    FOR SELECT USING (
        id IN (
            SELECT channel_id FROM public.chat_channel_members 
            WHERE user_id = get_current_user_id()
        ) OR type = 'public'
    );

-- Users can only see their own channel memberships
CREATE POLICY "Users can view their own channel memberships" ON public.chat_channel_members
    FOR SELECT USING (
        user_id = get_current_user_id()
    );

-- Users can only see messages in channels they're members of
CREATE POLICY "Users can view messages in their channels" ON public.chat_messages
    FOR SELECT USING (
        channel_id IN (
            SELECT channel_id FROM public.chat_channel_members 
            WHERE user_id = get_current_user_id()
        )
    );

-- Users can only insert messages in channels they're members of
CREATE POLICY "Users can send messages in their channels" ON public.chat_messages
    FOR INSERT WITH CHECK (
        channel_id IN (
            SELECT channel_id FROM public.chat_channel_members 
            WHERE user_id = get_current_user_id()
        )
    );

-- Users can only update/delete their own messages
CREATE POLICY "Users can edit their own messages" ON public.chat_messages
    FOR UPDATE USING (
        user_id = get_current_user_id()
    );

-- Allow read access to reactions and attachments for messages user can see
CREATE POLICY "Users can view reactions on accessible messages" ON public.chat_message_reactions
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = get_current_user_id()
            )
        )
    );

CREATE POLICY "Users can view attachments on accessible messages" ON public.chat_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM public.chat_messages 
            WHERE channel_id IN (
                SELECT channel_id FROM public.chat_channel_members 
                WHERE user_id = get_current_user_id()
            )
        )
    );

-- Users can view their own mentions
CREATE POLICY "Users can view their own mentions" ON public.chat_mentions
    FOR SELECT USING (
        user_id = get_current_user_id()
    );

-- Add updated_at triggers for chat tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_channels_updated_at') THEN
        CREATE TRIGGER update_chat_channels_updated_at
            BEFORE UPDATE ON public.chat_channels
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_messages_updated_at') THEN
        CREATE TRIGGER update_chat_messages_updated_at
            BEFORE UPDATE ON public.chat_messages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Create function to auto-add users to public channels when they join an organization
CREATE OR REPLACE FUNCTION auto_add_to_public_channels()
RETURNS TRIGGER AS $$
BEGIN
    -- Add new organization member to all public channels in that organization
    INSERT INTO public.chat_channel_members (channel_id, user_id)
    SELECT id, NEW.user_id
    FROM public.chat_channels
    WHERE organization_id = NEW.organization_id
    AND type = 'public'
    AND NOT EXISTS (
        SELECT 1 FROM public.chat_channel_members
        WHERE channel_id = chat_channels.id AND user_id = NEW.user_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-add users to public channels
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'auto_add_to_public_channels_trigger') THEN
        CREATE TRIGGER auto_add_to_public_channels_trigger
            AFTER INSERT ON public.organization_members
            FOR EACH ROW
            EXECUTE FUNCTION auto_add_to_public_channels();
    END IF;
END
$$;

-- Create function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID, channel_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    last_read_time TIMESTAMP WITH TIME ZONE;
    unread_count INTEGER;
BEGIN
    -- Get the last read timestamp for this user in this channel
    SELECT last_read_at INTO last_read_time
    FROM public.chat_channel_members
    WHERE channel_id = channel_uuid AND user_id = user_uuid;
    
    -- If no last read time, count all messages
    IF last_read_time IS NULL THEN
        SELECT COUNT(*) INTO unread_count
        FROM public.chat_messages
        WHERE channel_id = channel_uuid AND user_id != user_uuid;
    ELSE
        SELECT COUNT(*) INTO unread_count
        FROM public.chat_messages
        WHERE channel_id = channel_uuid 
        AND user_id != user_uuid
        AND created_at > last_read_time;
    END IF;
    
    RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql;
