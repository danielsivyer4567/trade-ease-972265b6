
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Search } from "lucide-react";

const PropertyBoundaries: React.FC = () => {
  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="h-6 w-6 text-primary" />
          Property Boundaries
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Property Boundaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input 
                  type="text" 
                  placeholder="Enter address, street, or suburb" 
                  className="pl-8 w-full"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Enter an address to view its property boundaries.
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundaries;
