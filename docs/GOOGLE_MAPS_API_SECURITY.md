# Google Maps API Key Security Guide

## URGENT: Your API Key is Exposed

Your Google Maps API key `AIzaSyBFVIiAURNyUiIR_2dRQmud98q9sCn5ONI` is currently exposed and needs immediate action.

## Immediate Actions Required

### 1. Delete the Exposed Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find the exposed key "Maps Platform API Key"
3. Click on it and then click "DELETE"

### 2. Create New Restricted Keys

Create separate keys for different purposes:

#### A. Browser Key (for JavaScript API)
1. Create new API key
2. Set Application restrictions: **HTTP referrers (websites)**
3. Add website restrictions:
   ```
   http://localhost:8080/*
   http://localhost:5173/*
   https://yourdomain.com/*
   https://*.yourdomain.com/*
   ```
4. Set API restrictions: Select only:
   - Maps JavaScript API
   - Places API (if needed)

#### B. Server Key (for Static APIs)
1. Create another API key
2. Set Application restrictions: **IP addresses**
3. Add your server's IP address
4. Set API restrictions: Select only:
   - Street View Static API
   - Geocoding API (if needed)

### 3. Update Your Application

1. **Remove API key from .env file**
2. **Use environment variables properly**
3. **Never commit API keys to Git**

## Best Practices

### For Development
```env
# .env.local (add to .gitignore)
VITE_GOOGLE_MAPS_API_KEY=your-restricted-dev-key
```

### For Production
- Use environment variables in your hosting platform
- Never hardcode API keys in your source code
- Use different keys for different environments

### Add to .gitignore
```gitignore
# Environment files
.env
.env.local
.env.production
.env*.local
```

## Monitoring Usage

1. Set up billing alerts in Google Cloud Console
2. Monitor API usage regularly
3. Set quotas to prevent unexpected charges

## Additional Security Measures

1. **Enable API Key Restrictions**
   - Restrict by API
   - Restrict by website/IP
   - Restrict by app bundle ID (for mobile)

2. **Use Multiple Keys**
   - One for development
   - One for production
   - Separate keys for different APIs

3. **Rotate Keys Regularly**
   - Change keys every 90 days
   - Update all applications using the keys

## Emergency Response

If you suspect unauthorized use:
1. Delete the compromised key immediately
2. Create new restricted keys
3. Check your billing for unauthorized charges
4. Contact Google Cloud Support if needed

## Resources
- [Google Maps Platform Security Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [API Key Restrictions](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions) 