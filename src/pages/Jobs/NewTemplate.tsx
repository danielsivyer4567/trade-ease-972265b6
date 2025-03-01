
import { AppLayout } from "@/components/ui/AppLayout";
import { NewTemplateForm } from "./components/templates/NewTemplateForm";

export default function NewTemplate() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Job Template</h1>
        <NewTemplateForm />
      </div>
    </AppLayout>
  );
}
