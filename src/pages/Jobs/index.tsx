
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Zap, Wind, Tag, Clock, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { JobTemplate } from "@/types/job";

const jobTemplates: JobTemplate[] = [
  {
    id: "1",
    title: "Basic Plumbing Service",
    estimatedDuration: "2 hours",
    materials: ["Pipe wrench", "Plumber's tape", "Replacement parts"],
    price: "$150",
    category: "Plumbing",
    description: "Standard plumbing service including inspection and basic repairs",
  },
  {
    id: "2",
    title: "Electrical Safety Inspection",
    estimatedDuration: "1.5 hours",
    materials: ["Multimeter", "Safety equipment", "Testing tools"],
    price: "$120",
    category: "Electrical",
    description: "Comprehensive electrical system safety inspection",
  },
  {
    id: "3",
    title: "HVAC Maintenance",
    estimatedDuration: "3 hours",
    materials: ["Filters", "Cleaning supplies", "Testing equipment"],
    price: "$200",
    category: "HVAC",
    description: "Full HVAC system maintenance and cleaning",
  }
];

const categories = [
  { name: "Plumbing", icon: Wrench, color: "text-blue-500" },
  { name: "Electrical", icon: Zap, color: "text-yellow-500" },
  { name: "HVAC", icon: Wind, color: "text-green-500" },
];

export default function Jobs() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Templates</h1>
            <p className="text-gray-500 mt-1">Manage and create job templates</p>
          </div>
          <Button onClick={() => navigate("/jobs/new-template")}>
            <Plus className="mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="p-6 col-span-1">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <List className="w-5 h-5" />
              Categories
            </h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </Card>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobTemplates.map((template) => (
                <Card key={template.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.title}</h3>
                    <Tag className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {template.estimatedDuration}
                    </div>
                    <div className="text-sm font-medium">{template.price}</div>
                    <div className="text-xs text-gray-500">
                      Materials: {template.materials.join(", ")}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
