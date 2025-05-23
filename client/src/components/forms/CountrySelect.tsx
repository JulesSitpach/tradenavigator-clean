// client/src/components/forms/CountrySelect.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useLanguage } from '../../providers/LanguageProvider';

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Americas-focused country list for SMB trade opportunities
export const COUNTRIES = [
  // North America - Primary Markets
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  
  // Central America - Emerging Opportunities
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'Central America' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', region: 'Central America' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'Central America' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'Central America' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'Central America' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'Central America' },
  
  // South America - Major Opportunities
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'South America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'South America' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'South America' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'South America' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'South America' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'South America' },
  
  // Caribbean - Strategic Hubs
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', region: 'Caribbean' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'Caribbean' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'Caribbean' },
  
  // Major Global Trade Partners
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
];

// Group countries by region for better UX
const groupedCountries = COUNTRIES.reduce((acc, country) => {
  if (!acc[country.region]) {
    acc[country.region] = [];
  }
  acc[country.region].push(country);
  return acc;
}, {} as Record<string, typeof COUNTRIES>);

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select a country",
  className = "",
}) => {
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Americas First - SMB Focus */}
        <div className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border-b">
          🌎 Americas - Alternative Trade Routes
        </div>
        {groupedCountries['North America']?.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              {country.name}
            </span>
          </SelectItem>
        ))}
        {groupedCountries['Central America']?.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              {country.name}
            </span>
          </SelectItem>
        ))}
        {groupedCountries['South America']?.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              {country.name}
            </span>
          </SelectItem>
        ))}
        {groupedCountries['Caribbean']?.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              {country.name}
            </span>
          </SelectItem>
        ))}
        
        {/* Global Partners */}
        <div className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-t mt-2">
          🌍 Major Global Partners
        </div>
        {['Asia', 'Europe'].map(region => 
          groupedCountries[region]?.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center">
                <span className="mr-2">{country.flag}</span>
                {country.name}
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
