import { useQuery } from "@tanstack/react-query";
import { fetchAnalyses } from "../../lib/api";
import SummaryCard from "./SummaryCard";
import { ReceiptCent, TrendingUp, AlertTriangle } from "lucide-react";

const AnalyticsSummary = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ["/api/analyses"],
    enabled: false,
  });

  // Calculate summary data
  const totalAnalyses = analyses?.length || 0;
  
  // Calculate potential savings (in a real app, this would come from the backend)
  const potentialSavings = "$15,232";
  
  // Calculate compliance issues
  const complianceIssues = 3; // This would be from an API in a real app

  return (
    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        icon={<ReceiptCent className="h-6 w-6" />}
        iconBgColor="bg-primary-100 dark:bg-primary-900"
        iconColor="text-primary-600 dark:text-primary-400"
        title="Total Cost Analyses"
        value={isLoading ? "Loading..." : totalAnalyses}
        linkText="View all"
        linkHref="/cost-analysis"
      />
      
      <SummaryCard
        icon={<TrendingUp className="h-6 w-6" />}
        iconBgColor="bg-green-100 dark:bg-green-900"
        iconColor="text-green-600 dark:text-green-400"
        title="Potential Savings"
        value={potentialSavings}
        linkText="View opportunities"
        linkHref="/tariff-analysis"
      />
      
      <SummaryCard
        icon={<AlertTriangle className="h-6 w-6" />}
        iconBgColor="bg-amber-100 dark:bg-amber-900"
        iconColor="text-amber-600 dark:text-amber-400"
        title="Compliance Issues"
        value={complianceIssues}
        linkText="Review now"
        linkHref="/regulations"
      />
    </div>
  );
};

export default AnalyticsSummary;

