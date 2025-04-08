
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { CustomerNote } from "@/pages/Banking/types";

interface CustomerNotesProps {
  notes: CustomerNote[];
  onAddNote?: (note: string, important: boolean) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export function CustomerNotes({ notes, onAddNote, formatDate }: CustomerNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;
    
    setIsSaving(true);
    try {
      await onAddNote(newNote, isImportant);
      setNewNote("");
      setIsImportant(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="border rounded p-3">
        <h3 className="font-medium mb-2">Add a Note</h3>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full border rounded p-2 text-sm mb-2"
          rows={3}
          placeholder="Enter a note about this customer..."
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={isImportant} 
              onChange={() => setIsImportant(!isImportant)} 
            />
            Mark as important
          </label>
          <Button 
            size="sm"
            onClick={handleAddNote}
            disabled={!newNote.trim() || isSaving}
          >
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium">Customer Notes</h3>
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`border rounded p-3 ${note.important ? 'border-amber-200 bg-amber-50' : ''}`}
            >
              {note.important && (
                <div className="flex items-center gap-1 text-amber-600 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Important</span>
                </div>
              )}
              <p className="text-sm">{note.content}</p>
              <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                <span>By: {note.created_by}</span>
                <span>{formatDate(note.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No notes for this customer</p>
      )}
    </div>
  );
}
