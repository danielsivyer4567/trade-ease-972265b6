import { AppLayout } from "@/components/ui/AppLayout";
import { JobsMain } from "./components/JobsMain";

export default function Jobs() {
  console.log("Jobs page component is rendering");
  
  try {
    return (
      <AppLayout>
        <JobsMain />
      </AppLayout>
    );
  } catch (error) {
    console.error("Error rendering Jobs page:", error);
    return (
      <AppLayout>
        <div className="p-4">
          <h1 className="text-xl font-bold text-red-500">Error loading Jobs page</h1>
          <p className="text-gray-600">{error?.message || "Unknown error"}</p>
        </div>
      </AppLayout>
    );
  }
}
