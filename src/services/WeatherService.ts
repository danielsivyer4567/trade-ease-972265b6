interface WeatherCondition {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  visibility: number;
  condition: string;
  uvIndex: number;
  pressure: number;
}

interface WeatherAlert {
  id: string;
  type: 'severe' | 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  startTime: string;
  endTime: string;
  impactedActivities: string[];
  riskLevel: 'high' | 'medium' | 'low';
}

interface WeatherForecast {
  date: string;
  conditions: WeatherCondition;
  constructionSuitability: {
    overall: 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable';
    concreteWork: 'suitable' | 'caution' | 'unsuitable';
    roofWork: 'suitable' | 'caution' | 'unsuitable';
    painting: 'suitable' | 'caution' | 'unsuitable';
    excavation: 'suitable' | 'caution' | 'unsuitable';
    craneOperations: 'suitable' | 'caution' | 'unsuitable';
  };
  risks: string[];
  recommendations: string[];
}

interface JobWeatherImpact {
  jobId: string;
  location: { lat: number; lon: number };
  weatherRisk: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    estimatedDelays: number; // in days
    additionalCosts: number; // in dollars
  };
  mitigationStrategies: string[];
  optimalWorkWindows: Array<{
    startDate: string;
    endDate: string;
    activities: string[];
    confidence: number;
  }>;
}

export class WeatherService {
  private static readonly BASE_URL = process.env.REACT_APP_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
  private static readonly API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';

  /**
   * Get current weather conditions for a location
   */
  static async getCurrentWeather(lat: number, lon: number): Promise<WeatherCondition> {
    // Mock weather data
    return {
      temperature: 26,
      humidity: 68,
      windSpeed: 15,
      windDirection: 135,
      precipitation: 20,
      visibility: 10,
      condition: 'Partly Cloudy',
      uvIndex: 7,
      pressure: 1013
    };
  }

  /**
   * Get weather forecast for the next 7 days
   */
  static async getWeatherForecast(lat: number, lon: number, days: number = 7): Promise<WeatherForecast[]> {
    try {
      // Mock forecast data
      const mockForecast: WeatherForecast[] = [];
      const baseDate = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        
        const temperature = 26 + Math.random() * 10 - 5; // 21-31°C range
        const humidity = 50 + Math.random() * 40; // 50-90% range
        const windSpeed = 10 + Math.random() * 20; // 10-30 km/h range
        const precipitation = Math.random() * 100; // 0-100% chance
        
        const conditions: WeatherCondition = {
          temperature,
          humidity,
          windSpeed,
          windDirection: Math.random() * 360,
          precipitation,
          visibility: 10 - (precipitation / 20), // Reduced visibility with rain
          condition: precipitation > 70 ? 'Rainy' : precipitation > 30 ? 'Cloudy' : 'Sunny',
          uvIndex: Math.floor(Math.random() * 11),
          pressure: 1000 + Math.random() * 40
        };

        const constructionSuitability = this.assessConstructionSuitability(conditions);
        const risks = this.identifyWeatherRisks(conditions);
        const recommendations = this.generateRecommendations(conditions, risks);

        mockForecast.push({
          date: date.toISOString().split('T')[0],
          conditions,
          constructionSuitability,
          risks,
          recommendations
        });
      }

      return mockForecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Get active weather alerts for a location
   */
  static async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      // Mock alert data
      const mockAlerts: WeatherAlert[] = [
        {
          id: 'alert-001',
          type: 'severe',
          title: 'Severe Thunderstorm Warning',
          description: 'Severe thunderstorms with damaging winds, large hail, and heavy rainfall expected. Construction activities should be suspended.',
          severity: 'severe',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
          impactedActivities: ['concrete work', 'roofing', 'crane operations', 'exterior painting'],
          riskLevel: 'high'
        },
        {
          id: 'alert-002',
          type: 'warning',
          title: 'Strong Wind Warning',
          description: 'Strong winds up to 50 km/h expected. Crane operations and high work should be avoided.',
          severity: 'moderate',
          startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          impactedActivities: ['crane operations', 'roofing', 'scaffolding work'],
          riskLevel: 'medium'
        }
      ];

      return mockAlerts;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw new Error('Failed to fetch weather alerts');
    }
  }

  /**
   * Analyze weather impact on a specific job
   */
  static async analyzeJobWeatherImpact(
    jobId: string,
    location: { lat: number; lon: number },
    plannedActivities: string[],
    startDate: string,
    endDate: string
  ): Promise<JobWeatherImpact> {
    try {
      const forecast = await this.getWeatherForecast(location.lat, location.lon);
      const alerts = await this.getWeatherAlerts(location.lat, location.lon);

      // Calculate weather risk based on forecast and planned activities
      const weatherRisk = this.calculateWeatherRisk(forecast, plannedActivities, alerts);
      
      // Generate mitigation strategies
      const mitigationStrategies = this.generateMitigationStrategies(weatherRisk, plannedActivities);
      
      // Identify optimal work windows
      const optimalWorkWindows = this.identifyOptimalWorkWindows(forecast, plannedActivities);

      return {
        jobId,
        location,
        weatherRisk,
        mitigationStrategies,
        optimalWorkWindows
      };
    } catch (error) {
      console.error('Error analyzing job weather impact:', error);
      throw new Error('Failed to analyze weather impact');
    }
  }

  /**
   * Get weather-based cost adjustments for construction activities
   */
  static getWeatherCostAdjustments(conditions: WeatherCondition, activities: string[]): Record<string, number> {
    const adjustments: Record<string, number> = {};

    activities.forEach(activity => {
      let adjustment = 0;

      // Temperature-based adjustments
      if (conditions.temperature < 5 || conditions.temperature > 35) {
        adjustment += 0.15; // 15% increase for extreme temperatures
      }

      // Wind-based adjustments
      if (conditions.windSpeed > 25) {
        if (activity.includes('crane') || activity.includes('roofing')) {
          adjustment += 0.25; // 25% increase for wind-sensitive activities
        } else {
          adjustment += 0.10; // 10% general increase for high winds
        }
      }

      // Precipitation-based adjustments
      if (conditions.precipitation > 50) {
        if (activity.includes('concrete') || activity.includes('painting')) {
          adjustment += 0.30; // 30% increase for rain-sensitive activities
        } else {
          adjustment += 0.15; // 15% general increase for rain
        }
      }

      // Humidity-based adjustments (affects painting and concrete curing)
      if (conditions.humidity > 85) {
        if (activity.includes('painting') || activity.includes('concrete')) {
          adjustment += 0.10; // 10% increase for high humidity
        }
      }

      adjustments[activity] = adjustment;
    });

    return adjustments;
  }

  /**
   * Get weather notifications for jobs
   */
  static async getJobWeatherNotifications(jobs: Array<{ id: string; location: { lat: number; lon: number }; activities: string[] }>): Promise<Array<{
    jobId: string;
    notifications: Array<{
      type: 'alert' | 'warning' | 'info';
      message: string;
      priority: 'high' | 'medium' | 'low';
      timestamp: string;
    }>;
  }>> {
    try {
      const notifications = await Promise.all(
        jobs.map(async (job) => {
          const alerts = await this.getWeatherAlerts(job.location.lat, job.location.lon);
          const forecast = await this.getWeatherForecast(job.location.lat, job.location.lon, 3);

          const jobNotifications = [];

          // Process alerts
          alerts.forEach(alert => {
            const affectedActivities = job.activities.filter(activity => 
              alert.impactedActivities.some(impacted => 
                activity.toLowerCase().includes(impacted.toLowerCase())
              )
            );

            if (affectedActivities.length > 0) {
              jobNotifications.push({
                type: 'alert' as const,
                message: `${alert.title}: ${affectedActivities.join(', ')} may be affected`,
                priority: alert.riskLevel as 'high' | 'medium' | 'low',
                timestamp: alert.startTime
              });
            }
          });

          // Process forecast warnings
          forecast.slice(0, 3).forEach((day, index) => {
            if (day.constructionSuitability.overall === 'poor' || day.constructionSuitability.overall === 'unsuitable') {
              jobNotifications.push({
                type: 'warning' as const,
                message: `Weather conditions on ${day.date} may impact construction activities`,
                priority: 'medium' as const,
                timestamp: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString()
              });
            }
          });

          return {
            jobId: job.id,
            notifications: jobNotifications
          };
        })
      );

      return notifications;
    } catch (error) {
      console.error('Error getting job weather notifications:', error);
      return [];
    }
  }

  // Private helper methods

  private static assessConstructionSuitability(conditions: WeatherCondition) {
    const suitability = {
      overall: 'good' as 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable',
      concreteWork: 'suitable' as 'suitable' | 'caution' | 'unsuitable',
      roofWork: 'suitable' as 'suitable' | 'caution' | 'unsuitable',
      painting: 'suitable' as 'suitable' | 'caution' | 'unsuitable',
      excavation: 'suitable' as 'suitable' | 'caution' | 'unsuitable',
      craneOperations: 'suitable' as 'suitable' | 'caution' | 'unsuitable'
    };

    // Assess concrete work
    if (conditions.temperature < 5 || conditions.temperature > 35 || conditions.precipitation > 30) {
      suitability.concreteWork = 'unsuitable';
    } else if (conditions.temperature < 10 || conditions.humidity > 85) {
      suitability.concreteWork = 'caution';
    }

    // Assess roof work
    if (conditions.windSpeed > 25 || conditions.precipitation > 20) {
      suitability.roofWork = 'unsuitable';
    } else if (conditions.windSpeed > 15 || conditions.precipitation > 10) {
      suitability.roofWork = 'caution';
    }

    // Assess painting
    if (conditions.precipitation > 10 || conditions.humidity > 85 || conditions.windSpeed > 20) {
      suitability.painting = 'unsuitable';
    } else if (conditions.humidity > 70 || conditions.windSpeed > 15) {
      suitability.painting = 'caution';
    }

    // Assess excavation
    if (conditions.precipitation > 50) {
      suitability.excavation = 'unsuitable';
    } else if (conditions.precipitation > 20) {
      suitability.excavation = 'caution';
    }

    // Assess crane operations
    if (conditions.windSpeed > 20 || conditions.visibility < 5) {
      suitability.craneOperations = 'unsuitable';
    } else if (conditions.windSpeed > 15 || conditions.visibility < 8) {
      suitability.craneOperations = 'caution';
    }

    // Determine overall suitability
    const unsuitableCount = Object.values(suitability).filter(s => s === 'unsuitable').length;
    const cautionCount = Object.values(suitability).filter(s => s === 'caution').length;

    if (unsuitableCount > 2) {
      suitability.overall = 'unsuitable';
    } else if (unsuitableCount > 0) {
      suitability.overall = 'poor';
    } else if (cautionCount > 2) {
      suitability.overall = 'fair';
    } else if (cautionCount > 0) {
      suitability.overall = 'good';
    } else {
      suitability.overall = 'excellent';
    }

    return suitability;
  }

  private static identifyWeatherRisks(conditions: WeatherCondition): string[] {
    const risks = [];

    if (conditions.temperature < 5) {
      risks.push('Freezing temperatures may affect concrete curing and equipment operation');
    }
    if (conditions.temperature > 35) {
      risks.push('High temperatures may cause rapid concrete curing and worker heat stress');
    }
    if (conditions.windSpeed > 25) {
      risks.push('Strong winds may prevent crane operations and roofing work');
    }
    if (conditions.precipitation > 50) {
      risks.push('Heavy rain may halt outdoor activities and cause site flooding');
    }
    if (conditions.humidity > 85) {
      risks.push('High humidity may slow paint drying and affect concrete finish');
    }
    if (conditions.visibility < 5) {
      risks.push('Poor visibility may create safety hazards for equipment operation');
    }
    if (conditions.uvIndex > 8) {
      risks.push('High UV index requires additional worker protection measures');
    }

    return risks;
  }

  private static generateRecommendations(conditions: WeatherCondition, risks: string[]): string[] {
    const recommendations = [];

    if (conditions.temperature < 5) {
      recommendations.push('Use heated enclosures for concrete work');
      recommendations.push('Implement cold weather concreting procedures');
    }
    if (conditions.temperature > 35) {
      recommendations.push('Schedule concrete pours for early morning');
      recommendations.push('Provide additional cooling for workers');
    }
    if (conditions.windSpeed > 20) {
      recommendations.push('Suspend crane operations');
      recommendations.push('Secure loose materials and equipment');
    }
    if (conditions.precipitation > 30) {
      recommendations.push('Reschedule outdoor concrete work');
      recommendations.push('Ensure proper site drainage');
    }
    if (conditions.humidity > 80) {
      recommendations.push('Allow extra time for paint and coating drying');
      recommendations.push('Use dehumidification in enclosed spaces');
    }

    return recommendations;
  }

  private static calculateWeatherRisk(
    forecast: WeatherForecast[],
    activities: string[],
    alerts: WeatherAlert[]
  ): { level: 'low' | 'medium' | 'high'; factors: string[]; estimatedDelays: number; additionalCosts: number } {
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const factors = [];
    let estimatedDelays = 0;
    let additionalCosts = 0;

    // Analyze forecast risks
    const poorWeatherDays = forecast.filter(day => 
      day.constructionSuitability.overall === 'poor' || day.constructionSuitability.overall === 'unsuitable'
    ).length;

    if (poorWeatherDays > 3) {
      riskLevel = 'high';
      factors.push('Extended period of poor weather conditions');
      estimatedDelays += poorWeatherDays * 0.5;
      additionalCosts += poorWeatherDays * 500;
    } else if (poorWeatherDays > 1) {
      riskLevel = 'medium';
      factors.push('Multiple days of challenging weather conditions');
      estimatedDelays += poorWeatherDays * 0.3;
      additionalCosts += poorWeatherDays * 300;
    }

    // Analyze alert risks
    const highSeverityAlerts = alerts.filter(alert => alert.severity === 'severe' || alert.severity === 'extreme');
    if (highSeverityAlerts.length > 0) {
      riskLevel = 'high';
      factors.push('Severe weather alerts in effect');
      estimatedDelays += highSeverityAlerts.length * 1;
      additionalCosts += highSeverityAlerts.length * 1000;
    }

    // Activity-specific risks
    const sensitiveActivities = activities.filter(activity => 
      activity.includes('concrete') || activity.includes('painting') || activity.includes('roofing')
    );
    if (sensitiveActivities.length > 0 && poorWeatherDays > 0) {
      factors.push('Weather-sensitive activities scheduled during poor conditions');
      additionalCosts += sensitiveActivities.length * 200;
    }

    return {
      level: riskLevel,
      factors,
      estimatedDelays: Math.round(estimatedDelays * 10) / 10,
      additionalCosts: Math.round(additionalCosts)
    };
  }

  private static generateMitigationStrategies(
    weatherRisk: { level: string; factors: string[] },
    activities: string[]
  ): string[] {
    const strategies = [];

    if (weatherRisk.level === 'high') {
      strategies.push('Consider rescheduling weather-sensitive activities');
      strategies.push('Implement comprehensive weather monitoring');
      strategies.push('Prepare alternative indoor work plans');
    }

    if (activities.some(a => a.includes('concrete'))) {
      strategies.push('Have heated enclosures ready for cold weather');
      strategies.push('Schedule concrete pours during optimal weather windows');
    }

    if (activities.some(a => a.includes('roofing'))) {
      strategies.push('Monitor wind conditions closely');
      strategies.push('Have fall protection systems ready');
    }

    if (activities.some(a => a.includes('painting'))) {
      strategies.push('Plan painting during low humidity periods');
      strategies.push('Have temporary shelters available');
    }

    strategies.push('Maintain emergency response procedures');
    strategies.push('Ensure all equipment is weather-protected');

    return strategies;
  }

  private static identifyOptimalWorkWindows(
    forecast: WeatherForecast[],
    activities: string[]
  ): Array<{ startDate: string; endDate: string; activities: string[]; confidence: number }> {
    const windows = [];

    for (let i = 0; i < forecast.length; i++) {
      const day = forecast[i];
      if (day.constructionSuitability.overall === 'excellent' || day.constructionSuitability.overall === 'good') {
        const suitableActivities = activities.filter(activity => {
          if (activity.includes('concrete')) return day.constructionSuitability.concreteWork === 'suitable';
          if (activity.includes('roofing')) return day.constructionSuitability.roofWork === 'suitable';
          if (activity.includes('painting')) return day.constructionSuitability.painting === 'suitable';
          if (activity.includes('excavation')) return day.constructionSuitability.excavation === 'suitable';
          if (activity.includes('crane')) return day.constructionSuitability.craneOperations === 'suitable';
          return true;
        });

        if (suitableActivities.length > 0) {
          const confidence = day.constructionSuitability.overall === 'excellent' ? 0.9 : 0.7;
          windows.push({
            startDate: day.date,
            endDate: day.date,
            activities: suitableActivities,
            confidence
          });
        }
      }
    }

    return windows;
  }
}

export default WeatherService; 