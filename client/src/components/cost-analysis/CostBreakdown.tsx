import { useQuery } from "@tanstack/react-query";
import { fetchAnalysisById } from "../../lib/api";
import CostBreakdownChart from "../charts/CostBreakdownChart";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Download, Share2, Save } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

interface CostBreakdownProps {
  analysisId: number | null;
}

const CostBreakdown = ({ analysisId }: CostBreakdownProps) => {
  const { data: analysis, isLoading, isError } = useQuery({
    queryKey: [analysisId ? `/api/analyses/${analysisId}` : null],
    enabled: !!analysisId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[250px] w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load cost analysis data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare chart data
  const breakdownData = [
    { name: "Duty", value: (analysis.breakdown.duties / analysis.totalCost) * 100, color: "#3B82F6" },
    { name: "Freight", value: (analysis.breakdown.freight / analysis.totalCost) * 100, color: "#38BDF8" },
    { name: "Taxes", value: (analysis.breakdown.taxes / analysis.totalCost) * 100, color: "#F59E0B" },
    { name: "Insurance", value: (analysis.breakdown.insurance / analysis.totalCost) * 100, color: "#10B981" },
    { name: "Customs", value: (analysis.breakdown.customsClearance / analysis.totalCost) * 100, color: "#8B5CF6" },
    { name: "Handling", value: (analysis.breakdown.handling / analysis.totalCost) * 100, color: "#EC4899" },
    { name: "Last Mile", value: (analysis.breakdown.lastMile / analysis.totalCost) * 100, color: "#F43F5E" },
    { name: "Other", value: (analysis.breakdown.other / analysis.totalCost) * 100, color: "#6B7280" },
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: analysis.currency || 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{analysis.description}</h2>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant="outline">{analysis.hsCode || "No HS Code"}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {analysis.originCountry} → {analysis.destinationCountry}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <CostBreakdownChart data={breakdownData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Landed Cost</p>
                <p className="text-2xl font-bold">{formatCurrency(analysis.totalCost)}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Method</p>
                <p className="font-medium">{analysis.shippingMethod?.toUpperCase() || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Carrier</p>
                <p className="font-medium">{analysis.carrier || "Any available carrier"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Cost Details</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cost Component
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Product Cost
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.productCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.productCost / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Freight
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.freight)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.freight / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Insurance
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.insurance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.insurance / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Duties
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.duties)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.duties / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Taxes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.taxes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.taxes / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Customs Clearance
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.customsClearance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.customsClearance / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Handling
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.handling)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.handling / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Last Mile Delivery
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.lastMile)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.lastMile / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        Other Costs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.breakdown.other)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                        {((analysis.breakdown.other / analysis.totalCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                        Total Landed Cost
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(analysis.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900 dark:text-gray-100">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization">
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertTitle>Optimization Suggestions</AlertTitle>
                <AlertDescription>
                  Based on your analysis, we've identified potential cost-saving opportunities.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Route Optimization</h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>You could save up to 15% on freight costs by switching to ocean freight instead of air freight.</p>
                      </div>
                      <div className="mt-3">
                        <div className="-mx-2 -my-1.5 flex">
                          <Button variant="outline" className="text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/60 px-2 py-1.5 rounded-md text-sm font-medium">
                            View Route Options
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Tariff Classification</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>Your product may qualify for a lower duty rate under HS code 8448.51.0000 instead of 8448.49.0000.</p>
                      </div>
                      <div className="mt-3">
                        <div className="-mx-2 -my-1.5 flex">
                          <Button variant="outline" className="text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/60 px-2 py-1.5 rounded-md text-sm font-medium">
                            Explore Classification Options
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Trade Program Eligibility</h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <p>Your shipment may qualify for duty-free treatment under USMCA program, saving up to 100% on duties.</p>
                      </div>
                      <div className="mt-3">
                        <div className="-mx-2 -my-1.5 flex">
                          <Button variant="outline" className="text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/60 px-2 py-1.5 rounded-md text-sm font-medium">
                            Check Eligibility
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostBreakdown;

