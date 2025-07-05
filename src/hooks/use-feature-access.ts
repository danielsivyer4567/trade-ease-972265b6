import { useState, useEffect } from 'react';
import { FeatureRequestService } from '@/services/FeatureRequestService';
import { supabase } from '@/integrations/supabase/client';

interface FeatureAccess {
  tradeCalculators: boolean;
  externalCalendarIntegration: boolean;
  unlimitedNotificationTexts: boolean;
  unlimitedCalendars: boolean;
  accountingIntegration: boolean;
  businessStructureMap: boolean;
  nccVoiceSearch: boolean;
  qbccVoiceSearch: boolean;
  timberQueenslandVoiceSearch: boolean;
  canRequestFeatures: boolean;
  featureRequestLimit: number;
  isLoading: boolean;
}

// Skeleton key user ID
const SKELETON_KEY_USER_ID = '7463a3ad-5193-4dee-b59f-307a8c1da359';

export const useFeatureAccess = (): FeatureAccess => {
  const [access, setAccess] = useState<FeatureAccess>({
    tradeCalculators: false,
    externalCalendarIntegration: false,
    unlimitedNotificationTexts: false,
    unlimitedCalendars: false,
    accountingIntegration: false,
    businessStructureMap: false,
    nccVoiceSearch: false,
    qbccVoiceSearch: false,
    timberQueenslandVoiceSearch: false,
    canRequestFeatures: false,
    featureRequestLimit: 0,
    isLoading: true
  });

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        // Check if current user is the skeleton key user
        const { data: { user } } = await supabase.auth.getUser();
        const isSkeletonKeyUser = user?.id === SKELETON_KEY_USER_ID;

        if (isSkeletonKeyUser) {
          // Grant all features to skeleton key user
          setAccess({
            tradeCalculators: true,
            externalCalendarIntegration: true,
            unlimitedNotificationTexts: true,
            unlimitedCalendars: true,
            accountingIntegration: true,
            businessStructureMap: true,
            nccVoiceSearch: true,
            qbccVoiceSearch: true,
            timberQueenslandVoiceSearch: true,
            canRequestFeatures: true,
            featureRequestLimit: -1, // Unlimited
            isLoading: false
          });
          return;
        }

        // Regular feature access check for non-skeleton key users
        const [
          tradeCalculators,
          externalCalendarIntegration,
          unlimitedNotificationTexts,
          unlimitedCalendars,
          accountingIntegration,
          businessStructureMap,
          nccVoiceSearch,
          qbccVoiceSearch,
          timberQueenslandVoiceSearch,
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
          FeatureRequestService.hasQBCCVoiceSearchAccess(),
          FeatureRequestService.hasTimberQueenslandVoiceSearchAccess(),
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
          qbccVoiceSearch,
          timberQueenslandVoiceSearch,
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