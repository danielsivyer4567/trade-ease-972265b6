import { AppLayout } from "@/components/ui/AppLayout";
import { Routes, Route } from "react-router-dom";
import { JobsMain } from "./components/JobsMain";
import { JobDetails } from "./JobDetails";

export default function Jobs() {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<JobsMain />} />
        <Route path=":id" element={<JobDetails />} />
      </Routes>
    </AppLayout>
  );
}
