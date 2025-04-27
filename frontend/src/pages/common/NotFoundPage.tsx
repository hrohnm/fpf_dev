import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          {t('errors.notFound')}
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Die angeforderte Seite konnte nicht gefunden werden.
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

export default NotFoundPage;
