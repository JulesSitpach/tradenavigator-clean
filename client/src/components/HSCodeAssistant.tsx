import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface HSCodeSuggestion {
  code: string;
  description: string;
  confidence: number;
  reasoning: string;
}

interface HSCodeAssistantProps {
  productName: string;
  productDescription: string;
  productCategory?: string;
  onCodeSelect: (code: string) => void;
  currentCode?: string;
}

const HSCodeAssistant: React.FC<HSCodeAssistantProps> = ({
  productName,
  productDescription,
  productCategory,
  onCodeSelect,
  currentCode
}) => {
  const [suggestions, setSuggestions] = useState<HSCodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getSuggestions = async () => {
    if (!productName.trim()) {
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    try {
      const response = await fetch('/api/hs-code-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productName.trim(),
          productDescription: productDescription.trim(),
          productCategory: productCategory || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get HS code suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error getting HS code suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSelect = (code: string) => {
    onCodeSelect(code);
    setShowSuggestions(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={getSuggestions}
        disabled={!productName.trim() || isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting AI suggestions...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI HS Code Suggestions
          </>
        )}
      </Button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">AI Suggested HS Codes:</h4>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => handleCodeSelect(suggestion.code)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-lg font-semibold">{suggestion.code}</div>
                  <Badge className={getConfidenceColor(suggestion.confidence)}>
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
                {suggestion.code === currentCode && (
                  <div className="flex items-center mt-2 text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Currently selected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            No HS code suggestions found. Try providing more detailed product information.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HSCodeAssistant;
