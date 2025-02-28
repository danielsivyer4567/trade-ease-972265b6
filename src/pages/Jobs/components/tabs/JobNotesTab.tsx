
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, FileText, Image, Video, File } from "lucide-react";

interface JobNote {
  id: string;
  text: string;
  timestamp: string;
  important: boolean;
  files?: Array<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
}

interface JobNotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const JobNotesTab = ({ notes, setNotes }: JobNotesTabProps) => {
  const [currentNote, setCurrentNote] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [jobNotes, setJobNotes] = useState<JobNote[]>([]);
  const { toast } = useToast();
  const jobId = window.location.pathname.split('/').pop() || "";

  useEffect(() => {
    // Try to parse notes from props first
    try {
      if (notes) {
        setJobNotes(JSON.parse(notes));
        return;
      }
    } catch (error) {
      console.error("Error parsing notes from props:", error);
    }

    // If no notes in props or parsing failed, try to load from localStorage
    if (jobId) {
      const storedNotes = localStorage.getItem(`job_notes_${jobId}`);
      if (storedNotes) {
        try {
          const parsedNotes = JSON.parse(storedNotes);
          setJobNotes(parsedNotes);
          setNotes(storedNotes); // Update the parent component's state
        } catch (error) {
          console.error("Error parsing notes from localStorage:", error);
          setJobNotes([]);
        }
      }
    }
  }, [jobId, notes, setNotes]);

  const handleAddNote = () => {
    if (!currentNote.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter some text for your note",
        variant: "destructive",
      });
      return;
    }

    const newNote: JobNote = {
      id: Date.now().toString(),
      text: currentNote.trim(),
      timestamp: new Date().toLocaleString(),
      important: isImportant,
    };

    const updatedNotes = [...jobNotes, newNote];
    setJobNotes(updatedNotes);
    
    // Save to localStorage and update parent component
    const notesString = JSON.stringify(updatedNotes);
    if (jobId) {
      localStorage.setItem(`job_notes_${jobId}`, notesString);
    }
    setNotes(notesString);
    
    setCurrentNote("");
    setIsImportant(false);
    
    toast({
      title: "Note Added",
      description: "Your job note has been saved",
    });
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = jobNotes.filter(note => note.id !== id);
    setJobNotes(updatedNotes);
    
    // Save to localStorage and update parent component
    const notesString = JSON.stringify(updatedNotes);
    if (jobId) {
      localStorage.setItem(`job_notes_${jobId}`, notesString);
    }
    setNotes(notesString);
    
    toast({
      title: "Note Deleted",
      description: "The note has been removed",
    });
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <TabsContent value="notes" className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Add New Note</Label>
          <Textarea
            className="min-h-[100px]"
            placeholder="Add job notes here..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="important"
              checked={isImportant}
              onCheckedChange={(checked) => setIsImportant(checked as boolean)}
            />
            <Label htmlFor="important">Mark as important</Label>
          </div>
          <Button onClick={handleAddNote} className="w-full md:w-auto">
            Add Note
          </Button>
        </div>

        <div className="space-y-4">
          {jobNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notes added yet</p>
          ) : (
            jobNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg border ${
                  note.important ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{note.timestamp}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </Button>
                </div>
                <p className="whitespace-pre-wrap">{note.text}</p>
                
                {note.files && note.files.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                      <Paperclip className="h-4 w-4" /> Attached Files ({note.files.length})
                    </h4>
                    <ul className="space-y-1">
                      {note.files.map((file, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {note.important && (
                  <span className="mt-2 inline-block text-sm font-medium text-red-600">
                    Important Note
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </TabsContent>
  );
};
