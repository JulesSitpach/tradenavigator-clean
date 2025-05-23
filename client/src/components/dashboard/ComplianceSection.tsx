import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ComplianceRequirement {
  id: number;
  title: string;
  description: string;
  icon: string;
  actionText: string;
  actionHref: string;
}

interface ComplianceSectionProps {
  requirements?: ComplianceRequirement[];
}

const ComplianceSection = ({ requirements }: ComplianceSectionProps) => {
  // Sample requirements if none provided
  const defaultRequirements: ComplianceRequirement[] = [
    {
      id: 1,
      title: "FDA Import Documentation Required",
      description: "Medical supplies shipment requires FDA Form 2877",
      icon: "gpp_maybe",
      actionText: "Process",
      actionHref: "/regulations/fda",
    },
    {
      id: 2,
      title: "Certificate of Origin Required",
      description: "Automotive sensors shipment to Canada needs USMCA certificate",
      icon: "gpp_maybe",
      actionText: "Process",
      actionHref: "/regulations/coo",
    },
    {
      id: 3,
      title: "Import License Expiring",
      description: "Your Brazilian import license expires in 15 days",
      icon: "gpp_maybe",
      actionText: "Renew",
      actionHref: "/regulations/license",
    },
  ];

  const items = requirements || defaultRequirements;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Compliance Requirements
          </h2>
          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
            {items.length} pending
          </Badge>
        </div>
        <div className="mt-6">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item) => (
                <li key={item.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <div>
                      <Link href={item.actionHref}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full"
                        >
                          {item.actionText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900 px-6 py-3">
        <div className="text-sm">
          <Link href="/regulations">
            <a className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              View all compliance requirements
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComplianceSection;

