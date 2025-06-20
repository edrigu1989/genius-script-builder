import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('settings.description')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t('settings.basic_config')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('settings.basic_config_desc')}
          </p>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.full_name')}
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('settings.full_name_placeholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.email')}
              </label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('settings.email_placeholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.preferred_language')}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="es">{t('settings.spanish')}</option>
                <option value="en">{t('settings.english')}</option>
                <option value="pt">{t('settings.portuguese')}</option>
              </select>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              {t('settings.save_changes')}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

