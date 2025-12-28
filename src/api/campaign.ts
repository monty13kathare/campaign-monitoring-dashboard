const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://mixo-fe-backend-task.vercel.app";

export const getCampaigns = async () => {
  const res = await fetch(`${BASE_URL}/campaigns`);
  return res.json();
};

export const getCampaignById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/campaigns/${id}`);
  return res.json();
};

export const getGlobalInsights = async () => {
  const res = await fetch(`${BASE_URL}/campaigns/insights`);
  return res.json();
};

export const getCampaignInsights = async (id: string) => {
  const res = await fetch(`${BASE_URL}/campaigns/${id}/insights`);
  return res.json();
};
