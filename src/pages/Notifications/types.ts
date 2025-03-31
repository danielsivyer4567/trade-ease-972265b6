
export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isSortedLater: boolean;
  isIncomplete: boolean;
  isUserTag?: boolean;
  taggedUserId?: number;
  tagPosition?: { x: number, y: number };
  tagPageUrl?: string;
  tagImage?: string;
}
