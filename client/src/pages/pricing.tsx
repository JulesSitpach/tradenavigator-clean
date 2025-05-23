import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import PricingPlans from '../components/pricing/PricingPlans';
import { useLanguage } from "../providers/LanguageProvider";

const PricingPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <PricingPlans />
        
        {/* Americas Trade Focus Banner */}
        <div className="bg-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-800 sm:text-3xl sm:tracking-tight">
                  {t('americas.title')}
                </h2>
                <p className="mt-3 text-lg text-blue-600">
                  {t('americas.subtitle')}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-blue-700">🇺🇸 🇨🇦 🇲🇽</h3>
                    <p className="text-sm mt-1 text-gray-700">{t('americas.northAmerica')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-blue-700">🇨🇷 🇵🇦 🇬🇹</h3>
                    <p className="text-sm mt-1 text-gray-700">{t('americas.centralAmerica')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-blue-700">🇧🇷 🇦🇷 🇨🇴</h3>
                    <p className="text-sm mt-1 text-gray-700">{t('americas.southAmerica')}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-blue-700">🇩🇴 🇯🇲 🇹🇹</h3>
                    <p className="text-sm mt-1 text-gray-700">{t('americas.caribbean')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="flex">
                  <a
                    href="#"
                    className="px-5 py-3 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700"
                  >
                    Explore Americas Trade Routes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    LS
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Luis Sanchez</h3>
                    <p className="text-sm text-gray-500">Textiles Exporter, Mexico</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "TradeNavigator has transformed how we ship to South America. The alternative routes saved us 22% on shipping costs last quarter."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    JC
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Jennifer Chen</h3>
                    <p className="text-sm text-gray-500">Electronics Distributor, Canada</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The Business plan gives us everything we need for our Americas trade routes. The compliance monitoring alone is worth the price."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    MR
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Marco Rivera</h3>
                    <p className="text-sm text-gray-500">Coffee Exporter, Colombia</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The detailed insights into Central American trade regulations saved us from costly compliance issues. Worth every penny."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill={i < 4 ? "currentColor" : "none"} stroke={i < 4 ? "none" : "currentColor"} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to simplify your Americas trade?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
              Join thousands of businesses that have optimized their trade routes, reduced costs, and simplified compliance with TradeNavigator.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#"
                className="px-8 py-3 rounded-md shadow-lg bg-white text-blue-700 font-medium text-lg hover:bg-blue-50"
              >
                Start Your Free Trial
              </a>
              <a
                href="#"
                className="ml-4 px-8 py-3 rounded-md border border-blue-300 text-white font-medium text-lg hover:bg-blue-800"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage;


