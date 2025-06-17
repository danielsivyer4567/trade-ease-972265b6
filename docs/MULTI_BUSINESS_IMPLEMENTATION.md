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

Three subscription levels:

1. **Free**: 
   - 1 organization only
   - Basic features
   - Up to 5 team members

2. **Premium** ($49/month):
   - Up to 5 organizations
   - Advanced features
   - Unlimited team members
   - Priority support

3. **Agency** ($149/month):
   - Unlimited organizations
   - Client management capabilities
   - White-label options
   - Dedicated support
   - Can manage client organizations with permissions

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

### 6. Agency Features

For agency users:
- Manage multiple client organizations
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

1. **Free Users**: Can create and manage one organization
2. **Premium Users**: Can create up to 5 organizations and switch between them
3. **Agency Users**: Can manage unlimited organizations and client businesses

### Switching Organizations

1. Click on the business name in the top-left corner
2. Select from the dropdown:
   - Your own organizations
   - Client organizations (for agency users)
3. The entire platform will refresh with the selected organization's data

### Creating Organizations

Premium/Agency users can:
1. Click the dropdown arrow next to business name
2. Select "Add Organization"
3. Fill in business details
4. The new organization becomes active immediately

### Agency Management

Agency users can:
1. Go to Settings > Organization & Subscription > Agency Management
2. Invite clients by email
3. Set granular permissions for each client
4. Monitor client activity through audit logs

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