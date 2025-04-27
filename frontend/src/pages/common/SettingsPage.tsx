import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Layout from '../../components/layout/Layout';
import Toggle from '../../components/ui/Toggle';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { showNotification } = useNotification();
  
  const [language, setLanguage] = useState(i18n.language);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifyOnNewAvailability, setNotifyOnNewAvailability] = useState(true);
  const [notifyOnAvailabilityChange, setNotifyOnAvailabilityChange] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update language
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
      
      // In a real app, you would call an API to update the user settings
      
      showNotification({
        type: 'success',
        message: t('settings.settingsSaved')
      });
    } catch (err) {
      showNotification({
        type: 'error',
        message: t('errors.serverError')
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetSettings = () => {
    setLanguage('de');
    setTheme('light');
    setEmailNotifications(true);
    setPushNotifications(true);
    setNotifyOnNewAvailability(true);
    setNotifyOnAvailabilityChange(true);
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {t('navigation.settings')}
          </h1>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('settings.general')}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.language')}
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('settings.appearance')}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.theme')}
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className={`relative px-4 py-3 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        theme === 'light' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 text-gray-700'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      {t('settings.lightMode')}
                    </button>
                    <button
                      type="button"
                      className={`relative px-4 py-3 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        theme === 'dark' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 text-gray-700'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      {t('settings.darkMode')}
                    </button>
                    <button
                      type="button"
                      className={`relative px-4 py-3 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        theme === 'system' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 text-gray-700'
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      {t('settings.systemMode')}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {t('settings.notifications')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {t('settings.emailNotifications')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Erhalten Sie Benachrichtigungen per E-Mail
                    </p>
                  </div>
                  <Toggle
                    enabled={emailNotifications}
                    setEnabled={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {t('settings.pushNotifications')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Erhalten Sie Benachrichtigungen im Browser
                    </p>
                  </div>
                  <Toggle
                    enabled={pushNotifications}
                    setEnabled={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {t('settings.notifyOnNewAvailability')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Benachrichtigung, wenn neue Plätze verfügbar werden
                    </p>
                  </div>
                  <Toggle
                    enabled={notifyOnNewAvailability}
                    setEnabled={setNotifyOnNewAvailability}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {t('settings.notifyOnAvailabilityChange')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Benachrichtigung, wenn sich die Verfügbarkeit ändert
                    </p>
                  </div>
                  <Toggle
                    enabled={notifyOnAvailabilityChange}
                    setEnabled={setNotifyOnAvailabilityChange}
                  />
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleResetSettings}
            >
              {t('settings.resetSettings')}
            </Button>
            <Button
              onClick={handleSaveSettings}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {t('settings.saveSettings')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
