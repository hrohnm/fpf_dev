import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ErrorPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || t('errors.serverError');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-extrabold text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          {t('common.error')}
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          {errorMessage}
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>
              {t('common.back')} {t('navigation.home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
