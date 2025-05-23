import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Link } from "wouter";

interface SummaryCardProps {
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number;
  linkText: string;
  linkHref: string;
}

const SummaryCard = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  linkText,
  linkHref,
}: SummaryCardProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <div className={`${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <a className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              {linkText}
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SummaryCard;

