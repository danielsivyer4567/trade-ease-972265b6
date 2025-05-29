import { format } from 'date-fns';

export const getCalendarClassNames = (teamColor: string) => ({
  months: "w-full",
  month: "w-full",
  table: "w-full border-collapse",
  head_row: "grid grid-cols-7",
  head_cell: "text-muted-foreground text-center text-sm font-medium p-2",
  row: "grid grid-cols-7",
  cell: "h-20 text-center text-sm p-0 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer",
  day: "h-20 w-full p-2 font-normal hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md",
  day_range_end: "day-range-end",
  day_selected: "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-800",
  day_today: "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50",
  day_outside: "text-gray-400 dark:text-gray-600",
  nav: "space-x-1 flex items-center justify-between p-2",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  caption: "flex justify-center py-4 relative items-center text-lg font-semibold"
});

export const getCalendarModifiers = (weatherDates: any[]) => ({
  rainy: (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weatherDates.some(rd => rd.date === dateStr);
  }
});

export const getCalendarModifiersStyles = () => ({
  rainy: {
    position: 'relative' as const
  }
});
