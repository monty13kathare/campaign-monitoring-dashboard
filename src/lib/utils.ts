import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}


export const calculateTrend = (
  current: number,
  previous?: number
) => {
  if (!previous || previous === 0) {
    return { value: 0, isPositive: true };
  }

  const diff = current - previous;
  const percent = Math.round((Math.abs(diff) / previous) * 100);

  return {
    value: percent,
    isPositive: diff >= 0,
  };
};


 export const getStatusColor = (status: string) => {
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




 
