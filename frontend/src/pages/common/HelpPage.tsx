import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const HelpPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqItems = [
    {
      question: 'Was ist Freiplatzfinder?',
      answer: 'Freiplatzfinder ist eine Plattform zur Verwaltung und Suche von freien Plätzen in Jugendhilfeeinrichtungen. Die Anwendung ermöglicht es Trägern, ihre Verfügbarkeiten zu verwalten, und Fallmanagern, schnell und einfach passende freie Plätze zu finden.'
    },
    {
      question: 'Wie kann ich mich registrieren?',
      answer: 'Die Registrierung erfolgt über Ihr zuständiges Jugendamt. Bitte wenden Sie sich an Ihren Administrator, um einen Zugang zu erhalten.'
    },
    {
      question: 'Wie kann ich mein Passwort zurücksetzen?',
      answer: 'Klicken Sie auf der Login-Seite auf "Passwort vergessen". Geben Sie Ihre E-Mail-Adresse ein, und Sie erhalten einen Link zum Zurücksetzen Ihres Passworts.'
    },
    {
      question: 'Wie aktualisiere ich die Verfügbarkeiten meiner Einrichtung?',
      answer: 'Als Träger können Sie im Bereich "Einrichtungen" Ihre Einrichtungen auswählen und dann die Verfügbarkeiten für jede Kategorie aktualisieren.'
    },
    {
      question: 'Wie suche ich nach freien Plätzen?',
      answer: 'Als Fallmanager können Sie im Bereich "Suche" verschiedene Filterkriterien wie Kategorie, Alter, Geschlecht und Standort angeben, um passende freie Plätze zu finden.'
    },
    {
      question: 'Kann ich Einrichtungen als Favoriten speichern?',
      answer: 'Ja, als Fallmanager können Sie Einrichtungen zu Ihren Favoriten hinzufügen, um schnell auf sie zugreifen zu können.'
    },
    {
      question: 'Wie kann ich Statistiken einsehen?',
      answer: 'Als Amtsleitung haben Sie Zugriff auf umfassende Statistiken und Berichte im Bereich "Statistiken".'
    }
  ];
  
  const filteredFaqItems = searchQuery
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {t('navigation.help')}
          </h1>
          
          <div className="mb-6">
            <div className="sm:hidden">
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="faq">FAQ</option>
                <option value="contact">Kontakt</option>
                <option value="documentation">Dokumentation</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    className={`${
                      activeTab === 'faq'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('faq')}
                  >
                    FAQ
                  </button>
                  <button
                    className={`${
                      activeTab === 'contact'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('contact')}
                  >
                    Kontakt
                  </button>
                  <button
                    className={`${
                      activeTab === 'documentation'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('documentation')}
                  >
                    Dokumentation
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {activeTab === 'faq' && (
            <div>
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Suche in FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              {filteredFaqItems.length === 0 ? (
                <p className="text-gray-500">Keine Ergebnisse gefunden.</p>
              ) : (
                <div className="space-y-4">
                  {filteredFaqItems.map((item, index) => (
                    <Card key={index} className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-500">
                        {item.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'contact' && (
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Kontakt
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Support
                  </h3>
                  <p className="text-gray-500 mb-2">
                    Bei Fragen oder Problemen können Sie uns kontaktieren:
                  </p>
                  <p className="text-gray-900">
                    E-Mail: support@freiplatzfinder.de<br />
                    Telefon: +49 123 456789<br />
                    Montag - Freitag, 9:00 - 17:00 Uhr
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Nachricht senden
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="E-Mail"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Nachricht"
                        rows={4}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Button type="submit">
                        Senden
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'documentation' && (
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Dokumentation
              </h2>
              
              <div className="prose max-w-none">
                <p>
                  Willkommen bei der Dokumentation von Freiplatzfinder. Hier finden Sie ausführliche Informationen zur Nutzung der Plattform.
                </p>
                
                <h3>Für Fallmanager</h3>
                <ul>
                  <li>Suche nach freien Plätzen</li>
                  <li>Verwaltung von Favoriten</li>
                  <li>Filterung nach verschiedenen Kriterien</li>
                  <li>Detailansicht von Einrichtungen</li>
                </ul>
                
                <h3>Für Träger</h3>
                <ul>
                  <li>Verwaltung von Einrichtungen</li>
                  <li>Aktualisierung von Verfügbarkeiten</li>
                  <li>Hochladen von Bildern</li>
                  <li>Einsicht in Statistiken</li>
                </ul>
                
                <h3>Für Amtsleitung</h3>
                <ul>
                  <li>Zugriff auf umfassende Statistiken</li>
                  <li>Generierung von Berichten</li>
                  <li>Überwachung der Belegungssituation</li>
                </ul>
                
                <p>
                  Für detailliertere Informationen können Sie die vollständige Dokumentation als PDF herunterladen.
                </p>
                
                <div className="mt-4">
                  <Button variant="outline">
                    Dokumentation herunterladen
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
