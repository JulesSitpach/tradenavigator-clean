import { useQuery } from "@tanstack/react-query";
import { fetchAnalyses } from "../../lib/api";
import { Link } from "wouter";
import { Button } from "../../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { format } from "date-fns";

const RecentAnalyses = () => {
  const { data: analyses, isLoading, isError } = useQuery({
    queryKey: ["/api/analyses"],
    enabled: false,
  });

  // Format date function
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  // Sample data for the UI
  const sampleAnalyses = [
    {
      id: 1,
      description: "Textile Machinery Parts",
      analysisType: "Cost Analysis",
      originCountry: "Germany",
      destinationCountry: "United States",
      totalCost: 24500,
      currency: "USD",
      createdAt: new Date("2023-07-12").toISOString(),
    },
    {
      id: 2,
      description: "Automotive Sensors",
      analysisType: "Tariff Analysis",
      originCountry: "Japan",
      destinationCountry: "Canada",
      totalCost: 8750,
      currency: "USD",
      createdAt: new Date("2023-07-10").toISOString(),
    },
    {
      id: 3,
      description: "Medical Supplies",
      analysisType: "Route Analysis",
      originCountry: "United States",
      destinationCountry: "Brazil",
      totalCost: 12300,
      currency: "USD",
      createdAt: new Date("2023-07-08").toISOString(),
    },
    {
      id: 4,
      description: "Organic Food Products",
      analysisType: "Regulations",
      originCountry: "Italy",
      destinationCountry: "Australia",
      totalCost: 9850,
      currency: "USD",
      createdAt: new Date("2023-07-05").toISOString(),
    },
  ];

  // Use actual data or sample data
  const displayData = analyses || sampleAnalyses;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Analyses</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of your recent trade analyses and calculations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/cost-analysis?new=true">
            <Button>
              New Analysis
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-red-500">
                  Error loading analyses
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
                        Description
                      </TableHead>
                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Type
                      </TableHead>
                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Origin
                      </TableHead>
                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Destination
                      </TableHead>
                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Total Cost
                      </TableHead>
                      <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Date
                      </TableHead>
                      <TableHead className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-950">
                    {displayData.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                          {analysis.description}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {analysis.analysisType}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {analysis.originCountry}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {analysis.destinationCountry}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: analysis.currency 
                          }).format(analysis.totalCost)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(analysis.createdAt)}
                        </TableCell>
                        <TableCell className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link 
                            href={`/${analysis.analysisType.toLowerCase().replace(' ', '-')}/${analysis.id}`}
                          >
                            <a className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                              View
                            </a>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentAnalyses;

