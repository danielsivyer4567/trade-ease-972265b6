# Calendar MCP Server Guide

## Overview

Your Trade-Ease MCP server now includes comprehensive calendar functionality that allows you to:
- Manage calendar events through the MCP interface
- Sync with external calendar providers (Google, Apple, Outlook)
- Create calendar events from job data automatically
- Track and manage calendar connections

## Database Setup

First, apply the calendar database migration:

```bash
# Apply the calendar migration
cd supabase
npx supabase db push
```

This will create the following tables:
- `calendar_events` - Store calendar events
- `user_calendar_connections` - Store external calendar connections
- `calendar_sync_events` - Track synchronization events

## Available Calendar Functions

### 1. Calendar Event Management

#### Get Calendar Events
```bash
# Get all calendar events
get_calendar_events

# Get events for a specific date range
get_calendar_events --start_date "2024-01-01" --end_date "2024-01-31"

# Get events for a specific job
get_calendar_events --job_id "job-uuid-here"

# Get events for a specific customer
get_calendar_events --customer_id "customer-uuid-here"

# Get events by type
get_calendar_events --event_type "job_appointment"
```

#### Create Calendar Event
```bash
# Create a basic calendar event
create_calendar_event \
  --title "Client Meeting" \
  --description "Discuss project requirements" \
  --start_time "2024-01-15T10:00:00Z" \
  --end_time "2024-01-15T11:00:00Z" \
  --event_type "meeting"

# Create a job-related event
create_calendar_event \
  --title "Site Visit" \
  --description "Initial site inspection" \
  --start_time "2024-01-16T09:00:00Z" \
  --end_time "2024-01-16T11:00:00Z" \
  --event_type "site_visit" \
  --job_id "job-uuid-here" \
  --customer_id "customer-uuid-here" \
  --location "123 Main St, City"
```

#### Update Calendar Event
```bash
# Update an existing event
update_calendar_event \
  --id "event-uuid-here" \
  --title "Updated Meeting Title" \
  --start_time "2024-01-15T11:00:00Z" \
  --end_time "2024-01-15T12:00:00Z"
```

#### Delete Calendar Event
```bash
# Delete a calendar event
delete_calendar_event --id "event-uuid-here"
```

### 2. Job-to-Calendar Integration

#### Create Event from Job
```bash
# Create a job appointment automatically
create_job_calendar_event \
  --job_id "job-uuid-here" \
  --event_type "job_appointment" \
  --duration_hours 3

# Create a site visit
create_job_calendar_event \
  --job_id "job-uuid-here" \
  --event_type "site_visit" \
  --duration_hours 2

# Create an inspection
create_job_calendar_event \
  --job_id "job-uuid-here" \
  --event_type "inspection" \
  --duration_hours 1
```

### 3. External Calendar Integration

#### Get Calendar Connections
```bash
# Get all calendar connections
get_calendar_connections

# Get connections for specific provider
get_calendar_connections --provider "google"
```

#### Sync with External Calendar
```bash
# Sync events with external calendar
sync_calendar_events \
  --connection_id "connection-uuid-here" \
  --sync_direction "bidirectional"

# Import events from external calendar
sync_calendar_events \
  --connection_id "connection-uuid-here" \
  --sync_direction "import"

# Export events to external calendar
sync_calendar_events \
  --connection_id "connection-uuid-here" \
  --sync_direction "export"
```

## Event Types

The system supports various event types:
- `meeting` - General meetings
- `job_appointment` - Job-related appointments
- `site_visit` - Site visits and inspections
- `inspection` - Formal inspections
- `follow_up` - Follow-up meetings
- `consultation` - Initial consultations

## Integration with Existing Trade-Ease Features

### Frontend Integration

Your Trade-Ease app already has calendar components that work with these MCP functions:

1. **Team Calendar** (`src/components/team/TeamCalendar.tsx`)
   - Displays team schedules
   - Shows job assignments
   - Integrates with weather data

2. **Dashboard Calendar** (`src/components/dashboard/DashboardCalendar.tsx`)
   - Mini calendar widget
   - Quick event overview
   - Job synchronization

3. **Calendar Page** (`src/pages/Calendar/Calendar.tsx`)
   - Full calendar interface
   - Multiple view modes
   - Integration management

### Backend Services

The MCP server integrates with existing services:

1. **Calendar Service** (`src/integrations/calendar/CalendarService.ts`)
   - Handles external calendar connections
   - Manages sync operations
   - Provides calendar utilities

2. **Supabase Functions** (`supabase/functions/sync-calendar-events/`)
   - Background synchronization
   - Webhook handling
   - Event processing

## Example Workflows

### Workflow 1: Schedule Job Appointment
```bash
# 1. Get a job
get_jobs --limit 1

# 2. Create calendar event from job
create_job_calendar_event \
  --job_id "job-uuid-from-step-1" \
  --event_type "job_appointment" \
  --duration_hours 2

# 3. Sync with external calendar
sync_calendar_events \
  --connection_id "your-google-calendar-connection-id" \
  --sync_direction "export"
```

### Workflow 2: Manage Weekly Schedule
```bash
# 1. Get this week's events
get_calendar_events \
  --start_date "2024-01-15" \
  --end_date "2024-01-21"

# 2. Create a new meeting
create_calendar_event \
  --title "Team Meeting" \
  --start_time "2024-01-17T14:00:00Z" \
  --end_time "2024-01-17T15:00:00Z" \
  --event_type "meeting"

# 3. Update existing event
update_calendar_event \
  --id "event-uuid-here" \
  --location "Conference Room A"
```

## Security and Permissions

- All calendar operations are user-scoped using Row Level Security (RLS)
- Users can only access their own calendar events and connections
- External calendar tokens are stored securely
- All operations require proper authentication

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure Supabase is running
   - Check database migration status
   - Verify connection credentials

2. **Event Creation Fails**
   - Check date format (ISO 8601)
   - Ensure end time is after start time
   - Verify job/customer IDs exist

3. **Sync Issues**
   - Check calendar connection status
   - Verify external calendar permissions
   - Review sync event logs

### Logs and Debugging

```bash
# Check recent sync events
get_calendar_connections

# Monitor sync operations
sync_calendar_events --connection_id "uuid" --sync_direction "import"
```

## Future Enhancements

The calendar system can be extended with:
- Recurring events
- Event reminders
- Conflict detection
- Advanced scheduling algorithms
- Integration with more calendar providers
- Mobile app synchronization

## Support

For issues or questions:
1. Check the database migration status
2. Verify MCP server connection
3. Review error logs in the MCP server output
4. Check Supabase dashboard for data consistency 