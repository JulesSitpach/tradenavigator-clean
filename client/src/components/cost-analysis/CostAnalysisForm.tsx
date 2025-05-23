import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createAnalysis } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { Loader2 } from "lucide-react";

// Form schema
const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  hsCode: z.string().optional(),
  category: z.string().optional(),
  value: z.coerce.number().min(0.01, "Value must be greater than 0"),
  valueUnit: z.string().default("per item"),
  currency: z.string().default("USD"),
  weight: z.coerce.number().min(0.01, "Weight must be greater than 0"),
  weightUnit: z.string().default("kg"),
  dimensions: z.object({
    length: z.coerce.number().min(0),
    width: z.coerce.number().min(0),
    height: z.coerce.number().min(0),
    unit: z.string().default("cm"),
  }),
  originCountry: z.string().min(2, "Origin country is required"),
  destinationCountry: z.string().min(2, "Destination country is required"),
  shippingMethod: z.string().default("air"),
  carrier: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CostAnalysisFormProps {
  onComplete: (analysisId: number) => void;
}

const CostAnalysisForm = ({ onComplete }: CostAnalysisFormProps) => {
  const [activeTab, setActiveTab] = useState("product");
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      hsCode: "",
      category: "",
      value: 0,
      valueUnit: "per item",
      currency: "USD",
      weight: 0,
      weightUnit: "kg",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
      originCountry: "",
      destinationCountry: "",
      shippingMethod: "air",
      carrier: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return createAnalysis({
        ...data,
        analysisType: "cost",
        // Set default breakdown values
        totalCost: data.value * 1.35, // Example calculation
        breakdown: {
          productCost: data.value,
          freight: data.value * 0.15,
          insurance: data.value * 0.05,
          duties: data.value * 0.08,
          taxes: data.value * 0.04,
          customsClearance: data.value * 0.01,
          handling: data.value * 0.01,
          lastMile: data.value * 0.01,
          other: 0
        },
        optimizationSuggestions: []
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis created",
        description: "Your cost analysis has been calculated successfully.",
      });
      onComplete(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error creating analysis",
        description: "There was a problem calculating your cost analysis. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const goToNextTab = () => {
    if (activeTab === "product") {
      setActiveTab("origin");
    } else if (activeTab === "origin") {
      setActiveTab("shipping");
    } else if (activeTab === "shipping") {
      form.handleSubmit(onSubmit)();
    }
  };

  const goToPrevTab = () => {
    if (activeTab === "shipping") {
      setActiveTab("origin");
    } else if (activeTab === "origin") {
      setActiveTab("product");
    }
  };

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "CN", label: "China" },
    { value: "DE", label: "Germany" },
    { value: "JP", label: "Japan" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "MX", label: "Mexico" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "IN", label: "India" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="product">Product Details</TabsTrigger>
            <TabsTrigger value="origin">Origin & Destination</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Method</TabsTrigger>
          </TabsList>
          
          {/* Product Details Tab */}
          <TabsContent value="product">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Textile Machinery Parts" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear description of the product being shipped
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hsCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HS Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 8448.49.0000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Harmonized System code for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="machinery">Machinery</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="textiles">Textiles</SelectItem>
                            <SelectItem value="automotive">Automotive</SelectItem>
                            <SelectItem value="chemicals">Chemicals</SelectItem>
                            <SelectItem value="food">Food Products</SelectItem>
                            <SelectItem value="medical">Medical Supplies</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="valueUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Per</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="per item">Per Item</SelectItem>
                            <SelectItem value="per kg">Per Kg</SelectItem>
                            <SelectItem value="per shipment">Per Shipment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                            <SelectItem value="CAD">CAD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="lb">Pounds (lb)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dimensions.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cm">Centimeters (cm)</SelectItem>
                            <SelectItem value="in">Inches (in)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Origin & Destination Tab */}
          <TabsContent value="origin">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="originCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryOptions.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryOptions.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Shipping Method Tab */}
          <TabsContent value="shipping">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="air">Air Freight</SelectItem>
                          <SelectItem value="ocean">Ocean Freight</SelectItem>
                          <SelectItem value="road">Road Freight</SelectItem>
                          <SelectItem value="rail">Rail Freight</SelectItem>
                          <SelectItem value="multimodal">Multimodal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Carrier (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select carrier (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dhl">DHL</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="maersk">Maersk</SelectItem>
                          <SelectItem value="msc">MSC</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Leave blank to compare all available carriers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      "Calculate Costs"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default CostAnalysisForm;

