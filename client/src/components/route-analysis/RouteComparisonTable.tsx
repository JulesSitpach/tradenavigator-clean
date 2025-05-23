import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Calendar,
  Flag,
  Clock,
  DollarSign,
  AlertTriangle,
  Check,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

interface RouteComparisonTableProps {
  routes: any[];
}

interface RouteDetailsProps {
  route: any;
}

const RouteDetails = ({ route }: RouteDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Route Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Carrier:</span>
              <span className="font-medium">{route.carrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Service:</span>
              <span className="font-medium">{route.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Transit Time:</span>
              <span className="font-medium">{route.estimatedDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Cost:</span>
              <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: route.currency }).format(route.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
              <Badge variant={route.riskLevel === 'low' ? 'success' : route.riskLevel === 'medium' ? 'warning' : 'destructive'}>
                {route.riskLevel.charAt(0).toUpperCase() + route.riskLevel.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Base Rate:</span>
              <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: route.currency }).format(route.cost * 0.7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Fuel Surcharge:</span>
              <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: route.currency }).format(route.cost * 0.15)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Insurance:</span>
              <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: route.currency }).format(route.cost * 0.05)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Handling Fees:</span>
              <span className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: route.currency }).format(route.cost * 0.1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Transit Details</h3>
        <div className="relative">
          <div className="absolute left-2.5 top-2.5 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="mb-6 ml-6 relative">
            <div className="absolute -left-8 mt-0.5 h-4 w-4 rounded-full bg-green-500"></div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="font-semibold">Origin</p>
              <p className="sm:ml-auto text-gray-500 dark:text-gray-400">Day 0</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Package picked up from shipper</p>
          </div>
          
          <div className="mb-6 ml-6 relative">
            <div className="absolute -left-8 mt-0.5 h-4 w-4 rounded-full bg-blue-500"></div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="font-semibold">Departure</p>
              <p className="sm:ml-auto text-gray-500 dark:text-gray-400">Day 1</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Package leaves origin country</p>
          </div>
          
          {route.estimatedDays > 7 && (
            <div className="mb-6 ml-6 relative">
              <div className="absolute -left-8 mt-0.5 h-4 w-4 rounded-full bg-amber-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <p className="font-semibold">In Transit</p>
                <p className="sm:ml-auto text-gray-500 dark:text-gray-400">Days 2-{route.estimatedDays - 3}</p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Package in transit</p>
            </div>
          )}
          
          <div className="mb-6 ml-6 relative">
            <div className="absolute -left-8 mt-0.5 h-4 w-4 rounded-full bg-purple-500"></div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="font-semibold">Customs Clearance</p>
              <p className="sm:ml-auto text-gray-500 dark:text-gray-400">Day {route.estimatedDays - 2}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Package clears customs</p>
          </div>
          
          <div className="ml-6 relative">
            <div className="absolute -left-8 mt-0.5 h-4 w-4 rounded-full bg-red-500"></div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="font-semibold">Delivery</p>
              <p className="sm:ml-auto text-gray-500 dark:text-gray-400">Day {route.estimatedDays}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Package delivered to consignee</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Required Documentation</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
          <li>Commercial Invoice</li>
          <li>Packing List</li>
          <li>Bill of Lading / Air Waybill</li>
          <li>Certificate of Origin (if applicable)</li>
          <li>Customs Declaration Forms</li>
          {route.service.toLowerCase().includes('express') && (
            <li>Express Courier Documentation</li>
          )}
        </ul>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Download Quote
        </Button>
        <Button>
          <Check className="h-4 w-4 mr-2" />
          Select This Route
        </Button>
      </div>
    </div>
  );
};

const RouteComparisonTable = ({ routes }: RouteComparisonTableProps) => {
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);
  
  const toggleRoute = (index: number) => {
    if (selectedRoutes.includes(index)) {
      setSelectedRoutes(selectedRoutes.filter(i => i !== index));
    } else {
      if (selectedRoutes.length < 3) {
        setSelectedRoutes([...selectedRoutes, index]);
      }
    }
  };
  
  // Sort routes by cost
  const sortedRoutes = [...routes].sort((a, b) => a.cost - b.cost);
  
  // Calculate relative transit time metrics
  const fastestTime = Math.min(...routes.map(r => r.estimatedDays));
  const slowestTime = Math.max(...routes.map(r => r.estimatedDays));
  const timeRange = slowestTime - fastestTime > 0 ? slowestTime - fastestTime : 1;
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Route Comparison Results
        </h3>
        <p className="text-blue-600 dark:text-blue-300 mt-1">
          We found {routes.length} shipping options for your route. Compare and select the best option for your needs.
        </p>
      </div>
      
      {selectedRoutes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Side-by-Side Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {selectedRoutes.map((routeIndex) => (
                      <TableHead key={routeIndex}>
                        {sortedRoutes[routeIndex].carrier} {sortedRoutes[routeIndex].service}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Transit Time</TableCell>
                    {selectedRoutes.map((routeIndex) => (
                      <TableCell key={routeIndex}>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          {sortedRoutes[routeIndex].estimatedDays} days
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost</TableCell>
                    {selectedRoutes.map((routeIndex) => (
                      <TableCell key={routeIndex}>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: sortedRoutes[routeIndex].currency 
                          }).format(sortedRoutes[routeIndex].cost)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Risk Level</TableCell>
                    {selectedRoutes.map((routeIndex) => (
                      <TableCell key={routeIndex}>
                        <div className="flex items-center">
                          <AlertTriangle className={`h-4 w-4 mr-2 ${
                            sortedRoutes[routeIndex].riskLevel === 'low' 
                              ? 'text-green-500' 
                              : sortedRoutes[routeIndex].riskLevel === 'medium' 
                              ? 'text-amber-500' 
                              : 'text-red-500'
                          }`} />
                          {sortedRoutes[routeIndex].riskLevel.charAt(0).toUpperCase() + sortedRoutes[routeIndex].riskLevel.slice(1)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Action</TableCell>
                    {selectedRoutes.map((routeIndex) => (
                      <TableCell key={routeIndex}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Details</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>
                                {sortedRoutes[routeIndex].carrier} {sortedRoutes[routeIndex].service} Details
                              </DialogTitle>
                              <DialogDescription>
                                Complete shipping route information and documentation requirements
                              </DialogDescription>
                            </DialogHeader>
                            <RouteDetails route={sortedRoutes[routeIndex]} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedRoutes.length === 0 
            ? "Select up to 3 routes to compare side-by-side" 
            : `${selectedRoutes.length} of 3 routes selected`}
        </p>
      </div>
      
      <div className="grid gap-4">
        {sortedRoutes.map((route, index) => (
          <Card key={index} className={selectedRoutes.includes(index) 
            ? "border-2 border-primary-500" 
            : ""
          }>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center">
                    {route.carrier} {route.service}
                    {index === 0 && (
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Best Value
                      </Badge>
                    )}
                    {route.estimatedDays === fastestTime && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Fastest
                      </Badge>
                    )}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transit Time</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        {route.estimatedDays} days
                      </p>
                      <div className="w-full mt-1">
                        <Progress 
                          value={100 - ((route.estimatedDays - fastestTime) / timeRange * 100)} 
                          className="h-1"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                      <p className="font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: route.currency 
                        }).format(route.cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                      <Badge variant={route.riskLevel === 'low' 
                        ? 'outline' 
                        : route.riskLevel === 'medium' 
                        ? 'secondary' 
                        : 'destructive'
                      }>
                        {route.riskLevel === 'low' && <Check className="h-3 w-3 mr-1" />}
                        {route.riskLevel === 'medium' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {route.riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {route.riskLevel.charAt(0).toUpperCase() + route.riskLevel.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                  <Button 
                    variant={selectedRoutes.includes(index) ? "default" : "outline"}
                    onClick={() => toggleRoute(index)}
                    disabled={selectedRoutes.length >= 3 && !selectedRoutes.includes(index)}
                  >
                    {selectedRoutes.includes(index) ? "Selected" : "Compare"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {route.carrier} {route.service} Details
                        </DialogTitle>
                        <DialogDescription>
                          Complete shipping route information and documentation requirements
                        </DialogDescription>
                      </DialogHeader>
                      <RouteDetails route={route} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteComparisonTable;

