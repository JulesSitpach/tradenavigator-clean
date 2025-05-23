import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Gift, FileText, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function SpecialPrograms() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;
  const urgencyLevel = costData?.urgencyLevel || 'Not specified';

  // Dynamic program eligibility based on user's actual data
  const getEligiblePrograms = () => {
    if (!costData || productCategory === 'Not specified') {
      return [];
    }

    const programs = [];

    // GSP (Generalized System of Preferences)
    const gspCountries = ['India', 'Thailand', 'Turkey', 'Brazil', 'Indonesia'];
    if (gspCountries.some(country => originCountry.includes(country)) && 
        destinationCountry.includes('United States')) {
      programs.push({
        name: 'GSP Program',
        type: 'Duty Elimination',
        eligibility: 'High',
        savings: Math.round(totalValue * 0.08),
        requirements: ['Certificate of Origin', 'Direct shipment'],
        timeline: '2-3 weeks processing',
        description: `Eliminates duties for ${productCategory} from ${originCountry}`,
        icon: Gift
      });
    }

    // Duty Drawback
    if (totalValue > 5000) {
      programs.push({
        name: 'Duty Drawback',
        type: 'Duty Recovery',
        eligibility: 'Medium',
        savings: Math.round(totalValue * 0.06),
        requirements: ['Export within 5 years', 'Manufacturing records', 'CBP filing'],
        timeline: '6-12 months processing',
        description: 'Recover duties paid on imported materials when you export finished goods',
        icon: DollarSign
      });
    }

    // ATA Carnet for temporary imports
    if (productCategory.includes('Machinery') || productCategory.includes('Electronics')) {
      programs.push({
        name: 'ATA Carnet',
        type: 'Temporary Import',
        eligibility: 'High',
        savings: Math.round(totalValue * 0.12),
        requirements: ['Temporary purpose', 'Re-export guarantee', 'Carnet application'],
        timeline: '1-2 weeks processing',
        description: 'Duty-free temporary import for trade shows, demos, or repairs',
        icon: Clock
      });
    }

    // Bonded Warehouse
    if (totalValue > 10000 && !urgencyLevel.toLowerCase().includes('urgent')) {
      programs.push({
        name: 'Bonded Warehouse',
        type: 'Deferred Duty',
        eligibility: 'Medium',
        savings: Math.round(totalValue * 0.04),
        requirements: ['Warehouse facility', 'CBP bond', 'Inventory tracking'],
        timeline: 'Immediate upon setup',
        description: 'Store goods without paying duties until withdrawal for sale',
        icon: FileText
      });
    }

    // HTSUS Chapter 98 (Free entry)
    if (totalValue < 2500) {
      programs.push({
        name: 'De Minimis Entry',
        type: 'Duty-Free Entry',
        eligibility: 'High',
        savings: Math.round(totalValue * 0.10),
        requirements: ['Value under $2,500', 'Informal entry'],
        timeline: 'Same day processing',
        description: 'Expedited, duty-free entry for low-value shipments',
        icon: CheckCircle2
      });
    }

    return programs;
  };

  const eligiblePrograms = getEligiblePrograms();

  // Calculate total potential savings
  const totalPotentialSavings = eligiblePrograms.reduce((sum, program) => sum + program.savings, 0);

  const getEligibilityColor = (eligibility) => {
    switch (eligibility) {
      case 'High': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Star className="mr-3 text-yellow-600" />
            Special Programs
          </h1>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-yellow-800">Product:</span>
                  <p className="text-yellow-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-yellow-800">Route:</span>
                  <p className="text-yellow-700">{originCountry} → {destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-yellow-800">Value:</span>
                  <p className="text-yellow-700">${totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-yellow-800">Potential Savings:</span>
                  <p className="text-yellow-700 font-bold">${totalPotentialSavings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {eligiblePrograms.length > 0 ? (
          <div className="space-y-6">
            {/* Programs Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 text-yellow-600" />
                  Available Programs
                </CardTitle>
                <CardDescription>
                  Duty savings opportunities for your {productCategory} import from {originCountry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eligiblePrograms.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <program.icon className="w-6 h-6 text-blue-600 mt-1" />
                          <div>
                            <h3 className="font-medium text-lg">{program.name}</h3>
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                          </div>
                        </div>
                        <Badge className={getEligibilityColor(program.eligibility)}>
                          {program.eligibility} Eligibility
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Program Type:</span>
                          <Badge variant="outline">{program.type}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Potential Savings:</span>
                          <span className="font-bold text-green-600">${program.savings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Processing Time:</span>
                          <Badge variant="secondary">{program.timeline}</Badge>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                        <ul className="text-sm space-y-1">
                          {program.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className="w-full" 
                        variant={program.eligibility === 'High' ? 'default' : 'outline'}
                      >
                        {program.eligibility === 'High' ? 'Apply Now' : 'Learn More'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Savings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 text-green-600" />
                  Savings Breakdown
                </CardTitle>
                <CardDescription>
                  Total potential savings across all eligible programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eligiblePrograms.map((program, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <program.icon className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{program.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600">${program.savings.toLocaleString()}</span>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((program.savings / totalValue) * 100)}% of order value
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <span className="font-bold text-green-800">Total Potential Savings</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${totalPotentialSavings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Guide</CardTitle>
                <CardDescription>
                  Priority steps to maximize your savings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Quick Wins</h4>
                    <p className="text-sm text-green-700">
                      Start with high-eligibility programs that offer immediate savings
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Long-term Strategy</h4>
                    <p className="text-sm text-blue-700">
                      Set up bonded warehouse and duty drawback for recurring shipments
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Documentation</h4>
                    <p className="text-sm text-purple-700">
                      Ensure all certificates and records are properly maintained
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Compliance</h4>
                    <p className="text-sm text-orange-700">
                      Work with customs broker to ensure program requirements are met
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    Generate Program Application Package
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Consultation with Trade Specialist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                Special programs analysis will show duty savings opportunities based on your specific trade details
              </p>
              <Button onClick={() => window.location.href = '/cost-analysis'}>
                Go to Cost Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}


