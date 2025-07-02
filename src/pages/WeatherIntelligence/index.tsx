import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Compass, 
  MapPin, 
  Bell, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Zap,
  Snowflake,
  Umbrella,
  Search,
  Navigation,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WeatherNotificationService from '@/services/WeatherNotificationService';

interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
    dewPoint: number;
    cloudCover: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
    windDirection: number;
  }>;
  alerts: Array<{
    id: string;
    type: 'severe' | 'warning' | 'watch' | 'advisory';
    title: string;
    description: string;
    severity: 'extreme' | 'severe' | 'moderate' | 'minor';
    startTime: string;
    endTime: string;
    areas: string[];
  }>;
  radar: {
    url: string;
    timestamp: string;
  };
}

interface JobWeatherAlert {
  jobId: string;
  jobName: string;
  location: string;
  alertType: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  severityFilter: string[];
  locationRadius: number;
  workingHoursOnly: boolean;
  weekendsIncluded: boolean;
}

const WeatherIntelligence: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [jobAlerts, setJobAlerts] = useState<JobWeatherAlert[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    severityFilter: ['extreme', 'severe', 'moderate'],
    locationRadius: 50,
    workingHoursOnly: false,
    weekendsIncluded: true
  });
  const [activeTab, setActiveTab] = useState('current');
  const { toast } = useToast();

  // Mock weather data for demonstration
  const mockWeatherData: WeatherData = {
    location: 'Brisbane, QLD',
    coordinates: { lat: -27.4698, lon: 153.0251 },
    current: {
      temperature: 26,
      feelsLike: 29,
      humidity: 68,
      pressure: 1013,
      windSpeed: 15,
      windDirection: 135,
      visibility: 10,
      uvIndex: 7,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      dewPoint: 19,
      cloudCover: 45
    },
    forecast: [
      {
        date: '2025-01-02',
        day: 'Today',
        high: 28,
        low: 21,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        precipitation: 20,
        windSpeed: 15,
        windDirection: 135,
        humidity: 65
      },
      {
        date: '2025-01-03',
        day: 'Tomorrow',
        high: 31,
        low: 23,
        condition: 'Sunny',
        icon: 'sunny',
        precipitation: 5,
        windSpeed: 12,
        windDirection: 120,
        humidity: 55
      },
      {
        date: '2025-01-04',
        day: 'Friday',
        high: 29,
        low: 22,
        condition: 'Light Rain',
        icon: 'light-rain',
        precipitation: 75,
        windSpeed: 18,
        windDirection: 180,
        humidity: 78
      },
      {
        date: '2025-01-05',
        day: 'Saturday',
        high: 25,
        low: 19,
        condition: 'Heavy Rain',
        icon: 'heavy-rain',
        precipitation: 95,
        windSpeed: 25,
        windDirection: 200,
        humidity: 85
      },
      {
        date: '2025-01-06',
        day: 'Sunday',
        high: 27,
        low: 20,
        condition: 'Clearing',
        icon: 'clearing',
        precipitation: 30,
        windSpeed: 14,
        windDirection: 150,
        humidity: 70
      }
    ],
    hourly: [
      { time: '9:00 AM', temperature: 24, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 10, windSpeed: 12, windDirection: 130 },
      { time: '12:00 PM', temperature: 27, condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 15, windSpeed: 15, windDirection: 135 },
      { time: '3:00 PM', temperature: 28, condition: 'Cloudy', icon: 'cloudy', precipitation: 25, windSpeed: 18, windDirection: 140 },
      { time: '6:00 PM', temperature: 26, condition: 'Light Rain', icon: 'light-rain', precipitation: 60, windSpeed: 20, windDirection: 145 },
      { time: '9:00 PM', temperature: 23, condition: 'Clearing', icon: 'clearing', precipitation: 20, windSpeed: 16, windDirection: 140 }
    ],
    alerts: [
      {
        id: 'alert-1',
        type: 'severe',
        title: 'Severe Thunderstorm Warning',
        description: 'Severe thunderstorms with damaging winds, large hail, and heavy rainfall expected. Construction activities should be suspended.',
        severity: 'severe',
        startTime: '2025-01-02T14:00:00Z',
        endTime: '2025-01-02T20:00:00Z',
        areas: ['Brisbane', 'Gold Coast', 'Sunshine Coast']
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'Strong Wind Warning',
        description: 'Strong winds up to 50 km/h expected. Crane operations and high work should be avoided.',
        severity: 'moderate',
        startTime: '2025-01-03T06:00:00Z',
        endTime: '2025-01-03T18:00:00Z',
        areas: ['Brisbane', 'Ipswich']
      }
    ],
    radar: {
      url: '/api/weather/radar/current',
      timestamp: '2025-01-02T12:00:00Z'
    }
  };

  // Mock job alerts
  const mockJobAlerts: JobWeatherAlert[] = [
    {
      jobId: 'job-001',
      jobName: 'Residential Build - 123 Main St',
      location: 'Brisbane, QLD',
      alertType: 'Heavy Rain Warning',
      severity: 'high',
      message: 'Heavy rain expected Friday. Consider rescheduling concrete pour.',
      timestamp: '2025-01-02T08:00:00Z',
      acknowledged: false
    },
    {
      jobId: 'job-002',
      jobName: 'Commercial Renovation - CBD Tower',
      location: 'Brisbane CBD, QLD',
      alertType: 'Strong Wind Alert',
      severity: 'medium',
      message: 'Strong winds forecast for tomorrow. Crane operations may be affected.',
      timestamp: '2025-01-02T07:30:00Z',
      acknowledged: false
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setWeatherData(mockWeatherData);
    setJobAlerts(mockJobAlerts);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation not available:', error);
        }
      );
    }

    // Set up real-time updates (every 5 minutes)
    const interval = setInterval(() => {
      if (notifications.enabled) {
        checkForWeatherUpdates();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [notifications.enabled]);

  const checkForWeatherUpdates = () => {
    // In a real implementation, this would check for weather changes
    // and trigger notifications if conditions worsen or improve
    console.log('Checking for weather updates...');
  };

  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would call a geocoding API
      // and then fetch weather data for the new location
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Location Updated",
        description: `Weather data updated for ${searchLocation}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data for location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          // In real implementation, fetch weather for current coordinates
          setLoading(false);
          toast({
            title: "Location Updated",
            description: "Using your current location for weather data",
          });
        },
        (error) => {
          setLoading(false);
          toast({
            title: "Location Error",
            description: "Could not access your location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setJobAlerts(prev => 
      prev.map(alert => 
        alert.jobId === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const playNotificationSound = () => {
    if (notifications.soundEnabled) {
      // In a real implementation, this would play an audio notification
      console.log('Playing notification sound...');
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'sunny': <Sun className="h-6 w-6 text-yellow-500" />,
      'partly-cloudy': <Cloud className="h-6 w-6 text-gray-400" />,
      'cloudy': <Cloud className="h-6 w-6 text-gray-600" />,
      'light-rain': <CloudRain className="h-6 w-6 text-blue-500" />,
      'heavy-rain': <CloudRain className="h-6 w-6 text-blue-700" />,
      'clearing': <Sun className="h-6 w-6 text-yellow-400" />
    };
    return iconMap[condition] || <Cloud className="h-6 w-6 text-gray-500" />;
  };

  const getSeverityColor = (severity: string) => {
    const colorMap: Record<string, string> = {
      'extreme': 'bg-red-600',
      'severe': 'bg-red-500',
      'moderate': 'bg-orange-500',
      'minor': 'bg-yellow-500',
      'high': 'bg-red-500',
      'medium': 'bg-orange-500',
      'low': 'bg-yellow-500'
    };
    return colorMap[severity] || 'bg-gray-500';
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  if (!weatherData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading weather data...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 space-y-6" style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333] mb-2 flex items-center justify-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Weather Intelligence
          </h1>
          <p className="text-[#6c757d]">Professional weather monitoring for construction projects</p>
        </div>

        {/* Location Search */}
        <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
          <CardHeader>
            <CardTitle className="text-[#333] flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search for a location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  className="bg-white"
                />
              </div>
              <Button 
                onClick={handleLocationSearch}
                disabled={loading}
                style={{ borderRadius: '25px' }}
                className="px-6"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={getCurrentLocation}
                disabled={loading}
                variant="outline"
                style={{ borderRadius: '25px' }}
                className="px-6"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#6c757d]">
              <MapPin className="h-4 w-4" />
              Current: {weatherData.location}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {weatherData.alerts.length > 0 && (
          <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
            <CardHeader>
              <CardTitle className="text-[#333] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weatherData.alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)} border-l-current`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <p className="text-xs text-[#6c757d] mt-2">
                          Areas: {alert.areas.join(', ')}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Job-Specific Alerts */}
        {jobAlerts.filter(alert => !alert.acknowledged).length > 0 && (
          <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
            <CardHeader>
              <CardTitle className="text-[#333] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                Job Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobAlerts.filter(alert => !alert.acknowledged).map((alert) => (
                <div key={alert.jobId} className="flex items-start justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-semibold text-[#333]">{alert.alertType}</span>
                    </div>
                    <p className="text-sm text-[#555] mb-1">{alert.jobName}</p>
                    <p className="text-sm text-[#6c757d] mb-2">{alert.message}</p>
                    <p className="text-xs text-[#6c757d]">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {alert.location}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.jobId)}
                    style={{ borderRadius: '25px' }}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Weather Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-[#94a3b8]">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="forecast">7-Day</TabsTrigger>
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Conditions */}
              <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
                <CardHeader>
                  <CardTitle className="text-[#333] flex items-center gap-2">
                    {getWeatherIcon(weatherData.current.icon)}
                    Current Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#333]">{weatherData.current.temperature}°C</div>
                      <div className="text-[#6c757d]">Feels like {weatherData.current.feelsLike}°C</div>
                      <div className="text-[#555] mt-2">{weatherData.current.condition}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-[#555]">Humidity: {weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-[#555]">
                          Wind: {weatherData.current.windSpeed} km/h {getWindDirection(weatherData.current.windDirection)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-[#555]">Visibility: {weatherData.current.visibility} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-[#555]">UV Index: {weatherData.current.uvIndex}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
                <CardHeader>
                  <CardTitle className="text-[#333] flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Detailed Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#555]">Pressure:</span>
                        <span className="text-[#333] font-medium">{weatherData.current.pressure} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#555]">Dew Point:</span>
                        <span className="text-[#333] font-medium">{weatherData.current.dewPoint}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#555]">Cloud Cover:</span>
                        <span className="text-[#333] font-medium">{weatherData.current.cloudCover}%</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Compass className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm text-[#555]">Wind Direction</div>
                        <div className="font-bold text-[#333]">{getWindDirection(weatherData.current.windDirection)}</div>
                        <div className="text-xs text-[#6c757d]">{weatherData.current.windDirection}°</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hourly">
            <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
              <CardHeader>
                <CardTitle className="text-[#333] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hourly Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.hourly.map((hour, index) => (
                    <div key={index} className="text-center p-3 bg-white rounded-lg">
                      <div className="text-sm text-[#6c757d] mb-2">{hour.time}</div>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(hour.icon)}
                      </div>
                      <div className="font-bold text-[#333]">{hour.temperature}°C</div>
                      <div className="text-xs text-[#555] mt-1">{hour.condition}</div>
                      <div className="text-xs text-blue-500 mt-1">{hour.precipitation}%</div>
                      <div className="text-xs text-[#6c757d]">{hour.windSpeed} km/h</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
              <CardHeader>
                <CardTitle className="text-[#333] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 text-[#555] font-medium">{day.day}</div>
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(day.icon)}
                          <span className="text-[#555]">{day.condition}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xs text-[#6c757d]">Rain</div>
                          <div className="text-sm text-blue-500">{day.precipitation}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#6c757d]">Wind</div>
                          <div className="text-sm text-[#555]">{day.windSpeed} km/h</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#6c757d]">High/Low</div>
                          <div className="text-sm text-[#333] font-medium">{day.high}° / {day.low}°</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar">
            <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
              <CardHeader>
                <CardTitle className="text-[#333] flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Weather Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                    <p className="text-[#555]">Interactive radar map will be displayed here</p>
                    <p className="text-sm text-[#6c757d] mt-2">
                      Last updated: {new Date(weatherData.radar.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card style={{ background: '#e2e8f0', border: '2px solid #94a3b8' }}>
              <CardHeader>
                <CardTitle className="text-[#333] flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#555]">Enable Notifications</Label>
                    <p className="text-sm text-[#6c757d]">Receive weather alerts and updates</p>
                  </div>
                  <Button
                    variant={notifications.enabled ? "default" : "outline"}
                    onClick={() => setNotifications(prev => ({ ...prev, enabled: !prev.enabled }))}
                    style={{ borderRadius: '25px' }}
                  >
                    {notifications.enabled ? <Bell className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#555]">Sound Notifications</Label>
                    <p className="text-sm text-[#6c757d]">Play sound for weather alerts</p>
                  </div>
                  <Button
                    variant={notifications.soundEnabled ? "default" : "outline"}
                    onClick={() => setNotifications(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    style={{ borderRadius: '25px' }}
                  >
                    {notifications.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#555]">Alert Radius (km)</Label>
                  <Input
                    type="number"
                    value={notifications.locationRadius}
                    onChange={(e) => setNotifications(prev => ({ ...prev, locationRadius: parseInt(e.target.value) || 50 }))}
                    className="bg-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#555]">Working Hours Only</Label>
                    <p className="text-sm text-[#6c757d]">Only send alerts during work hours (6 AM - 6 PM)</p>
                  </div>
                  <Button
                    variant={notifications.workingHoursOnly ? "default" : "outline"}
                    onClick={() => setNotifications(prev => ({ ...prev, workingHoursOnly: !prev.workingHoursOnly }))}
                    style={{ borderRadius: '25px' }}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#555]">Include Weekends</Label>
                    <p className="text-sm text-[#6c757d]">Send alerts on weekends</p>
                  </div>
                  <Button
                    variant={notifications.weekendsIncluded ? "default" : "outline"}
                    onClick={() => setNotifications(prev => ({ ...prev, weekendsIncluded: !prev.weekendsIncluded }))}
                    style={{ borderRadius: '25px' }}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[#555]">Test Notifications</Label>
                      <p className="text-sm text-[#6c757d]">Test your notification settings</p>
                    </div>
                    <Button
                      onClick={async () => {
                        const notificationService = WeatherNotificationService.getInstance();
                        await notificationService.testNotification();
                        toast({
                          title: "Test Notification Sent",
                          description: "Check your browser notifications and listen for audio alerts.",
                        });
                      }}
                      style={{ borderRadius: '25px' }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Test Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WeatherIntelligence; 