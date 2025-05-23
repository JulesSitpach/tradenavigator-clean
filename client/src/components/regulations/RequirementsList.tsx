import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

interface Requirement {
  id: string;
  title: string;
  description: string;
  agency: string;
  category: string;
  mandatory: boolean;
  status: "completed" | "pending" | "not-required";
  dueDate?: string;
  complexity: "low" | "medium" | "high";
  documents: string[];
  links: {
    title: string;
    url: string;
  }[];
}

interface RequirementsListProps {
  country: string;
  productType: string;
}

const RequirementsList = ({ country, productType }: RequirementsListProps) => {
  // In a real application, this would fetch from an API based on country and product type
  const getRequirements = (country: string, productType: string): Requirement[] => {
    // Example requirements for US electronics
    if (country === "US" && productType === "electronics") {
      return [
        {
          id: "1",
          title: "FCC Declaration of Conformity",
          description: "Electronics must comply with FCC regulations for electromagnetic interference.",
          agency: "Federal Communications Commission (FCC)",
          category: "Certification",
          mandatory: true,
          status: "pending",
          dueDate: "2023-08-15",
          complexity: "medium",
          documents: ["FCC Form 740", "Test Reports", "Technical Documentation"],
          links: [
            { title: "FCC Guidelines", url: "#" },
            { title: "Testing Labs", url: "#" }
          ]
        },
        {
          id: "2",
          title: "UL Safety Certification",
          description: "Voluntary safety certification for electronic products.",
          agency: "Underwriters Laboratories (UL)",
          category: "Certification",
          mandatory: false,
          status: "not-required",
          complexity: "high",
          documents: ["Product Samples", "Technical Documentation", "Application Form"],
          links: [
            { title: "UL Application Process", url: "#" }
          ]
        },
        {
          id: "3",
          title: "Customs Entry Form",
          description: "Required for all imports to clear customs.",
          agency: "U.S. Customs and Border Protection (CBP)",
          category: "Customs",
          mandatory: true,
          status: "pending",
          dueDate: "2023-08-10",
          complexity: "low",
          documents: ["CBP Form 7501", "Commercial Invoice", "Packing List"],
          links: [
            { title: "CBP Import Guidelines", url: "#" }
          ]
        },
        {
          id: "4",
          title: "Electronic Product Radiation Control Reporting",
          description: "Required for products that emit radiation (e.g., wireless devices).",
          agency: "Food and Drug Administration (FDA)",
          category: "Compliance",
          mandatory: true,
          status: "completed",
          complexity: "medium",
          documents: ["FDA Form 2877", "Technical Documentation"],
          links: [
            { title: "FDA Electronic Products", url: "#" }
          ]
        }
      ];
    }
    
    // Default fallback requirements (simplified)
    return [
      {
        id: "1",
        title: "Import License",
        description: "General import license requirement.",
        agency: "Customs Authority",
        category: "Customs",
        mandatory: true,
        status: "pending",
        dueDate: "2023-08-15",
        complexity: "medium",
        documents: ["Application Form", "Business License", "Product Details"],
        links: [
          { title: "Import License Guidelines", url: "/regulations/guidelines" }
        ]
      },
      {
        id: "2",
        title: "Commercial Invoice",
        description: "Required for all commercial shipments.",
        agency: "Customs Authority",
        category: "Documentation",
        mandatory: true,
        status: "pending",
        dueDate: "2023-08-10",
        complexity: "low",
        documents: ["Invoice Template"],
        links: [
          { title: "Invoice Requirements", url: "#" }
        ]
      }
    ];
  };

  const [requirements, setRequirements] = useState<Requirement[]>(
    getRequirements(country, productType)
  );
  
  const [completedItems, setCompletedItems] = useState<string[]>(
    requirements.filter(r => r.status === "completed").map(r => r.id)
  );

  const handleToggleComplete = (id: string) => {
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter(itemId => itemId !== id));
    } else {
      setCompletedItems([...completedItems, id]);
    }
  };

  const getComplexityLabel = (complexity: "low" | "medium" | "high") => {
    switch (complexity) {
      case "low":
        return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">High</Badge>;
    }
  };
  
  const getStatusIcon = (status: "completed" | "pending" | "not-required") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "not-required":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Filter requirements based on selected country and product type
  const filteredRequirements = getRequirements(country, productType);
  
  // Calculate progress percentage
  const totalRequired = filteredRequirements.filter(r => r.mandatory).length;
  const completedRequired = completedItems.filter(id => 
    filteredRequirements.find(r => r.id === id && r.mandatory)
  ).length;
  const progressPercentage = totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Compliance Progress</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedRequired} of {totalRequired} mandatory requirements completed
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
            <Download className="mr-2 h-4 w-4" />
            Export Checklist
          </Button>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Completed: {completedItems.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span>Pending: {filteredRequirements.filter(r => r.status === "pending").length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Not Required: {filteredRequirements.filter(r => r.status === "not-required").length}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredRequirements.map((requirement) => (
          <div 
            key={requirement.id}
            className={`border rounded-lg ${
              completedItems.includes(requirement.id)
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                : "border-gray-200 dark:border-gray-700"
            } overflow-hidden`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="mr-3 flex items-center h-5 mt-0.5">
                  <Checkbox 
                    id={`requirement-${requirement.id}`}
                    checked={completedItems.includes(requirement.id)}
                    onCheckedChange={() => handleToggleComplete(requirement.id)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Label 
                        htmlFor={`requirement-${requirement.id}`}
                        className={`font-medium ${
                          completedItems.includes(requirement.id)
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {requirement.title}
                      </Label>
                      {requirement.mandatory && (
                        <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {requirement.dueDate && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(requirement.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {getComplexityLabel(requirement.complexity)}
                      <div className="flex items-center">
                        {getStatusIcon(requirement.status)}
                      </div>
                    </div>
                  </div>
                  <p className={`mt-1 text-sm ${
                    completedItems.includes(requirement.id)
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-300"
                  }`}>
                    {requirement.description}
                  </p>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="py-2 text-sm">
                    View Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Agency:</span>{" "}
                        <span className="font-medium">{requirement.agency}</span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Required Documents:</span>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {requirement.documents.map((doc, idx) => (
                            <li key={idx} className="text-gray-600 dark:text-gray-300">{doc}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {requirement.links.length > 0 && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Helpful Links:</span>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {requirement.links.map((link, idx) => (
                              <li key={idx}>
                                <a 
                                  href={link.url} 
                                  className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                                >
                                  {link.title}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Document
                        </Button>
                        <Button size="sm">
                          Complete Requirement
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementsList;

