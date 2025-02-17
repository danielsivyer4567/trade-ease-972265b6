
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewTemplate() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/jobs")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Template</h1>
            <p className="text-gray-500 mt-1">Define a new job template</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <form className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Template Name
                </label>
                <Input placeholder="e.g., Basic Plumbing Service" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <Input placeholder="e.g., Plumbing" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Estimated Duration
                </label>
                <Input placeholder="e.g., 2 hours" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Price
                </label>
                <Input placeholder="e.g., $150" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Required Materials
                </label>
                <Input placeholder="e.g., Pipe wrench, Plumber's tape" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <textarea 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe the job template..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/jobs")}>
                Cancel
              </Button>
              <Button>
                Create Template
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
