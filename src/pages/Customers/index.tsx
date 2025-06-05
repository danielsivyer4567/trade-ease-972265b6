import { AppLayout } from "@/components/ui/AppLayout";
import { CustomersPageContent } from "./components/CustomersPageContent";
import ErrorBoundary from "@/components/ErrorBoundary";

const CustomersPage = () => {
  return (
    <AppLayout>
      <ErrorBoundary>
        <CustomersPageContent />
      </ErrorBoundary>
    </AppLayout>
  );
};

export default CustomersPage;
