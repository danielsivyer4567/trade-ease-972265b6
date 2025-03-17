
import { ServiceInfo } from "../types";
import { useToggleSync } from "./service-operations/useToggleSync";
import { useConnectService } from "./service-operations/useConnectService";
import { useAddNewService } from "./service-operations/useAddNewService";
import { useRemoveService } from "./service-operations/useRemoveService";
import { useSyncAll } from "./service-operations/useSyncAll";

export const useServiceOperations = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchMessagingAccounts: () => Promise<void>
) => {
  const handleToggleSync = useToggleSync(services, setServices, setIsLoading);
  const handleConnectService = useConnectService(services, setServices, setIsLoading, fetchMessagingAccounts);
  const handleAddNewService = useAddNewService(setIsLoading, fetchMessagingAccounts);
  const handleRemoveService = useRemoveService(services, setServices, setIsLoading);
  const handleSyncAll = useSyncAll(services, setServices, setIsLoading);

  return {
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll
  };
};
