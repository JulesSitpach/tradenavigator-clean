import React from 'react';
import { useLocation } from 'wouter';
import MainLayout from '../components/layouts/MainLayout';
import { getHashUrl, navigateTo } from '../lib/navigation';

export default function Dashboard() {
  const [location] = useLocation();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tools Section */}
          <DashboardCard 
            title="Cost Breakdown" 
            description="Calculate total landed costs for international shipments" 
            link="/cost-analysis"
            icon="📊" 
          />
          <DashboardCard 
            title="Alternative Routes" 
            description="Compare shipping routes, methods, and costs" 
            link="/route-analysis" 
            icon="🚢" 
          />
          <DashboardCard 
            title="Tariff Lookup" 
            description="Find duty rates and classification options" 
            link="/tariff-analysis" 
            icon="📋" 
          />
          <DashboardCard 
            title="Visualizations" 
            description="Interactive data visualizations for your trade data" 
            link="/visualizations" 
            icon="📈" 
          />
          
          {/* Programs Section */}
          <DashboardCard 
            title="Duty Drawback" 
            description="Recovery of duties, taxes, and fees" 
            link="/programs/duty-drawback" 
            icon="💰" 
          />
          <DashboardCard 
            title="Trade Zones" 
            description="Leverage free trade zones for cost savings" 
            link="/programs/trade-zones" 
            icon="🌎" 
          />
          <DashboardCard 
            title="Special Programs" 
            description="Duty savings opportunities and eligibility" 
            link="/programs/special-programs" 
            icon="🌟" 
          />
          
          {/* Regulations Section */}
          <DashboardCard 
            title="Basic Regulations" 
            description="Essential compliance requirements for your products" 
            link="/regulations" 
            icon="📝" 
          />
          <DashboardCard 
            title="Detailed Regulations" 
            description="In-depth regulatory information by product category" 
            link="/regulations-detailed" 
            icon="📑" 
          />
          <DashboardCard 
            title="Exemptions" 
            description="Find out about exemptions and special conditions" 
            link="/regulations-exemptions" 
            icon="🔎" 
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
  icon: string;
}

function DashboardCard({ title, description, link, icon }: DashboardCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] border border-border">
      <div className="flex items-start">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          <a 
            href={link}
            className="text-primary hover:underline text-sm font-medium"
          >
            Open tool →
          </a>
        </div>
      </div>
    </div>
  );
}


