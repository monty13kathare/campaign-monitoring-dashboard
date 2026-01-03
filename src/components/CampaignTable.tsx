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
} from "lucide-react";
import type { JSX } from "react";
import { formatCurrency, formatDate } from "../lib/formatters";
import { getStatusColor } from "../lib/utils";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
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
          return (
            <div
              key={campaign.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
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
                </div>
              </div>

              {/* Budget Information */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-linear-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    Total Budget
                  </div>
                  <div className="font-bold text-gray-900 flex items-center">
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

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Created {formatDate(campaign.created_at)}
                </div>
                <div className="flex items-center gap-2">
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
                  Total Budget
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
