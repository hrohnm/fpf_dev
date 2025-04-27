import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Logo from '../../components/common/Logo';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'));
      return;
    }
    
    if (password.length < 8) {
      setError(t('errors.passwordTooShort'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call an API to reset the password
      
      setIsSubmitted(true);
      showNotification({
        type: 'success',
        message: t('auth.passwordResetSuccess')
      });
    } catch (err) {
      setError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="flex flex-col items-center">
          <Logo className="h-12 w-auto mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('auth.resetPassword')}
          </h2>
        </div>
        
        {!token && (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <p className="font-bold">{t('common.error')}</p>
              <p>{t('errors.invalidCredentials')}</p>
            </div>
            <div className="mt-6">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>
        )}
        
        {token && isSubmitted ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <p className="font-bold">{t('common.success')}</p>
              <p>{t('auth.passwordResetSuccess')}</p>
            </div>
            <div className="mt-6">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t('auth.login')}
              </Link>
            </div>
          </div>
        ) : token && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.newPassword')}
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.newPassword')}
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
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPassword')}
                  className="rounded-md"
                />
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('auth.resetPassword')}
              </Button>
            </div>
            
            <div className="text-center">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t('common.back')} {t('auth.login')}
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
