import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, ArrowRight, Trash2 } from 'lucide-react';
import { CostData } from "../providers/CostDataProvider";

interface SavedSearch {
  id: string;
  timestamp: Date;
  productName: string;
  productCategory: string;
  originCountry: string;
  destinationCountry: string;
  totalValue: number;
  data: CostData;
}

interface SavedSearchesProps {
  onLoadSearch: (data: CostData) => void;
}

export function SavedSearches({ onLoadSearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('tradeNavigator_savedSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        })));
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  // Save a new search
  const saveSearch = (data: CostData) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      timestamp: new Date(),
      productName: data.productName || 'Unnamed Product',
      productCategory: data.productCategory || 'Unknown Category',
      originCountry: data.originCountry || 'Unknown Origin',
      destinationCountry: data.destinationCountry || 'Unknown Destination',
      totalValue: data.totalValue || 0,
      data
    };

    // Keep only the last 3 searches
    const updatedSearches = [newSearch, ...savedSearches.slice(0, 2)];
    setSavedSearches(updatedSearches);
    
    // Save to localStorage
    localStorage.setItem('tradeNavigator_savedSearches', JSON.stringify(updatedSearches));
  };

  // Remove a saved search
  const removeSearch = (id: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem('tradeNavigator_savedSearches', JSON.stringify(updatedSearches));
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hr ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  // Expose saveSearch function to parent component
  useEffect(() => {
    (window as any).saveTradeSearch = saveSearch;
    return () => {
      delete (window as any).saveTradeSearch;
    };
  }, [savedSearches]);

  if (savedSearches.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            Complete your first cost analysis to see saved searches here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Searches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedSearches.map((search) => (
          <div 
            key={search.id} 
            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-sm truncate">
                  {search.productName}
                </h4>
                <Badge variant="outline" className="text-xs mt-1">
                  {search.productCategory}
                </Badge>
              </div>
              <button
                onClick={() => removeSearch(search.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Remove search"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            
            <div className="text-xs text-gray-600 mb-2">
              {search.originCountry} → {search.destinationCountry}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">
                ${search.totalValue.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatTimestamp(search.timestamp)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLoadSearch(search.data)}
                  className="h-7 px-2 text-xs"
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Load
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
