
import { StaffMember } from './types';

export const CURRENT_USER_ID = 'user_current_123';
export const CURRENT_USER_NAME = 'You';

export const AVAILABLE_STAFF: StaffMember[] = [
  { id: 'staff_1', name: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
  { id: 'staff_2', name: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: 'staff_3', name: 'Charlie Chaplin', avatarUrl: 'https://picsum.photos/seed/charlie/40/40' },
  { id: 'staff_4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
];

export const DEFAULT_DRAWING_STATE = {
  tool: 'pencil' as const,
  color: '#FF0000', // Red
  lineWidth: 3,
};

export const DRAWING_COLORS = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#000000', '#FFFFFF', '#FFA500', '#800080'];
export const DRAWING_LINE_WIDTHS = [1, 3, 5, 8, 12];

export const MOCK_BUSINESS_LOGO_URL = 'https://picsum.photos/seed/logo/64/64';

export const PANEL_SIDEBAR_WIDTH = 0; 

export const MAX_COMMENT_LENGTH = 1000;
