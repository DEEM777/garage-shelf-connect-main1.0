import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent = {
  eventType: 'portal_redirect' | 'offer_click';
  platform?: string;
  searchQuery?: string;
  itemName?: string;
};

export const useAnalytics = () => {
  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const { error } = await supabase
        .from('click_analytics' as any) // 'as any' because types might not be updated yet
        .insert([{
          event_type: event.eventType,
          platform: event.platform,
          search_query: event.searchQuery,
          item_name: event.itemName,
        }]);

      if (error) {
        console.warn('Analytics tracking error:', error.message);
      }
    } catch (err) {
      // Silent fail to not disrupt user experience
      console.warn('Analytics fallback silent fail:', err);
    }
  };

  return { trackEvent };
};
