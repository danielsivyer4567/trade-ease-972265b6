
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobNote {
  id: string;
  text: string;
  timestamp: string;
  important: boolean;
}

interface JobNotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const JobNotesTab = ({ notes, setNotes }: JobNotesTabProps) => {
  const [currentNote, setCurrentNote] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [jobNotes, setJobNotes] = useState<JobNote[]>(() => {
    try {
      return notes ? JSON.parse(notes) : [];
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

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
    setNotes(JSON.stringify(updatedNotes));
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
    setNotes(JSON.stringify(updatedNotes));
    
    toast({
      title: "Note Deleted",
      description: "The note has been removed",
    });
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
