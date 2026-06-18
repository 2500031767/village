// translations.js — English, Telugu, Hindi for the entire app
const t = {
  en: {
    // ── Nav ──
    nav: {
      home: 'Home',
      about: 'About Village',
      census: 'Census Dashboard',
      agriculture: 'Agriculture',
      education: 'Education',
      healthcare: 'Healthcare',
      infrastructure: 'Infrastructure',
      schemes: 'Govt. Schemes',
      issues: 'Village Issues',
      notifications: 'Notifications',
      businesses: 'Business Directory',
      gallery: 'Gallery',
      nri: 'NRI & Migrants',
      services: 'Digital Services',
      insights: 'AI Insights',
      survey: 'Survey & Credits',
      contact: 'Contact',
      admin: 'Admin Workspace',
      adminLogin: 'Admin Login',
    },
    // ── Common ──
    common: {
      loading: 'Loading...',
      noData: 'No data available.',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      addNew: 'Add New',
      search: 'Search',
      viewAll: 'View All',
      poweredBy: 'Powered by',
      learnMore: 'Learn More',
      openMaps: 'Open in Google Maps',
      mapView: 'Map View',
      streetView: 'Street View — Village Ground Level',
    },
  },

  te: {
    // ── Nav ──
    nav: {
      home: 'హోమ్',
      about: 'గ్రామం గురించి',
      census: 'జనాభా డాష్‌బోర్డ్',
      agriculture: 'వ్యవసాయం',
      education: 'విద్య',
      healthcare: 'ఆరోగ్య సంరక్షణ',
      infrastructure: 'మౌలిక సదుపాయాలు',
      schemes: 'ప్రభుత్వ పథకాలు',
      issues: 'గ్రామ సమస్యలు',
      notifications: 'నోటిఫికేషన్లు',
      businesses: 'వ్యాపార డైరెక్టరీ',
      gallery: 'గ్యాలరీ',
      nri: 'ఎన్ఆర్ఐ & వలసదారులు',
      services: 'డిజిటల్ సేవలు',
      insights: 'AI అంతర్దృష్టులు',
      survey: 'సర్వే & క్రెడిట్స్',
      contact: 'సంప్రదింపు',
      admin: 'అడ్మిన్ వర్క్‌స్పేస్',
      adminLogin: 'అడ్మిన్ లాగిన్',
    },
    // ── Common ──
    common: {
      loading: 'లోడవుతోంది...',
      noData: 'డేటా అందుబాటులో లేదు.',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      addNew: 'కొత్తది జోడించు',
      search: 'వెతకండి',
      viewAll: 'అన్నీ చూడండి',
      poweredBy: 'ద్వారా అందించబడింది',
      learnMore: 'మరింత తెలుసుకోండి',
      openMaps: 'Google Maps లో తెరువు',
      mapView: 'మ్యాప్ వీక్షణ',
      streetView: 'స్ట్రీట్ వ్యూ — గ్రామ స్థాయి',
    },
  },

  hi: {
    // ── Nav ──
    nav: {
      home: 'होम',
      about: 'गाँव के बारे में',
      census: 'जनगणना डैशबोर्ड',
      agriculture: 'कृषि',
      education: 'शिक्षा',
      healthcare: 'स्वास्थ्य सेवा',
      infrastructure: 'बुनियादी ढाँचा',
      schemes: 'सरकारी योजनाएँ',
      issues: 'ग्राम समस्याएँ',
      notifications: 'सूचनाएँ',
      businesses: 'व्यापार निर्देशिका',
      gallery: 'गैलरी',
      nri: 'एनआरआई और प्रवासी',
      services: 'डिजिटल सेवाएँ',
      insights: 'AI अंतर्दृष्टि',
      survey: 'सर्वेक्षण और क्रेडिट',
      contact: 'संपर्क',
      admin: 'व्यवस्थापक कार्यक्षेत्र',
      adminLogin: 'व्यवस्थापक लॉगिन',
    },
    // ── Common ──
    common: {
      loading: 'लोड हो रहा है...',
      noData: 'डेटा उपलब्ध नहीं है।',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएँ',
      addNew: 'नया जोड़ें',
      search: 'खोजें',
      viewAll: 'सब देखें',
      poweredBy: 'द्वारा संचालित',
      learnMore: 'और जानें',
      openMaps: 'Google Maps में खोलें',
      mapView: 'मानचित्र दृश्य',
      streetView: 'स्ट्रीट व्यू — ग्राम स्तर',
    },
  },
};

export default t;

// Helper: get a translation value
export function tr(lang, path) {
  const keys = path.split('.');
  let val = t[lang] || t['en'];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) break;
  }
  // Fallback to English
  if (val === undefined) {
    val = t['en'];
    for (const k of keys) { val = val?.[k]; if (val === undefined) break; }
  }
  return val ?? path;
}
