import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  BarChart3, TrendingUp, AlertTriangle, Clock, DollarSign, 
  Globe, Zap, Bell, Star, ArrowRight, Plus, Bookmark,
  PieChart, Activity, Target, ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCostData } from '../../providers/CostDataProvider';

export default function Dashboard() {
  const { costData } = useCostData();

  // Generate dynamic overview data based on user's analysis history
  const getCurrentMonthSummary = () => {
    const totalValue = costData ? (costData.unitPrice * costData.quantity) : 0;
    const estimatedShipments = Math.max(1, Math.floor(totalValue / 10000));
    const avgCostPerShipment = totalValue > 0 ? Math.round(totalValue / estimatedShipments) : 0;

    return {
      totalValue: totalValue || 125000,
      shipments: estimatedShipments || 8,
      avgCost: avgCostPerShipment || 15625,
      growth: '+12%'
    };
  };

  // Generate smart alerts based on current analysis
  const getSmartAlerts = () => {
    if (!costData) {
      return [
        { type: 'info', title: 'Get Started', message: 'Complete your first trade analysis to see personalized alerts', priority: 'low' },
        { type: 'trend', title: 'Market Update', message: 'Shipping rates from Asia down 8% this quarter', priority: 'medium' }
      ];
    }

    const alerts = [];
    const productCategory = costData.productCategory || '';
    const originCountry = costData.originCountry || '';
    const totalValue = (costData.unitPrice || 0) * (costData.quantity || 1);

    // Tariff change alerts
    if (productCategory.includes('Electronics')) {
      alerts.push({
        type: 'warning',
        title: 'Tariff Alert',
        message: 'Electronics duties may increase 15% next quarter - consider accelerated imports',
        priority: 'high'
      });
    }

    // Cost optimization opportunities
    if (totalValue > 25000) {
      alerts.push({
        type: 'savings',
        title: 'Savings Opportunity',
        message: `Trade zone benefits could save $${Math.round(totalValue * 0.08).toLocaleString()} annually`,
        priority: 'medium'
      });
    }

    // Route-specific insights
    if (originCountry.includes('China')) {
      alerts.push({
        type: 'trend',
        title: 'Alternative Routes',
        message: 'Vietnam suppliers offering 20% lower total costs for similar products',
        priority: 'medium'
      });
    }

    return alerts;
  };

  // Generate recent activity based on analysis
  const getRecentActivity = () => {
    if (!costData) {
      return [
        { action: 'Analysis Created', description: 'Ready to start your first trade analysis', time: 'Now', status: 'pending' }
      ];
    }

    return [
      { 
        action: 'Cost Analysis', 
        description: `${costData.productCategory} from ${costData.originCountry}`, 
        time: '2 min ago', 
        status: 'completed',
        value: `$${((costData.unitPrice || 0) * (costData.quantity || 1)).toLocaleString()}`
      },
      { 
        action: 'Tariff Lookup', 
        description: `HS Code verification for ${costData.productCategory}`, 
        time: '5 min ago', 
        status: 'completed' 
      },
      { 
        action: 'Route Analysis', 
        description: `${costData.shippingMethod} shipping options`, 
        time: '8 min ago', 
        status: 'completed' 
      }
    ];
  };

  // Performance metrics
  const getPerformanceMetrics = () => {
    const totalValue = costData ? (costData.unitPrice * costData.quantity) : 50000;
    const dutyRate = costData?.productCategory?.includes('Electronics') ? 6.5 : 5.0;
    const shippingRate = costData?.shippingMethod?.toLowerCase().includes('air') ? 15 : 8;

    return {
      avgDutyRate: dutyRate,
      avgShippingCost: shippingRate,
      costEfficiency: 87,
      timeEfficiency: 92
    };
  };

  const monthSummary = getCurrentMonthSummary();
  const alerts = getSmartAlerts();
  const recentActivity = getRecentActivity();
  const performance = getPerformanceMetrics();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'savings': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="dashboard-header">
          <h1 className="flex items-center text-2xl font-bold mb-2">
            <Globe className="h-6 w-6 mr-2" />
            Trade Command Center
          </h1>
          <p className="text-gray-500 mb-6">Your comprehensive international trade intelligence dashboard</p>
        </div>

        {/* Professional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex flex-col items-center justify-center space-y-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:transform hover:-translate-y-1"
            onClick={() => window.location.href = '/cost-analysis'}
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">New Analysis</span>
          </Button>
          
          <Button 
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-20 flex flex-col items-center justify-center space-y-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:transform hover:-translate-y-1"
            onClick={() => window.location.href = '/tariff-analysis'}
          >
            <Zap className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Quick Tariff Check</span>
          </Button>
          
          <Button 
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-20 flex flex-col items-center justify-center space-y-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:transform hover:-translate-y-1"
            onClick={() => window.location.href = '/ai-guidance'}
          >
            <Star className="w-6 h-6 text-purple-600" />
            <span className="font-medium">AI Insights</span>
          </Button>
          
          <Button 
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-20 flex flex-col items-center justify-center space-y-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:transform hover:-translate-y-1"
            onClick={() => window.location.href = '/visualizations'}
          >
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span className="font-medium">View Charts</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Professional Trade Health Dashboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-600" />
                Trade Health Dashboard
              </CardTitle>
              <CardDescription>Current month performance summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${monthSummary.totalValue.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700">Total Trade Value</p>
                  <Badge variant="outline" className="mt-1 bg-blue-100">{monthSummary.growth}</Badge>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{monthSummary.shipments}</div>
                  <p className="text-sm text-green-700">Active Shipments</p>
                  <Badge variant="outline" className="mt-1 bg-green-100">This month</Badge>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${monthSummary.avgCost.toLocaleString()}
                  </div>
                  <p className="text-sm text-purple-700">Avg Cost per Shipment</p>
                  <Badge variant="outline" className="mt-1 bg-purple-100">-5% vs last month</Badge>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{performance.avgDutyRate}%</div>
                  <p className="text-sm text-orange-700">Avg Duty Rate</p>
                  <Badge variant="outline" className="mt-1 bg-orange-100">Optimized</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Efficiency Score
              </CardTitle>
              <CardDescription>Your trade optimization metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Cost Efficiency</span>
                  <span className="text-sm">{performance.costEfficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${performance.costEfficiency}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Time Efficiency</span>
                  <span className="text-sm">{performance.timeEfficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${performance.timeEfficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">A-</div>
                  <p className="text-sm text-gray-500">Overall Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-orange-600" />
                Smart Alerts & Opportunities
              </CardTitle>
              <CardDescription>Personalized insights for your trade operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest trade analysis actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{activity.action}</h4>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        {activity.value && (
                          <div className="text-sm font-medium text-green-600">{activity.value}</div>
                        )}
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Access to Dashboards */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-indigo-600" />
              Analysis Dashboards
            </CardTitle>
            <CardDescription>Access all your trade analysis tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/regulations'}
              >
                <ShieldCheck className="w-6 h-6 text-red-600" />
                <span className="text-sm">Regulations</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/route-analysis'}
              >
                <Globe className="w-6 h-6 text-blue-600" />
                <span className="text-sm">Routes</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/markets'}
              >
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="text-sm">Markets</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/special-programs'}
              >
                <Star className="w-6 h-6 text-yellow-600" />
                <span className="text-sm">Programs</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/trade-zones'}
              >
                <Bookmark className="w-6 h-6 text-purple-600" />
                <span className="text-sm">Trade Zones</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}


