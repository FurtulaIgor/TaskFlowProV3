import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    features: string;
    testimonials: string;
    pricing: string;
    login: string;
    getStarted: string;
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
    or: string;
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

  // Landing page
  landing: {
    hero: {
      badge: string;
      title: string;
      titleHighlight: string;
      titleSuffix: string;
      subtitle: string;
      getStarted: string;
      viewDemo: string;
      freeTrialNote: string;
    };
    stats: {
      satisfiedUsers: string;
      scheduledAppointments: string;
      uptime: string;
      support: string;
    };
    features: {
      title: string;
      subtitle: string;
      appointmentManagement: {
        title: string;
        description: string;
      };
      clientDatabase: {
        title: string;
        description: string;
      };
      autoInvoicing: {
        title: string;
        description: string;
      };
      analytics: {
        title: string;
        description: string;
      };
      aiAssistant: {
        title: string;
        description: string;
      };
      dataSecurity: {
        title: string;
        description: string;
      };
    };
    benefits: {
      title: string;
      saveTime: {
        title: string;
        description: string;
      };
      increaseRevenue: {
        title: string;
        description: string;
      };
      workAnywhere: {
        title: string;
        description: string;
      };
      localized: {
        title: string;
        description: string;
      };
      resultsTitle: string;
      timeSaved: string;
      revenueIncrease: string;
      customerSatisfaction: string;
      errorReduction: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
      testimonial1: {
        name: string;
        role: string;
        content: string;
      };
      testimonial2: {
        name: string;
        role: string;
        content: string;
      };
      testimonial3: {
        name: string;
        role: string;
        content: string;
      };
    };
    pricing: {
      title: string;
      subtitle: string;
      starter: {
        title: string;
        price: string;
        period: string;
        feature1: string;
        feature2: string;
        feature3: string;
        button: string;
      };
      professional: {
        title: string;
        badge: string;
        price: string;
        period: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        button: string;
      };
      enterprise: {
        title: string;
        price: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        button: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      getStarted: string;
      viewDemo: string;
      note: string;
    };
    footer: {
      description: string;
      product: string;
      features: string;
      pricing: string;
      integrations: string;
      api: string;
      support: string;
      help: string;
      documentation: string;
      contact: string;
      status: string;
      company: string;
      about: string;
      blog: string;
      careers: string;
      privacy: string;
      copyright: string;
    };
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
    features: 'Funkcionalnosti',
    testimonials: 'Recenzije',
    pricing: 'Cene',
    login: 'Prijava',
    getStarted: 'Počni besplatno',
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
    or: 'ili',
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
  landing: {
    hero: {
      badge: 'Automatizuj svoj biznis danas',
      title: 'Upravljaj svojim',
      titleHighlight: 'poslovanjem',
      titleSuffix: 'kao profesionalac',
      subtitle: 'TaskFlowPro je kompletno rešenje za male biznise. Automatizuj termine, fakturisanje, komunikaciju sa klijentima i fokusiraj se na ono što najbolje radiš.',
      getStarted: 'Počni besplatno',
      viewDemo: 'Pogledaj demo',
      freeTrialNote: 'Besplatno 30 dana • Bez obaveze • Otkaži bilo kada',
    },
    stats: {
      satisfiedUsers: 'Zadovoljnih korisnika',
      scheduledAppointments: 'Zakazanih termina',
      uptime: 'Uptime',
      support: 'Podrška',
    },
    features: {
      title: 'Sve što trebaš za uspešan biznis',
      subtitle: 'TaskFlowPro kombinuje sve potrebne alate u jednoj platformi, omogućavajući ti da se fokusiraš na rast svog biznisa.',
      appointmentManagement: {
        title: 'Upravljanje terminima',
        description: 'Lako zakazivanje i organizovanje termina sa klijentima. Automatski podsetnici i notifikacije.',
      },
      clientDatabase: {
        title: 'Baza klijenata',
        description: 'Centralizovana baza podataka o klijentima sa istorijom interakcija i preferencijama.',
      },
      autoInvoicing: {
        title: 'Automatsko fakturisanje',
        description: 'Kreiranje i slanje faktura u PDF formatu. Praćenje plaćanja i dospeća.',
      },
      analytics: {
        title: 'Analitika i izveštaji',
        description: 'Detaljni uvidi u poslovanje, prihode i performanse kroz intuitivne grafikone.',
      },
      aiAssistant: {
        title: 'AI asistent',
        description: 'Pametan asistent za komunikaciju sa klijentima i automatizaciju rutinskih zadataka.',
      },
      dataSecurity: {
        title: 'Bezbednost podataka',
        description: 'Najviši standardi bezbednosti i zaštite privatnosti vaših poslovnih podataka.',
      },
    },
    benefits: {
      title: 'Zašto TaskFlowPro?',
      saveTime: {
        title: 'Uštedi vreme',
        description: 'Automatizuj rutinske zadatke i fokusiraj se na ono što je važno - tvoje klijente.',
      },
      increaseRevenue: {
        title: 'Povećaj prihode',
        description: 'Bolje organizovanje termina i automatsko fakturisanje znače više zarade.',
      },
      workAnywhere: {
        title: 'Radi svugde',
        description: 'Pristupaj svom poslovanju sa bilo kog uređaja, bilo gde, bilo kada.',
      },
      localized: {
        title: 'Lokalizovano',
        description: 'Prilagođeno srpskom tržištu sa podrškom za lokalne standarde i propise.',
      },
      resultsTitle: 'Rezultati koji govore',
      timeSaved: 'Ušteda vremena',
      revenueIncrease: 'Povećanje prihoda',
      customerSatisfaction: 'Zadovoljstvo klijenata',
      errorReduction: 'Smanjenje grešaka',
    },
    testimonials: {
      title: 'Šta kažu naši korisnici',
      subtitle: 'Pridruži se stotinama zadovoljnih preduzetnika',
      testimonial1: {
        name: 'Marija Petrović',
        role: 'Vlasnica salona lepote',
        content: 'TaskFlowPro je potpuno promenio način na koji vodim svoj salon. Sada imam više vremena za klijente, a manje za administraciju.',
      },
      testimonial2: {
        name: 'Stefan Nikolić',
        role: 'Fizioterapeut',
        content: 'Neverovatno je koliko mi je ovaj sistem olakšao posao. Termini, fakture, sve je automatizovano i profesionalno.',
      },
      testimonial3: {
        name: 'Ana Jovanović',
        role: 'Konsultant',
        content: 'Konačno imam potpunu kontrolu nad svojim poslovanjem. Preporučujem svim malim preduzetnicima!',
      },
    },
    pricing: {
      title: 'Jednostavne cene',
      subtitle: 'Bez skrivenih troškova. Otkaži bilo kada.',
      starter: {
        title: 'Starter',
        price: 'Besplatno',
        period: '30 dana',
        feature1: 'Do 50 termina mesečno',
        feature2: 'Osnovno fakturisanje',
        feature3: 'Email podrška',
        button: 'Počni besplatno',
      },
      professional: {
        title: 'Professional',
        badge: 'Najpopularniji',
        price: '2.990 RSD',
        period: '/ mesečno',
        feature1: 'Neograničeni termini',
        feature2: 'Napredna analitika',
        feature3: 'AI asistent',
        feature4: 'Prioritetna podrška',
        button: 'Izaberi plan',
      },
      enterprise: {
        title: 'Enterprise',
        price: 'Kontakt',
        feature1: 'Sve Professional funkcije',
        feature2: 'Prilagođena integracija',
        feature3: 'Dedicirani account manager',
        feature4: '24/7 podrška',
        button: 'Kontaktiraj nas',
      },
    },
    cta: {
      title: 'Spreman si da automatizuješ svoj biznis?',
      subtitle: 'Pridruži se stotinama uspešnih preduzetnika koji već koriste TaskFlowPro',
      getStarted: 'Počni besplatno danas',
      viewDemo: 'Pogledaj demo',
      note: 'Besplatno 30 dana • Bez kreditne kartice • Otkaži bilo kada',
    },
    footer: {
      description: 'Automatizuj svoj biznis i fokusiraj se na ono što voliš da radiš.',
      product: 'Proizvod',
      features: 'Funkcionalnosti',
      pricing: 'Cene',
      integrations: 'Integracije',
      api: 'API',
      support: 'Podrška',
      help: 'Pomoć',
      documentation: 'Dokumentacija',
      contact: 'Kontakt',
      status: 'Status',
      company: 'Kompanija',
      about: 'O nama',
      blog: 'Blog',
      careers: 'Karijera',
      privacy: 'Privatnost',
      copyright: 'Sva prava zadržana.',
    },
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
    features: 'Features',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    login: 'Login',
    getStarted: 'Get Started',
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
    or: 'or',
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
  landing: {
    hero: {
      badge: 'Automate your business today',
      title: 'Manage your',
      titleHighlight: 'business',
      titleSuffix: 'like a professional',
      subtitle: 'TaskFlowPro is a complete solution for small businesses. Automate appointments, invoicing, client communication and focus on what you do best.',
      getStarted: 'Get started free',
      viewDemo: 'View demo',
      freeTrialNote: 'Free 30 days • No commitment • Cancel anytime',
    },
    stats: {
      satisfiedUsers: 'Satisfied users',
      scheduledAppointments: 'Scheduled appointments',
      uptime: 'Uptime',
      support: 'Support',
    },
    features: {
      title: 'Everything you need for a successful business',
      subtitle: 'TaskFlowPro combines all necessary tools in one platform, allowing you to focus on growing your business.',
      appointmentManagement: {
        title: 'Appointment management',
        description: 'Easy scheduling and organizing appointments with clients. Automatic reminders and notifications.',
      },
      clientDatabase: {
        title: 'Client database',
        description: 'Centralized client database with interaction history and preferences.',
      },
      autoInvoicing: {
        title: 'Automatic invoicing',
        description: 'Create and send invoices in PDF format. Track payments and due dates.',
      },
      analytics: {
        title: 'Analytics and reports',
        description: 'Detailed business insights, revenue and performance through intuitive charts.',
      },
      aiAssistant: {
        title: 'AI assistant',
        description: 'Smart assistant for client communication and automation of routine tasks.',
      },
      dataSecurity: {
        title: 'Data security',
        description: 'Highest security standards and privacy protection for your business data.',
      },
    },
    benefits: {
      title: 'Why TaskFlowPro?',
      saveTime: {
        title: 'Save time',
        description: 'Automate routine tasks and focus on what matters - your clients.',
      },
      increaseRevenue: {
        title: 'Increase revenue',
        description: 'Better appointment organization and automatic invoicing mean more earnings.',
      },
      workAnywhere: {
        title: 'Work anywhere',
        description: 'Access your business from any device, anywhere, anytime.',
      },
      localized: {
        title: 'Localized',
        description: 'Adapted to local markets with support for local standards and regulations.',
      },
      resultsTitle: 'Results that speak',
      timeSaved: 'Time saved',
      revenueIncrease: 'Revenue increase',
      customerSatisfaction: 'Customer satisfaction',
      errorReduction: 'Error reduction',
    },
    testimonials: {
      title: 'What our users say',
      subtitle: 'Join hundreds of satisfied entrepreneurs',
      testimonial1: {
        name: 'Maria Peterson',
        role: 'Beauty salon owner',
        content: 'TaskFlowPro completely changed how I run my salon. Now I have more time for clients and less for administration.',
      },
      testimonial2: {
        name: 'Steven Nicholas',
        role: 'Physiotherapist',
        content: 'It\'s incredible how much this system has made my job easier. Appointments, invoices, everything is automated and professional.',
      },
      testimonial3: {
        name: 'Anna Johnson',
        role: 'Consultant',
        content: 'Finally I have complete control over my business. I recommend it to all small entrepreneurs!',
      },
    },
    pricing: {
      title: 'Simple pricing',
      subtitle: 'No hidden costs. Cancel anytime.',
      starter: {
        title: 'Starter',
        price: 'Free',
        period: '30 days',
        feature1: 'Up to 50 appointments monthly',
        feature2: 'Basic invoicing',
        feature3: 'Email support',
        button: 'Start free',
      },
      professional: {
        title: 'Professional',
        badge: 'Most popular',
        price: '$29',
        period: '/ month',
        feature1: 'Unlimited appointments',
        feature2: 'Advanced analytics',
        feature3: 'AI assistant',
        feature4: 'Priority support',
        button: 'Choose plan',
      },
      enterprise: {
        title: 'Enterprise',
        price: 'Contact',
        feature1: 'All Professional features',
        feature2: 'Custom integration',
        feature3: 'Dedicated account manager',
        feature4: '24/7 support',
        button: 'Contact us',
      },
    },
    cta: {
      title: 'Ready to automate your business?',
      subtitle: 'Join hundreds of successful entrepreneurs already using TaskFlowPro',
      getStarted: 'Get started free today',
      viewDemo: 'View demo',
      note: 'Free 30 days • No credit card • Cancel anytime',
    },
    footer: {
      description: 'Automate your business and focus on what you love to do.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      integrations: 'Integrations',
      api: 'API',
      support: 'Support',
      help: 'Help',
      documentation: 'Documentation',
      contact: 'Contact',
      status: 'Status',
      company: 'Company',
      about: 'About',
      blog: 'Blog',
      careers: 'Careers',
      privacy: 'Privacy',
      copyright: 'All rights reserved.',
    },
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
    features: 'Fonctionnalités',
    testimonials: 'Témoignages',
    pricing: 'Tarifs',
    login: 'Connexion',
    getStarted: 'Commencer',
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
    or: 'ou',
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
  landing: {
    hero: {
      badge: 'Automatisez votre entreprise aujourd\'hui',
      title: 'Gérez votre',
      titleHighlight: 'entreprise',
      titleSuffix: 'comme un professionnel',
      subtitle: 'TaskFlowPro est une solution complète pour les petites entreprises. Automatisez les rendez-vous, la facturation, la communication client et concentrez-vous sur ce que vous faites de mieux.',
      getStarted: 'Commencer gratuitement',
      viewDemo: 'Voir la démo',
      freeTrialNote: 'Gratuit 30 jours • Sans engagement • Annulez à tout moment',
    },
    stats: {
      satisfiedUsers: 'Utilisateurs satisfaits',
      scheduledAppointments: 'Rendez-vous programmés',
      uptime: 'Disponibilité',
      support: 'Support',
    },
    features: {
      title: 'Tout ce dont vous avez besoin pour une entreprise prospère',
      subtitle: 'TaskFlowPro combine tous les outils nécessaires en une seule plateforme, vous permettant de vous concentrer sur la croissance de votre entreprise.',
      appointmentManagement: {
        title: 'Gestion des rendez-vous',
        description: 'Planification et organisation faciles des rendez-vous avec les clients. Rappels automatiques et notifications.',
      },
      clientDatabase: {
        title: 'Base de données clients',
        description: 'Base de données clients centralisée avec historique des interactions et préférences.',
      },
      autoInvoicing: {
        title: 'Facturation automatique',
        description: 'Créez et envoyez des factures au format PDF. Suivez les paiements et les échéances.',
      },
      analytics: {
        title: 'Analyses et rapports',
        description: 'Aperçus détaillés de l\'entreprise, revenus et performances grâce à des graphiques intuitifs.',
      },
      aiAssistant: {
        title: 'Assistant IA',
        description: 'Assistant intelligent pour la communication client et l\'automatisation des tâches routinières.',
      },
      dataSecurity: {
        title: 'Sécurité des données',
        description: 'Normes de sécurité les plus élevées et protection de la confidentialité de vos données d\'entreprise.',
      },
    },
    benefits: {
      title: 'Pourquoi TaskFlowPro?',
      saveTime: {
        title: 'Économisez du temps',
        description: 'Automatisez les tâches routinières et concentrez-vous sur ce qui compte - vos clients.',
      },
      increaseRevenue: {
        title: 'Augmentez les revenus',
        description: 'Une meilleure organisation des rendez-vous et une facturation automatique signifient plus de gains.',
      },
      workAnywhere: {
        title: 'Travaillez partout',
        description: 'Accédez à votre entreprise depuis n\'importe quel appareil, n\'importe où, n\'importe quand.',
      },
      localized: {
        title: 'Localisé',
        description: 'Adapté aux marchés locaux avec support pour les normes et réglementations locales.',
      },
      resultsTitle: 'Résultats qui parlent',
      timeSaved: 'Temps économisé',
      revenueIncrease: 'Augmentation des revenus',
      customerSatisfaction: 'Satisfaction client',
      errorReduction: 'Réduction des erreurs',
    },
    testimonials: {
      title: 'Ce que disent nos utilisateurs',
      subtitle: 'Rejoignez des centaines d\'entrepreneurs satisfaits',
      testimonial1: {
        name: 'Marie Dubois',
        role: 'Propriétaire de salon de beauté',
        content: 'TaskFlowPro a complètement changé la façon dont je gère mon salon. Maintenant j\'ai plus de temps pour les clients et moins pour l\'administration.',
      },
      testimonial2: {
        name: 'Étienne Martin',
        role: 'Kinésithérapeute',
        content: 'C\'est incroyable à quel point ce système a facilité mon travail. Rendez-vous, factures, tout est automatisé et professionnel.',
      },
      testimonial3: {
        name: 'Anne Leroy',
        role: 'Consultante',
        content: 'Enfin j\'ai un contrôle complet sur mon entreprise. Je le recommande à tous les petits entrepreneurs!',
      },
    },
    pricing: {
      title: 'Tarification simple',
      subtitle: 'Pas de coûts cachés. Annulez à tout moment.',
      starter: {
        title: 'Starter',
        price: 'Gratuit',
        period: '30 jours',
        feature1: 'Jusqu\'à 50 rendez-vous par mois',
        feature2: 'Facturation de base',
        feature3: 'Support par e-mail',
        button: 'Commencer gratuitement',
      },
      professional: {
        title: 'Professionnel',
        badge: 'Le plus populaire',
        price: '29€',
        period: '/ mois',
        feature1: 'Rendez-vous illimités',
        feature2: 'Analyses avancées',
        feature3: 'Assistant IA',
        feature4: 'Support prioritaire',
        button: 'Choisir le plan',
      },
      enterprise: {
        title: 'Entreprise',
        price: 'Contact',
        feature1: 'Toutes les fonctionnalités Pro',
        feature2: 'Intégration personnalisée',
        feature3: 'Gestionnaire de compte dédié',
        feature4: 'Support 24/7',
        button: 'Nous contacter',
      },
    },
    cta: {
      title: 'Prêt à automatiser votre entreprise?',
      subtitle: 'Rejoignez des centaines d\'entrepreneurs prospères qui utilisent déjà TaskFlowPro',
      getStarted: 'Commencez gratuitement aujourd\'hui',
      viewDemo: 'Voir la démo',
      note: 'Gratuit 30 jours • Pas de carte de crédit • Annulez à tout moment',
    },
    footer: {
      description: 'Automatisez votre entreprise et concentrez-vous sur ce que vous aimez faire.',
      product: 'Produit',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      integrations: 'Intégrations',
      api: 'API',
      support: 'Support',
      help: 'Aide',
      documentation: 'Documentation',
      contact: 'Contact',
      status: 'Statut',
      company: 'Entreprise',
      about: 'À propos',
      blog: 'Blog',
      careers: 'Carrières',
      privacy: 'Confidentialité',
      copyright: 'Tous droits réservés.',
    },
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

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    children
  );
};