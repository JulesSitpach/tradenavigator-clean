import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Search, Loader2, Info, CheckCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Progress } from "../../components/ui/progress";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { fetchHSCodeSuggestions } from "../../lib/api";

interface HsCodeLookupProps {
  onHsCodeSelected: (hsCode: string, description: string) => void;
}

const formSchema = z.object({
  productDescription: z.string().min(5, "Description must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const HsCodeLookup = ({ onHsCodeSelected }: HsCodeLookupProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return fetchHSCodeSuggestions(data.productDescription);
    },
    onSuccess: (data) => {
      setSuggestions(data);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const handleSelect = (hsCode: string, description: string) => {
    onHsCodeSelected(hsCode, description);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Describe your product in detail..." 
                        className="pl-8"
                        {...field}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        "Find HS Code"
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Enter a detailed description of your product for accurate HS code suggestions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {mutation.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
        </div>
      )}

      {mutation.isError && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Error Finding HS Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We encountered an error while searching for HS codes. Please try again or refine your search terms.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}

      {!mutation.isPending && !mutation.isError && suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Suggested HS Codes</h3>
          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className="hover:border-primary-500 transition-colors cursor-pointer"
              onClick={() => handleSelect(suggestion.hsCode, suggestion.description)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-lg">{suggestion.hsCode}</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Harmonized System (HS) code used for international trade</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {index === 0 && (
                        <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Best Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{suggestion.description}</p>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Confidence:</span>
                      <span className="font-medium">{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                    <Progress 
                      value={suggestion.confidence * 100} 
                      className="w-full md:w-24 h-2 mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(suggestion.hsCode, suggestion.description);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Select this HS Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!mutation.isPending && !mutation.isError && suggestions.length === 0 && mutation.isSuccess && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              No HS Codes Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              We couldn't find any matching HS codes. Try using more specific product details or
              terminology commonly used in international trade.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => form.reset()}
            >
              Try Different Terms
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          What is an HS Code?
        </h3>
        <p className="text-blue-600 dark:text-blue-300 mt-1">
          The Harmonized System (HS) is an international nomenclature for the classification of products.
          Customs authorities use HS codes to identify products for applying tariffs and collecting international trade statistics.
        </p>
      </div>
    </div>
  );
};

export default HsCodeLookup;

