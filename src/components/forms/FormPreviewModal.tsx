
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, FileText } from "lucide-react";

interface FormPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    id: number;
    title: string;
    description: string;
    type: string;
    hasAutomation?: boolean;
  };
}

export function FormPreviewModal({ open, onOpenChange, formData }: FormPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Form Preview: {formData.title}
          </DialogTitle>
          <DialogDescription>
            This is how your form will appear to customers.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Card className="border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <CardTitle>{formData.title}</CardTitle>
              </div>
              <CardDescription>{formData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.type === "job" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="(123) 456-7890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </>
              )}

              {formData.type === "feedback" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="satisfaction">Overall Satisfaction</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Very Satisfied (5)</SelectItem>
                        <SelectItem value="4">Satisfied (4)</SelectItem>
                        <SelectItem value="3">Neutral (3)</SelectItem>
                        <SelectItem value="2">Dissatisfied (2)</SelectItem>
                        <SelectItem value="1">Very Dissatisfied (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea id="comments" placeholder="Please share your thoughts on our service..." />
                  </div>
                </>
              )}

              {formData.type === "onboarding" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="Enter business name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Primary Contact</Label>
                    <Input id="contactPerson" placeholder="Contact person name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea id="address" placeholder="Full business address" />
                  </div>
                </>
              )}

              {formData.type === "project" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="projectDetails">Project Details</Label>
                    <Textarea id="projectDetails" placeholder="Describe your project requirements..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Expected Timeline</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="3months">1-3 months</SelectItem>
                        <SelectItem value="6months">3-6 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="w-full md:w-auto">Submit Form</Button>
            </CardFooter>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
