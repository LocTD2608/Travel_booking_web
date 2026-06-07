/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from './translations';
import type { Language } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
    translateGuests: (guestsStr: string) => string;
    translatePassengers: (passengersStr: string) => string;
    translateRating: (ratingStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = localStorage.getItem('preferred_language');
        if (stored === 'vi' || stored === 'en') {
            return stored as Language;
        }
        return 'vi'; // default language is Vietnamese
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('preferred_language', lang);
    };

    const t = (key: string, defaultValue?: string): string => {
        const dictionary = translations[language];
        if (dictionary && dictionary[key]) {
            return dictionary[key];
        }
        return defaultValue !== undefined ? defaultValue : key;
    };

    // Keep HTML lang attribute in sync
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const translateGuests = (guestsStr: string): string => {
        if (!guestsStr) return '';
        const key = 'guests.' + guestsStr.toLowerCase().replace(/[^a-z0-9]/g, '');
        const translated = t(key);
        if (translated !== key) return translated;
        return guestsStr;
    };

    const translatePassengers = (passengersStr: string): string => {
        if (!passengersStr) return '';
        if (passengersStr.toLowerCase().includes('1 adult')) {
            return t('passengers.1passenger', '1 Passenger, Economy');
        }
        const match = passengersStr.match(/^(\d+)/);
        if (match) {
            const num = match[1];
            const key = `passengers.${num}passengers`;
            const translated = t(key);
            if (translated !== key) return translated;
        }
        return passengersStr;
    };

    const translateRating = (ratingStr: string): string => {
        if (!ratingStr) return '';
        const lower = ratingStr.toLowerCase().trim();
        if (lower === 'tuyệt vời' || lower === 'excellent') return t('rating.excellent', 'Tuyệt vời');
        if (lower === 'exceptional' || lower === 'ngoại hạng') return t('rating.exceptional', 'Ngoại hạng');
        if (lower === 'superb' || lower === 'tuyệt hảo') return t('rating.superb', 'Tuyệt hảo');
        if (lower === 'very good' || lower === 'rất tốt') return t('rating.veryGood', 'Rất tốt');
        if (lower === 'good' || lower === 'tốt') return t('rating.good', 'Tốt');
        if (lower === 'pleasant' || lower === 'được chấp nhận') return t('rating.pleasant', 'Được chấp nhận');
        if (lower === 'poor' || lower === 'cần cải thiện') return t('rating.poor', 'Cần cải thiện');
        return ratingStr;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translateGuests, translatePassengers, translateRating }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
