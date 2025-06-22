import axios from 'axios';

export interface ScreenAnalysisRequest {
  imageData: string;
  context?: string;
  userId?: string;
  sessionId?: string;
}

export interface ScreenAnalysisResponse {
  analysis: string;
  uiElements: UIElement[];
  suggestedActions: SuggestedAction[];
  overlayCommands: OverlayCommand[];
  confidence: number;
}

export interface UIElement {
  type: 'button' | 'input' | 'text' | 'image' | 'link' | 'form' | 'menu';
  text?: string;
  position: { x: number; y: number; width: number; height: number };
  confidence: number;
  action?: string;
}

export interface SuggestedAction {
  type: 'click' | 'type' | 'scroll' | 'navigate' | 'highlight' | 'explain';
  target: string;
  description: string;
  position?: { x: number; y: number };
  value?: string;
}

export interface OverlayCommand {
  type: 'highlight' | 'cursor' | 'arrow' | 'circle' | 'text' | 'clear';
  position: { x: number; y: number };
  size?: { width: number; height: number };
  color?: string;
  text?: string;
  duration?: number;
  animation?: 'pulse' | 'fade' | 'bounce';
}

export interface AISession {
  sessionId: string;
  userId: string;
  startTime: Date;
  isActive: boolean;
  analysisHistory: ScreenAnalysisResponse[];
}

class AISupportService {
  private baseURL: string;
  private apiKey: string;
  private activeSession: AISession | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
    this.apiKey = import.meta.env.VITE_VERTEX_AI_KEY || 'AIzaSyDDJy7brTYuEoNWfE0evnC2Eo0O8Ast6Bc';
  }

  // Initialize a new AI support session
  async startSession(userId: string): Promise<AISession> {
    const sessionId = `ai_support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.activeSession = {
      sessionId,
      userId,
      startTime: new Date(),
      isActive: true,
      analysisHistory: []
    };

    try {
      await axios.post(`${this.baseURL}/api/ai-support/session`, {
        sessionId,
        userId,
        startTime: this.activeSession.startTime
      });
    } catch (error) {
      console.warn('Failed to register session with backend:', error);
    }

    return this.activeSession;
  }

  // End the current AI support session
  async endSession(): Promise<void> {
    if (!this.activeSession) return;

    this.activeSession.isActive = false;

    try {
      await axios.post(`${this.baseURL}/api/ai-support/session/end`, {
        sessionId: this.activeSession.sessionId
      });
    } catch (error) {
      console.warn('Failed to end session with backend:', error);
    }

    this.activeSession = null;
  }

  // Analyze screen data using Google Cloud Vertex AI
  async analyzeScreen(request: ScreenAnalysisRequest): Promise<ScreenAnalysisResponse> {
    if (!this.activeSession) {
      throw new Error('No active AI support session');
    }

    try {
      // First, send to our backend for processing
      const response = await axios.post(`${this.baseURL}/api/ai-support/analyze`, {
        ...request,
        sessionId: this.activeSession.sessionId
      });

      const analysisResult: ScreenAnalysisResponse = response.data;
      
      // Store in session history
      this.activeSession.analysisHistory.push(analysisResult);

      return analysisResult;
    } catch (error) {
      console.error('Error analyzing screen:', error);
      
      // Fallback to direct Vertex AI call if backend is unavailable
      return this.analyzeWithVertexAI(request);
    }
  }

  // Direct Vertex AI integration as fallback
  private async analyzeWithVertexAI(request: ScreenAnalysisRequest): Promise<ScreenAnalysisResponse> {
    const base64Data = request.imageData.split(',')[1];
    
    const prompt = `
      Analyze this screenshot of a business management application called TradeEase. 
      Identify UI elements, user interface components, and provide actionable guidance.
      
      Context: ${request.context || 'General application usage'}
      
      Please provide:
      1. A detailed analysis of what you see
      2. Identified UI elements with their positions
      3. Suggested actions the user might want to take
      4. Overlay commands for visual guidance
      
      Return the response in JSON format with the following structure:
      {
        "analysis": "detailed description",
        "uiElements": [{"type": "button", "text": "Submit", "position": {"x": 100, "y": 200, "width": 80, "height": 40}, "confidence": 0.95}],
        "suggestedActions": [{"type": "click", "target": "Submit button", "description": "Click the submit button to save changes"}],
        "overlayCommands": [{"type": "highlight", "position": {"x": 100, "y": 200}, "size": {"width": 80, "height": 40}, "color": "#00ff00"}],
        "confidence": 0.9
      }
    `;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/png",
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Vertex AI request failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || '';
      
      // Parse the JSON response from AI
      try {
        const parsedResponse = JSON.parse(aiResponse);
        return parsedResponse as ScreenAnalysisResponse;
      } catch (parseError) {
        // If parsing fails, return a basic analysis
        return {
          analysis: aiResponse,
          uiElements: [],
          suggestedActions: [],
          overlayCommands: [],
          confidence: 0.7
        };
      }
    } catch (error) {
      console.error('Vertex AI analysis failed:', error);
      throw new Error('AI analysis service unavailable');
    }
  }

  // Get session history
  getSessionHistory(): ScreenAnalysisResponse[] {
    return this.activeSession?.analysisHistory || [];
  }

  // Get current session
  getCurrentSession(): AISession | null {
    return this.activeSession;
  }

  // Send overlay commands to the frontend
  async sendOverlayCommands(commands: OverlayCommand[]): Promise<void> {
    if (!this.activeSession) return;

    try {
      await axios.post(`${this.baseURL}/api/ai-support/overlay`, {
        sessionId: this.activeSession.sessionId,
        commands
      });
    } catch (error) {
      console.warn('Failed to send overlay commands:', error);
    }
  }

  // Get real-time assistance suggestions
  async getAssistanceSuggestions(context: string): Promise<string[]> {
    try {
      const response = await axios.post(`${this.baseURL}/api/ai-support/suggestions`, {
        context,
        sessionId: this.activeSession?.sessionId
      });
      return response.data.suggestions;
    } catch (error) {
      console.warn('Failed to get assistance suggestions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const aiSupportService = new AISupportService();
export default aiSupportService; 