import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export interface SearchParams {
    type: 'flight' | 'hotel' | 'bus' | 'transfer' | 'car' | null;
    from?: string;
    to?: string;
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
    adults?: number;
    children?: number;
    rooms?: number;
    seatClass?: 'economy' | 'business' | 'first';
}

export interface SearchFilters {
    priceRange?: [number, number];
    rating?: number;
    airline?: string[];
    hotelType?: string[];
    amenities?: string[];
    sortBy?: 'price' | 'rating' | 'duration' | 'departure';
    sortOrder?: 'asc' | 'desc';
}

interface SearchContextType {
    searchParams: SearchParams;
    filters: SearchFilters;
    setSearchParams: (params: Partial<SearchParams>) => void;
    setFilters: (filters: Partial<SearchFilters>) => void;
    resetSearch: () => void;
    resetFilters: () => void;
}

// Default values
const defaultSearchParams: SearchParams = {
    type: null,
    passengers: 1,
    adults: 1,
    children: 0,
    rooms: 1,
};

const defaultFilters: SearchFilters = {
    sortBy: 'price',
    sortOrder: 'asc',
};

// Create Context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider Component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchParams, setSearchParamsState] = useState<SearchParams>(defaultSearchParams);
    const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);

    const setSearchParams = (params: Partial<SearchParams>) => {
        setSearchParamsState((prev) => ({ ...prev, ...params }));
    };

    const setFilters = (newFilters: Partial<SearchFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    };

    const resetSearch = () => {
        setSearchParamsState(defaultSearchParams);
    };

    const resetFilters = () => {
        setFiltersState(defaultFilters);
    };

    const value: SearchContextType = {
        searchParams,
        filters,
        setSearchParams,
        setFilters,
        resetSearch,
        resetFilters,
    };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

// Custom Hook
export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
};
