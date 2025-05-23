import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Link } from "wouter";
import { ReactNode } from "react";

interface OpportunityCardProps {
  icon: ReactNode;
  iconColor: string;
  borderColor: string;
  title: string;
  description: string;
  confidence?: {
    label: string;
    value: number;
  };
  savings?: string;
  warning?: string;
  linkHref: string;
}

const OpportunityCard = ({
  icon,
  iconColor,
  borderColor,
  title,
  description,
  confidence,
  savings,
  warning,
  linkHref,
}: OpportunityCardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          {confidence && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Confidence</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{confidence.label}</span>
              </div>
              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`${
                    confidence.value >= 80 
                      ? "bg-green-500" 
                      : confidence.value >= 50 
                      ? "bg-amber-500"
                      : "bg-red-500"
                  } h-2 rounded-full`} 
                  style={{ width: `${confidence.value}%` }}
                />
              </div>
            </>
          )}
          
          {savings && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500 dark:text-gray-400">Est. Savings</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{savings}</span>
            </div>
          )}
          
          {warning && (
            <div className="mt-1 flex items-center">
              <span className="material-icons text-amber-500 text-sm mr-1">priority_high</span>
              <span className="text-xs text-amber-700 dark:text-amber-500">{warning}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900 px-5 py-3">
        <Link href={linkHref}>
          <a className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            View details
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;

