import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import SummaryCard from '../../components/dashboard/SummaryCard';
import RecentAnalyses from '../../components/dashboard/RecentAnalyses';
import AnalyticsSummary from '../../components/dashboard/AnalyticsSummary';
import ComplianceSection from '../../components/dashboard/ComplianceSection';
import OpportunityCard from '../../components/dashboard/OpportunityCard';
// PHASE 2 FIX: Import providers for progressive data discovery
import { useCostData } from '../../providers/CostDataProvider';
import { useAnalysis } from '../../providers/AnalysisProvider';
import { Package, Globe, Ship, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const Overview = () => {
  // PHASE 2 FIX: Connect to providers for real data
  const { costData, savedSearches } = useCostData();
  const { currentAnalysis, costAnalysisResults, isLoading } = useAnalysis();

  // Calculate dynamic values based on real data
  const totalValue = costData?.totalValue || 0;
  const hasActiveAnalysis = !!costData?.productName;
  const recentSearchCount = savedSearches?.length || 0;

  return (
    <MainLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {hasActiveAnalysis 
              ? `Analyzing: ${costData?.productName} (${costData?.originCountry} → ${costData?.destinationCountry})`
              : 'Enter data in Cost Analysis to see your trade overview here'
            }
          </p>
        </div>

        {/* PHASE 2 FIX: Show progressive discovery status */}
        {!hasActiveAnalysis && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Get Started with Progressive Data Discovery</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Visit the <strong>Cost Analysis</strong> page to enter your product details. 
                  This overview will automatically populate with insights from your data.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* PHASE 2 FIX: Dynamic data from providers */}
          <SummaryCard
            title="Current Analysis"
            value={hasActiveAnalysis ? costData?.productName || "Active" : "None"}
            change={hasActiveAnalysis ? "✅ Data Available" : "⏳ Waiting for data"}
            timeframe={hasActiveAnalysis ? `${costData?.originCountry} → ${costData?.destinationCountry}` : "Start in Cost Analysis"}
            icon={<Package className="h-6 w-6 text-blue-600" />}
          />
          
          <SummaryCard
            title="Total Shipment Value"
            value={totalValue > 0 ? `$${totalValue.toLocaleString()}` : "$0"}
            change={totalValue > 0 ? `${costData?.quantity || 0} units` : "No data"}
            timeframe={totalValue > 0 ? `@ $${costData?.unitPrice || 0}/unit` : "Enter quantity & price"}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
          />
          
          <SummaryCard
            title="Saved Searches"
            value={recentSearchCount.toString()}
            change={recentSearchCount > 0 ? "Available" : "None yet"}
            timeframe="Across all analyses"
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          />

          {/* Trade Route Summary */}
          {hasActiveAnalysis && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Trade Route</h3>
                <Ship className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Origin:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{costData?.originCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Destination:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{costData?.destinationCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{costData?.shippingMethod || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Incoterms:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{costData?.incoterms || 'Not specified'}</span>
                </div>
                {costData?.hsCode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">HS Code:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{costData.hsCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Details */}
          {hasActiveAnalysis && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Details</h3>
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{costData?.productCategory}</p>
                </div>
                {costData?.productDescription && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{costData.productDescription}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-xs text-gray-500">Weight</span>
                    <p className="text-sm font-medium">{costData?.weight || 0} kg</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Dimensions</span>
                    <p className="text-sm font-medium">
                      {costData?.dimensions?.length || 0} × {costData?.dimensions?.width || 0} × {costData?.dimensions?.height || 0} cm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {costAnalysisResults && (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100">Analysis Complete</h3>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Your trade analysis is ready! Data is now available across all dashboards.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Route Analysis
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tariff Analysis
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Regulations
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +14 More
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Existing Components - Enhanced with Progressive Data */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Analyses</h2>
            <RecentAnalyses data={savedSearches} />
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analytics Summary</h2>
            <AnalyticsSummary 
              hasData={hasActiveAnalysis}
              costData={costData}
              analysisResults={costAnalysisResults}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Compliance Overview</h2>
            <ComplianceSection 
              hasData={hasActiveAnalysis}
              originCountry={costData?.originCountry}
              destinationCountry={costData?.destinationCountry}
              hsCode={costData?.hsCode}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Opportunities</h2>
            <OpportunityCard 
              hasData={hasActiveAnalysis}
              costData={costData}
            />
          </div>
        </div>

        {/* Progressive Discovery Help */}
        {!hasActiveAnalysis && (
          <div className="mt-8 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready for Progressive Data Discovery?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your trade details once in Cost Analysis, and watch as all 17 dashboards 
                automatically populate with insights, analysis, and opportunities.
              </p>
              <button
                onClick={() => window.location.href = '/cost-analysis'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                Start Cost Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Overview;


