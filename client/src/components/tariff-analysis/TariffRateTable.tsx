import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTariffData } from "../../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { AlertTriangle, Check, Info, Loader2, TrendingDown } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

interface TariffRateTableProps {
  hsCode: string;
}

const TariffRateTable = ({ hsCode }: TariffRateTableProps) => {
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationCountry, setDestinationCountry] = useState("US");

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/tariff/${hsCode}`, originCountry, destinationCountry],
    queryFn: () => fetchTariffData(hsCode, originCountry, destinationCountry),
  });

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "CN", label: "China" },
    { value: "DE", label: "Germany" },
    { value: "JP", label: "Japan" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "IN", label: "India" },
  ];

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load tariff data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Origin Country
          </label>
          <Select
            value={originCountry}
            onValueChange={setOriginCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select origin country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destination Country
          </label>
          <Select
            value={destinationCountry}
            onValueChange={setDestinationCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="duties">
        <TabsList>
          <TabsTrigger value="duties">Duty Rates</TabsTrigger>
          <TabsTrigger value="programs">Preference Programs</TabsTrigger>
          <TabsTrigger value="additional">Additional Fees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="duties">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{data.hsCode}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{data.description}</p>
                </div>
                <Badge className="mt-2 md:mt-0">
                  Base Rate: {formatPercentage(data.baseRate)}
                </Badge>
              </div>
              
              <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Tariff Information
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      <p>The base duty rate for this product is {formatPercentage(data.baseRate)} when imported from {countryOptions.find(c => c.value === originCountry)?.label} to {countryOptions.find(c => c.value === destinationCountry)?.label}.</p>
                      {data.preferentialRates && data.preferentialRates.length > 0 && (
                        <p className="mt-1">There are {data.preferentialRates.length} preference programs that may provide reduced or zero duty rates.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Country Comparison</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Origin Country</TableHead>
                      <TableHead>Base Rate</TableHead>
                      <TableHead>Best Pref. Rate</TableHead>
                      <TableHead>Potential Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* China rates */}
                    <TableRow className={originCountry === "CN" ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell className="font-medium">China</TableCell>
                      <TableCell>{formatPercentage(0.075)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                          <AlertTriangle className="h-3 w-3 mr-1" /> None
                        </Badge>
                      </TableCell>
                      <TableCell>0.00%</TableCell>
                    </TableRow>
                    
                    {/* Mexico rates */}
                    <TableRow className={originCountry === "MX" ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell className="font-medium">Mexico</TableCell>
                      <TableCell>{formatPercentage(0.075)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          <Check className="h-3 w-3 mr-1" /> 0.00% (USMCA)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                        7.50%
                      </TableCell>
                    </TableRow>
                    
                    {/* Canada rates */}
                    <TableRow className={originCountry === "CA" ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell className="font-medium">Canada</TableCell>
                      <TableCell>{formatPercentage(0.065)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          <Check className="h-3 w-3 mr-1" /> 0.00% (USMCA)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                        6.50%
                      </TableCell>
                    </TableRow>
                    
                    {/* Japan rates */}
                    <TableRow className={originCountry === "JP" ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell className="font-medium">Japan</TableCell>
                      <TableCell>{formatPercentage(0.055)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                          {formatPercentage(0.025)} (GSP)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                        3.00%
                      </TableCell>
                    </TableRow>
                    
                    {/* Germany rates */}
                    <TableRow className={originCountry === "DE" ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell className="font-medium">Germany</TableCell>
                      <TableCell>{formatPercentage(0.05)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                          {formatPercentage(0.035)} (EU FTA)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                        1.50%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="programs">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Preferential Programs</h3>
              {data.preferentialRates && data.preferentialRates.length > 0 ? (
                <div className="space-y-4">
                  {data.preferentialRates.map((rate, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-base font-semibold">{rate.program}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            Preferential duty rate: {formatPercentage(rate.rate)}
                          </p>
                        </div>
                        <Badge className="mt-2 sm:mt-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Save {formatPercentage(data.baseRate - rate.rate)}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Requirements:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {rate.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Check Eligibility</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Preferential Programs Available</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are no preferential trade programs available for this product from {countryOptions.find(c => c.value === originCountry)?.label} to {countryOptions.find(c => c.value === destinationCountry)?.label}.
                  </p>
                  <div className="mt-6">
                    <Button>Explore Alternative Origins</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="additional">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Additional Fees and Taxes</h3>
              
              {data.additionalFees && data.additionalFees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Calculation Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.additionalFees.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{fee.type}</TableCell>
                        <TableCell>
                          {fee.calculationType === "percentage" 
                            ? formatPercentage(fee.amount)
                            : `$${fee.amount.toFixed(2)}`
                          }
                        </TableCell>
                        <TableCell>
                          {fee.calculationType === "percentage" 
                            ? "Percentage of value"
                            : "Fixed amount"
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Additional Fees Data</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Additional fees data is not available for this product and country combination.
                  </p>
                </div>
              )}
              
              <div className="mt-6 rounded-md bg-amber-50 dark:bg-amber-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      <p>Additional fees and taxes may apply based on local regulations and specific product characteristics. This information is provided for general guidance only.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {data.specialRequirements && data.specialRequirements.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Special Requirements</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    {data.specialRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TariffRateTable;

