import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface PricingFeature {
  name: string;
  free: boolean;
  professional: boolean;
  business: boolean;
  enterprise: boolean;
}

const PricingPlans: React.FC = () => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  
  // Calculate prices with annual discount
  const getPriceDisplay = (monthlyPrice: number) => {
    if (billingCycle === 'annually') {
      const annualPrice = monthlyPrice * 10; // 2 months free
      return `$${annualPrice}${t('pricing.annually')}`;
    }
    return `$${monthlyPrice}${t('pricing.monthly')}`;
  };
  
  // Features table for all plans
  const features: PricingFeature[] = [
    { 
      name: 'Basic Cost Analysis', 
      free: true, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'HS Code Lookup', 
      free: true, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Standard Route Analysis', 
      free: true, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Alternative Routes (3)', 
      free: false, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'AI Guidance Basic', 
      free: false, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Americas Trade Focus', 
      free: false, 
      professional: true, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Advanced Cost Modeling', 
      free: false, 
      professional: false, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Unlimited Route Analysis', 
      free: false, 
      professional: false, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Document Templates', 
      free: false, 
      professional: false, 
      business: true, 
      enterprise: true 
    },
    { 
      name: 'Compliance Monitoring', 
      free: false, 
      professional: false, 
      business: false, 
      enterprise: true 
    },
    { 
      name: 'Dedicated Account Manager', 
      free: false, 
      professional: false, 
      business: false, 
      enterprise: true 
    },
    { 
      name: 'Custom API Access', 
      free: false, 
      professional: false, 
      business: false, 
      enterprise: true 
    },
  ];
  
  // Function to render check or X
  const renderAvailability = (isAvailable: boolean) => {
    return isAvailable ? (
      <Check className="h-5 w-5 text-green-500" />
    ) : (
      <X className="h-5 w-5 text-gray-300" />
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Pricing Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('pricing.title')}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          {t('pricing.subtitle')}
        </p>
        
        {/* Billing Cycle Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex bg-gray-100 rounded-lg p-1 max-w-xs">
            <button
              className={`relative py-2 px-6 text-sm font-medium rounded-md focus:outline-none ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`relative py-2 px-6 text-sm font-medium rounded-md focus:outline-none ${
                billingCycle === 'annually' 
                  ? 'bg-white text-gray-900 shadow' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('annually')}
            >
              Annually
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Plan */}
        <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">{t('pricing.free')}</h2>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">$0</p>
            <p className="mt-1 text-sm text-gray-500">No credit card required</p>
            
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">3 cost analyses per month</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Basic trade route analysis</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Simple HS code lookup</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a
                href="#"
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-100"
              >
                {t('pricing.getStarted')}
              </a>
            </div>
          </div>
        </div>
        
        {/* Professional Plan */}
        <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">{t('pricing.professional')}</h2>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">{billingCycle === 'monthly' ? '$19' : '$190'}</p>
            <p className="mt-1 text-sm text-gray-500">{billingCycle === 'monthly' ? 'per month' : 'per year (save $38)'}</p>
            
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Unlimited cost analyses</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Alternative route analysis</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">AI trade guidance</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Americas trade specialization</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a
                href="#"
                className="block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-medium text-white text-center hover:bg-blue-700"
              >
                {t('pricing.getStarted')}
              </a>
            </div>
          </div>
        </div>
        
        {/* Business Plan */}
        <div className="rounded-lg border border-blue-200 shadow-md overflow-hidden relative">
          {/* Popular tag */}
          <div className="absolute top-0 inset-x-0">
            <div className="bg-blue-500 text-white text-xs font-semibold py-1 text-center">
              Most Popular
            </div>
          </div>
          
          <div className="p-6 pt-8">
            <h2 className="text-lg font-medium text-gray-900">{t('pricing.business')}</h2>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">{billingCycle === 'monthly' ? '$49' : '$490'}</p>
            <p className="mt-1 text-sm text-gray-500">{billingCycle === 'monthly' ? 'per month' : 'per year (save $98)'}</p>
            
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Everything in Professional</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Advanced cost modeling</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Unlimited route analysis</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Document templates & generation</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a
                href="#"
                className="block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-medium text-white text-center hover:bg-blue-700"
              >
                {t('pricing.getStarted')}
              </a>
            </div>
          </div>
        </div>
        
        {/* Enterprise Plan */}
        <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">{t('pricing.enterprise')}</h2>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">{billingCycle === 'monthly' ? '$99' : '$990'}</p>
            <p className="mt-1 text-sm text-gray-500">{billingCycle === 'monthly' ? 'per month' : 'per year (save $198)'}</p>
            
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Everything in Business</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Custom API access</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Compliance monitoring</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">Dedicated account manager</p>
              </li>
            </ul>
            
            <div className="mt-8">
              <a
                href="#"
                className="block w-full bg-gray-800 border border-transparent rounded-md py-2 text-sm font-medium text-white text-center hover:bg-gray-900"
              >
                {t('pricing.contactSales')}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Compare All Features</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('pricing.free')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('pricing.professional')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('pricing.business')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('pricing.enterprise')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderAvailability(feature.free)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderAvailability(feature.professional)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderAvailability(feature.business)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderAvailability(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16 border-t border-gray-200 pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Can I change plans later?</h3>
            <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Is there a trial period?</h3>
            <p className="mt-2 text-gray-600">All paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
            <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and for Enterprise plans, we also support invoicing.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">What's special about the Americas Trade Focus?</h3>
            <p className="mt-2 text-gray-600">Our platform provides specialized data, routes, and regulations for North, Central, and South American trade corridors, ideal for SMBs looking for alternatives to traditional routes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
