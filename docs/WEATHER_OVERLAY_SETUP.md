# Weather Overlay System Setup Guide

## Overview
The Weather Overlay system allows you to display real-time weather data (clouds, precipitation, temperature, wind, and pressure) on top of your existing Google Maps implementation using the **free OpenWeatherMap API**.

## 🚀 Quick Setup

### Step 1: Get OpenWeatherMap API Key

1. **Sign up for free** at [OpenWeatherMap](https://openweathermap.org/api)
2. **Go to API Keys** section in your dashboard
3. **Copy your API key** (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
4. **Add to your .env.local file**:

```env
# OpenWeatherMap API Key (Free tier: 1,000 calls/day)
VITE_OPENWEATHERMAP_API_KEY=your-api-key-here
```

### Step 2: Available Weather Layers

The system provides 5 weather layers:

| Layer | Description | Best For |
|-------|-------------|----------|
| **Clouds** | Cloud coverage | General weather overview |
| **Rain** | Precipitation (rain/snow) | Current weather conditions |
| **Temperature** | Temperature map | Planning outdoor work |
| **Wind** | Wind speed and direction | Safety planning |
| **Pressure** | Air pressure | Weather forecasting |

## 🛠️ Integration Methods

### Method 1: Use Pre-built Integration

```tsx
import { SharedJobMapWithWeather } from '@/components/shared/SharedJobMapWithWeather';

// In your component
<SharedJobMapWithWeather
  jobs={jobs}
  height="600px"
  showStreetView={false}
  onJobClick={(job) => console.log('Job clicked:', job)}
/>
```

### Method 2: Add to Existing Map

```tsx
import { WeatherOverlay } from '@/components/ui/WeatherOverlay';

// In your map component
const [map, setMap] = useState<google.maps.Map | null>(null);

// When your map loads
const handleMapLoad = (mapInstance: google.maps.Map) => {
  setMap(mapInstance);
};

// In your JSX
<div className="relative">
  <YourExistingMap onMapLoad={handleMapLoad} />
  <div className="absolute top-4 right-4">
    <WeatherOverlay map={map} />
  </div>
</div>
```

### Method 3: Custom Integration

```tsx
// Create your own weather controls
const toggleWeatherLayer = (layerType: string) => {
  if (!map) return;
  
  const weatherMapType = new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
      return `https://tile.openweathermap.org/map/${layerType}/${zoom}/${coord.x}/${coord.y}.png?appid=${apiKey}`;
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 18,
    minZoom: 0,
    name: 'Weather',
    opacity: 0.6
  });

  map.overlayMapTypes.push(weatherMapType);
};
```

## 📊 Weather Layer Details

### Available Layer Types:
- `clouds_new` - Current cloud coverage
- `precipitation_new` - Rain and snow
- `temp_new` - Temperature
- `wind_new` - Wind speed/direction
- `pressure_new` - Air pressure

### API Endpoint Format:
```
https://tile.openweathermap.org/map/{layer}/{zoom}/{x}/{y}.png?appid={API_KEY}
```

## 🎯 Real-World Use Cases

### Construction & Trade Work
- **Clouds**: Plan outdoor work schedules
- **Rain**: Avoid work during precipitation
- **Wind**: Safety for high-altitude work
- **Temperature**: Worker comfort and safety

### Example Implementation:
```tsx
// Show weather for job planning
const JobPlanningMap = () => {
  const [activeWeatherLayers, setActiveWeatherLayers] = useState(['clouds', 'precipitation']);
  
  return (
    <SharedJobMapWithWeather
      jobs={todaysJobs}
      height="500px"
      onJobClick={(job) => {
        // Show weather-specific job details
        showJobWeatherDetails(job);
      }}
    />
  );
};
```

## 🔧 Advanced Configuration

### Custom Layer Opacity
```tsx
const weatherMapType = new google.maps.ImageMapType({
  // ... other options
  opacity: 0.8, // 0.0 to 1.0
});
```

### Multiple Layers
```tsx
// Add multiple weather layers
const addMultipleWeatherLayers = () => {
  const layers = ['clouds_new', 'precipitation_new'];
  
  layers.forEach(layer => {
    const weatherMapType = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return `https://tile.openweathermap.org/map/${layer}/${zoom}/${coord.x}/${coord.y}.png?appid=${apiKey}`;
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: layer === 'clouds_new' ? 0.5 : 0.7,
      name: layer
    });
    
    map.overlayMapTypes.push(weatherMapType);
  });
};
```

## 📱 Mobile Optimization

The weather overlay is fully responsive and works on mobile devices:

```tsx
// Mobile-optimized weather controls
<div className="absolute top-2 right-2 z-10 md:top-4 md:right-4">
  <button className="px-2 py-1 md:px-3 md:py-2 bg-white rounded text-sm">
    Weather
  </button>
</div>
```

## 🚨 Important Notes

### API Limits
- **Free tier**: 1,000 calls/day
- **Rate limit**: 60 calls/minute
- **Data update**: Every 10 minutes

### Performance Tips
1. **Cache weather data** when possible
2. **Limit simultaneous layers** (max 2-3 for performance)
3. **Use appropriate opacity** (0.5-0.7 recommended)
4. **Remove layers when not needed** to save API calls

### Error Handling
```tsx
const handleWeatherError = (error: Error) => {
  console.error('Weather layer error:', error);
  // Show user-friendly message
  toast.error('Weather data temporarily unavailable');
};
```

## 🔍 Troubleshooting

### Common Issues:

1. **Weather layers not showing**
   - Check API key is correct
   - Verify API key is active (can take 1-2 hours)
   - Check browser console for errors

2. **API quota exceeded**
   - Reduce layer refresh frequency
   - Remove unused layers
   - Consider upgrading to paid plan

3. **Slow performance**
   - Use only necessary layers
   - Optimize opacity settings
   - Clean up layers when component unmounts

### Debug Mode:
```tsx
// Add debug logging
const debugWeatherAPI = () => {
  console.log('API Key:', import.meta.env.VITE_OPENWEATHERMAP_API_KEY ? 'Present' : 'Missing');
  console.log('Active layers:', activeWeatherLayers);
};
```

## 📈 Next Steps

1. **Get your API key** from OpenWeatherMap
2. **Add to .env.local** file
3. **Test with the example** component
4. **Integrate with your existing maps**
5. **Customize for your use case**

## 🆘 Support

If you need help:
1. Check the browser console for errors
2. Verify your API key is working at OpenWeatherMap
3. Test with the provided example components
4. Review the integration methods above

---

**Ready to add weather overlays to your maps?** Start with Step 1 above! 🌤️ 