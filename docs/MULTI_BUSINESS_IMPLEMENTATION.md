# Multi-Business/Multi-Tenant Implementation

## Overview

This implementation adds support for premium and agency users to manage multiple businesses within TradeEase. The system allows users to switch between organizations without logging out, with all data and functions scoped to the selected organization.

## Features Implemented

### 1. Database Schema

Created comprehensive database tables and functions:

- **organizations**: Stores business information (name, ABN, ACN, address, etc.)
- **organization_members**: Links users to organizations with roles (owner, admin, member, viewer)
- **agency_client_relationships**: Manages agency-client relationships with granular permissions
- **organization_invitations**: Handles invitations to join organizations
- **organization_audit_logs**: Tracks all organization-related activities
- **user_profiles**: Extended with subscription tier and current organization

### 2. Subscription Tiers

Four subscription levels:

1. **Free Starter** ($0/month): 
   - 1 organization, 1 user
   - Basic features: invoices, quoting, calendar
   - View all features (locked)
   - 0 automations, 0 automated texts/emails
   - 40% affiliate commission on referrals
   - Standard ticket support

2. **Growing Pain Relief** ($75/month inc GST):
   - 1 organization, 3 users
   - Auto web enquiry forwarding
   - ABN verification
   - Internal communications/tagging
   - Add-ons available:
     - Automated texts: +$20/mo + 10¢/msg
     - AI agents: Setup + monthly fees
     - Workflows: Per setup + monthly
   - 40% affiliate commission
   - Standard ticket support

3. **Premium Edge** ($449/month):
   - 15 users included
   - ALL features unlocked
   - Unlimited free texts
   - Unlimited automations
   - Dedicated phone number
   - Free basic workflow setup
   - Advanced workflows: Extra setup cost
   - Twilio & AI token costs apply
   - 40% affiliate commission
   - Priority ticket support

4. **Skeleton Key** (Contact for pricing):
   - White-label branding
   - Step-by-step setup videos
   - Resell to your clients
   - Keep 100% of client fees
   - Client management tools
   - Sell custom workflows
   - Highest priority support
   - Optional dedicated developer
   - Only pay AI token costs

### 3. Organization Context

Created `OrganizationContext` that provides:

- Current organization state
- List of accessible organizations
- Organization switching functionality
- Organization creation and management
- Invitation system

### 4. UI Components

#### Updated Sidebar Header
- Displays current business name
- Dropdown for premium/agency users to switch organizations
- Visual indicators for organization type (owned vs agency access)
- Quick access to add new organizations

#### Organization Settings Page
- Manage current organization details
- View all accessible organizations
- Create new organizations (based on subscription)
- Invite team members or agency clients
- Subscription management with upgrade options

### 5. Security & Permissions

Implemented Row Level Security (RLS) policies:

- Users can only view organizations they belong to
- Organization owners/admins can manage members
- Agency users have controlled access to client organizations
- Audit logging for all organization activities

### 6. Skeleton Key Features

For Skeleton Key users:
- White-label the entire platform
- Manage unlimited client organizations
- Granular permission controls:
  - View all data
  - Edit settings
  - Manage users
  - Manage billing
  - Create content
  - Delete content
  - Export data
- Client invitation system
- Activity monitoring
- Resell at your own pricing
- Keep 100% of client revenue
- Sell custom workflows to clients

## Implementation Files

### Database
- `/supabase/migrations/20250122000000_multi_business_system.sql` - Complete database schema

### Frontend
- `/src/contexts/OrganizationContext.tsx` - Organization state management
- `/src/components/ui/sidebar/SidebarHeader.tsx` - Updated header with business selector
- `/src/pages/Settings/OrganizationSettings.tsx` - Organization management page
- `/src/routes/settings-routes.tsx` - Added organization settings route

### Scripts
- `/scripts/run-migration.js` - Migration runner script

## Usage

### For Users

1. **Free Starter**: 1 organization, 1 user, basic features only
2. **Growing Pain Relief**: 1 organization, 3 users, with add-on options
3. **Premium Edge**: 15 users, all features unlocked, unlimited usage
4. **Skeleton Key**: White-label solution for agencies and consultants

### Switching Organizations

1. Click on the business name in the top-left corner
2. Select from the dropdown:
   - Your own organizations
   - Client organizations (for agency users)
3. The entire platform will refresh with the selected organization's data

### Creating Organizations

Premium Edge/Skeleton Key users can:
1. Click the dropdown arrow next to business name
2. Select "Add Organization"
3. Fill in business details
4. The new organization becomes active immediately

Note: Free Starter and Growing Pain Relief users are limited to 1 organization

### Skeleton Key Management

Skeleton Key users can:
1. Go to Settings > Organization & Subscription > Client Management
2. Invite clients by email
3. Set granular permissions for each client
4. Monitor client activity through audit logs
5. White-label the platform with their branding
6. Set custom pricing for their clients
7. Manage billing relationships directly with clients

## Technical Details

### Organization Switching

When a user switches organizations:
1. The `switch_organization_context` database function is called
2. User's `current_organization_id` is updated
3. An audit log entry is created
4. The page reloads to ensure all data is refreshed

### Data Isolation

All queries should be scoped to the current organization:
```typescript
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('organization_id', currentOrganization.id);
```

### Permission Checking

For agency users accessing client data:
```typescript
const hasAccess = userOrganizations.some(
  org => org.organization_id === targetOrgId && 
         (org.access_type === 'member' || org.access_type === 'agency')
);
```

## Future Enhancements

1. **Payment Integration**: Connect with Stripe/PayPal for subscription management
2. **White-Label Features**: Custom branding for agency clients
3. **Advanced Permissions**: More granular permission controls
4. **Bulk Operations**: Manage multiple organizations at once
5. **API Access**: Programmatic organization management
6. **Usage Analytics**: Track usage per organization
7. **Billing Split**: Separate billing for each organization

## Migration Instructions

To apply the multi-business system to your database:

1. Ensure you have the latest code
2. Run the migration:
   ```bash
   node scripts/run-migration.js
   ```
3. Or use Supabase CLI:
   ```bash
   npx supabase db push
   ```

## Testing

1. Create a test user account
2. Create an organization during signup
3. Test switching between organizations
4. Test invitation system
5. Test permission restrictions

## Notes

- The system maintains backward compatibility with existing single-organization users
- All existing users are automatically set to the "free" tier
- Organization switching requires a page reload to ensure data consistency
- Agency relationships require mutual consent (invitation acceptance) 