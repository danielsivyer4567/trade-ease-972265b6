import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Video, Wand2 } from "lucide-react";
interface VideoEditorProps {
  onVideoSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  disabled?: boolean;
  selectedVideo?: File | null;
}
export function VideoEditor({
  onVideoSelect,
  onEdit,
  disabled,
  selectedVideo
}: VideoEditorProps) {
  return <Card className="border-dashed">
      <CardHeader className="bg-slate-300">
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="h-4 w-4 text-blue-500" />
          Video Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Video</Label>
          <div className="flex items-center gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg transition-colors duration-200 bg-slate-300">
                <Video className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedVideo ? selectedVideo.name : "Upload Video"}
                </span>
              </div>
              <input type="file" className="hidden" onChange={onVideoSelect} accept="video/*" />
            </label>
          </div>
        </div>
        {selectedVideo && <Button onClick={onEdit} variant="outline" className="w-full" disabled={disabled}>
            <span className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Edit with AI
            </span>
          </Button>}
      </CardContent>
    </Card>;
}