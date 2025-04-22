import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Define the invoice status type
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

// Define the invoice item interface
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Define the invoice attachment interface
interface InvoiceAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

// Define the form schema using Zod
const formSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  customerId: z.string().min(1, "Customer is required"),
  jobId: z.string().optional(),
  quoteId: z.string().optional(),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(["draft", "sent", "paid", "overdue"] as const),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Unit price must be at least 0"),
      total: z.number().min(0, "Total must be at least 0"),
    })
  ).min(1, "At least one item is required"),
  notes: z.string().optional(),
  attachments: z.array(
    z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileType: z.string(),
      uploadedAt: z.string()
    })
  ).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  initialData?: FormValues;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onCancel
}: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]
  );

  const [attachments, setAttachments] = useState<InvoiceAttachment[]>(
    initialData?.attachments || []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: initialData?.invoiceNumber || `INV-${Date.now()}`,
      customerId: initialData?.customerId || "",
      jobId: initialData?.jobId || "",
      quoteId: initialData?.quoteId || "",
      issueDate: initialData?.issueDate || new Date(),
      dueDate: initialData?.dueDate || new Date(),
      status: initialData?.status || "draft",
      items: items,
      notes: initialData?.notes || "",
      attachments: initialData?.attachments || []
    },
  });

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = 
        Number(newItems[index].quantity) * Number(newItems[index].unitPrice);
    }
    
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.warning("At least one item is required");
      return;
    }
    
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    form.setValue("items", newItems);
  };

  const handleAttach = (files: FileList) => {
    const newAttachments = Array.from(files).map((file) => ({
      id: uuidv4(),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      uploadedAt: new Date().toISOString()
    }));
    setAttachments([...attachments, ...newAttachments]);
    form.setValue("attachments", [...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    const newAttachments = attachments.filter((a) => a.id !== attachmentId);
    setAttachments(newAttachments);
    form.setValue("attachments", newAttachments);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Invoice" : "New Invoice"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="INV-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add customer options from API */}
                        <SelectItem value="customer-1">Customer 1</SelectItem>
                        <SelectItem value="customer-2">Customer 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Job (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add job options from API */}
                        <SelectItem value="job-1">Job 1</SelectItem>
                        <SelectItem value="job-2">Job 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quoteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Quote (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a quote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add quote options from API */}
                        <SelectItem value="quote-1">Quote 1</SelectItem>
                        <SelectItem value="quote-2">Quote 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Items</h3>
                <Button type="button" onClick={addItem}>Add Item</Button>
              </div>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md">
                    <div className="col-span-5">
                      <FormLabel>Description</FormLabel>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel>Unit Price</FormLabel>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel>Total</FormLabel>
                      <Input
                        type="number"
                        value={item.total}
                        readOnly
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end items-center space-x-2 border-t pt-4">
                <div className="font-semibold">Total: ${totalAmount.toFixed(2)}</div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes or terms..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Attachments</h3>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleAttach(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center py-4"
                >
                  <div className="rounded-full bg-primary/10 p-2 mb-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Click to upload files</span>
                  <span className="text-xs text-gray-500">or drag and drop</span>
                </label>
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span className="text-sm truncate">{attachment.fileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#00A3BE] hover:bg-[#008CA3]">
                {initialData ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 