// ─── Flight ──────────────────────────────────────────────────────────────────
export interface FlightResult {
    MaChuyenBay: number;
    from_code: string;
    from_name: string;
    to_code: string;
    to_name: string;
    HangBay: string;   // Hãng bay
    HangGhe: string;   // Economy / Business / First
    price: number;
    departure_time: string;
    arrival_time: string;
}

export interface FlightFilters {
    from?: string;
    to?: string;
    date?: string;
    passengers?: string;
    priceMax?: string;
    sortBy?: string;
}

// ─── Hotel ───────────────────────────────────────────────────────────────────
export interface HotelResult {
    MaKS: number;
    name: string;
    address: string;
    stars: number;
    min_price: number;
}

export interface HotelFilters {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    rating?: string;
    sortBy?: string;
}

// ─── Train ───────────────────────────────────────────────────────────────────
export interface TrainResult {
    MaDV: number;
    description: string;
    price: number;
    unit: string;
    from: string;
    to: string;
    seat_type: string;
}

export interface TrainFilters {
    from?: string;
    to?: string;
    date?: string;
    priceMax?: string;
    sortBy?: string;
}

// ─── Experience ──────────────────────────────────────────────────────────────
export interface ExperienceResult {
    MaDV: number;
    description: string;
    price: number;
    unit: string;
    pickup: string;
    attraction: string;
}

export interface ExperienceFilters {
    destination?: string;
    date?: string;
    priceMax?: string;
    sortBy?: string;
}

export interface DestinationResult {
    id: number;
    name: string;
    subtitle: string;
    price: string;
    rating: number;
    image: string;
}

// ─── Generic API response ────────────────────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    message?: string;
}

export interface SingleResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ─── Hotel Detail ─────────────────────────────────────────────────────────────
export interface RoomTypeInfo {
    roomTypeId: number;
    name: string;
    price: number;
    maxGuests: number;
}

export interface HotelDetailResult {
    hotel: {
        id: number;
        name: string;
        address: string;
        stars: number;
    };
    rooms: RoomTypeInfo[];
    reviews: Array<{
        rating: number;
        comment: string;
        date: string;
        userName: string;
    }>;
}

export interface GuestSelection {
    adults: number;
    children: number;
    rooms: number;
}
