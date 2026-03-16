/**
 * 📚 EXAMPLE: Cách sử dụng SearchContext và BookingContext
 * 
 * File này chỉ để tham khảo, KHÔNG chạy trong production
 */

import React from 'react';
import { useSearch, useBooking } from '../context';

// ========================================
// EXAMPLE 1: Sử dụng SearchContext
// ========================================
export const SearchExample: React.FC = () => {
    const { searchParams, setSearchParams, filters, setFilters } = useSearch();

    const handleSearch = () => {
        // User nhập form search
        setSearchParams({
            type: 'flight',
            from: 'Hà Nội',
            to: 'Sài Gòn',
            departureDate: '2026-02-15',
            passengers: 2,
            seatClass: 'economy'
        });
    };

    const handleFilter = () => {
        // User chọn filters
        setFilters({
            priceRange: [500000, 2000000],
            rating: 4,
            airline: ['Vietnam Airlines', 'VietJet'],
            sortBy: 'price',
            sortOrder: 'asc'
        });
    };

    return (
        <div>
            <h2>Search Example</h2>
            <button onClick={handleSearch}>Set Search Params</button>
            <button onClick={handleFilter}>Apply Filters</button>

            <div>
                <h3>Current Search:</h3>
                <p>From: {searchParams.from}</p>
                <p>To: {searchParams.to}</p>
                <p>Passengers: {searchParams.passengers}</p>
            </div>

            <div>
                <h3>Current Filters:</h3>
                <p>Price Range: {filters.priceRange?.join(' - ')}</p>
                <p>Min Rating: {filters.rating}</p>
                <p>Airlines: {filters.airline?.join(', ')}</p>
            </div>
        </div>
    );
};

// ========================================
// EXAMPLE 2: Sử dụng BookingContext
// ========================================
export const BookingExample: React.FC = () => {
    const {
        selectedFlight,
        selectedHotel,
        selectFlight,
        selectHotel,
        getTotalPrice,
        currentStep,
        nextStep,
        clearAll
    } = useBooking();

    const handleSelectFlight = () => {
        // User chọn vé máy bay từ danh sách
        selectFlight({
            id: 'VN123',
            airline: 'Vietnam Airlines',
            flightNumber: 'VN123',
            from: 'HAN',
            to: 'SGN',
            departureTime: '2026-02-15T08:00:00',
            arrivalTime: '2026-02-15T10:15:00',
            duration: 135,
            price: 1500000,
            seatClass: 'Economy',
            availableSeats: 42
        });
    };

    const handleSelectHotel = () => {
        // User chọn khách sạn
        selectHotel({
            id: 'HOTEL001',
            name: 'Reverie Saigon',
            location: 'Quận 1, TP.HCM',
            address: '22-36 Nguyễn Huệ',
            rating: 5,
            pricePerNight: 3000000,
            checkIn: '2026-02-15',
            checkOut: '2026-02-17',
            rooms: 1,
            amenities: ['Pool', 'Spa', 'Restaurant']
        });
    };

    const handleCheckout = () => {
        // Chuyển sang bước thanh toán
        nextStep();
    };

    const handleCancelBooking = () => {
        // Hủy toàn bộ booking
        clearAll();
    };

    return (
        <div>
            <h2>Booking Example</h2>

            <div>
                <h3>Bước hiện tại: {currentStep}</h3>
            </div>

            <button onClick={handleSelectFlight}>Chọn Vé Bay</button>
            <button onClick={handleSelectHotel}>Chọn Khách Sạn</button>
            <button onClick={handleCheckout}>Tiếp tục thanh toán</button>
            <button onClick={handleCancelBooking}>Hủy Booking</button>

            {selectedFlight && (
                <div>
                    <h3>✈️ Vé đã chọn:</h3>
                    <p>{selectedFlight.airline} - {selectedFlight.flightNumber}</p>
                    <p>{selectedFlight.from} → {selectedFlight.to}</p>
                    <p>{selectedFlight.price.toLocaleString()} VNĐ</p>
                </div>
            )}

            {selectedHotel && (
                <div>
                    <h3>🏨 Khách sạn đã chọn:</h3>
                    <p>{selectedHotel.name}</p>
                    <p>{selectedHotel.location}</p>
                    <p>{selectedHotel.pricePerNight.toLocaleString()} VNĐ/đêm</p>
                </div>
            )}

            <div>
                <h3>💰 Tổng tiền: {getTotalPrice().toLocaleString()} VNĐ</h3>
            </div>
        </div>
    );
};

// ========================================
// EXAMPLE 3: Kết hợp cả hai Context
// ========================================
export const CombinedExample: React.FC = () => {
    const { searchParams } = useSearch();
    const { selectedFlight, getTotalPrice, hasSelections } = useBooking();

    return (
        <div>
            <h2>Combined Context Example</h2>

            {/* Hiển thị thông tin search */}
            <div>
                <p>Đang tìm: {searchParams.from} → {searchParams.to}</p>
                <p>Số khách: {searchParams.passengers}</p>
            </div>

            {/* Hiển thị booking đã chọn */}
            {hasSelections() && (
                <div>
                    <h3>Đã chọn:</h3>
                    {selectedFlight && <p>✈️ {selectedFlight.airline}</p>}
                    <p>💰 Tổng: {getTotalPrice().toLocaleString()} VNĐ</p>
                </div>
            )}
        </div>
    );
};
