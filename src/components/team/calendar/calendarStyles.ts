import { format } from 'date-fns';

export const getCalendarClassNames = (teamColor: string) => ({
  months: "w-full",
  month: "w-full",
  table: "w-full border-collapse",
  head_row: "grid grid-cols-7 overflow-hidden border-b-2 border-slate-300",
  head_cell: "text-slate-600 text-center text-sm font-semibold p-3 bg-slate-200 border-r border-slate-300 last:border-r-0",
  row: "grid grid-cols-7",
  cell: "h-20 text-center text-sm p-0 relative hover:bg-slate-100 cursor-pointer transition-all duration-200 border border-slate-200 m-0.5",
  day: "h-20 w-full p-2 font-normal hover:bg-slate-100 transition-all duration-200",
  day_range_end: "day-range-end",
  day_selected: "bg-blue-50 border-blue-200 shadow-sm hover:bg-blue-100",
  day_today: "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 shadow-md font-semibold",
  day_outside: "text-slate-400 bg-slate-50",
  nav: "space-x-1 flex items-center justify-between p-3 bg-slate-200",
  nav_button_previous: "absolute left-2 bg-white hover:bg-slate-100 border border-slate-300 p-2 transition-all duration-200",
  nav_button_next: "absolute right-2 bg-white hover:bg-slate-100 border border-slate-300 p-2 transition-all duration-200",
  caption: "flex justify-center py-2 relative items-center text-lg font-bold text-slate-700"
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
