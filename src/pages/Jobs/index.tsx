import { AppLayout } from "@/components/ui/AppLayout";
import { Routes, Route } from "react-router-dom";
import { JobsMain } from "./components/JobsMain";

export default function Jobs() {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<JobsMain />} />
      </Routes>
    </AppLayout>
  );
}
