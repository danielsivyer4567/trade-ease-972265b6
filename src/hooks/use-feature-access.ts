import { useState, useEffect } from 'react';
import { FeatureRequestService } from '@/services/FeatureRequestService';

interface FeatureAccess {
  tradeCalculators: boolean;
  externalCalendarIntegration: boolean;
  unlimitedNotificationTexts: boolean;
  unlimitedCalendars: boolean;
  accountingIntegration: boolean;
  businessStructureMap: boolean;
  nccVoiceSearch: boolean;
  canRequestFeatures: boolean;
  featureRequestLimit: number;
  isLoading: boolean;
}

export const useFeatureAccess = (): FeatureAccess => {
  const [access, setAccess] = useState<FeatureAccess>({
    tradeCalculators: false,
    externalCalendarIntegration: false,
    unlimitedNotificationTexts: false,
    unlimitedCalendars: false,
    accountingIntegration: false,
    businessStructureMap: false,
    nccVoiceSearch: false,
    canRequestFeatures: false,
    featureRequestLimit: 0,
    isLoading: true
  });

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        const [
          tradeCalculators,
          externalCalendarIntegration,
          unlimitedNotificationTexts,
          unlimitedCalendars,
          accountingIntegration,
          businessStructureMap,
          nccVoiceSearch,
          canRequestFeatures,
          featureRequestLimit
        ] = await Promise.all([
          FeatureRequestService.hasTradeCalculatorAccess(),
          FeatureRequestService.hasExternalCalendarIntegration(),
          FeatureRequestService.hasUnlimitedNotificationTexts(),
          FeatureRequestService.hasUnlimitedCalendars(),
          FeatureRequestService.hasAccountingIntegration(),
          FeatureRequestService.hasBusinessStructureMapAccess(),
          FeatureRequestService.hasNCCVoiceSearchAccess(),
          FeatureRequestService.canRequestFeatures(),
          FeatureRequestService.getFeatureRequestLimit()
        ]);

        setAccess({
          tradeCalculators,
          externalCalendarIntegration,
          unlimitedNotificationTexts,
          unlimitedCalendars,
          accountingIntegration,
          businessStructureMap,
          nccVoiceSearch,
          canRequestFeatures,
          featureRequestLimit,
          isLoading: false
        });
      } catch (error) {
        console.error('Error checking feature access:', error);
        setAccess(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkFeatureAccess();
  }, []);

  return access;
}; 