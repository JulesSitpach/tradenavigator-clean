import { ReactNode } from 'react';
import { CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

interface DashboardHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple';
}

export function DashboardHeader({ title, description, icon, variant = 'blue' }: DashboardHeaderProps) {
  const variantStyles = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700',
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
    amber: 'bg-gradient-to-r from-amber-600 to-amber-700',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-700'
  };

  return (
    <CardHeader className={`${variantStyles[variant]} text-white`}>
      <CardTitle className="text-2xl flex items-center gap-2 text-white">
        <span className="text-white">{icon}</span>
        {title}
      </CardTitle>
      <CardDescription className={`${variant === 'blue' ? 'text-blue-100' : variant === 'emerald' ? 'text-emerald-100' : variant === 'amber' ? 'text-amber-100' : 'text-purple-100'}`}>
        {description}
      </CardDescription>
    </CardHeader>
  );
}
