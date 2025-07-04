# TradeEase NCC Feature Migration Guide

This guide covers the deployment of the NCC (National Construction Code) voice search feature to your Supabase database.

## 🎯 Overview

The NCC feature includes:
- **NCC Codes Table**: Stores National Construction Code data with search functionality
- **Subscription Integration**: Links to your existing subscription system
- **Voice Search**: Real-time voice recognition for NCC code queries
- **External References**: Links to official ABCB and NCC resources

## 📋 Prerequisites

- Supabase project with project ref: `wxwbxupdisbofesaygqj`
- Environment variables configured:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions)

## 🚀 Deployment Options

### Option 1: Automated Deployment (Recommended)

```bash
# Generate migration files
npm run migrate:generate

# Deploy using Supabase CLI
npm run migrate:deploy

# Verify the deployment
npm run migrate:verify
```

### Option 2: Manual Dashboard Deployment

```bash
# Generate migration files
npm run migrate:generate
```

Then:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/wxwbxupdisbofesaygqj)
2. Navigate to SQL Editor
3. Copy contents of `migration-combined.sql`
4. Paste and execute

### Option 3: Individual Migration Files

If you prefer to run migrations individually, execute them in this order:

1. `20250122000001_subscription_features.sql` - Subscription features
2. `20250122000002_enhance_subscription_features.sql` - NCC feature flags
3. `20250123000000_create_ncc_codes_table.sql` - NCC codes table

## 📊 What Gets Created

### Tables
- **`ncc_codes`**: NCC code data with search functionality
- **`subscription_features`**: Feature flags (updated with NCC voice search)
- **`user_subscriptions`**: User subscription data
- **`feature_requests`**: Feature request system

### Functions
- **`search_ncc_codes(search_query TEXT)`**: Full-text search for NCC codes
- **`update_ncc_codes_updated_at()`**: Automatic timestamp updates

### Indexes
- Full-text search index on NCC codes
- Keyword search index
- Category and code indexes

### RLS Policies
- Read access for authorized users only
- Subscription-based access control

## 🔍 Verification

After deployment, run the verification script:

```bash
npm run migrate:verify
```

This will check:
- ✅ All tables exist with correct columns
- ✅ Functions are callable
- ✅ Sample NCC data is present
- ✅ Subscription features are configured
- ✅ RLS policies are active

## 🌐 External References

The feature includes links to:
- **Official NCC**: https://ncc.abcb.gov.au/
- **ABCB Website**: https://www.abcb.gov.au/
- **NCC Updates**: https://www.abcb.gov.au/ncc/ncc-updates
- **NCC Guidance**: https://www.abcb.gov.au/ncc/ncc-guidance

## 🔧 Configuration

### NCC Configuration (`src/config/ncc-config.ts`)
- Centralized URL management
- Category definitions
- Search parameters
- Feature flags

### Database Configuration (`src/config/database-config.ts`)
- Environment detection
- Migration strategies
- Table names
- RLS policies

## 🎮 Usage

### Frontend Component
```tsx
import { NCCVoiceSearch } from '@/components/NCCVoiceSearch';

// Use in your app
<NCCVoiceSearch />
```

### API Service
```tsx
import { NCCSearchService } from '@/services/NCCSearchService';

// Search NCC codes
const results = await NCCSearchService.searchNCCCodes('fire resistance');

// Get categories
const categories = await NCCSearchService.getNCCCategories();
```

## 🔐 Access Control

The NCC voice search feature is available for:
- **Premium Edge** subscription: ✅ Included
- **Skeleton Key** subscription: ✅ Included
- **Growing Pain Relief**: ❌ Not included (available as add-on)
- **Free Starter**: ❌ Not included

## 🛠️ Troubleshooting

### Common Issues

1. **"Project not linked"**
   ```bash
   npm run migrate:link
   ```

2. **"Missing environment variables"**
   - Check your `.env` file
   - Ensure all Supabase variables are set

3. **"RLS policy violation"**
   - Verify user has active subscription
   - Check subscription tier permissions

4. **"Function not found"**
   - Run verification script to check deployment
   - Re-run migration if needed

### Rollback

If you need to rollback:

```sql
-- Drop NCC codes table
DROP TABLE IF EXISTS ncc_codes CASCADE;

-- Remove NCC feature from subscription_features
DELETE FROM subscription_features WHERE feature_key = 'ncc_voice_search';
```

## 📈 Monitoring

### Database Monitoring
- Check Supabase dashboard for query performance
- Monitor RLS policy effectiveness
- Track search function usage

### Application Monitoring
- Voice recognition success rates
- Search result relevance
- User engagement metrics

## 🔄 Updates

### Adding New NCC Codes
```sql
INSERT INTO ncc_codes (code, title, description, category, keywords) 
VALUES ('NEW-CODE', 'New Code Title', 'Description', 'Category', ARRAY['keyword1', 'keyword2']);
```

### Updating External URLs
Edit `src/config/ncc-config.ts` and update the URLs object.

### Adding New Categories
1. Update `src/config/ncc-config.ts`
2. Add category to database
3. Update frontend component if needed

## 📞 Support

If you encounter issues:
1. Check the verification script output
2. Review Supabase logs
3. Check environment variables
4. Verify subscription status

## 🎉 Success Criteria

Migration is successful when:
- ✅ All tables exist and are accessible
- ✅ Functions return expected results
- ✅ RLS policies work correctly
- ✅ Frontend component loads without errors
- ✅ Voice search responds to queries
- ✅ External links open correctly 