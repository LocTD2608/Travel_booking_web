/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    price: number;
    seatClass: string;
    availableSeats: number;
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    address: string;
    rating: number;
    pricePerNight: number;
    checkIn: string;
    checkOut: string;
    rooms: number;
    amenities: string[];
    image?: string;
}

export interface Bus {
    id: string;
    company: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    seatType: string;
    availableSeats: number;
}

export type BookingStep = 'search' | 'select' | 'details' | 'payment' | 'confirmation';

interface BookingContextType {
    // Selected items
    selectedFlight: Flight | null;
    selectedHotel: Hotel | null;
    selectedBus: Bus | null;

    // Booking flow
    currentStep: BookingStep;

    // Actions
    selectFlight: (flight: Flight) => void;
    selectHotel: (hotel: Hotel) => void;
    selectBus: (bus: Bus) => void;

    clearFlight: () => void;
    clearHotel: () => void;
    clearBus: () => void;
    clearAll: () => void;

    setStep: (step: BookingStep) => void;
    nextStep: () => void;
    previousStep: () => void;

    // Computed
    getTotalPrice: () => number;
    hasSelections: () => boolean;
}

// Create Context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider Component
export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [currentStep, setCurrentStep] = useState<BookingStep>('search');

    const selectFlight = (flight: Flight) => {
        setSelectedFlight(flight);
    };

    const selectHotel = (hotel: Hotel) => {
        setSelectedHotel(hotel);
    };

    const selectBus = (bus: Bus) => {
        setSelectedBus(bus);
    };

    const clearFlight = () => {
        setSelectedFlight(null);
    };

    const clearHotel = () => {
        setSelectedHotel(null);
    };

    const clearBus = () => {
        setSelectedBus(null);
    };

    const clearAll = () => {
        setSelectedFlight(null);
        setSelectedHotel(null);
        setSelectedBus(null);
        setCurrentStep('search');
    };

    const setStep = (step: BookingStep) => {
        setCurrentStep(step);
    };

    const steps: BookingStep[] = ['search', 'select', 'details', 'payment', 'confirmation'];

    const nextStep = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const previousStep = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const getTotalPrice = (): number => {
        let total = 0;
        if (selectedFlight) total += selectedFlight.price;
        if (selectedHotel) {
            const nights = selectedHotel.checkOut && selectedHotel.checkIn
                ? Math.ceil((new Date(selectedHotel.checkOut).getTime() - new Date(selectedHotel.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                : 1;
            total += selectedHotel.pricePerNight * nights * selectedHotel.rooms;
        }
        if (selectedBus) total += selectedBus.price;
        return total;
    };

    const hasSelections = (): boolean => {
        return !!(selectedFlight || selectedHotel || selectedBus);
    };

    const value: BookingContextType = {
        selectedFlight,
        selectedHotel,
        selectedBus,
        currentStep,
        selectFlight,
        selectHotel,
        selectBus,
        clearFlight,
        clearHotel,
        clearBus,
        clearAll,
        setStep,
        nextStep,
        previousStep,
        getTotalPrice,
        hasSelections,
    };

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// Custom Hook
export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};
