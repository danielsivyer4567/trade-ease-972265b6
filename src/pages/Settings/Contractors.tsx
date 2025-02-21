
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Settings, UserPlus, Phone, Mail, Clock } from "lucide-react";

export default function ContractorsPage() {
  const contractors = [
    {
      id: 1,
      name: "John Doe",
      specialty: "Plumbing",
      phone: "+1 234 567 8900",
      email: "john@example.com",
      availability: "Weekdays",
    },
    {
      id: 2,
      name: "Jane Smith",
      specialty: "Electrical",
      phone: "+1 234 567 8901",
      email: "jane@example.com",
      availability: "All week",
    },
    {
      id: 3,
      name: "Mike Johnson",
      specialty: "Carpentry",
      phone: "+1 234 567 8902",
      email: "mike@example.com",
      availability: "Weekends",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/settings" className="hover:text-blue-500">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Users className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Contractors</h1>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contractor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((contractor) => (
            <Card key={contractor.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{contractor.name}</span>
                  <Link to={`/settings/contractors/${contractor.id}`}>
                    <Settings className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  </Link>
                </CardTitle>
                <CardDescription>{contractor.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {contractor.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {contractor.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {contractor.availability}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
