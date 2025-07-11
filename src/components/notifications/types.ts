export interface Point {
  x: number;
  y: number;
}

export type DrawingTool = 'pencil' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'star';

export interface DrawingState {
  isActive: boolean;
  tool: DrawingTool;
  color: string;
  lineWidth: number;
  isDrawingOnPage: boolean;
}