export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: "active" | "paused" | "completed" | "draft";
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
  start_date?: string;
  end_date?: string;
  spend?: number;
  clicks?: number;
  impressions?: number;
  conversions?: number;
  ctr?: number;
  conversion_rate?: number;
  avg_cpc?: number;
  // Optional metadata
  description?: string;
  target_audience?: string;
  objective?: "awareness" | "traffic" | "engagement" | "leads" | "sales" | "app_installs";
  updated_at?: string;
}

// Additional interfaces for related data
export interface CampaignMetrics {
  campaign_id: string;
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  conversion_rate: number;
  avg_cpc: number;
}

export interface CampaignInsights {
  campaign_id: string;
  total_spend: number;
  total_clicks: number;
  total_impressions: number;
  total_conversions: number;
  avg_ctr: number;
  avg_conversion_rate: number;
  avg_cpc: number;
  cost_per_conversion: number;
  budget_utilization: number;
  start_date: string;
  end_date?: string;
}

// For the table component props
export interface CampaignTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaignId: string) => void;
  onEditClick?: (campaignId: string) => void;
  onDeleteClick?: (campaignId: string) => void;
  isLoading?: boolean;
}

export interface CampaignInsights {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}
