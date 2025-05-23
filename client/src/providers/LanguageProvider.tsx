import React, { createContext, useContext, useState, useEffect } from 'react';
import { LucideGlobe } from 'lucide-react';

// Define available languages
export type LanguageCode = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.costAnalysis': 'Cost Analysis',
    'nav.routeAnalysis': 'Route Analysis',
    'nav.tariffAnalysis': 'Tariff Analysis',
    'nav.regulations': 'Regulations',
    'nav.markets': 'Markets',
    'nav.aiGuidance': 'AI Guidance',
    'nav.pricing': 'Pricing',
    
    // Common UI elements
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.results': 'Results',
    'common.noResults': 'No results found',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    
    // Dashboard
    'dashboard.title': 'Dashboard Overview',
    'dashboard.recentAnalyses': 'Recent Analyses',
    'dashboard.analyticsSummary': 'Analytics Summary',
    'dashboard.complianceOverview': 'Compliance Overview',
    'dashboard.opportunities': 'Opportunities',
    
    // Cost Analysis
    'costAnalysis.title': 'Cost Analysis',
    'costAnalysis.productInfo': 'Product Information',
    'costAnalysis.category': 'Product Category',
    'costAnalysis.name': 'Product Name',
    'costAnalysis.description': 'Product Description',
    'costAnalysis.hsCode': 'HS Code',
    'costAnalysis.calculate': 'Calculate',
    
    // Pricing
    'pricing.title': 'Pricing Plans',
    'pricing.subtitle': 'Find the perfect plan for your trade navigation needs',
    'pricing.free': 'Free',
    'pricing.professional': 'Professional',
    'pricing.business': 'Business',
    'pricing.enterprise': 'Enterprise',
    'pricing.monthly': '/month',
    'pricing.annually': '/year',
    'pricing.getStarted': 'Get Started',
    'pricing.contactSales': 'Contact Sales',
    'pricing.currentPlan': 'Current Plan',
    
    // Americas Focus
    'americas.title': 'Americas Trade Focus',
    'americas.subtitle': 'Specialized tools for North, Central, and South American trade',
    'americas.northAmerica': 'North America',
    'americas.centralAmerica': 'Central America',
    'americas.southAmerica': 'South America',
    'americas.caribbean': 'Caribbean',
    'americas.partners': 'Major Global Partners'
  },
  es: {
    // Navigation
    'nav.overview': 'Resumen',
    'nav.costAnalysis': 'Análisis de Costos',
    'nav.routeAnalysis': 'Análisis de Rutas',
    'nav.tariffAnalysis': 'Análisis de Aranceles',
    'nav.regulations': 'Regulaciones',
    'nav.markets': 'Mercados',
    'nav.aiGuidance': 'Guía de IA',
    'nav.pricing': 'Precios',
    
    // Common UI elements
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.results': 'Resultados',
    'common.noResults': 'No se encontraron resultados',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.submit': 'Enviar',
    
    // Dashboard
    'dashboard.title': 'Resumen del Panel',
    'dashboard.recentAnalyses': 'Análisis Recientes',
    'dashboard.analyticsSummary': 'Resumen Analítico',
    'dashboard.complianceOverview': 'Resumen de Cumplimiento',
    'dashboard.opportunities': 'Oportunidades',
    
    // Cost Analysis
    'costAnalysis.title': 'Análisis de Costos',
    'costAnalysis.productInfo': 'Información del Producto',
    'costAnalysis.category': 'Categoría del Producto',
    'costAnalysis.name': 'Nombre del Producto',
    'costAnalysis.description': 'Descripción del Producto',
    'costAnalysis.hsCode': 'Código HS',
    'costAnalysis.calculate': 'Calcular',
    
    // Pricing
    'pricing.title': 'Planes de Precios',
    'pricing.subtitle': 'Encuentra el plan perfecto para tus necesidades de navegación comercial',
    'pricing.free': 'Gratis',
    'pricing.professional': 'Profesional',
    'pricing.business': 'Negocio',
    'pricing.enterprise': 'Empresa',
    'pricing.monthly': '/mes',
    'pricing.annually': '/año',
    'pricing.getStarted': 'Comenzar',
    'pricing.contactSales': 'Contactar Ventas',
    'pricing.currentPlan': 'Plan Actual',
    
    // Americas Focus
    'americas.title': 'Enfoque en Comercio de las Américas',
    'americas.subtitle': 'Herramientas especializadas para el comercio en América del Norte, Central y del Sur',
    'americas.northAmerica': 'América del Norte',
    'americas.centralAmerica': 'América Central',
    'americas.southAmerica': 'América del Sur',
    'americas.caribbean': 'Caribe',
    'americas.partners': 'Socios Globales Principales'
  },
  fr: {
    // Navigation
    'nav.overview': 'Aperçu',
    'nav.costAnalysis': 'Analyse des Coûts',
    'nav.routeAnalysis': 'Analyse des Routes',
    'nav.tariffAnalysis': 'Analyse Tarifaire',
    'nav.regulations': 'Réglementations',
    'nav.markets': 'Marchés',
    'nav.aiGuidance': 'Conseils IA',
    'nav.pricing': 'Tarification',
    
    // Common UI elements
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.results': 'Résultats',
    'common.noResults': 'Aucun résultat trouvé',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.submit': 'Soumettre',
    
    // Dashboard
    'dashboard.title': 'Aperçu du Tableau de Bord',
    'dashboard.recentAnalyses': 'Analyses Récentes',
    'dashboard.analyticsSummary': 'Résumé Analytique',
    'dashboard.complianceOverview': 'Aperçu de la Conformité',
    'dashboard.opportunities': 'Opportunités',
    
    // Cost Analysis
    'costAnalysis.title': 'Analyse des Coûts',
    'costAnalysis.productInfo': 'Informations sur le Produit',
    'costAnalysis.category': 'Catégorie de Produit',
    'costAnalysis.name': 'Nom du Produit',
    'costAnalysis.description': 'Description du Produit',
    'costAnalysis.hsCode': 'Code SH',
    'costAnalysis.calculate': 'Calculer',
    
    // Pricing
    'pricing.title': 'Plans Tarifaires',
    'pricing.subtitle': 'Trouvez le forfait parfait pour vos besoins de navigation commerciale',
    'pricing.free': 'Gratuit',
    'pricing.professional': 'Professionnel',
    'pricing.business': 'Entreprise',
    'pricing.enterprise': 'Grand Compte',
    'pricing.monthly': '/mois',
    'pricing.annually': '/an',
    'pricing.getStarted': 'Commencer',
    'pricing.contactSales': 'Contacter les Ventes',
    'pricing.currentPlan': 'Forfait Actuel',
    
    // Americas Focus
    'americas.title': 'Focus sur le Commerce des Amériques',
    'americas.subtitle': 'Outils spécialisés pour le commerce en Amérique du Nord, Centrale et du Sud',
    'americas.northAmerica': 'Amérique du Nord',
    'americas.centralAmerica': 'Amérique Centrale',
    'americas.southAmerica': 'Amérique du Sud',
    'americas.caribbean': 'Caraïbes',
    'americas.partners': 'Partenaires Mondiaux Majeurs'
  }
};

// Language Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved language preference from localStorage, default to 'en'
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as LanguageCode;
      return savedLanguage && ['en', 'es', 'fr'].includes(savedLanguage) ? savedLanguage : 'en';
    }
    return 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Function to set language
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language selector component
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-sm p-1 rounded hover:bg-muted">
        <LucideGlobe size={16} className="mr-1" />
        <span>{languageOptions.find(l => l.code === language)?.flag} {language.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-card rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => setLanguage(option.code as LanguageCode)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === option.code ? 'bg-muted font-medium' : 'hover:bg-muted'
              }`}
            >
              <span className="flex items-center">
                <span className="mr-2">{option.flag}</span>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageProvider;
