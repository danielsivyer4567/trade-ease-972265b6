
import { Textarea } from "@/components/ui/textarea";

interface FinancialNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const FinancialNotes = ({ notes, setNotes }: FinancialNotesProps) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Financial Notes</h4>
      <Textarea
        placeholder="Add financial notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};
