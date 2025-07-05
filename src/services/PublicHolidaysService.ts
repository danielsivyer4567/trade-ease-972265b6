import { format, isMatch } from 'date-fns';

export interface PublicHoliday {
  date: string; // YYYY-MM-DD format
  name: string;
  country: string;
  region?: string;
}

interface CountryHolidays {
  [country: string]: {
    fixed: Array<{ month: number; day: number; name: string }>;
    dynamic?: Array<{ date: string; name: string }>; // For holidays that change yearly
  };
}

// Common public holidays by country
const COUNTRY_HOLIDAYS: CountryHolidays = {
  US: {
    fixed: [
      { month: 1, day: 1, name: "New Year's Day" },
      { month: 7, day: 4, name: "Independence Day" },
      { month: 12, day: 25, name: "Christmas Day" },
    ],
    dynamic: [
      // These would be calculated dynamically in a real implementation
      { date: "2024-01-15", name: "Martin Luther King Jr. Day" },
      { date: "2024-02-19", name: "Presidents Day" },
      { date: "2024-05-27", name: "Memorial Day" },
      { date: "2024-09-02", name: "Labor Day" },
      { date: "2024-11-28", name: "Thanksgiving Day" },
    ]
  },
  AU: {
    fixed: [
      { month: 1, day: 1, name: "New Year's Day" },
      { month: 1, day: 26, name: "Australia Day" },
      { month: 4, day: 25, name: "Anzac Day" },
      { month: 12, day: 25, name: "Christmas Day" },
      { month: 12, day: 26, name: "Boxing Day" },
    ]
  },
  UK: {
    fixed: [
      { month: 1, day: 1, name: "New Year's Day" },
      { month: 12, day: 25, name: "Christmas Day" },
      { month: 12, day: 26, name: "Boxing Day" },
    ],
    dynamic: [
      { date: "2024-03-29", name: "Good Friday" },
      { date: "2024-04-01", name: "Easter Monday" },
      { date: "2024-05-06", name: "Early May Bank Holiday" },
      { date: "2024-05-27", name: "Spring Bank Holiday" },
      { date: "2024-08-26", name: "Summer Bank Holiday" },
    ]
  },
  CA: {
    fixed: [
      { month: 1, day: 1, name: "New Year's Day" },
      { month: 7, day: 1, name: "Canada Day" },
      { month: 12, day: 25, name: "Christmas Day" },
      { month: 12, day: 26, name: "Boxing Day" },
    ],
    dynamic: [
      { date: "2024-02-19", name: "Family Day" },
      { date: "2024-03-29", name: "Good Friday" },
      { date: "2024-05-20", name: "Victoria Day" },
      { date: "2024-09-02", name: "Labour Day" },
      { date: "2024-10-14", name: "Thanksgiving Day" },
    ]
  }
};

export class PublicHolidaysService {
  private static instance: PublicHolidaysService;
  private userCountry: string = 'US'; // Default to US
  private holidaysCache: Map<string, PublicHoliday[]> = new Map();

  static getInstance(): PublicHolidaysService {
    if (!PublicHolidaysService.instance) {
      PublicHolidaysService.instance = new PublicHolidaysService();
    }
    return PublicHolidaysService.instance;
  }

  async detectUserLocation(): Promise<string> {
    try {
      // Try to get user's timezone and deduce country
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      if (timezone.includes('America')) {
        if (timezone.includes('Toronto') || timezone.includes('Vancouver')) {
          return 'CA';
        }
        return 'US';
      } else if (timezone.includes('Europe/London')) {
        return 'UK';
      } else if (timezone.includes('Australia')) {
        return 'AU';
      }

      // Fallback: try geolocation API
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // This is a simplified country detection
              // In production, you'd use a proper geo-to-country service
              resolve('US'); // Default fallback
            },
            () => resolve('US') // Default on error
          );
        });
      }

      return 'US'; // Ultimate fallback
    } catch (error) {
      console.warn('Could not detect user location:', error);
      return 'US';
    }
  }

  async setUserCountry(country?: string): Promise<void> {
    if (country) {
      this.userCountry = country;
    } else {
      this.userCountry = await this.detectUserLocation();
    }
  }

  getHolidaysForYear(year: number, country?: string): PublicHoliday[] {
    const targetCountry = country || this.userCountry;
    const cacheKey = `${targetCountry}-${year}`;

    if (this.holidaysCache.has(cacheKey)) {
      return this.holidaysCache.get(cacheKey)!;
    }

    const holidays: PublicHoliday[] = [];
    const countryData = COUNTRY_HOLIDAYS[targetCountry];

    if (!countryData) {
      console.warn(`No holiday data available for country: ${targetCountry}`);
      return holidays;
    }

    // Add fixed holidays
    countryData.fixed.forEach(holiday => {
      const date = new Date(year, holiday.month - 1, holiday.day);
      holidays.push({
        date: format(date, 'yyyy-MM-dd'),
        name: holiday.name,
        country: targetCountry
      });
    });

    // Add dynamic holidays (only for current year in this simplified implementation)
    if (countryData.dynamic && year === 2024) {
      countryData.dynamic.forEach(holiday => {
        holidays.push({
          date: holiday.date,
          name: holiday.name,
          country: targetCountry
        });
      });
    }

    this.holidaysCache.set(cacheKey, holidays);
    return holidays;
  }

  getHolidayForDate(date: Date, country?: string): PublicHoliday | null {
    const dateStr = format(date, 'yyyy-MM-dd');
    const year = date.getFullYear();
    const holidays = this.getHolidaysForYear(year, country);
    
    return holidays.find(holiday => holiday.date === dateStr) || null;
  }

  isPublicHoliday(date: Date, country?: string): boolean {
    return this.getHolidayForDate(date, country) !== null;
  }

  getHolidaysForMonth(date: Date, country?: string): PublicHoliday[] {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const holidays = this.getHolidaysForYear(year, country);
    
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === year && 
             holidayDate.getMonth() + 1 === month;
    });
  }
}

export const publicHolidaysService = PublicHolidaysService.getInstance(); 