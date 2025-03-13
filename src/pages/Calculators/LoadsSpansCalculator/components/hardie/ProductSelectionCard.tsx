
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HARDIE_PRODUCT_TYPES, HARDIE_THICKNESSES } from "../../constants";

interface ProductSelectionCardProps {
  productType: string;
  setProductType: (value: string) => void;
  thickness: string;
  setThickness: (value: string) => void;
}

export const ProductSelectionCard: React.FC<ProductSelectionCardProps> = ({
  productType,
  setProductType,
  thickness,
  setThickness
}) => {
  // Get selected product details for additional information
  const selectedProduct = HARDIE_PRODUCT_TYPES.find(p => p.name === productType) || HARDIE_PRODUCT_TYPES[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>James Hardie Product Selection</CardTitle>
        <CardDescription>
          James Hardie is a leading manufacturer of fiber cement products, widely used in construction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-type">Product Type</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger id="product-type">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {HARDIE_PRODUCT_TYPES.map((product) => (
                  <SelectItem key={product.name} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProduct && (
              <p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thickness">Thickness</Label>
            <Select value={thickness} onValueChange={setThickness}>
              <SelectTrigger id="thickness">
                <SelectValue placeholder="Select thickness" />
              </SelectTrigger>
              <SelectContent>
                {HARDIE_THICKNESSES.map((thick) => (
                  <SelectItem key={thick} value={thick}>
                    {thick}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Thickness affects load capacity, fire rating, and acoustic properties
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
