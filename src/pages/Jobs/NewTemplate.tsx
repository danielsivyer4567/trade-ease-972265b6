import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useState } from "react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { toast } from "sonner";

export default function NewTemplate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    templateName: "",
    category: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    description: "",
    price: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf' && file.type !== 'text/csv') {
        toast.error('Please upload a PDF or CSV file');
        return;
      }
      toast.success('Template uploaded successfully');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 10;

    // Header
    doc.setFontSize(16);
    doc.text(formData.companyName || "Your Company Name", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(formData.companyAddress || "Your Company Address", 10, y);
    y += 10;
    doc.text(`Phone: ${formData.companyPhone || "[Phone]"} • Email: ${formData.companyEmail || "[Email]"}`, 10, y);

    // Quote Title
    y += 15;
    doc.setFontSize(14);
    doc.text("Trade Quote", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Quote Template: ${formData.templateName}`, 10, y);
    y += 10;
    doc.text(`Category: ${formData.category}`, 10, y);

    // Description
    y += 15;
    doc.text("Service Description:", 10, y);
    y += 10;
    doc.text(formData.description || "[Description of services]", 10, y);

    // Pricing
    y += 15;
    doc.text("Pricing:", 10, y);
    y += 10;
    doc.text(`Base Price: $${formData.price || "[Price]"}`, 10, y);

    // Terms & Conditions
    y += 15;
    doc.text("Terms & Conditions", 10, y);
    y += 10;
    doc.text("1. This is a template quote for reference purposes", 10, y);
    y += 10;
    doc.text("2. Actual quotes may vary based on specific requirements", 10, y);
    y += 10;
    doc.text("3. Valid for 30 days from the date of issue", 10, y);

    // Save the PDF
    doc.save("quote_template.pdf");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/quotes/new")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Template</h1>
              <p className="text-gray-500 mt-1">Define a new quote template</p>
            </div>
          </div>
          <div className="flex gap-2">
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload Template" 
            />
            <Button 
              variant="outline"
              onClick={generatePDF}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Download Template PDF
            </Button>
          </div>
        </div>

        <Card className="max-w-2xl">
          <form className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Template Name
                </label>
                <Input 
                  name="templateName"
                  value={formData.templateName}
                  onChange={handleInputChange}
                  placeholder="e.g., Basic Plumbing Service" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <Input 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Plumbing" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Company Name
                </label>
                <Input 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Company Address
                </label>
                <Input 
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="Your company address" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Phone
                  </label>
                  <Input 
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    placeholder="Company phone" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email
                  </label>
                  <Input 
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    placeholder="Company email" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Base Price
                </label>
                <Input 
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Base price for this service" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe the template..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/quotes/new")}>
                Cancel
              </Button>
              <Button type="submit">
                Create Template
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
