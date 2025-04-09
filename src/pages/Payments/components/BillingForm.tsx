
import { ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentFormData } from "../types";

interface BillingFormProps {
  formData: PaymentFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function BillingForm({ formData, handleInputChange }: BillingFormProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Enter customer billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address1">Address</Label>
            <Input
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="locality">City</Label>
            <Input
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="administrativeArea">State</Label>
              <Input
                id="administrativeArea"
                name="administrativeArea"
                value={formData.administrativeArea}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
