-- Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL DEFAULT 'meeting',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL
);

-- User Calendar Connections Table
CREATE TABLE IF NOT EXISTS user_calendar_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'apple', 'outlook', 'other')),
    provider_id TEXT,
    calendar_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    sync_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider, calendar_id)
);

-- Calendar Sync Events Table
CREATE TABLE IF NOT EXISTS calendar_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    connection_id UUID REFERENCES user_calendar_connections(id) ON DELETE CASCADE,
    trade_event_id TEXT NOT NULL,
    provider_event_id TEXT,
    event_title TEXT NOT NULL,
    event_start TIMESTAMP WITH TIME ZONE NOT NULL,
    event_end TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_job_id ON calendar_events(job_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_customer_id ON calendar_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);

CREATE INDEX IF NOT EXISTS idx_user_calendar_connections_user_id ON user_calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_connections_provider ON user_calendar_connections(provider);
CREATE INDEX IF NOT EXISTS idx_user_calendar_connections_sync_enabled ON user_calendar_connections(sync_enabled);

CREATE INDEX IF NOT EXISTS idx_calendar_sync_events_user_id ON calendar_sync_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_events_connection_id ON calendar_sync_events(connection_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_events_sync_status ON calendar_sync_events(sync_status);

-- Create update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calendar_events_updated_at 
    BEFORE UPDATE ON calendar_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_calendar_connections_updated_at 
    BEFORE UPDATE ON user_calendar_connections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_sync_events_updated_at 
    BEFORE UPDATE ON calendar_sync_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calendar_events
CREATE POLICY "Users can view their own calendar events" ON calendar_events
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own calendar events" ON calendar_events
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own calendar events" ON calendar_events
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for user_calendar_connections
CREATE POLICY "Users can view their own calendar connections" ON user_calendar_connections
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own calendar connections" ON user_calendar_connections
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own calendar connections" ON user_calendar_connections
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own calendar connections" ON user_calendar_connections
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create RLS policies for calendar_sync_events
CREATE POLICY "Users can view their own sync events" ON calendar_sync_events
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own sync events" ON calendar_sync_events
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own sync events" ON calendar_sync_events
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own sync events" ON calendar_sync_events
    FOR DELETE USING (auth.uid()::text = user_id);

-- Grant necessary permissions
GRANT ALL ON calendar_events TO authenticated;
GRANT ALL ON user_calendar_connections TO authenticated;
GRANT ALL ON calendar_sync_events TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE calendar_events IS 'Store calendar events for trade business scheduling';
COMMENT ON TABLE user_calendar_connections IS 'Store user connections to external calendar providers';
COMMENT ON TABLE calendar_sync_events IS 'Track synchronization events between trade calendar and external calendars'; 