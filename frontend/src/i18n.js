import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav_products": "Products",
      "nav_company": "Company",
      "nav_pricing": "Pricing",
      "nav_get_started": "Get started",
      "hero_title_1": "Unlock growth",
      "hero_title_2": "with every payment",
      "hero_subtitle": "Run payments, extend net terms and automate collections compliance."
    }
  },
  es: {
    translation: {
      "nav_products": "Productos",
      "nav_company": "Compañía",
      "nav_pricing": "Precios",
      "nav_get_started": "Empezar",
      "hero_title_1": "Desbloquea el crecimiento",
      "hero_title_2": "con cada pago",
      "hero_subtitle": "Realiza pagos, extiende plazos netos y automatiza el cumplimiento de cobros."
    }
  },
  fr: {
    translation: {
      "nav_products": "Produits",
      "nav_company": "Entreprise",
      "nav_pricing": "Tarification",
      "nav_get_started": "Commencer",
      "hero_title_1": "Débloquez la croissance",
      "hero_title_2": "avec chaque paiement",
      "hero_subtitle": "Effectuez des paiements, prolongez les délais nets et automatisez la conformité des recouvrements."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
