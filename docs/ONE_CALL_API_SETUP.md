# One Call API 3.0 Setup Guide

## 🌤️ What is One Call API 3.0?

One Call API 3.0 is OpenWeatherMap's premium API that provides comprehensive weather data in a single API call:

- **Current weather** - Real-time conditions
- **Minute forecast** - Next 60 minutes
- **Hourly forecast** - Next 48 hours  
- **Daily forecast** - Next 8 days
- **Weather alerts** - Government alerts
- **Historical data** - 46+ years back

## 🔑 How to Subscribe (FREE TIER)

### Step 1: Create OpenWeatherMap Account
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **"Sign up"** 
3. Fill in email, password, accept terms
4. Click **"Create Account"**
5. **IMPORTANT:** Check your email and click the confirmation link

### Step 2: Subscribe to One Call API 3.0
1. Sign in to your OpenWeatherMap account
2. Go to [https://openweathermap.org/api/one-call-3](https://openweathermap.org/api/one-call-3)
3. Click **"Subscribe"** button
4. Fill out the billing form (credit card required, but free tier is FREE)
5. Set API call limit to **999 calls/day** (to avoid accidental charges)
6. Complete subscription

### Step 3: Get Your API Key
1. Go to [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
2. Copy your API key
3. Update your `.env.local` file:
   ```env
   VITE_OPENWEATHERMAP_API_KEY=3f7376da1b1c68b39b3664144825a12d
   ```

## 📊 API Usage Examples

### Basic One Call API 3.0 Request
```javascript
const response = await fetch(
  `https://api.openweathermap.org/data/3.0/onecall?lat=-27.4698&lon=153.0251&appid=${API_KEY}&units=metric`
);
```

### With Exclusions (to save API calls)
```javascript
const response = await fetch(
  `https://api.openweathermap.org/data/3.0/onecall?lat=-27.4698&lon=153.0251&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
);
```

### Available Exclusions
- `minutely` - Skip minute-by-minute forecasts
- `hourly` - Skip hourly forecasts  
- `daily` - Skip daily forecasts
- `alerts` - Skip weather alerts
- `current` - Skip current weather

## 🔄 Alternative: Use Basic Weather API

If you don't want to subscribe, you can use the basic weather API instead:

```javascript
// Current weather (FREE, no subscription needed)
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=-27.4698&lon=153.0251&appid=${API_KEY}&units=metric`
);

// 5-day forecast (FREE, no subscription needed)  
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?lat=-27.4698&lon=153.0251&appid=${API_KEY}&units=metric`
);
```

## 🎯 Your Weather Overlay System

The weather overlay system I created for you uses the **Weather Maps API** which works with your basic API key (no subscription required).

**Weather Maps API endpoints:**
- `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid={API_KEY}`
- `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={API_KEY}`
- `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={API_KEY}`

## 💡 Recommendations

### For Weather Overlays (Map Tiles)
✅ **Use basic API key** - No subscription needed  
✅ **Weather overlay works immediately** after API key activation

### For Detailed Weather Data
✅ **Subscribe to One Call API 3.0** - More comprehensive data  
✅ **Free tier: 1,000 calls/day** - Perfect for most applications

## 🔧 Testing Your Setup

Use the test script I created:

```bash
# Update API key in test-weather-api.js
node test-weather-api.js
```

## 📋 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Invalid API key | Not subscribed to One Call API 3.0 | Subscribe to One Call API 3.0 |
| 401 Invalid API key | API key not activated | Wait 2 hours after signup |
| 401 Invalid API key | Email not confirmed | Check email and click confirmation |
| 429 Too many requests | Exceeded daily limit | Wait 24 hours or upgrade plan |

## 🎉 Success!

Once setup correctly, you'll have:
- ✅ Beautiful weather overlays on your maps
- ✅ Comprehensive weather data via One Call API 3.0
- ✅ Free tier with 1,000 API calls per day
- ✅ All weather layers: clouds, rain, temperature, wind, pressure 