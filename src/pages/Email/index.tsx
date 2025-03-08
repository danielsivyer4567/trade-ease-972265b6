import { AppLayout } from "@/components/ui/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Globe, Copy, CheckCircle, Clipboard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
export default function Email() {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [forwardingEmail, setForwardingEmail] = useState("");
  const [formFields, setFormFields] = useState([{
    id: "name",
    label: "Name",
    required: true
  }, {
    id: "email",
    label: "Email",
    required: true
  }, {
    id: "phone",
    label: "Phone",
    required: false
  }, {
    id: "message",
    label: "Message",
    required: true
  }]);
  const [formStyleOptions, setFormStyleOptions] = useState({
    primaryColor: "#3b82f6",
    formWidth: "600px",
    buttonText: "Submit Enquiry"
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const handleAddField = () => {
    const newId = `field_${formFields.length + 1}`;
    setFormFields([...formFields, {
      id: newId,
      label: "New Field",
      required: false
    }]);
  };
  const handleUpdateField = (index: number, field: {
    id: string;
    label: string;
    required: boolean;
  }) => {
    const updatedFields = [...formFields];
    updatedFields[index] = field;
    setFormFields(updatedFields);
  };
  const handleRemoveField = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };
  const generateFormCode = () => {
    const formId = "trade-ease-enquiry-form";
    return `
<!-- Trade Ease Enquiry Form -->
<form id="${formId}" style="max-width: ${formStyleOptions.formWidth}; margin: 0 auto;">
  ${formFields.map(field => `
  <div style="margin-bottom: 15px;">
    <label for="${field.id}" style="display: block; margin-bottom: 5px; font-weight: 600;">${field.label}${field.required ? ' *' : ''}</label>
    ${field.id === "message" ? `<textarea id="${field.id}" name="${field.id}" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" ${field.required ? 'required' : ''}></textarea>` : `<input type="${field.id === "email" ? "email" : field.id === "phone" ? "tel" : "text"}" id="${field.id}" name="${field.id}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" ${field.required ? 'required' : ''}>`}
  </div>`).join('')}
  <button type="submit" style="background-color: ${formStyleOptions.primaryColor}; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 500;">${formStyleOptions.buttonText}</button>
</form>
<script>
  document.getElementById("${formId}").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // Replace this URL with your actual endpoint
    fetch("https://api.trade-ease.com/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      alert("Thank you for your enquiry! We will get back to you shortly.");
      document.getElementById("${formId}").reset();
    })
    .catch(error => {
      console.error("Error:", error);
      alert("There was an error submitting your enquiry. Please try again later.");
    });
  });
</script>
<!-- End Trade Ease Enquiry Form -->
`;
  };
  const getFormLink = () => {
    return "https://trade-ease.com/enquiry-form/12345";
  };
  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast({
        title: "Copied to clipboard",
        description: `${type === 'code' ? 'HTML code' : 'Form link'} has been copied to your clipboard.`
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive"
      });
    });
  };
  return <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Mail className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Email Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Forwarding Setup */}
          <Card className="bg-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Forwarding
              </CardTitle>
              <CardDescription>
                Set up an email address to forward client enquiries to your personal or business email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forwarding-email">Forward emails to</Label>
                <Input id="forwarding-email" type="email" placeholder="your@tradeease.com.au" value={forwardingEmail} onChange={e => setForwardingEmail(e.target.value)} />
              </div>
              
              <div className="pt-2">
                <Button onClick={() => {
                toast({
                  title: "Forwarding email updated",
                  description: `Enquiries will now be sent to ${forwardingEmail}`
                });
              }} disabled={!forwardingEmail || !/^\S+@\S+\.\S+$/.test(forwardingEmail)}>
                  Save Forwarding Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Web Enquiry Form Setup */}
          <Card>
            <CardHeader className="bg-slate-200">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Web Enquiry Form
              </CardTitle>
              <CardDescription>
                Create and customize a web form for client enquiries to embed on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 bg-slate-200">
              <div className="space-y-2">
                <Label htmlFor="form-color">Form Accent Color</Label>
                <div className="flex gap-2">
                  <Input id="form-color" type="color" className="w-12 p-1 h-10" value={formStyleOptions.primaryColor} onChange={e => setFormStyleOptions({
                  ...formStyleOptions,
                  primaryColor: e.target.value
                })} />
                  <Input type="text" value={formStyleOptions.primaryColor} onChange={e => setFormStyleOptions({
                  ...formStyleOptions,
                  primaryColor: e.target.value
                })} className="flex-1" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input id="button-text" value={formStyleOptions.buttonText} onChange={e => setFormStyleOptions({
                ...formStyleOptions,
                buttonText: e.target.value
              })} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form-width">Form Width</Label>
                <Input id="form-width" value={formStyleOptions.formWidth} onChange={e => setFormStyleOptions({
                ...formStyleOptions,
                formWidth: e.target.value
              })} placeholder="600px or 100%" />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Form Fields</Label>
                  <Button variant="outline" size="sm" onClick={handleAddField}>
                    Add Field
                  </Button>
                </div>
                
                <div className="space-y-3 mt-2">
                  {formFields.map((field, index) => <div key={index} className="flex items-center gap-2">
                      <Input value={field.label} onChange={e => handleUpdateField(index, {
                    ...field,
                    label: e.target.value
                  })} className="flex-1" />
                      <div className="flex items-center whitespace-nowrap">
                        <input type="checkbox" id={`required-${index}`} checked={field.required} onChange={e => handleUpdateField(index, {
                      ...field,
                      required: e.target.checked
                    })} className="mr-1" />
                        <Label htmlFor={`required-${index}`} className="text-sm">Required</Label>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveField(index)} disabled={formFields.length <= 1}>
                        Remove
                      </Button>
                    </div>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Preview & Export */}
        <Card className="mt-8">
          <CardHeader className="bg-slate-200">
            <CardTitle>Get Your Enquiry Form</CardTitle>
            <CardDescription>
              Copy the code below to embed the form on your website, or share the direct link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 bg-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="form-code">HTML Code</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateFormCode(), 'code')} className="flex items-center gap-1 text-neutral-50 bg-slate-400 hover:bg-slate-300 px-[17px] mx-[4px] py-0 my-[14px]">
                  {copiedCode ? <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </> : <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>}
                </Button>
              </div>
              <Textarea id="form-code" value={generateFormCode()} readOnly className="font-mono text-sm h-64" />
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="form-link">Direct Form Link</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(getFormLink(), 'link')} className="flex items-center gap-1">
                  {copiedLink ? <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </> : <>
                      <Clipboard className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>}
                </Button>
              </div>
              <div className="flex items-center">
                <Input id="form-link" value={getFormLink()} readOnly className="font-mono" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Share this link on social media or in emails to allow clients to submit enquiries directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
}