import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AnalysisProvider } from "./providers/AnalysisProvider";
import { CostDataProvider } from "./providers/CostDataProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";

// Import our new Router component
import AppRouter from "./components/AppRouter";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AuthProvider>
            <AnalysisProvider>
              <CostDataProvider>
                <TooltipProvider>
                  <Toaster />
                  <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
                    <AppRouter />
                  </Suspense>
                </TooltipProvider>
              </CostDataProvider>
            </AnalysisProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

