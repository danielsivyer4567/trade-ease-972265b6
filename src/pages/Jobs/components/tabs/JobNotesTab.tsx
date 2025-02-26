
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface JobNotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const JobNotesTab = ({ notes, setNotes }: JobNotesTabProps) => {
  return (
    <TabsContent value="notes" className="space-y-4">
      <Textarea
        className="w-full min-h-[200px] p-4"
        placeholder="Add job notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </TabsContent>
  );
};
