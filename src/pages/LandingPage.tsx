import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Smartphone,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Upravljanje terminima',
      description: 'Lako zakazivanje i organizovanje termina sa klijentima. Automatski podsetnici i notifikacije.'
    },
    {
      icon: Users,
      title: 'Baza klijenata',
      description: 'Centralizovana baza podataka o klijentima sa istorijom interakcija i preferencijama.'
    },
    {
      icon: FileText,
      title: 'Automatsko fakturisanje',
      description: 'Kreiranje i slanje faktura u PDF formatu. Praćenje plaćanja i dospeća.'
    },
    {
      icon: BarChart3,
      title: 'Analitika i izveštaji',
      description: 'Detaljni uvidi u poslovanje, prihode i performanse kroz intuitivne grafikone.'
    },
    {
      icon: MessageSquare,
      title: 'AI asistent',
      description: 'Pametan asistent za komunikaciju sa klijentima i automatizaciju rutinskih zadataka.'
    },
    {
      icon: Shield,
      title: 'Bezbednost podataka',
      description: 'Najviši standardi bezbednosti i zaštite privatnosti vaših poslovnih podataka.'
    }
  ];

  const testimonials = [
    {
      name: 'Marija Petrović',
      role: 'Vlasnica salona lepote',
      content: 'TaskFlowPro je potpuno promenio način na koji vodim svoj salon. Sada imam više vremena za klijente, a manje za administraciju.',
      rating: 5
    },
    {
      name: 'Stefan Nikolić',
      role: 'Fizioterapeut',
      content: 'Neverovatno je koliko mi je ovaj sistem olakšao posao. Termini, fakture, sve je automatizovano i profesionalno.',
      rating: 5
    },
    {
      name: 'Ana Jovanović',
      role: 'Konsultant',
      content: 'Konačno imam potpunu kontrolu nad svojim poslovanjem. Preporučujem svim malim preduzetnicima!',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Zadovoljnih korisnika' },
    { number: '10,000+', label: 'Zakazanih termina' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Podrška' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlowPro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Funkcionalnosti</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Recenzije</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Cene</a>
              <Link to="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Prijava
              </Link>
              <Link to="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Počni besplatno
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Automatizuj svoj biznis danas
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Upravljaj svojim
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> poslovanjem </span>
                kao profesionalac
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                TaskFlowPro je kompletno rešenje za male biznise. Automatizuj termine, fakturisanje, 
                komunikaciju sa klijentima i fokusiraj se na ono što najbolje radiš.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 w-full sm:w-auto">
                    Počni besplatno
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto border-2 hover:bg-gray-50">
                    Pogledaj demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Besplatno 30 dana • Bez obaveze • Otkaži bilo kada
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Današnji termini</h3>
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-blue-100">+3 od juče</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Ana Marković</div>
                      <div className="text-sm text-gray-500">Konsultacija</div>
                    </div>
                    <div className="text-sm font-medium">14:00</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Petar Jovanović</div>
                      <div className="text-sm text-gray-500">Terapija</div>
                    </div>
                    <div className="text-sm font-medium">15:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Sve što trebaš za uspešan biznis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TaskFlowPro kombinuje sve potrebne alate u jednoj platformi, 
              omogućavajući ti da se fokusiraš na rast svog biznisa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Zašto TaskFlowPro?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Uštedi vreme</h3>
                    <p className="text-gray-600">Automatizuj rutinske zadatke i fokusiraj se na ono što je važno - tvoje klijente.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Povećaj prihode</h3>
                    <p className="text-gray-600">Bolje organizovanje termina i automatsko fakturisanje znače više zarade.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4 mt-1">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Radi svugde</h3>
                    <p className="text-gray-600">Pristupaj svom poslovanju sa bilo kog uređaja, bilo gde, bilo kada.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4 mt-1">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokalizovano</h3>
                    <p className="text-gray-600">Prilagođeno srpskom tržištu sa podrškom za lokalne standarde i propise.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Rezultati koji govore</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Ušteda vremena</span>
                    <span className="font-bold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Povećanje prihoda</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Zadovoljstvo klijenata</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Smanjenje grešaka</span>
                    <span className="font-bold">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Šta kažu naši korisnici
            </h2>
            <p className="text-xl text-gray-600">
              Pridruži se stotinama zadovoljnih preduzetnika
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Jednostavne cene
            </h2>
            <p className="text-xl text-gray-600">
              Bez skrivenih troškova. Otkaži bilo kada.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Besplatno</span>
                <span className="text-gray-500 ml-2">30 dana</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Do 50 termina mesečno</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Osnovno fakturisanje</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email podrška</span>
                </li>
              </ul>
              <Link to="/auth/register">
                <Button variant="outline" fullWidth className="border-2">
                  Počni besplatno
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-8 transform scale-105 shadow-2xl">
              <div className="bg-white/20 text-center py-2 px-4 rounded-full text-sm font-medium mb-4 inline-block">
                Najpopularniji
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">2.990 RSD</span>
                <span className="opacity-80 ml-2">/ mesečno</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Neograničeni termini</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Napredna analitika</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>AI asistent</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3" />
                  <span>Prioritetna podrška</span>
                </li>
              </ul>
              <Link to="/auth/register">
                <Button fullWidth className="bg-white text-blue-600 hover:bg-gray-100">
                  Izaberi plan
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Kontakt</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Sve Professional funkcije</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Prilagođena integracija</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Dedicirani account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>24/7 podrška</span>
                </li>
              </ul>
              <Button variant="outline" fullWidth className="border-2">
                Kontaktiraj nas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Spreman si da automatizuješ svoj biznis?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Pridruži se stotinama uspešnih preduzetnika koji već koriste TaskFlowPro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Počni besplatno danas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                Pogledaj demo
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            Besplatno 30 dana • Bez kreditne kartice • Otkaži bilo kada
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">TaskFlowPro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Automatizuj svoj biznis i fokusiraj se na ono što voliš da radiš.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Proizvod</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funkcionalnosti</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Cene</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integracije</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Podrška</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Pomoć</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dokumentacija</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kompanija</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">O nama</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karijera</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privatnost</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TaskFlowPro. Sva prava zadržana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;