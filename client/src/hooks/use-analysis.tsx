import { useAnalysis as useAnalysisContext } from "../providers/AnalysisProvider";

// Re-export the hook from the provider
export const useAnalysis = useAnalysisContext;
