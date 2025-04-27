import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Layout from '../../components/layout/Layout';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call an API to update the user profile
      
      showNotification({
        type: 'success',
        message: 'Profil erfolgreich aktualisiert'
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
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {t('navigation.profile')}
          </h1>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold mb-4">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-gray-500">{t(`user.roles.${user?.role}`)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('user.lastLogin')}: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('user.userDetails')}
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        {t('user.firstName')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        {t('user.lastName')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('user.email')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      {t('common.save')}
                    </Button>
                  </div>
                </form>
              </Card>
              
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('auth.changePassword')}
                </h3>
                
                <form>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        {t('auth.oldPassword')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        {t('auth.newPassword')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        {t('auth.confirmPassword')}
                      </label>
                      <div className="mt-1">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      {t('auth.changePassword')}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
