import { Link } from "react-router-dom";
import type { Campaign } from "../types/campaign";
import {
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Target,
  MoreVertical,
  BarChart3,
  Clock,
  Zap,
  MousePointer,
} from "lucide-react";
import type { JSX } from "react";
import { formatCurrency, formatDate } from "../lib/formatters";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformIcons: { [key: string]: JSX.Element } = {
      meta: <Facebook className="w-4 h-4 text-blue-600" />,
      facebook: <Facebook className="w-4 h-4 text-blue-600" />,
      instagram: <Instagram className="w-4 h-4 text-pink-600" />,
      twitter: <Twitter className="w-4 h-4 text-sky-500" />,
      google: <Globe className="w-4 h-4 text-red-500" />,
      tiktok: (
        <div className="w-4 h-4 bg-black text-white text-xs flex items-center justify-center">
          TT
        </div>
      ),
      linkedin: (
        <div className="w-4 h-4 bg-blue-700 text-white text-xs flex items-center justify-center">
          in
        </div>
      ),
      pinterest: (
        <div className="w-4 h-4 bg-red-600 text-white text-xs flex items-center justify-center">
          P
        </div>
      ),
    };
    return (
      platformIcons[platform.toLowerCase()] || (
        <Globe className="w-4 h-4 text-gray-500" />
      )
    );
  };

 



 

  const getPerformanceMetrics = (campaign: Campaign) => {
    // Calculate additional performance metrics based on campaign data
    const ctr =
      campaign.clicks && campaign.impressions
        ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
        : "0.00";

    const conversionRate =
      campaign.conversions && campaign.clicks
        ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2)
        : "0.00";

    const cpc =
      campaign.spend && campaign.clicks
        ? (campaign.spend / campaign.clicks).toFixed(2)
        : "0.00";

    const budgetUsed = campaign.spend
      ? ((campaign.spend / campaign.budget) * 100).toFixed(1)
      : "0";

    return { ctr, conversionRate, cpc, budgetUsed };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Campaigns Overview
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {campaigns?.length} total campaigns ·{" "}
              {campaigns?.filter((c) => c.status === "active").length} active ·{" "}
              {campaigns?.filter((c) => c.status === "paused")?.length} paused
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden">
        {campaigns?.map((campaign) => {
          const metrics = getPerformanceMetrics(campaign);

          return (
            <div
              key={campaign.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  {/* <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {campaign.id}
                    </span>
                  </div> */}
                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {campaign.name}
                  </Link>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                  {/* <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button> */}
                </div>
              </div>

              {/* Platform & Brand Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {campaign.platforms.map((platform) => (
                      <div key={platform} className="p-1.5 bg-gray-100 rounded">
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                  {/* <div className="text-xs text-gray-500">
                    · {formatDate(campaign.created_at)}
                  </div> */}
                </div>
                {/* <div className="text-xs text-gray-500 flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  {campaign.brand_id}
                </div> */}
              </div>

              {/* Budget Information */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-linear-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    Total Budget
                  </div>
                  <div className="font-bold text-gray-900 flex items-center">
                    {/* <DollarSign className="w-4 h-4 mr-1" /> */}
                    {formatCurrency(campaign.budget)}
                  </div>
                </div>
                <div className="bg-linear-to-r from-green-50 to-green-100 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium mb-1">
                    Daily Budget
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatCurrency(campaign.daily_budget || 0)}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              {campaign.spend && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Budget Usage</span>
                    <span className="text-sm font-medium text-gray-900">
                      {metrics.budgetUsed}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600"
                      style={{
                        width: `${Math.min(Number(metrics.budgetUsed), 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Campaign Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                {campaign.clicks && (
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      Clicks
                    </div>
                    <div className="font-bold text-gray-900">
                      {campaign.clicks.toLocaleString()}
                    </div>
                  </div>
                )}
                {campaign.impressions && (
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">
                      Impressions
                    </div>
                    <div className="font-bold text-gray-900">
                      {campaign.impressions.toLocaleString()}
                    </div>
                  </div>
                )}
                {campaign.conversions && (
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">
                      Conversions
                    </div>
                    <div className="font-bold text-gray-900">
                      {campaign?.conversions}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Created {formatDate(campaign.created_at)}
                </div>
                <div className="flex items-center gap-2">
                  {/* <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button> */}
                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Campaign Name
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Todal Budget
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Daily Budget
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Platforms
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns?.map((campaign) => {
              //   const metrics = getPerformanceMetrics(campaign);

              return (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Campaign Details */}
                  <td className="py-4 px-6">
                    <div>
                      <Link
                        to={`/campaign/${campaign.id}`}
                        className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {campaign.name}
                      </Link>
                    </div>
                  </td>

                  {/* Status & Brand */}
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                          campaign.status
                        )} inline-block`}
                      >
                        {campaign.status}
                      </span>
                      {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="font-mono">{campaign.brand_id}</span>
                      </div> */}
                    </div>
                  </td>

                  {/* Total Budget */}
                  <td className="py-4 px-6">
                    <div className="flex items-center font-bold text-gray-900">
                      {formatCurrency(campaign.budget)}
                    </div>
                  </td>

                  {/* Daily Budget */}
                  <td className="py-4 px-6">
                    <div className="font-semibold items-center text-gray-900">
                      {formatCurrency(campaign.daily_budget || 0)}
                    </div>
                  </td>

                  {/* Platforms */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {campaign?.platforms?.map((platform) => (
                        <div
                          key={platform}
                          className="px-2 py-1  bg-gray-200 rounded-md group-hover:bg-gray-200 transition-colors flex gap-1 items-center"
                          title={
                            platform.charAt(0).toUpperCase() + platform.slice(1)
                          }
                        >
                          {getPlatformIcon(platform)}
                          <span className="text-xs text-gray-600">
                            {platform}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(campaign.created_at)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(campaign.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/campaign/${campaign.id}`}
                        className="px-4 py-2 bg-linear-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm hover:shadow text-sm font-medium flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Details
                      </Link>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{campaigns?.length}</span>{" "}
              campaigns
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Paused</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 mr-4">
              Total Budget: {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))}
            </div>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Next
            </button>
          </div> */}
        </div>
      </div>

      {/* Empty State */}
      {campaigns?.length === 0 && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-linear-to-r from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first campaign to start advertising across platforms
          </p>
          <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md font-medium">
            Create First Campaign
          </button>
        </div>
      )}
    </div>
  );
}
