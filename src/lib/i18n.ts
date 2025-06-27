// Internationalization configuration and utilities
export type Language = 'sr' | 'en' | 'fr';

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    date: string;
    time: string;
    status: string;
    actions: string;
    settings: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    appointments: string;
    clients: string;
    invoices: string;
    messages: string;
    admin: string;
    settings: string;
  };

  // Authentication
  auth: {
    welcomeBack: string;
    signInToAccount: string;
    emailAddress: string;
    enterPassword: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    signUp: string;
    createAccount: string;
    joinPlatform: string;
    confirmPassword: string;
    agreeToTerms: string;
    termsOfService: string;
    privacyPolicy: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    backToHome: string;
    signingIn: string;
    creatingAccount: string;
    invalidCredentials: string;
    loginError: string;
    registrationError: string;
    passwordMismatch: string;
    passwordTooShort: string;
    registrationSuccess: string;
    loginSuccess: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    businessOverview: string;
    todaysAppointments: string;
    totalClients: string;
    todaysRevenue: string;
    pendingInvoices: string;
    viewAppointments: string;
    manageClients: string;
    viewInvoices: string;
    addService: string;
    refreshData: string;
    noAppointmentsToday: string;
    noRegisteredClients: string;
    noRevenueToday: string;
    allInvoicesPaid: string;
    appointmentToday: string;
    appointmentsToday: string;
    registeredClient: string;
    registeredClients: string;
    fromPaidInvoices: string;
    invoicesPending: string;
    invoicePending: string;
    revenueChart: string;
    appointmentsChart: string;
    dailyRevenueOverview: string;
    appointmentsByDay: string;
    quickActions: string;
    mostUsedFeatures: string;
    newAppointment: string;
    addClient: string;
    newInvoice: string;
  };

  // Appointments
  appointments: {
    title: string;
    appointmentManagement: string;
    newAppointment: string;
    editAppointment: string;
    createAppointment: string;
    client: string;
    service: string;
    appointmentDate: string;
    startTime: string;
    duration: string;
    durationMinutes: string;
    appointmentStatus: string;
    additionalNotes: string;
    selectClient: string;
    selectService: string;
    selectDate: string;
    enterTime: string;
    enterDuration: string;
    pending: string;
    confirmed: string;
    cancelled: string;
    noAppointments: string;
    deleteConfirm: string;
    appointmentDeleted: string;
    appointmentCreated: string;
    appointmentUpdated: string;
    deleteError: string;
    createError: string;
    updateError: string;
    minimumDuration: string;
    durationStep: string;
    statusDescription: {
      pending: string;
      confirmed: string;
      cancelled: string;
    };
    formHelp: {
      client: string;
      service: string;
      date: string;
      time: string;
      duration: string;
      status: string;
      notes: string;
    };
  };

  // Clients
  clients: {
    title: string;
    clientManagement: string;
    addClient: string;
    editClient: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    additionalNotes: string;
    lastContact: string;
    createdBy: string;
    creationDate: string;
    noClients: string;
    noClientsFound: string;
    searchClients: string;
    deleteConfirm: string;
    clientDeleted: string;
    clientAdded: string;
    clientUpdated: string;
    deleteError: string;
    addError: string;
    updateError: string;
    adminView: string;
    adminViewDescription: string;
    searchClientsUsers: string;
    formValidation: {
      nameRequired: string;
      nameMinLength: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
    };
    formHelp: {
      name: string;
      email: string;
      phone: string;
      notes: string;
    };
  };

  // Invoices
  invoices: {
    title: string;
    invoiceManagement: string;
    newInvoice: string;
    editInvoice: string;
    invoiceNumber: string;
    client: string;
    creationDate: string;
    dueDate: string;
    amount: string;
    status: string;
    linkedAppointment: string;
    generatePdf: string;
    downloadPdf: string;
    changeStatus: string;
    markAsPaid: string;
    markAsPending: string;
    allStatuses: string;
    pending: string;
    paid: string;
    cancelled: string;
    overdue: string;
    noInvoices: string;
    noInvoicesFound: string;
    searchInvoices: string;
    selectClientFirst: string;
    selectAppointment: string;
    enterAmount: string;
    selectDueDate: string;
    statusUpdated: string;
    pdfGenerated: string;
    pdfDownloaded: string;
    statusUpdateError: string;
    pdfError: string;
    invoiceCreated: string;
    createError: string;
    statusDescriptions: {
      pending: string;
      paid: string;
      cancelled: string;
      overdue: string;
    };
    formHelp: {
      client: string;
      appointment: string;
      amount: string;
      dueDate: string;
    };
  };

  // Messages
  messages: {
    title: string;
    aiAssistant: string;
    draftResponses: string;
    settings: string;
    client: string;
    selectClient: string;
    clearConversation: string;
    conversation: string;
    noMessages: string;
    startTyping: string;
    typeMessage: string;
    aiResponse: string;
    aiTips: string;
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
  };

  // Settings
  settings: {
    title: string;
    accountSettings: string;
    personalInfo: string;
    personalBusinessData: string;
    basicInfo: string;
    companyInfo: string;
    contactInfo: string;
    address: string;
    services: string;
    addService: string;
    editService: string;
    serviceName: string;
    serviceDescription: string;
    duration: string;
    price: string;
    yourServices: string;
    noServices: string;
    serviceAdded: string;
    serviceUpdated: string;
    serviceDeleted: string;
    serviceError: string;
    deleteServiceConfirm: string;
    notificationSettings: string;
    emailNotifications: string;
    newAppointmentNotifications: string;
    appointmentReminders: string;
    paymentNotifications: string;
    saveSettings: string;
    unsavedChanges: string;
    settingsSaved: string;
    fullName: string;
    companyName: string;
    businessType: string;
    individual: string;
    company: string;
    taxNumber: string;
    registrationNumber: string;
    bankAccount: string;
    phoneNumber: string;
    emailAddress: string;
    street: string;
    postalCode: string;
    country: string;
    formHelp: {
      fullName: string;
      email: string;
      businessType: string;
      companyName: string;
      taxNumber: string;
      registrationNumber: string;
      phone: string;
      bankAccount: string;
      address: string;
    };
    notificationHelp: {
      newAppointments: string;
      reminders: string;
      payments: string;
    };
  };

  // Admin
  admin: {
    title: string;
    administration: string;
    userManagement: string;
    adminActionsHistory: string;
    user: string;
    role: string;
    registrationDate: string;
    actions: string;
    manageRole: string;
    deleteUser: string;
    updateRole: string;
    roleUpdated: string;
    userDeleted: string;
    updateError: string;
    deleteError: string;
    noUsers: string;
    noActions: string;
    actionTypes: {
      updateRole: string;
      assignRole: string;
      deleteUser: string;
    };
    roles: {
      user: string;
      admin: string;
      pending: string;
    };
    roleDescriptions: {
      user: string;
      admin: string;
    };
    deleteWarning: string;
    deleteConfirmation: string;
    whatWillBeDeleted: string;
    deleteItems: {
      account: string;
      clients: string;
      services: string;
      appointments: string;
      invoices: string;
      roles: string;
    };
    deletionReason: string;
    enterReason: string;
    confirmDeletion: string;
  };

  // Landing Page
  landing: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      startFree: string;
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
      automaticInvoicing: {
        title: string;
        description: string;
      };
      analyticsReports: {
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
      timeSaving: string;
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
        features: string[];
        button: string;
      };
      professional: {
        title: string;
        price: string;
        period: string;
        popular: string;
        features: string[];
        button: string;
      };
      enterprise: {
        title: string;
        price: string;
        features: string[];
        button: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      startToday: string;
      viewDemo: string;
      freeTrialNote: string;
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

  // Error messages
  errors: {
    networkError: string;
    authError: string;
    permissionDenied: string;
    notFound: string;
    serverError: string;
    validationError: string;
    unexpectedError: string;
    tryAgain: string;
    contactSupport: string;
  };

  // Success messages
  success: {
    dataSaved: string;
    itemCreated: string;
    itemUpdated: string;
    itemDeleted: string;
    emailSent: string;
    passwordUpdated: string;
    settingsUpdated: string;
  };
}

// Serbian translations
export const translations: Record<Language, TranslationKeys> = {
  sr: {
    common: {
      loading: 'Učitavanje...',
      save: 'Sačuvaj',
      cancel: 'Otkaži',
      delete: 'Obriši',
      edit: 'Uredi',
      add: 'Dodaj',
      search: 'Pretraži',
      back: 'Nazad',
      next: 'Sledeće',
      previous: 'Prethodno',
      close: 'Zatvori',
      confirm: 'Potvrdi',
      yes: 'Da',
      no: 'Ne',
      success: 'Uspeh',
      error: 'Greška',
      warning: 'Upozorenje',
      info: 'Informacija',
      required: 'Obavezno',
      optional: 'Opciono',
      email: 'Email',
      password: 'Lozinka',
      name: 'Ime',
      phone: 'Telefon',
      address: 'Adresa',
      city: 'Grad',
      country: 'Zemlja',
      date: 'Datum',
      time: 'Vreme',
      status: 'Status',
      actions: 'Akcije',
      settings: 'Podešavanja',
      profile: 'Profil',
      logout: 'Odjavi se',
      login: 'Prijavi se',
      register: 'Registruj se',
    },
    nav: {
      dashboard: 'Dashboard',
      appointments: 'Termini',
      clients: 'Klijenti',
      invoices: 'Fakture',
      messages: 'Poruke',
      admin: 'Admin',
      settings: 'Podešavanja',
    },
    auth: {
      welcomeBack: 'Dobrodošli nazad',
      signInToAccount: 'Prijavite se na svoj TaskFlowPro nalog',
      emailAddress: 'Email adresa',
      enterPassword: 'Unesite vašu lozinku',
      rememberMe: 'Zapamti me',
      forgotPassword: 'Zaboravili ste lozinku?',
      signIn: 'Prijavite se',
      signUp: 'Registrujte se besplatno',
      createAccount: 'Kreirajte nalog',
      joinPlatform: 'Pridružite se TaskFlowPro platformi',
      confirmPassword: 'Potvrdite lozinku',
      agreeToTerms: 'Slažem se sa',
      termsOfService: 'Uslovima korišćenja',
      privacyPolicy: 'Politikom privatnosti',
      alreadyHaveAccount: 'Već imate nalog?',
      dontHaveAccount: 'Nemate nalog?',
      backToHome: 'Nazad na početnu',
      signingIn: 'Prijavljivanje...',
      creatingAccount: 'Kreiranje naloga...',
      invalidCredentials: 'Neispravni podaci za prijavu',
      loginError: 'Došlo je do greške prilikom prijave',
      registrationError: 'Došlo je do greške prilikom registracije',
      passwordMismatch: 'Lozinke se ne podudaraju',
      passwordTooShort: 'Lozinka mora imati najmanje 6 karaktera',
      registrationSuccess: 'Uspešno ste se registrovali',
      loginSuccess: 'Uspešno ste se prijavili',
    },
    dashboard: {
      title: 'Dashboard',
      businessOverview: 'Pregled poslovanja za',
      todaysAppointments: 'Današnji termini',
      totalClients: 'Ukupno klijenata',
      todaysRevenue: 'Današnji prihod',
      pendingInvoices: 'Fakture na čekanju',
      viewAppointments: 'Pogledaj termine',
      manageClients: 'Upravljaj klijentima',
      viewInvoices: 'Pogledaj fakture',
      addService: 'Dodaj uslugu',
      refreshData: 'Osveži podatke',
      noAppointmentsToday: 'Nema zakazanih termina',
      noRegisteredClients: 'Nema registrovanih klijenata',
      noRevenueToday: 'Nema prihoda danas',
      allInvoicesPaid: 'Sve fakture su plaćene',
      appointmentToday: 'termin danas',
      appointmentsToday: 'termina danas',
      registeredClient: 'registrovan klijent',
      registeredClients: 'registrovanih klijenata',
      fromPaidInvoices: 'od plaćenih faktura',
      invoicesPending: 'faktura čeka plaćanje',
      invoicePending: 'faktura čeka plaćanje',
      revenueChart: 'Prihod (poslednjih 7 dana)',
      appointmentsChart: 'Termini (poslednjih 7 dana)',
      dailyRevenueOverview: 'Pregled dnevnog prihoda od plaćenih faktura',
      appointmentsByDay: 'Broj zakazanih termina po danima',
      quickActions: 'Brze akcije',
      mostUsedFeatures: 'Najčešće korišćene funkcije',
      newAppointment: 'Novi termin',
      addClient: 'Dodaj klijenta',
      newInvoice: 'Nova faktura',
    },
    appointments: {
      title: 'Termini',
      appointmentManagement: 'Upravljanje terminima sa klijentima',
      newAppointment: 'Novi termin',
      editAppointment: 'Uredi termin',
      createAppointment: 'Kreiraj novi termin',
      client: 'Klijent',
      service: 'Usluga',
      appointmentDate: 'Datum termina',
      startTime: 'Vreme početka',
      duration: 'Trajanje (minuti)',
      durationMinutes: 'minuta',
      appointmentStatus: 'Status termina',
      additionalNotes: 'Dodatne napomene',
      selectClient: 'Izaberite klijenta za termin',
      selectService: 'Izaberite uslugu',
      selectDate: 'Odaberite datum kada će se termin održati',
      enterTime: 'Unesite vreme kada termin počinje',
      enterDuration: 'Unesite koliko minuta će termin trajati',
      pending: 'Na čekanju',
      confirmed: 'Potvrđen',
      cancelled: 'Otkazan',
      noAppointments: 'Još uvek nema dodanih termina',
      deleteConfirm: 'Da li ste sigurni da želite da obrišete ovaj termin?',
      appointmentDeleted: 'Termin je uspešno obrisan',
      appointmentCreated: 'Termin je uspešno kreiran',
      appointmentUpdated: 'Termin je uspešno ažuriran',
      deleteError: 'Greška prilikom brisanja termina',
      createError: 'Greška prilikom kreiranja termina',
      updateError: 'Greška prilikom ažuriranja termina',
      minimumDuration: 'minimum 15 minuta, korak od 15 minuta',
      durationStep: 'korak od 15 minuta',
      statusDescription: {
        pending: 'termin još nije potvrđen',
        confirmed: 'termin je potvrđen',
        cancelled: 'termin je otkazan',
      },
      formHelp: {
        client: 'Odaberite klijenta sa kojim želite da zakažete termin',
        service: 'Odaberite uslugu koju ćete pružiti klijentu tokom termina',
        date: 'Odaberite datum kada će se termin održati',
        time: 'Unesite vreme kada termin počinje',
        duration: 'Unesite koliko minuta će termin trajati (minimum 15 minuta, korak od 15 minuta)',
        status: 'Odaberite trenutni status termina',
        notes: 'Opcionalno - dodajte važne informacije o terminu, posebne zahteve ili napomene',
      },
    },
    clients: {
      title: 'Klijenti',
      clientManagement: 'Upravljanje informacijama o klijentima',
      addClient: 'Dodaj klijenta',
      editClient: 'Uredi podatke o klijentu',
      fullName: 'Ime i prezime',
      emailAddress: 'Email adresa',
      phoneNumber: 'Broj telefona',
      additionalNotes: 'Dodatne napomene',
      lastContact: 'Poslednji kontakt',
      createdBy: 'Uneo korisnik',
      creationDate: 'Datum unosa',
      noClients: 'Još uvek nema dodanih klijenata',
      noClientsFound: 'Nema klijenata koji odgovaraju pretrazi',
      searchClients: 'Pretražite klijente...',
      deleteConfirm: 'Da li ste sigurni da želite da obrišete ovog klijenta?',
      clientDeleted: 'Klijent je uspešno obrisan',
      clientAdded: 'Novi klijent je uspešno dodat',
      clientUpdated: 'Podaci o klijentu su uspešno ažurirani',
      deleteError: 'Greška prilikom brisanja klijenta',
      addError: 'Greška prilikom dodavanja novog klijenta',
      updateError: 'Greška prilikom ažuriranja podataka o klijentu',
      adminView: 'Admin pogled',
      adminViewDescription: 'Upravljanje svim klijentima u sistemu (admin pogled)',
      searchClientsUsers: 'Pretražite klijente ili korisnike...',
      formValidation: {
        nameRequired: 'Ime i prezime je obavezno',
        nameMinLength: 'Ime mora imati najmanje 2 karaktera',
        emailRequired: 'Email adresa je obavezna',
        emailInvalid: 'Unesite validnu email adresu',
        phoneRequired: 'Broj telefona je obavezan',
        phoneInvalid: 'Unesite validan broj telefona',
      },
      formHelp: {
        name: 'Unesite puno ime i prezime klijenta',
        email: 'Email adresa za komunikaciju i slanje faktura',
        phone: 'Kontakt telefon za hitne slučajeve i potvrde termina',
        notes: 'Opcionalno - dodajte važne informacije o klijentu',
      },
    },
    invoices: {
      title: 'Fakture',
      invoiceManagement: 'Upravljanje fakturama i naplatom',
      newInvoice: 'Nova faktura',
      editInvoice: 'Uredi fakturu',
      invoiceNumber: 'Broj fakture',
      client: 'Klijent',
      creationDate: 'Datum kreiranja',
      dueDate: 'Datum dospeća',
      amount: 'Iznos',
      status: 'Status',
      linkedAppointment: 'Povezani termin (opciono)',
      generatePdf: 'Prikaži PDF fakturu',
      downloadPdf: 'Preuzmi PDF',
      changeStatus: 'Promeni status',
      markAsPaid: 'Označi kao plaćeno',
      markAsPending: 'Vrati na čekanje',
      allStatuses: 'Svi statusi',
      pending: 'Na čekanju',
      paid: 'Plaćeno',
      cancelled: 'Otkazano',
      overdue: 'Neplaćeno',
      noInvoices: 'Još uvek nema kreiranih faktura',
      noInvoicesFound: 'Nema faktura koje odgovaraju pretrazi',
      searchInvoices: 'Pretražite fakture...',
      selectClientFirst: 'Prvo izaberite klijenta da biste videli dostupne termine',
      selectAppointment: 'Opcionalno - izaberite termin da se automatski popuni iznos',
      enterAmount: 'Unesite iznos fakture u dinarima',
      selectDueDate: 'Odaberite datum do kada faktura treba da bude plaćena',
      statusUpdated: 'Status fakture je promenjen',
      pdfGenerated: 'PDF faktura je uspešno generisana',
      pdfDownloaded: 'PDF faktura je preuzeta',
      statusUpdateError: 'Greška prilikom ažuriranja statusa fakture',
      pdfError: 'Greška prilikom generisanja PDF fakture',
      invoiceCreated: 'Faktura je uspešno kreirana',
      createError: 'Greška prilikom kreiranja fakture',
      statusDescriptions: {
        pending: 'Na čekanju - faktura čeka plaćanje',
        paid: 'Plaćeno - faktura je plaćena',
        cancelled: 'Otkazano - faktura je otkazana',
        overdue: 'Neplaćeno - faktura nije plaćena na vreme',
      },
      formHelp: {
        client: 'Odaberite klijenta kome želite da ispošaljete fakturu',
        appointment: 'Opcionalno - izaberite termin da se automatski popuni iznos na osnovu cene usluge',
        amount: 'Unesite iznos fakture u dinarima. Ako ste izabrali termin, iznos će se automatski popuniti.',
        dueDate: 'Odaberite datum do kada faktura treba da bude plaćena. Podrazumevano je postavljen na 7 dana od danas.',
      },
    },
    messages: {
      title: 'AI Asistent',
      aiAssistant: 'AI Asistent',
      draftResponses: 'Kreiranje odgovora uz pomoć AI asistenta',
      settings: 'Podešavanja',
      client: 'Klijent',
      selectClient: 'Izaberite klijenta',
      clearConversation: 'Obriši konverzaciju',
      conversation: 'Konverzacija',
      noMessages: 'Još nema poruka',
      startTyping: 'Počnite da kucate da biste kreirali poruku',
      typeMessage: 'Ukucajte vašu poruku...',
      aiResponse: 'AI Odgovor',
      aiTips: 'Saveti za AI Asistenta',
      tip1: 'Koristite AI za kreiranje odgovora na česta pitanja klijenata',
      tip2: 'Generirajte poruke za zakazivanje termina',
      tip3: 'Kreirajte poruke za praćenje propuštenih termina',
      tip4: 'Napravite podseća za plaćanje neplaćenih faktura',
    },
    settings: {
      title: 'Podešavanja',
      accountSettings: 'Upravljanje podešavanjima naloga i preferencijama',
      personalInfo: 'Lični i poslovni podaci',
      personalBusinessData: 'Lični i poslovni podaci',
      basicInfo: 'Osnovne informacije',
      companyInfo: 'Podaci o firmi / preduzetništvu',
      contactInfo: 'Kontakt informacije',
      address: 'Adresa',
      services: 'Usluge',
      addService: 'Dodaj novu uslugu',
      editService: 'Uredi uslugu',
      serviceName: 'Naziv usluge',
      serviceDescription: 'Opis usluge',
      duration: 'Trajanje (minuti)',
      price: 'Cena (RSD)',
      yourServices: 'Vaše usluge',
      noServices: 'Još uvek nema dodanih usluga',
      serviceAdded: 'Usluga je uspešno dodana',
      serviceUpdated: 'Usluga je uspešno ažurirana',
      serviceDeleted: 'Usluga je uspešno obrisana',
      serviceError: 'Greška prilikom čuvanja usluge',
      deleteServiceConfirm: 'Da li ste sigurni da želite da obrišete ovu uslugu?',
      notificationSettings: 'Podešavanja obaveštenja',
      emailNotifications: 'Email obaveštenja',
      newAppointmentNotifications: 'Obaveštenja o novim terminima',
      appointmentReminders: 'Podsetnici za termine',
      paymentNotifications: 'Obaveštenja o plaćanjima',
      saveSettings: 'Sačuvaj podešavanja',
      unsavedChanges: 'Imate nesačuvane promene',
      settingsSaved: 'Podešavanja su sačuvana',
      fullName: 'Ime i prezime',
      companyName: 'Naziv firme / preduzetništva',
      businessType: 'Tip poslovanja',
      individual: 'Preduzetnik / Fizičko lice',
      company: 'Pravno lice / Firma',
      taxNumber: 'PIB (Poreski identifikacioni broj)',
      registrationNumber: 'Matični broj',
      bankAccount: 'Broj računa',
      phoneNumber: 'Broj telefona',
      emailAddress: 'Email adresa',
      street: 'Ulica i broj',
      postalCode: 'Poštanski broj',
      country: 'Zemlja',
      formHelp: {
        fullName: 'Vaše puno ime kako će se pojavljivati na fakturama',
        email: 'Glavna email adresa za komunikaciju',
        businessType: 'Odaberite da li ste preduzetnik ili firma',
        companyName: 'Zvanični naziv vašeg preduzetništva ili firme',
        taxNumber: 'Vaš PIB broj (opciono, ali preporučeno za fakturisanje)',
        registrationNumber: 'Matični broj preduzetništva ili firme (opciono)',
        phone: 'Kontakt telefon za klijente i poslovnu komunikaciju',
        bankAccount: 'Broj računa za prijem plaćanja (opciono)',
        address: 'Adresa vašeg poslovnog prostora ili prebivališta',
      },
      notificationHelp: {
        newAppointments: 'Primićete email kada se zakažu novi termini ili kada klijenti promene postojeće termine',
        reminders: 'Automatski podsetnici 24 sata pre zakazanih termina',
        payments: 'Obaveštenja kada su fakture plaćene ili kada su dospeće za plaćanje',
      },
    },
    admin: {
      title: 'Administracija',
      administration: 'Upravljanje ulogama korisnika i dozvolama',
      userManagement: 'Upravljanje korisnicima',
      adminActionsHistory: 'Istorija admin akcija',
      user: 'Korisnik',
      role: 'Uloga',
      registrationDate: 'Datum registracije',
      actions: 'Akcije',
      manageRole: 'Upravljaj ulogom',
      deleteUser: 'Obriši',
      updateRole: 'Ažuriranje uloge korisnika',
      roleUpdated: 'Uloga korisnika je uspešno ažurirana',
      userDeleted: 'Korisnik je uspešno obrisan',
      updateError: 'Greška prilikom ažuriranja uloge korisnika',
      deleteError: 'Greška prilikom brisanja korisnika',
      noUsers: 'Nema registrovanih korisnika',
      noActions: 'Nema zabeleženih akcija',
      actionTypes: {
        updateRole: 'Ažuriranje uloge',
        assignRole: 'Dodeljivanje uloge',
        deleteUser: 'Brisanje korisnika',
      },
      roles: {
        user: 'Korisnik',
        admin: 'Administrator',
        pending: 'Na čekanju',
      },
      roleDescriptions: {
        user: 'Korisnik',
        admin: 'Administrator',
      },
      deleteWarning: 'Upozorenje - Nepovratna akcija',
      deleteConfirmation: 'Ova akcija će trajno obrisati korisnika i sve povezane podatke',
      whatWillBeDeleted: 'Šta će biti obrisano:',
      deleteItems: {
        account: 'Korisnički nalog i profil',
        clients: 'Svi klijenti korisnika',
        services: 'Sve usluge korisnika',
        appointments: 'Svi termini korisnika',
        invoices: 'Sve fakture korisnika',
        roles: 'Sve uloge i dozvole',
      },
      deletionReason: 'Razlog brisanja (opciono)',
      enterReason: 'Unesite razlog za brisanje korisnika...',
      confirmDeletion: 'Da biste nastavili sa brisanjem, kliknite na dugme "Obriši korisnika"',
    },
    landing: {
      hero: {
        title: 'Upravljaj svojim poslovanjem kao profesionalac',
        subtitle: 'Automatizuj svoj biznis danas',
        description: 'TaskFlowPro je kompletno rešenje za male biznise. Automatizuj termine, fakturisanje, komunikaciju sa klijentima i fokusiraj se na ono što najbolje radiš.',
        startFree: 'Počni besplatno',
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
        automaticInvoicing: {
          title: 'Automatsko fakturisanje',
          description: 'Kreiranje i slanje faktura u PDF formatu. Praćenje plaćanja i dospeća.',
        },
        analyticsReports: {
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
        timeSaving: 'Ušteda vremena',
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
          features: [
            'Do 50 termina mesečno',
            'Osnovno fakturisanje',
            'Email podrška',
          ],
          button: 'Počni besplatno',
        },
        professional: {
          title: 'Professional',
          price: '2.990 RSD',
          period: '/ mesečno',
          popular: 'Najpopularniji',
          features: [
            'Neograničeni termini',
            'Napredna analitika',
            'AI asistent',
            'Prioritetna podrška',
          ],
          button: 'Izaberi plan',
        },
        enterprise: {
          title: 'Enterprise',
          price: 'Kontakt',
          features: [
            'Sve Professional funkcije',
            'Prilagođena integracija',
            'Dedicirani account manager',
            '24/7 podrška',
          ],
          button: 'Kontaktiraj nas',
        },
      },
      cta: {
        title: 'Spreman si da automatizuješ svoj biznis?',
        subtitle: 'Pridruži se stotinama uspešnih preduzetnika koji već koriste TaskFlowPro',
        startToday: 'Počni besplatno danas',
        viewDemo: 'Pogledaj demo',
        freeTrialNote: 'Besplatno 30 dana • Bez kreditne kartice • Otkaži bilo kada',
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
    errors: {
      networkError: 'Greška mreže. Proverite internetsku konekciju.',
      authError: 'Greška autentifikacije. Molimo prijavite se ponovo.',
      permissionDenied: 'Nemate dozvolu za ovu akciju.',
      notFound: 'Traženi resurs nije pronađen.',
      serverError: 'Greška servera. Pokušajte ponovo kasnije.',
      validationError: 'Podaci nisu validni. Proverite unos.',
      unexpectedError: 'Došlo je do neočekivane greške.',
      tryAgain: 'Pokušajte ponovo',
      contactSupport: 'Kontaktirajte podršku',
    },
    success: {
      dataSaved: 'Podaci su uspešno sačuvani',
      itemCreated: 'Stavka je uspešno kreirana',
      itemUpdated: 'Stavka je uspešno ažurirana',
      itemDeleted: 'Stavka je uspešno obrisana',
      emailSent: 'Email je uspešno poslat',
      passwordUpdated: 'Lozinka je uspešno ažurirana',
      settingsUpdated: 'Podešavanja su uspešno ažurirana',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      required: 'Required',
      optional: 'Optional',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
    },
    nav: {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      clients: 'Clients',
      invoices: 'Invoices',
      messages: 'Messages',
      admin: 'Admin',
      settings: 'Settings',
    },
    auth: {
      welcomeBack: 'Welcome back',
      signInToAccount: 'Sign in to your TaskFlowPro account',
      emailAddress: 'Email address',
      enterPassword: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      signIn: 'Sign in',
      signUp: 'Sign up for free',
      createAccount: 'Create account',
      joinPlatform: 'Join the TaskFlowPro platform',
      confirmPassword: 'Confirm password',
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      backToHome: 'Back to home',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      invalidCredentials: 'Invalid login credentials',
      loginError: 'An error occurred during login',
      registrationError: 'An error occurred during registration',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      registrationSuccess: 'Successfully registered',
      loginSuccess: 'Successfully logged in',
    },
    dashboard: {
      title: 'Dashboard',
      businessOverview: 'Business overview for',
      todaysAppointments: "Today's appointments",
      totalClients: 'Total clients',
      todaysRevenue: "Today's revenue",
      pendingInvoices: 'Pending invoices',
      viewAppointments: 'View appointments',
      manageClients: 'Manage clients',
      viewInvoices: 'View invoices',
      addService: 'Add service',
      refreshData: 'Refresh data',
      noAppointmentsToday: 'No appointments scheduled',
      noRegisteredClients: 'No registered clients',
      noRevenueToday: 'No revenue today',
      allInvoicesPaid: 'All invoices are paid',
      appointmentToday: 'appointment today',
      appointmentsToday: 'appointments today',
      registeredClient: 'registered client',
      registeredClients: 'registered clients',
      fromPaidInvoices: 'from paid invoices',
      invoicesPending: 'invoices pending payment',
      invoicePending: 'invoice pending payment',
      revenueChart: 'Revenue (last 7 days)',
      appointmentsChart: 'Appointments (last 7 days)',
      dailyRevenueOverview: 'Daily revenue overview from paid invoices',
      appointmentsByDay: 'Number of scheduled appointments by day',
      quickActions: 'Quick actions',
      mostUsedFeatures: 'Most used features',
      newAppointment: 'New appointment',
      addClient: 'Add client',
      newInvoice: 'New invoice',
    },
    appointments: {
      title: 'Appointments',
      appointmentManagement: 'Managing appointments with clients',
      newAppointment: 'New appointment',
      editAppointment: 'Edit appointment',
      createAppointment: 'Create new appointment',
      client: 'Client',
      service: 'Service',
      appointmentDate: 'Appointment date',
      startTime: 'Start time',
      duration: 'Duration (minutes)',
      durationMinutes: 'minutes',
      appointmentStatus: 'Appointment status',
      additionalNotes: 'Additional notes',
      selectClient: 'Select a client for the appointment',
      selectService: 'Select a service',
      selectDate: 'Select the date when the appointment will take place',
      enterTime: 'Enter the time when the appointment starts',
      enterDuration: 'Enter how many minutes the appointment will last',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      noAppointments: 'No appointments added yet',
      deleteConfirm: 'Are you sure you want to delete this appointment?',
      appointmentDeleted: 'Appointment successfully deleted',
      appointmentCreated: 'Appointment successfully created',
      appointmentUpdated: 'Appointment successfully updated',
      deleteError: 'Error deleting appointment',
      createError: 'Error creating appointment',
      updateError: 'Error updating appointment',
      minimumDuration: 'minimum 15 minutes, step of 15 minutes',
      durationStep: 'step of 15 minutes',
      statusDescription: {
        pending: 'appointment not yet confirmed',
        confirmed: 'appointment is confirmed',
        cancelled: 'appointment is cancelled',
      },
      formHelp: {
        client: 'Select the client you want to schedule an appointment with',
        service: 'Select the service you will provide to the client during the appointment',
        date: 'Select the date when the appointment will take place',
        time: 'Enter the time when the appointment starts',
        duration: 'Enter how many minutes the appointment will last (minimum 15 minutes, step of 15 minutes)',
        status: 'Select the current status of the appointment',
        notes: 'Optional - add important information about the appointment, special requirements or notes',
      },
    },
    clients: {
      title: 'Clients',
      clientManagement: 'Managing client information',
      addClient: 'Add client',
      editClient: 'Edit client data',
      fullName: 'Full name',
      emailAddress: 'Email address',
      phoneNumber: 'Phone number',
      additionalNotes: 'Additional notes',
      lastContact: 'Last contact',
      createdBy: 'Created by user',
      creationDate: 'Creation date',
      noClients: 'No clients added yet',
      noClientsFound: 'No clients match the search',
      searchClients: 'Search clients...',
      deleteConfirm: 'Are you sure you want to delete this client?',
      clientDeleted: 'Client successfully deleted',
      clientAdded: 'New client successfully added',
      clientUpdated: 'Client data successfully updated',
      deleteError: 'Error deleting client',
      addError: 'Error adding new client',
      updateError: 'Error updating client data',
      adminView: 'Admin view',
      adminViewDescription: 'Managing all clients in the system (admin view)',
      searchClientsUsers: 'Search clients or users...',
      formValidation: {
        nameRequired: 'Full name is required',
        nameMinLength: 'Name must be at least 2 characters',
        emailRequired: 'Email address is required',
        emailInvalid: 'Enter a valid email address',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Enter a valid phone number',
      },
      formHelp: {
        name: 'Enter the full name of the client',
        email: 'Email address for communication and sending invoices',
        phone: 'Contact phone for emergencies and appointment confirmations',
        notes: 'Optional - add important information about the client',
      },
    },
    invoices: {
      title: 'Invoices',
      invoiceManagement: 'Managing invoices and billing',
      newInvoice: 'New invoice',
      editInvoice: 'Edit invoice',
      invoiceNumber: 'Invoice number',
      client: 'Client',
      creationDate: 'Creation date',
      dueDate: 'Due date',
      amount: 'Amount',
      status: 'Status',
      linkedAppointment: 'Linked appointment (optional)',
      generatePdf: 'Show PDF invoice',
      downloadPdf: 'Download PDF',
      changeStatus: 'Change status',
      markAsPaid: 'Mark as paid',
      markAsPending: 'Return to pending',
      allStatuses: 'All statuses',
      pending: 'Pending',
      paid: 'Paid',
      cancelled: 'Cancelled',
      overdue: 'Overdue',
      noInvoices: 'No invoices created yet',
      noInvoicesFound: 'No invoices match the search',
      searchInvoices: 'Search invoices...',
      selectClientFirst: 'First select a client to see available appointments',
      selectAppointment: 'Optional - select an appointment to automatically fill the amount',
      enterAmount: 'Enter the invoice amount in dinars',
      selectDueDate: 'Select the date by which the invoice should be paid',
      statusUpdated: 'Invoice status changed',
      pdfGenerated: 'PDF invoice successfully generated',
      pdfDownloaded: 'PDF invoice downloaded',
      statusUpdateError: 'Error updating invoice status',
      pdfError: 'Error generating PDF invoice',
      invoiceCreated: 'Invoice successfully created',
      createError: 'Error creating invoice',
      statusDescriptions: {
        pending: 'Pending - invoice awaiting payment',
        paid: 'Paid - invoice has been paid',
        cancelled: 'Cancelled - invoice has been cancelled',
        overdue: 'Overdue - invoice not paid on time',
      },
      formHelp: {
        client: 'Select the client you want to send the invoice to',
        appointment: 'Optional - select an appointment to automatically fill the amount based on service price',
        amount: 'Enter the invoice amount in dinars. If you selected an appointment, the amount will be automatically filled.',
        dueDate: 'Select the date by which the invoice should be paid. Default is set to 7 days from today.',
      },
    },
    messages: {
      title: 'AI Assistant',
      aiAssistant: 'AI Assistant',
      draftResponses: 'Draft responses with AI assistance',
      settings: 'Settings',
      client: 'Client',
      selectClient: 'Select a client',
      clearConversation: 'Clear conversation',
      conversation: 'Conversation',
      noMessages: 'No messages yet',
      startTyping: 'Start typing to create a message',
      typeMessage: 'Type your message...',
      aiResponse: 'AI Response',
      aiTips: 'AI Assistant Tips',
      tip1: 'Use AI to draft responses to common client questions',
      tip2: 'Generate appointment scheduling messages',
      tip3: 'Create follow-up messages for missed appointments',
      tip4: 'Craft payment reminders for overdue invoices',
    },
    settings: {
      title: 'Settings',
      accountSettings: 'Managing account settings and preferences',
      personalInfo: 'Personal and business data',
      personalBusinessData: 'Personal and business data',
      basicInfo: 'Basic information',
      companyInfo: 'Company / business data',
      contactInfo: 'Contact information',
      address: 'Address',
      services: 'Services',
      addService: 'Add new service',
      editService: 'Edit service',
      serviceName: 'Service name',
      serviceDescription: 'Service description',
      duration: 'Duration (minutes)',
      price: 'Price (RSD)',
      yourServices: 'Your services',
      noServices: 'No services added yet',
      serviceAdded: 'Service successfully added',
      serviceUpdated: 'Service successfully updated',
      serviceDeleted: 'Service successfully deleted',
      serviceError: 'Error saving service',
      deleteServiceConfirm: 'Are you sure you want to delete this service?',
      notificationSettings: 'Notification settings',
      emailNotifications: 'Email notifications',
      newAppointmentNotifications: 'New appointment notifications',
      appointmentReminders: 'Appointment reminders',
      paymentNotifications: 'Payment notifications',
      saveSettings: 'Save settings',
      unsavedChanges: 'You have unsaved changes',
      settingsSaved: 'Settings saved',
      fullName: 'Full name',
      companyName: 'Company / business name',
      businessType: 'Business type',
      individual: 'Individual / Sole proprietor',
      company: 'Legal entity / Company',
      taxNumber: 'Tax ID number',
      registrationNumber: 'Registration number',
      bankAccount: 'Bank account number',
      phoneNumber: 'Phone number',
      emailAddress: 'Email address',
      street: 'Street and number',
      postalCode: 'Postal code',
      country: 'Country',
      formHelp: {
        fullName: 'Your full name as it will appear on invoices',
        email: 'Main email address for communication',
        businessType: 'Select whether you are an individual or company',
        companyName: 'Official name of your business or company',
        taxNumber: 'Your tax ID number (optional, but recommended for invoicing)',
        registrationNumber: 'Business or company registration number (optional)',
        phone: 'Contact phone for clients and business communication',
        bankAccount: 'Bank account number for receiving payments (optional)',
        address: 'Address of your business premises or residence',
      },
      notificationHelp: {
        newAppointments: 'You will receive email when new appointments are scheduled or when clients change existing appointments',
        reminders: 'Automatic reminders 24 hours before scheduled appointments',
        payments: 'Notifications when invoices are paid or when they are due for payment',
      },
    },
    admin: {
      title: 'Administration',
      administration: 'Managing user roles and permissions',
      userManagement: 'User management',
      adminActionsHistory: 'Admin actions history',
      user: 'User',
      role: 'Role',
      registrationDate: 'Registration date',
      actions: 'Actions',
      manageRole: 'Manage role',
      deleteUser: 'Delete',
      updateRole: 'Update user role',
      roleUpdated: 'User role successfully updated',
      userDeleted: 'User successfully deleted',
      updateError: 'Error updating user role',
      deleteError: 'Error deleting user',
      noUsers: 'No registered users',
      noActions: 'No recorded actions',
      actionTypes: {
        updateRole: 'Role update',
        assignRole: 'Role assignment',
        deleteUser: 'User deletion',
      },
      roles: {
        user: 'User',
        admin: 'Administrator',
        pending: 'Pending',
      },
      roleDescriptions: {
        user: 'User',
        admin: 'Administrator',
      },
      deleteWarning: 'Warning - Irreversible action',
      deleteConfirmation: 'This action will permanently delete the user and all related data',
      whatWillBeDeleted: 'What will be deleted:',
      deleteItems: {
        account: 'User account and profile',
        clients: 'All user clients',
        services: 'All user services',
        appointments: 'All user appointments',
        invoices: 'All user invoices',
        roles: 'All roles and permissions',
      },
      deletionReason: 'Deletion reason (optional)',
      enterReason: 'Enter reason for deleting the user...',
      confirmDeletion: 'To proceed with deletion, click the "Delete User" button',
    },
    landing: {
      hero: {
        title: 'Manage your business like a professional',
        subtitle: 'Automate your business today',
        description: 'TaskFlowPro is a complete solution for small businesses. Automate appointments, invoicing, client communication and focus on what you do best.',
        startFree: 'Start free',
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
        automaticInvoicing: {
          title: 'Automatic invoicing',
          description: 'Creating and sending invoices in PDF format. Payment and due date tracking.',
        },
        analyticsReports: {
          title: 'Analytics and reports',
          description: 'Detailed business insights, revenue and performance through intuitive charts.',
        },
        aiAssistant: {
          title: 'AI assistant',
          description: 'Smart assistant for client communication and routine task automation.',
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
          description: 'Adapted to the Serbian market with support for local standards and regulations.',
        },
        resultsTitle: 'Results that speak',
        timeSaving: 'Time savings',
        revenueIncrease: 'Revenue increase',
        customerSatisfaction: 'Customer satisfaction',
        errorReduction: 'Error reduction',
      },
      testimonials: {
        title: 'What our users say',
        subtitle: 'Join hundreds of satisfied entrepreneurs',
        testimonial1: {
          name: 'Maria Petrovic',
          role: 'Beauty salon owner',
          content: 'TaskFlowPro completely changed the way I run my salon. Now I have more time for clients and less for administration.',
        },
        testimonial2: {
          name: 'Stefan Nikolic',
          role: 'Physiotherapist',
          content: "It's incredible how much this system has made my job easier. Appointments, invoices, everything is automated and professional.",
        },
        testimonial3: {
          name: 'Ana Jovanovic',
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
          features: [
            'Up to 50 appointments per month',
            'Basic invoicing',
            'Email support',
          ],
          button: 'Start free',
        },
        professional: {
          title: 'Professional',
          price: '$29.90',
          period: '/ month',
          popular: 'Most popular',
          features: [
            'Unlimited appointments',
            'Advanced analytics',
            'AI assistant',
            'Priority support',
          ],
          button: 'Choose plan',
        },
        enterprise: {
          title: 'Enterprise',
          price: 'Contact',
          features: [
            'All Professional features',
            'Custom integration',
            'Dedicated account manager',
            '24/7 support',
          ],
          button: 'Contact us',
        },
      },
      cta: {
        title: 'Ready to automate your business?',
        subtitle: 'Join hundreds of successful entrepreneurs already using TaskFlowPro',
        startToday: 'Start free today',
        viewDemo: 'View demo',
        freeTrialNote: 'Free 30 days • No credit card • Cancel anytime',
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
    errors: {
      networkError: 'Network error. Check your internet connection.',
      authError: 'Authentication error. Please log in again.',
      permissionDenied: 'You do not have permission for this action.',
      notFound: 'The requested resource was not found.',
      serverError: 'Server error. Please try again later.',
      validationError: 'Data is not valid. Check your input.',
      unexpectedError: 'An unexpected error occurred.',
      tryAgain: 'Try again',
      contactSupport: 'Contact support',
    },
    success: {
      dataSaved: 'Data successfully saved',
      itemCreated: 'Item successfully created',
      itemUpdated: 'Item successfully updated',
      itemDeleted: 'Item successfully deleted',
      emailSent: 'Email successfully sent',
      passwordUpdated: 'Password successfully updated',
      settingsUpdated: 'Settings successfully updated',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non',
      success: 'Succès',
      error: 'Erreur',
      warning: 'Avertissement',
      info: 'Information',
      required: 'Requis',
      optional: 'Optionnel',
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      date: 'Date',
      time: 'Heure',
      status: 'Statut',
      actions: 'Actions',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Se déconnecter',
      login: 'Se connecter',
      register: "S'inscrire",
    },
    nav: {
      dashboard: 'Tableau de bord',
      appointments: 'Rendez-vous',
      clients: 'Clients',
      invoices: 'Factures',
      messages: 'Messages',
      admin: 'Admin',
      settings: 'Paramètres',
    },
    auth: {
      welcomeBack: 'Bon retour',
      signInToAccount: 'Connectez-vous à votre compte TaskFlowPro',
      emailAddress: 'Adresse email',
      enterPassword: 'Entrez votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      signIn: 'Se connecter',
      signUp: 'Inscription gratuite',
      createAccount: 'Créer un compte',
      joinPlatform: 'Rejoignez la plateforme TaskFlowPro',
      confirmPassword: 'Confirmer le mot de passe',
      agreeToTerms: "J'accepte les",
      termsOfService: "Conditions d'utilisation",
      privacyPolicy: 'Politique de confidentialité',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      dontHaveAccount: "Vous n'avez pas de compte ?",
      backToHome: "Retour à l'accueil",
      signingIn: 'Connexion...',
      creatingAccount: 'Création du compte...',
      invalidCredentials: 'Identifiants de connexion invalides',
      loginError: 'Une erreur est survenue lors de la connexion',
      registrationError: "Une erreur est survenue lors de l'inscription",
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      registrationSuccess: 'Inscription réussie',
      loginSuccess: 'Connexion réussie',
    },
    dashboard: {
      title: 'Tableau de bord',
      businessOverview: "Aperçu de l'entreprise pour",
      todaysAppointments: "Rendez-vous d'aujourd'hui",
      totalClients: 'Total des clients',
      todaysRevenue: "Revenus d'aujourd'hui",
      pendingInvoices: 'Factures en attente',
      viewAppointments: 'Voir les rendez-vous',
      manageClients: 'Gérer les clients',
      viewInvoices: 'Voir les factures',
      addService: 'Ajouter un service',
      refreshData: 'Actualiser les données',
      noAppointmentsToday: 'Aucun rendez-vous programmé',
      noRegisteredClients: 'Aucun client enregistré',
      noRevenueToday: "Aucun revenu aujourd'hui",
      allInvoicesPaid: 'Toutes les factures sont payées',
      appointmentToday: "rendez-vous aujourd'hui",
      appointmentsToday: "rendez-vous aujourd'hui",
      registeredClient: 'client enregistré',
      registeredClients: 'clients enregistrés',
      fromPaidInvoices: 'des factures payées',
      invoicesPending: 'factures en attente de paiement',
      invoicePending: 'facture en attente de paiement',
      revenueChart: 'Revenus (7 derniers jours)',
      appointmentsChart: 'Rendez-vous (7 derniers jours)',
      dailyRevenueOverview: 'Aperçu des revenus quotidiens des factures payées',
      appointmentsByDay: 'Nombre de rendez-vous programmés par jour',
      quickActions: 'Actions rapides',
      mostUsedFeatures: 'Fonctionnalités les plus utilisées',
      newAppointment: 'Nouveau rendez-vous',
      addClient: 'Ajouter un client',
      newInvoice: 'Nouvelle facture',
    },
    appointments: {
      title: 'Rendez-vous',
      appointmentManagement: 'Gestion des rendez-vous avec les clients',
      newAppointment: 'Nouveau rendez-vous',
      editAppointment: 'Modifier le rendez-vous',
      createAppointment: 'Créer un nouveau rendez-vous',
      client: 'Client',
      service: 'Service',
      appointmentDate: 'Date du rendez-vous',
      startTime: 'Heure de début',
      duration: 'Durée (minutes)',
      durationMinutes: 'minutes',
      appointmentStatus: 'Statut du rendez-vous',
      additionalNotes: 'Notes supplémentaires',
      selectClient: 'Sélectionner un client pour le rendez-vous',
      selectService: 'Sélectionner un service',
      selectDate: 'Sélectionner la date du rendez-vous',
      enterTime: 'Entrer l\'heure de début du rendez-vous',
      enterDuration: 'Entrer la durée du rendez-vous en minutes',
      pending: 'En attente',
      confirmed: 'Confirmé',
      cancelled: 'Annulé',
      noAppointments: 'Aucun rendez-vous ajouté',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
      appointmentDeleted: 'Rendez-vous supprimé avec succès',
      appointmentCreated: 'Rendez-vous créé avec succès',
      appointmentUpdated: 'Rendez-vous mis à jour avec succès',
      deleteError: 'Erreur lors de la suppression du rendez-vous',
      createError: 'Erreur lors de la création du rendez-vous',
      updateError: 'Erreur lors de la mise à jour du rendez-vous',
      minimumDuration: 'minimum 15 minutes, par pas de 15 minutes',
      durationStep: 'par pas de 15 minutes',
      statusDescription: {
        pending: 'rendez-vous pas encore confirmé',
        confirmed: 'rendez-vous confirmé',
        cancelled: 'rendez-vous annulé',
      },
      formHelp: {
        client: 'Sélectionnez le client avec qui vous voulez programmer un rendez-vous',
        service: 'Sélectionnez le service que vous fournirez au client pendant le rendez-vous',
        date: 'Sélectionnez la date à laquelle le rendez-vous aura lieu',
        time: 'Entrez l\'heure à laquelle le rendez-vous commence',
        duration: 'Entrez combien de minutes durera le rendez-vous (minimum 15 minutes, par pas de 15 minutes)',
        status: 'Sélectionnez le statut actuel du rendez-vous',
        notes: 'Optionnel - ajoutez des informations importantes sur le rendez-vous, des exigences spéciales ou des notes',
      },
    },
    clients: {
      title: 'Clients',
      clientManagement: 'Gestion des informations clients',
      addClient: 'Ajouter un client',
      editClient: 'Modifier les données client',
      fullName: 'Nom complet',
      emailAddress: 'Adresse email',
      phoneNumber: 'Numéro de téléphone',
      additionalNotes: 'Notes supplémentaires',
      lastContact: 'Dernier contact',
      createdBy: 'Créé par l\'utilisateur',
      creationDate: 'Date de création',
      noClients: 'Aucun client ajouté',
      noClientsFound: 'Aucun client ne correspond à la recherche',
      searchClients: 'Rechercher des clients...',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce client ?',
      clientDeleted: 'Client supprimé avec succès',
      clientAdded: 'Nouveau client ajouté avec succès',
      clientUpdated: 'Données client mises à jour avec succès',
      deleteError: 'Erreur lors de la suppression du client',
      addError: 'Erreur lors de l\'ajout du nouveau client',
      updateError: 'Erreur lors de la mise à jour des données client',
      adminView: 'Vue administrateur',
      adminViewDescription: 'Gestion de tous les clients du système (vue administrateur)',
      searchClientsUsers: 'Rechercher des clients ou des utilisateurs...',
      formValidation: {
        nameRequired: 'Le nom complet est requis',
        nameMinLength: 'Le nom doit contenir au moins 2 caractères',
        emailRequired: 'L\'adresse email est requise',
        emailInvalid: 'Entrez une adresse email valide',
        phoneRequired: 'Le numéro de téléphone est requis',
        phoneInvalid: 'Entrez un numéro de téléphone valide',
      },
      formHelp: {
        name: 'Entrez le nom complet du client',
        email: 'Adresse email pour la communication et l\'envoi de factures',
        phone: 'Téléphone de contact pour les urgences et confirmations de rendez-vous',
        notes: 'Optionnel - ajoutez des informations importantes sur le client',
      },
    },
    invoices: {
      title: 'Factures',
      invoiceManagement: 'Gestion des factures et de la facturation',
      newInvoice: 'Nouvelle facture',
      editInvoice: 'Modifier la facture',
      invoiceNumber: 'Numéro de facture',
      client: 'Client',
      creationDate: 'Date de création',
      dueDate: 'Date d\'échéance',
      amount: 'Montant',
      status: 'Statut',
      linkedAppointment: 'Rendez-vous lié (optionnel)',
      generatePdf: 'Afficher la facture PDF',
      downloadPdf: 'Télécharger le PDF',
      changeStatus: 'Changer le statut',
      markAsPaid: 'Marquer comme payé',
      markAsPending: 'Remettre en attente',
      allStatuses: 'Tous les statuts',
      pending: 'En attente',
      paid: 'Payé',
      cancelled: 'Annulé',
      overdue: 'En retard',
      noInvoices: 'Aucune facture créée',
      noInvoicesFound: 'Aucune facture ne correspond à la recherche',
      searchInvoices: 'Rechercher des factures...',
      selectClientFirst: 'Sélectionnez d\'abord un client pour voir les rendez-vous disponibles',
      selectAppointment: 'Optionnel - sélectionnez un rendez-vous pour remplir automatiquement le montant',
      enterAmount: 'Entrez le montant de la facture en dinars',
      selectDueDate: 'Sélectionnez la date à laquelle la facture doit être payée',
      statusUpdated: 'Statut de la facture modifié',
      pdfGenerated: 'Facture PDF générée avec succès',
      pdfDownloaded: 'Facture PDF téléchargée',
      statusUpdateError: 'Erreur lors de la mise à jour du statut de la facture',
      pdfError: 'Erreur lors de la génération de la facture PDF',
      invoiceCreated: 'Facture créée avec succès',
      createError: 'Erreur lors de la création de la facture',
      statusDescriptions: {
        pending: 'En attente - facture en attente de paiement',
        paid: 'Payé - facture payée',
        cancelled: 'Annulé - facture annulée',
        overdue: 'En retard - facture non payée à temps',
      },
      formHelp: {
        client: 'Sélectionnez le client à qui vous voulez envoyer la facture',
        appointment: 'Optionnel - sélectionnez un rendez-vous pour remplir automatiquement le montant basé sur le prix du service',
        amount: 'Entrez le montant de la facture en dinars. Si vous avez sélectionné un rendez-vous, le montant sera automatiquement rempli.',
        dueDate: 'Sélectionnez la date à laquelle la facture doit être payée. Par défaut, elle est fixée à 7 jours à partir d\'aujourd\'hui.',
      },
    },
    messages: {
      title: 'Assistant IA',
      aiAssistant: 'Assistant IA',
      draftResponses: 'Rédiger des réponses avec l\'assistance IA',
      settings: 'Paramètres',
      client: 'Client',
      selectClient: 'Sélectionner un client',
      clearConversation: 'Effacer la conversation',
      conversation: 'Conversation',
      noMessages: 'Aucun message encore',
      startTyping: 'Commencez à taper pour créer un message',
      typeMessage: 'Tapez votre message...',
      aiResponse: 'Réponse IA',
      aiTips: 'Conseils Assistant IA',
      tip1: 'Utilisez l\'IA pour rédiger des réponses aux questions fréquentes des clients',
      tip2: 'Générez des messages de planification de rendez-vous',
      tip3: 'Créez des messages de suivi pour les rendez-vous manqués',
      tip4: 'Rédigez des rappels de paiement pour les factures en retard',
    },
    settings: {
      title: 'Paramètres',
      accountSettings: 'Gestion des paramètres de compte et des préférences',
      personalInfo: 'Données personnelles et professionnelles',
      personalBusinessData: 'Données personnelles et professionnelles',
      basicInfo: 'Informations de base',
      companyInfo: 'Données de l\'entreprise / activité',
      contactInfo: 'Informations de contact',
      address: 'Adresse',
      services: 'Services',
      addService: 'Ajouter un nouveau service',
      editService: 'Modifier le service',
      serviceName: 'Nom du service',
      serviceDescription: 'Description du service',
      duration: 'Durée (minutes)',
      price: 'Prix (RSD)',
      yourServices: 'Vos services',
      noServices: 'Aucun service ajouté',
      serviceAdded: 'Service ajouté avec succès',
      serviceUpdated: 'Service mis à jour avec succès',
      serviceDeleted: 'Service supprimé avec succès',
      serviceError: 'Erreur lors de l\'enregistrement du service',
      deleteServiceConfirm: 'Êtes-vous sûr de vouloir supprimer ce service ?',
      notificationSettings: 'Paramètres de notification',
      emailNotifications: 'Notifications par email',
      newAppointmentNotifications: 'Notifications de nouveaux rendez-vous',
      appointmentReminders: 'Rappels de rendez-vous',
      paymentNotifications: 'Notifications de paiement',
      saveSettings: 'Enregistrer les paramètres',
      unsavedChanges: 'Vous avez des modifications non enregistrées',
      settingsSaved: 'Paramètres enregistrés',
      fullName: 'Nom complet',
      companyName: 'Nom de l\'entreprise / activité',
      businessType: 'Type d\'activité',
      individual: 'Individuel / Entrepreneur individuel',
      company: 'Personne morale / Entreprise',
      taxNumber: 'Numéro d\'identification fiscale',
      registrationNumber: 'Numéro d\'enregistrement',
      bankAccount: 'Numéro de compte bancaire',
      phoneNumber: 'Numéro de téléphone',
      emailAddress: 'Adresse email',
      street: 'Rue et numéro',
      postalCode: 'Code postal',
      country: 'Pays',
      formHelp: {
        fullName: 'Votre nom complet tel qu\'il apparaîtra sur les factures',
        email: 'Adresse email principale pour la communication',
        businessType: 'Sélectionnez si vous êtes un individu ou une entreprise',
        companyName: 'Nom officiel de votre entreprise ou société',
        taxNumber: 'Votre numéro d\'identification fiscale (optionnel, mais recommandé pour la facturation)',
        registrationNumber: 'Numéro d\'enregistrement de l\'entreprise ou de la société (optionnel)',
        phone: 'Téléphone de contact pour les clients et la communication professionnelle',
        bankAccount: 'Numéro de compte bancaire pour recevoir les paiements (optionnel)',
        address: 'Adresse de vos locaux professionnels ou de résidence',
      },
      notificationHelp: {
        newAppointments: 'Vous recevrez un email lorsque de nouveaux rendez-vous sont programmés ou lorsque les clients modifient des rendez-vous existants',
        reminders: 'Rappels automatiques 24 heures avant les rendez-vous programmés',
        payments: 'Notifications lorsque les factures sont payées ou lorsqu\'elles sont dues pour paiement',
      },
    },
    admin: {
      title: 'Administration',
      administration: 'Gestion des rôles utilisateur et des permissions',
      userManagement: 'Gestion des utilisateurs',
      adminActionsHistory: 'Historique des actions admin',
      user: 'Utilisateur',
      role: 'Rôle',
      registrationDate: 'Date d\'inscription',
      actions: 'Actions',
      manageRole: 'Gérer le rôle',
      deleteUser: 'Supprimer',
      updateRole: 'Mettre à jour le rôle utilisateur',
      roleUpdated: 'Rôle utilisateur mis à jour avec succès',
      userDeleted: 'Utilisateur supprimé avec succès',
      updateError: 'Erreur lors de la mise à jour du rôle utilisateur',
      deleteError: 'Erreur lors de la suppression de l\'utilisateur',
      noUsers: 'Aucun utilisateur enregistré',
      noActions: 'Aucune action enregistrée',
      actionTypes: {
        updateRole: 'Mise à jour du rôle',
        assignRole: 'Attribution du rôle',
        deleteUser: 'Suppression de l\'utilisateur',
      },
      roles: {
        user: 'Utilisateur',
        admin: 'Administrateur',
        pending: 'En attente',
      },
      roleDescriptions: {
        user: 'Utilisateur',
        admin: 'Administrateur',
      },
      deleteWarning: 'Avertissement - Action irréversible',
      deleteConfirmation: 'Cette action supprimera définitivement l\'utilisateur et toutes les données associées',
      whatWillBeDeleted: 'Ce qui sera supprimé :',
      deleteItems: {
        account: 'Compte utilisateur et profil',
        clients: 'Tous les clients de l\'utilisateur',
        services: 'Tous les services de l\'utilisateur',
        appointments: 'Tous les rendez-vous de l\'utilisateur',
        invoices: 'Toutes les factures de l\'utilisateur',
        roles: 'Tous les rôles et permissions',
      },
      deletionReason: 'Raison de la suppression (optionnel)',
      enterReason: 'Entrez la raison de la suppression de l\'utilisateur...',
      confirmDeletion: 'Pour procéder à la suppression, cliquez sur le bouton "Supprimer l\'utilisateur"',
    },
    landing: {
      hero: {
        title: 'Gérez votre entreprise comme un professionnel',
        subtitle: 'Automatisez votre entreprise aujourd\'hui',
        description: 'TaskFlowPro est une solution complète pour les petites entreprises. Automatisez les rendez-vous, la facturation, la communication client et concentrez-vous sur ce que vous faites de mieux.',
        startFree: 'Commencer gratuitement',
        viewDemo: 'Voir la démo',
        freeTrialNote: '30 jours gratuits • Sans engagement • Annulez à tout moment',
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
          description: 'Planification et organisation faciles des rendez-vous avec les clients. Rappels et notifications automatiques.',
        },
        clientDatabase: {
          title: 'Base de données clients',
          description: 'Base de données clients centralisée avec historique des interactions et préférences.',
        },
        automaticInvoicing: {
          title: 'Facturation automatique',
          description: 'Création et envoi de factures au format PDF. Suivi des paiements et des échéances.',
        },
        analyticsReports: {
          title: 'Analyses et rapports',
          description: 'Aperçus détaillés de l\'entreprise, des revenus et des performances grâce à des graphiques intuitifs.',
        },
        aiAssistant: {
          title: 'Assistant IA',
          description: 'Assistant intelligent pour la communication client et l\'automatisation des tâches routinières.',
        },
        dataSecurity: {
          title: 'Sécurité des données',
          description: 'Normes de sécurité les plus élevées et protection de la confidentialité pour vos données d\'entreprise.',
        },
      },
      benefits: {
        title: 'Pourquoi TaskFlowPro ?',
        saveTime: {
          title: 'Économisez du temps',
          description: 'Automatisez les tâches routinières et concentrez-vous sur ce qui compte - vos clients.',
        },
        increaseRevenue: {
          title: 'Augmentez les revenus',
          description: 'Une meilleure organisation des rendez-vous et une facturation automatique signifient plus de revenus.',
        },
        workAnywhere: {
          title: 'Travaillez partout',
          description: 'Accédez à votre entreprise depuis n\'importe quel appareil, n\'importe où, n\'importe quand.',
        },
        localized: {
          title: 'Localisé',
          description: 'Adapté au marché serbe avec support pour les normes et réglementations locales.',
        },
        resultsTitle: 'Résultats qui parlent',
        timeSaving: 'Économie de temps',
        revenueIncrease: 'Augmentation des revenus',
        customerSatisfaction: 'Satisfaction client',
        errorReduction: 'Réduction des erreurs',
      },
      testimonials: {
        title: 'Ce que disent nos utilisateurs',
        subtitle: 'Rejoignez des centaines d\'entrepreneurs satisfaits',
        testimonial1: {
          name: 'Maria Petrovic',
          role: 'Propriétaire de salon de beauté',
          content: 'TaskFlowPro a complètement changé la façon dont je gère mon salon. Maintenant j\'ai plus de temps pour les clients et moins pour l\'administration.',
        },
        testimonial2: {
          name: 'Stefan Nikolic',
          role: 'Physiothérapeute',
          content: 'C\'est incroyable à quel point ce système a facilité mon travail. Rendez-vous, factures, tout est automatisé et professionnel.',
        },
        testimonial3: {
          name: 'Ana Jovanovic',
          role: 'Consultante',
          content: 'Enfin j\'ai un contrôle complet sur mon entreprise. Je le recommande à tous les petits entrepreneurs !',
        },
      },
      pricing: {
        title: 'Tarification simple',
        subtitle: 'Pas de coûts cachés. Annulez à tout moment.',
        starter: {
          title: 'Starter',
          price: 'Gratuit',
          period: '30 jours',
          features: [
            'Jusqu\'à 50 rendez-vous par mois',
            'Facturation de base',
            'Support par email',
          ],
          button: 'Commencer gratuitement',
        },
        professional: {
          title: 'Professionnel',
          price: '29,90 €',
          period: '/ mois',
          popular: 'Le plus populaire',
          features: [
            'Rendez-vous illimités',
            'Analyses avancées',
            'Assistant IA',
            'Support prioritaire',
          ],
          button: 'Choisir le plan',
        },
        enterprise: {
          title: 'Entreprise',
          price: 'Contact',
          features: [
            'Toutes les fonctionnalités Professionnel',
            'Intégration personnalisée',
            'Gestionnaire de compte dédié',
            'Support 24/7',
          ],
          button: 'Nous contacter',
        },
      },
      cta: {
        title: 'Prêt à automatiser votre entreprise ?',
        subtitle: 'Rejoignez des centaines d\'entrepreneurs prospères qui utilisent déjà TaskFlowPro',
        startToday: 'Commencez gratuitement aujourd\'hui',
        viewDemo: 'Voir la démo',
        freeTrialNote: '30 jours gratuits • Pas de carte de crédit • Annulez à tout moment',
      },
      footer: {
        description: 'Automatisez votre entreprise et concentrez-vous sur ce que vous aimez faire.',
        product: 'Produit',
        features: 'Fonctionnalités',
        pricing: 'Tarification',
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
    errors: {
      networkError: 'Erreur réseau. Vérifiez votre connexion internet.',
      authError: 'Erreur d\'authentification. Veuillez vous reconnecter.',
      permissionDenied: 'Vous n\'avez pas la permission pour cette action.',
      notFound: 'La ressource demandée n\'a pas été trouvée.',
      serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
      validationError: 'Les données ne sont pas valides. Vérifiez votre saisie.',
      unexpectedError: 'Une erreur inattendue s\'est produite.',
      tryAgain: 'Réessayer',
      contactSupport: 'Contacter le support',
    },
    success: {
      dataSaved: 'Données enregistrées avec succès',
      itemCreated: 'Élément créé avec succès',
      itemUpdated: 'Élément mis à jour avec succès',
      itemDeleted: 'Élément supprimé avec succès',
      emailSent: 'Email envoyé avec succès',
      passwordUpdated: 'Mot de passe mis à jour avec succès',
      settingsUpdated: 'Paramètres mis à jour avec succès',
    },
  },
};

// Language context and hooks
import { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to Serbian
    const saved = localStorage.getItem('taskflowpro-language');
    return (saved as Language) || 'sr';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('taskflowpro-language', lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Utility function for getting translations outside of components
export const getTranslations = (lang: Language): TranslationKeys => {
  return translations[lang];
};

// Language detection utility
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('sr')) return 'sr';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('en')) return 'en';
  
  // Default to Serbian
  return 'sr';
};