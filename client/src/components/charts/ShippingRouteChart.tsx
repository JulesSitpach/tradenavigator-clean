import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";

interface Route {
  id: string;
  name: string;
  days: number;
  icon: string;
  iconColor: string;
}

interface ShippingRouteChartProps {
  fastestRoute?: Route;
  economicalRoute?: Route;
}

const ShippingRouteChart = ({ 
  fastestRoute = { 
    id: "air", 
    name: "Fastest Route", 
    days: 15, 
    icon: "flight", 
    iconColor: "text-amber-500" 
  },
  economicalRoute = { 
    id: "ocean", 
    name: "Most Economical", 
    days: 32, 
    icon: "directions_boat", 
    iconColor: "text-blue-500" 
  }
}: ShippingRouteChartProps) => {
  
  return (
    <div>
      {/* Map chart placeholder */}
      <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg relative mb-4">
        <div className="absolute inset-0 opacity-30 rounded-lg p-6">
          {/* World map outline in background */}
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="absolute left-[25%] top-[40%] w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="absolute left-[75%] top-[35%] w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="absolute left-[25%] top-[40%] right-[25%] h-0.5 bg-blue-500" style={{ top: '40%', transform: 'translate(0, 1.5px)' }}></div>
        <div className="z-10 text-sm font-medium text-gray-600 dark:text-gray-300">
          Route visualization coming soon
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{fastestRoute.name}</div>
          <div className="mt-1 flex items-center">
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{fastestRoute.days} days</span>
            <span className={`material-icons ${fastestRoute.iconColor} text-sm ml-1`}>{fastestRoute.icon}</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{economicalRoute.name}</div>
          <div className="mt-1 flex items-center">
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{economicalRoute.days} days</span>
            <span className={`material-icons ${economicalRoute.iconColor} text-sm ml-1`}>{economicalRoute.icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingRouteChart;

