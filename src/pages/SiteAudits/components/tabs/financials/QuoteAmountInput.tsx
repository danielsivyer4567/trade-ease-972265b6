
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuoteAmountInputProps {
  quoteAmount: number;
  setQuoteAmount: (amount: number) => void;
}

export const QuoteAmountInput = ({ quoteAmount, setQuoteAmount }: QuoteAmountInputProps) => {
  return (
    <div>
      <Label htmlFor="quote">Quote Amount ($)</Label>
      <Input
        id="quote"
        type="number"
        value={quoteAmount}
        onChange={(e) => setQuoteAmount(Number(e.target.value))}
        placeholder="Enter quote amount"
        className="mt-1"
      />
    </div>
  );
};
