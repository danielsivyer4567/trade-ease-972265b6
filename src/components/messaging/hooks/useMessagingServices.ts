
import { useServicesFetch } from './useServicesFetch';
import { useServiceOperations } from './useServiceOperations';

export const useMessagingServices = () => {
  const {
    services,
    setServices,
    isLoading,
    setIsLoading,
    fetchMessagingAccounts
  } = useServicesFetch();

  const {
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll
  } = useServiceOperations(
    services,
    setServices,
    setIsLoading,
    fetchMessagingAccounts
  );

  return {
    services,
    isLoading,
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll,
    fetchMessagingAccounts
  };
};
