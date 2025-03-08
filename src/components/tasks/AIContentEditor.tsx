import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Brain, Sparkles } from "lucide-react";
interface AIEditingOptions {
  tone: string;
  length: string;
}
interface AIContentEditorProps {
  options: AIEditingOptions;
  onOptionsChange: (options: AIEditingOptions) => void;
  onEnhance: () => void;
  isEditing: boolean;
  disabled: boolean;
}
export function AIContentEditor({
  options,
  onOptionsChange,
  onEnhance,
  isEditing,
  disabled
}: AIContentEditorProps) {
  return <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          AI Content Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tone</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={options.tone} onChange={e => onOptionsChange({
            ...options,
            tone: e.target.value
          })}>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Length</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={options.length} onChange={e => onOptionsChange({
            ...options,
            length: e.target.value
          })}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>
        <Button onClick={onEnhance} variant="outline" disabled={isEditing || disabled} className="w-full bg-slate-300 hover:bg-slate-200">
          {isEditing ? "Enhancing content..." : <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Enhance with AI
            </span>}
        </Button>
      </CardContent>
    </Card>;
}