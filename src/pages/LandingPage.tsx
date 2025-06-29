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
  Globe,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../lib/i18n';
import LanguageSelector from '../components/common/LanguageSelector';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: Calendar,
      title: t.landing.features.appointmentManagement.title,
      description: t.landing.features.appointmentManagement.description
    },
    {
      icon: Users,
      title: t.landing.features.clientDatabase.title,
      description: t.landing.features.clientDatabase.description
    },
    {
      icon: FileText,
      title: t.landing.features.autoInvoicing.title,
      description: t.landing.features.autoInvoicing.description
    },
    {
      icon: BarChart3,
      title: t.landing.features.analytics.title,
      description: t.landing.features.analytics.description
    },
    {
      icon: MessageSquare,
      title: t.landing.features.aiAssistant.title,
      description: t.landing.features.aiAssistant.description
    },
    {
      icon: Shield,
      title: t.landing.features.dataSecurity.title,
      description: t.landing.features.dataSecurity.description
    }
  ];

  const testimonials = [
    {
      name: t.landing.testimonials.testimonial1.name,
      role: t.landing.testimonials.testimonial1.role,
      content: t.landing.testimonials.testimonial1.content,
      rating: 5
    },
    {
      name: t.landing.testimonials.testimonial2.name,
      role: t.landing.testimonials.testimonial2.role,
      content: t.landing.testimonials.testimonial2.content,
      rating: 5
    },
    {
      name: t.landing.testimonials.testimonial3.name,
      role: t.landing.testimonials.testimonial3.role,
      content: t.landing.testimonials.testimonial3.content,
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: t.landing.stats.satisfiedUsers },
    { number: '10,000+', label: t.landing.stats.scheduledAppointments },
    { number: '99.9%', label: t.landing.stats.uptime },
    { number: '24/7', label: t.landing.stats.support }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.features}
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.testimonials}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.pricing}
              </a>
              <LanguageSelector />
              <Link to="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t.nav.login}
              </Link>
              <Link to="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {t.nav.getStarted}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
                <a
                  href="#features"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.features}
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.testimonials}
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.pricing}
                </a>
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button fullWidth className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    {t.nav.getStarted}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                {t.landing.hero.badge}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {t.landing.hero.title}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}{t.landing.hero.titleHighlight}{' '}
                </span>
                kao profesionalac
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.landing.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 w-full sm:w-auto">
                    {t.landing.hero.getStarted}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto border-2 hover:bg-gray-50">
                    {t.landing.hero.viewDemo}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center text-sm text-gray-500 justify-center lg:justify-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                {t.landing.hero.freeTrialNote}
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t.dashboard.todaysAppointments}</h3>
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t.landing.features.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t.landing.benefits.title}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.landing.benefits.saveTime.title}</h3>
                    <p className="text-gray-600">{t.landing.benefits.saveTime.description}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.landing.benefits.increaseRevenue.title}</h3>
                    <p className="text-gray-600">{t.landing.benefits.increaseRevenue.description}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.landing.benefits.workAnywhere.title}</h3>
                    <p className="text-gray-600">{t.landing.benefits.workAnywhere.description}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.landing.benefits.localized.title}</h3>
                    <p className="text-gray-600">{t.landing.benefits.localized.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-6">{t.landing.benefits.resultsTitle}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{t.landing.benefits.timeSaved}</span>
                    <span className="font-bold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t.landing.benefits.revenueIncrease}</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t.landing.benefits.customerSatisfaction}</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t.landing.benefits.errorReduction}</span>
                    <span className="font-bold">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.landing.testimonials.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {t.landing.testimonials.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
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
      <section id="pricing" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t.landing.pricing.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {t.landing.pricing.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.landing.pricing.starter.title}</h3>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{t.landing.pricing.starter.price}</span>
                <span className="text-gray-500 ml-2">{t.landing.pricing.starter.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.starter.feature1}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.starter.feature2}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.starter.feature3}</span>
                </li>
              </ul>
              <Link to="/auth/register">
                <Button variant="outline" fullWidth className="border-2">
                  {t.landing.pricing.starter.button}
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 transform scale-105 shadow-2xl">
              <div className="bg-white/20 text-center py-2 px-4 rounded-full text-sm font-medium mb-4 inline-block">
                {t.landing.pricing.professional.badge}
              </div>
              <h3 className="text-xl font-semibold mb-4">{t.landing.pricing.professional.title}</h3>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold">{t.landing.pricing.professional.price}</span>
                <span className="opacity-80 ml-2">{t.landing.pricing.professional.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.professional.feature1}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.professional.feature2}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.professional.feature3}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.professional.feature4}</span>
                </li>
              </ul>
              <Link to="/auth/register">
                <Button fullWidth className="bg-white text-blue-600 hover:bg-gray-100">
                  {t.landing.pricing.professional.button}
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.landing.pricing.enterprise.title}</h3>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{t.landing.pricing.enterprise.price}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.enterprise.feature1}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.enterprise.feature2}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.enterprise.feature3}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t.landing.pricing.enterprise.feature4}</span>
                </li>
              </ul>
              <Button variant="outline" fullWidth className="border-2">
                {t.landing.pricing.enterprise.button}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            {t.landing.cta.title}
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            {t.landing.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 w-full sm:w-auto">
                {t.landing.cta.getStarted}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 w-full sm:w-auto">
                {t.landing.cta.viewDemo}
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            {t.landing.cta.note}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">TaskFlowPro</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                {t.landing.footer.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.landing.footer.product}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t.landing.footer.features}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.landing.footer.pricing}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.integrations}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.api}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.landing.footer.support}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.help}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.documentation}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.contact}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.status}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.landing.footer.company}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.blog}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.careers}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.landing.footer.privacy}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p>&copy; 2025 TaskFlowPro. {t.landing.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;