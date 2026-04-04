"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Language context type
interface LanguageContextType {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About", 
      services: "Services",
      projects: "Projects",
      contact: "Contact"
    },
    home: {
      title: "Freude Dev | Efficient Services at your disposal",
      hero: {
        title: "FreudeDev",
        subtitle: "Efficient Services at your disposal"
      },
      testimonials: {
        title: "— What clients say",
        stats: {
          clients: "Clients Served",
          projects: "Projects Completed",
          experience: "Years of Experience", 
          satisfaction: "Client Satisfaction"
        }
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about our services"
      }
    },
    about: {
      title: "About Us",
      subtitle: "Who we are",
      description: "FreudeDev is a digital services company specialising in IT Maintenance, Web Design, and Network Administration — delivering efficient, reliable solutions tailored to each client's needs.",
      mission: "Founded with a mission to make professional tech services accessible, we work with startups, SMEs, and institutions to build, maintain, and secure their digital infrastructure.",
      cta: {
        title: "Three services.<br />One reliable team.",
        description: "From diagnosing hardware faults to deploying secure networks and building beautiful websites — FreudeDev covers your full digital needs.",
        button: "Explore our services"
      },
      stats: {
        clients: "Clients",
        projects: "Projects",
        years: "Years", 
        satisfaction: "Satisfaction"
      }
    },
    services: {
      title: "Services",
      subtitle: "Our Digital Solutions"
    },
    projects: {
      title: "Projects", 
      subtitle: "Our Work"
    },
    footer: {
      description: "Efficient digital services, IT solutions, and web development for your business growth.",
      services: "Services",
      company: "Company",
      legal: "Legal",
      quick_links: "Quick Links",
      copyright: "© 2026 FreudeDev. All rights reserved."
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      services: "Services", 
      projects: "Projets",
      contact: "Contact"
    },
    home: {
      title: "Freude Dev | Services efficaces à votre disposition",
      hero: {
        title: "FreudeDev",
        subtitle: "Services efficaces à votre disposition"
      },
      testimonials: {
        title: "— Ce que disent les clients",
        stats: {
          clients: "Clients servis",
          projects: "Projets complétés",
          experience: "Années d'expérience",
          satisfaction: "Satisfaction client"
        }
      },
      faq: {
        title: "Questions Fréquentes",
        subtitle: "Tout ce que vous devez savoir sur nos services"
      }
    },
    about: {
      title: "À propos",
      subtitle: "Qui nous sommes",
      description: "FreudeDev est une entreprise de services numériques spécialisée dans la maintenance informatique, la conception web et l'administration réseau — offrant des solutions efficaces et fiables adaptées aux besoins de chaque client.",
      mission: "Fondée avec pour mission de rendre les services tech professionnels accessibles, nous travaillons avec des startups, des PME et des institutions pour construire, maintenir et sécuriser leur infrastructure numérique.",
      cta: {
        title: "Trois services.<br />Une équipe fiable.",
        description: "Du diagnostic des pannes matérielles au déploiement de réseaux sécurisés et à la création de beaux sites web — FreudeDev couvre tous vos besoins numériques.",
        button: "Explorer nos services"
      },
      stats: {
        clients: "Clients",
        projects: "Projets",
        years: "Années",
        satisfaction: "Satisfaction"
      }
    },
    services: {
      title: "Services",
      subtitle: "Nos solutions numériques"
    },
    projects: {
      title: "Projets",
      subtitle: "Nos réalisations"
    },
    footer: {
      description: "Services numériques efficaces, solutions informatiques et développement web pour la croissance de votre entreprise.",
      services: "Services",
      company: "Entreprise",
      legal: "Légal", 
      quick_links: "Liens rapides",
      copyright: "© 2026 FreudeDev. Tous droits réservés."
    }
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
