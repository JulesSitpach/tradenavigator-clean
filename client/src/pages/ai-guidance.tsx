import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Brain, Lightbulb, AlertTriangle, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useCostData } from "../providers/CostDataProvider";

export default function AIGuidance() {
  const { costData } = useCostData();

  // Extract key information from cost analysis
  const productCategory = costData?.productCategory || 'Not specified';
  const originCountry = costData?.originCountry || 'Not specified';
  const destinationCountry = costData?.destinationCountry || 'Not specified';
  const shippingMethod = costData?.shippingMethod || 'Not specified';
  const urgencyLevel = costData?.urgencyLevel || 'Not specified';
  const unitPrice = costData?.unitPrice || 0;
  const quantity = costData?.quantity || 1;
  const totalValue = unitPrice * quantity;
  const hsCode = costData?.hsCode || 'Not provided';

  // Generate intelligent recommendations based on user's actual data
  const generateRecommendations = () => {
    if (!costData || productCategory === 'Not specified') {
      return null;
    }

    const recommendations = [];
    
    // Cost optimization recommendations
    if (shippingMethod.toLowerCase().includes('air') && urgencyLevel.toLowerCase() === 'standard') {
      recommendations.push({
        type: 'cost',
        priority: 'high',
        title: 'Switch to Ocean Freight',
        description: `For ${productCategory} with standard delivery, ocean freight could save 60-70% on shipping costs`,
        savings: Math.round(totalValue * 0.1),
        effort: 'Low'
      });
    }

    // Trade agreement opportunities
    if ((originCountry.includes('Canada') || originCountry.includes('Mexico')) && 
        destinationCountry.includes('United States')) {
      recommendations.push({
        type: 'savings',
        priority: 'high',
        title: 'USMCA Benefits Available',
        description: 'Your route qualifies for preferential tariff rates under USMCA',
        savings: Math.round(totalValue * 0.05),
        effort: 'Medium'
      });
    }

    // Volume optimization
    if (quantity < 100 && unitPrice > 50) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: 'Consider Larger Orders',
        description: 'Increasing order quantity could unlock better pricing and shipping rates',
        savings: Math.round(totalValue * 0.15),
        effort: 'Low'
      });
    }

    // Compliance optimization
    if (hsCode === 'Not provided' || hsCode.length < 6) {
      recommendations.push({
        type: 'compliance',
        priority: 'high',
        title: 'Optimize HS Code Classification',
        description: 'Accurate HS code classification could reduce duty rates and avoid delays',
        savings: Math.round(totalValue * 0.08),
        effort: 'Medium'
      });
    }

    // Market timing
    if (productCategory.includes('Textiles') && new Date().getMonth() > 8) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        title: 'Seasonal Import Opportunity',
        description: 'Q4 is peak season for textiles - consider expedited shipping for holiday demand',
        savings: 0,
        effort: 'High'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Risk assessment based on user data
  const generateRiskAssessment = () => {
    if (!costData) return null;

    const risks = [];

    if (totalValue > 10000 && !shippingMethod.toLowerCase().includes('courier')) {
      risks.push({
        level: 'medium',
        category: 'Financial',
        description: 'High-value shipment without premium handling',
        mitigation: 'Consider insurance and tracking services'
      });
    }

    if (urgencyLevel.toLowerCase().includes('urgent') && shippingMethod.toLowerCase().includes('ocean')) {
      risks.push({
        level: 'high',
        category: 'Timeline',
        description: 'Urgent timeline with slow shipping method',
        mitigation: 'Switch to air freight or express courier'
      });
    }

    if (destinationCountry.includes('United States') && productCategory.includes('Food')) {
      risks.push({
        level: 'high',
        category: 'Compliance',
        description: 'FDA requirements for food imports',
        mitigation: 'Ensure FDA prior notice and proper labeling'
      });
    }

    return risks;
  };

  const risks = generateRiskAssessment();

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Lightbulb className="w-5 h-5 text-orange-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'cost': return 'bg-green-50 border-green-200';
      case 'savings': return 'bg-blue-50 border-blue-200';
      case 'compliance': return 'bg-red-50 border-red-200';
      case 'optimization': return 'bg-purple-50 border-purple-200';
      case 'timing': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with context from Cost Analysis */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Brain className="mr-3 text-purple-600" />
            AI Guidance
          </h1>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-800">Product:</span>
                  <p className="text-purple-700">{productCategory}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Route:</span>
                  <p className="text-purple-700">{originCountry} → {destinationCountry}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Method:</span>
                  <p className="text-purple-700">{shippingMethod}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Urgency:</span>
                  <p className="text-purple-700">{urgencyLevel}</p>
                </div>
                <div>
                  <span className="font-medium text-purple-800">Value:</span>
                  <p className="text-purple-700">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {recommendations ? (
          <div className="space-y-6">
            {/* Optimization Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 text-yellow-600" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  AI-powered insights for your {productCategory} trade from {originCountry} to {destinationCountry}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getTypeColor(rec.type)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getPriorityIcon(rec.priority)}
                            <div className="flex-1">
                              <h4 className="font-medium flex items-center">
                                {rec.title}
                                <Badge className="ml-2" variant="outline">
                                  {rec.priority} priority
                                </Badge>
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {rec.description}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                {rec.savings > 0 && (
                                  <Badge variant="secondary">
                                    Potential savings: ${rec.savings.toLocaleString()}
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  Effort: {rec.effort}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>Your current setup looks optimized!</p>
                    <p className="text-sm">No immediate improvements identified</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            {risks && risks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 text-orange-600" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Potential risks identified for your shipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {risks.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        risk.level === 'high' ? 'text-red-500' : 
                        risk.level === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{risk.category} Risk</h4>
                          <Badge variant={risk.level === 'high' ? 'destructive' : 'secondary'}>
                            {risk.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                        <p className="text-sm font-medium mt-2 text-blue-600">
                          💡 {risk.mitigation}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 text-green-600" />
                  Trade Performance Score
                </CardTitle>
                <CardDescription>
                  Overall optimization score for your current setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendations.length === 0 ? '95' : Math.max(65, 95 - (recommendations.length * 10))}%
                    </div>
                    <p className="text-sm text-green-700">Cost Efficiency</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {urgencyLevel.toLowerCase().includes('urgent') && shippingMethod.toLowerCase().includes('ocean') ? '60' : '85'}%
                    </div>
                    <p className="text-sm text-blue-700">Timeline Match</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {hsCode === 'Not provided' ? '70' : '90'}%
                    </div>
                    <p className="text-sm text-purple-700">Compliance</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {risks?.length > 1 ? '65' : '80'}%
                    </div>
                    <p className="text-sm text-orange-700">Risk Management</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>
                  Priority steps to optimize your trade setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.length > 0 ? (
                  <>
                    <Button className="w-full justify-start">
                      <CheckCircle2 className="mr-2 w-4 h-4" />
                      Implement High Priority Recommendations
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 w-4 h-4" />
                      Schedule Optimization Review
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="mr-2 w-4 h-4" />
                      Explore Advanced Optimization
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 w-4 h-4" />
                      Set Up Monitoring Alerts
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Complete Your Cost Analysis First</h3>
              <p className="text-muted-foreground mb-4">
                AI guidance will provide personalized recommendations based on your specific trade requirements
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


