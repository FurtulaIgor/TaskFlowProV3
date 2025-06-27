import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definišemo tipove za jezike
export type Language = 'sr' | 'en' | 'fr';

// Definišemo interfejs za prevode
interface Translations {
  // Navigacija
  nav: {
    dashboard: string;
    appointments: string;
    clients: string;
    invoices: string;
    messages: string;
    settings: string;
    admin: string;
  };
  
  // Autentifikacija
  auth: {
    welcomeBack: string;
    signInToAccount: string;
    emailAddress: string;
    enterPassword: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    signingIn: string;
    dontHaveAccount: string;
    signUp: string;
    backToHome: string;
    agreeToTerms: string;
    termsOfService: string;
    privacyPolicy: string;
    loginSuccess: string;
    invalidCredentials: string;
    loginError: string;
  };
  
  // Opšti termini
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    logout: string;
    password: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    notes: string;
    status: string;
    date: string;
    time: string;
    amount: string;
    total: string;
    actions: string;
    yes: string;
    no: string;
    close: string;
    submit: string;
    required: string;
    optional: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    businessOverview: string;
    refreshData: string;
    todaysAppointments: string;
    totalClients: string;
    todaysRevenue: string;
    pendingInvoices: string;
    noAppointmentsToday: string;
    appointmentToday: string;
    appointmentsToday: string;
    noRegisteredClients: string;
    registeredClient: string;
    registeredClients: string;
    noRevenueToday: string;
    fromPaidInvoices: string;
    allInvoicesPaid: string;
    invoicePending: string;
    invoicesPending: string;
    viewAppointments: string;
    manageClients: string;
    viewInvoices: string;
    revenueChart: string;
    appointmentsChart: string;
    dailyRevenueOverview: string;
    appointmentsByDay: string;
    quickActions: string;
    mostUsedFeatures: string;
    newAppointment: string;
    addClient: string;
    newInvoice: string;
    addService: string;
  };
}

// Prevodi za srpski jezik
const translations_sr: Translations = {
  nav: {
    dashboard: 'Dashboard',
    appointments: 'Termini',
    clients: 'Klijenti',
    invoices: 'Fakture',
    messages: 'Poruke',
    settings: 'Podešavanja',
    admin: 'Admin',
  },
  auth: {
    welcomeBack: 'Dobrodošli nazad',
    signInToAccount: 'Prijavite se na svoj TaskFlowPro nalog',
    emailAddress: 'Email adresa',
    enterPassword: 'Unesite vašu lozinku',
    rememberMe: 'Zapamti me',
    forgotPassword: 'Zaboravili ste lozinku?',
    signIn: 'Prijavite se',
    signingIn: 'Prijavljivanje...',
    dontHaveAccount: 'Nemate nalog?',
    signUp: 'Registrujte se besplatno',
    backToHome: 'Nazad na početnu',
    agreeToTerms: 'Prijavom se slažete sa našim',
    termsOfService: 'Uslovima korišćenja',
    privacyPolicy: 'Politikom privatnosti',
    loginSuccess: 'Uspešno ste se prijavili',
    invalidCredentials: 'Neispravni podaci za prijavu',
    loginError: 'Došlo je do greške prilikom prijave',
  },
  common: {
    loading: 'Učitavanje...',
    save: 'Sačuvaj',
    cancel: 'Otkaži',
    delete: 'Obriši',
    edit: 'Uredi',
    add: 'Dodaj',
    search: 'Pretraži',
    filter: 'Filter',
    logout: 'Odjavi se',
    password: 'Lozinka',
    email: 'Email',
    name: 'Ime',
    phone: 'Telefon',
    address: 'Adresa',
    notes: 'Napomene',
    status: 'Status',
    date: 'Datum',
    time: 'Vreme',
    amount: 'Iznos',
    total: 'Ukupno',
    actions: 'Akcije',
    yes: 'Da',
    no: 'Ne',
    close: 'Zatvori',
    submit: 'Potvrdi',
    required: 'Obavezno',
    optional: 'Opciono',
  },
  dashboard: {
    title: 'Dashboard',
    businessOverview: 'Pregled poslovanja za',
    refreshData: 'Osveži podatke',
    todaysAppointments: 'Današnji termini',
    totalClients: 'Ukupno klijenata',
    todaysRevenue: 'Današnji prihod',
    pendingInvoices: 'Fakture na čekanju',
    noAppointmentsToday: 'Nema zakazanih termina',
    appointmentToday: 'termin danas',
    appointmentsToday: 'termina danas',
    noRegisteredClients: 'Nema registrovanih klijenata',
    registeredClient: 'registrovan klijent',
    registeredClients: 'registrovanih klijenata',
    noRevenueToday: 'Nema prihoda danas',
    fromPaidInvoices: 'od plaćenih faktura',
    allInvoicesPaid: 'Sve fakture su plaćene',
    invoicePending: 'faktura čeka plaćanje',
    invoicesPending: 'faktura čeka plaćanje',
    viewAppointments: 'Pogledaj termine',
    manageClients: 'Upravljaj klijentima',
    viewInvoices: 'Pogledaj fakture',
    revenueChart: 'Prihod (poslednjih 7 dana)',
    appointmentsChart: 'Termini (poslednjih 7 dana)',
    dailyRevenueOverview: 'Pregled dnevnog prihoda od plaćenih faktura',
    appointmentsByDay: 'Broj zakazanih termina po danima',
    quickActions: 'Brze akcije',
    mostUsedFeatures: 'Najčešće korišćene funkcije',
    newAppointment: 'Novi termin',
    addClient: 'Dodaj klijenta',
    newInvoice: 'Nova faktura',
    addService: 'Dodaj uslugu',
  },
};

// Prevodi za engleski jezik
const translations_en: Translations = {
  nav: {
    dashboard: 'Dashboard',
    appointments: 'Appointments',
    clients: 'Clients',
    invoices: 'Invoices',
    messages: 'Messages',
    settings: 'Settings',
    admin: 'Admin',
  },
  auth: {
    welcomeBack: 'Welcome back',
    signInToAccount: 'Sign in to your TaskFlowPro account',
    emailAddress: 'Email address',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up for free',
    backToHome: 'Back to home',
    agreeToTerms: 'By signing in you agree to our',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    loginSuccess: 'Successfully signed in',
    invalidCredentials: 'Invalid login credentials',
    loginError: 'An error occurred during login',
  },
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    logout: 'Sign out',
    password: 'Password',
    email: 'Email',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    notes: 'Notes',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    amount: 'Amount',
    total: 'Total',
    actions: 'Actions',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    submit: 'Submit',
    required: 'Required',
    optional: 'Optional',
  },
  dashboard: {
    title: 'Dashboard',
    businessOverview: 'Business overview for',
    refreshData: 'Refresh data',
    todaysAppointments: "Today's appointments",
    totalClients: 'Total clients',
    todaysRevenue: "Today's revenue",
    pendingInvoices: 'Pending invoices',
    noAppointmentsToday: 'No appointments scheduled for today',
    appointmentToday: 'appointment today',
    appointmentsToday: 'appointments today',
    noRegisteredClients: 'No registered clients',
    registeredClient: 'registered client',
    registeredClients: 'registered clients',
    noRevenueToday: 'No revenue today',
    fromPaidInvoices: 'from paid invoices',
    allInvoicesPaid: 'All invoices are paid',
    invoicePending: 'invoice pending payment',
    invoicesPending: 'invoices pending payment',
    viewAppointments: 'View appointments',
    manageClients: 'Manage clients',
    viewInvoices: 'View invoices',
    revenueChart: 'Revenue (last 7 days)',
    appointmentsChart: 'Appointments (last 7 days)',
    dailyRevenueOverview: 'Daily revenue overview from paid invoices',
    appointmentsByDay: 'Number of scheduled appointments by day',
    quickActions: 'Quick actions',
    mostUsedFeatures: 'Most used features',
    newAppointment: 'New appointment',
    addClient: 'Add client',
    newInvoice: 'New invoice',
    addService: 'Add service',
  },
};

// Prevodi za francuski jezik
const translations_fr: Translations = {
  nav: {
    dashboard: 'Tableau de bord',
    appointments: 'Rendez-vous',
    clients: 'Clients',
    invoices: 'Factures',
    messages: 'Messages',
    settings: 'Paramètres',
    admin: 'Admin',
  },
  auth: {
    welcomeBack: 'Bon retour',
    signInToAccount: 'Connectez-vous à votre compte TaskFlowPro',
    emailAddress: 'Adresse e-mail',
    enterPassword: 'Entrez votre mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    dontHaveAccount: "Vous n'avez pas de compte?",
    signUp: 'Inscrivez-vous gratuitement',
    backToHome: "Retour à l'accueil",
    agreeToTerms: 'En vous connectant, vous acceptez nos',
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: 'Politique de confidentialité',
    loginSuccess: 'Connexion réussie',
    invalidCredentials: 'Identifiants de connexion invalides',
    loginError: 'Une erreur est survenue lors de la connexion',
  },
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    logout: 'Se déconnecter',
    password: 'Mot de passe',
    email: 'E-mail',
    name: 'Nom',
    phone: 'Téléphone',
    address: 'Adresse',
    notes: 'Notes',
    status: 'Statut',
    date: 'Date',
    time: 'Heure',
    amount: 'Montant',
    total: 'Total',
    actions: 'Actions',
    yes: 'Oui',
    no: 'Non',
    close: 'Fermer',
    submit: 'Soumettre',
    required: 'Obligatoire',
    optional: 'Optionnel',
  },
  dashboard: {
    title: 'Tableau de bord',
    businessOverview: 'Aperçu des affaires pour',
    refreshData: 'Actualiser les données',
    todaysAppointments: "Rendez-vous d'aujourd'hui",
    totalClients: 'Total des clients',
    todaysRevenue: "Revenus d'aujourd'hui",
    pendingInvoices: 'Factures en attente',
    noAppointmentsToday: "Aucun rendez-vous programmé aujourd'hui",
    appointmentToday: "rendez-vous aujourd'hui",
    appointmentsToday: "rendez-vous aujourd'hui",
    noRegisteredClients: 'Aucun client enregistré',
    registeredClient: 'client enregistré',
    registeredClients: 'clients enregistrés',
    noRevenueToday: "Aucun revenu aujourd'hui",
    fromPaidInvoices: 'des factures payées',
    allInvoicesPaid: 'Toutes les factures sont payées',
    invoicePending: 'facture en attente de paiement',
    invoicesPending: 'factures en attente de paiement',
    viewAppointments: 'Voir les rendez-vous',
    manageClients: 'Gérer les clients',
    viewInvoices: 'Voir les factures',
    revenueChart: 'Revenus (7 derniers jours)',
    appointmentsChart: 'Rendez-vous (7 derniers jours)',
    dailyRevenueOverview: 'Aperçu des revenus quotidiens des factures payées',
    appointmentsByDay: 'Nombre de rendez-vous programmés par jour',
    quickActions: 'Actions rapides',
    mostUsedFeatures: 'Fonctionnalités les plus utilisées',
    newAppointment: 'Nouveau rendez-vous',
    addClient: 'Ajouter un client',
    newInvoice: 'Nouvelle facture',
    addService: 'Ajouter un service',
  },
};

// Mapa svih prevoda
const allTranslations: Record<Language, Translations> = {
  sr: translations_sr,
  en: translations_en,
  fr: translations_fr,
};

// Context interfejs
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// Kreiraj context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook za korišćenje jezika
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider komponenta
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Pokušaj da učitaš jezik iz localStorage ili koristi srpski kao default
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskflowpro-language') as Language;
      if (saved && ['sr', 'en', 'fr'].includes(saved)) {
        return saved;
      }
      
      // Pokušaj da detektuješ jezik browsera
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('sr')) return 'sr';
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('fr')) return 'fr';
    }
    return 'sr'; // Default na srpski
  });

  // Funkcija za promenu jezika
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskflowpro-language', lang);
    }
  };

  // Dobij trenutne prevode
  const t = allTranslations[language];

  // Context vrednost
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};