export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isSortedLater: boolean;
  isIncomplete: boolean;
}
