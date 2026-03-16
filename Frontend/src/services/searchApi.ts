import type {
    FlightResult, FlightFilters,
    HotelResult, HotelFilters,
    TrainResult, TrainFilters,
    ExperienceResult, ExperienceFilters,
    ApiResponse,
} from '../types/search';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Xây URLSearchParams từ object, bỏ qua các key undefined/rỗng */
function buildParams(obj: Record<string, string | undefined>): string {
    const p = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
        if (v !== undefined && v !== '') p.set(k, v);
    });
    const s = p.toString();
    return s ? `?${s}` : '';
}

// ─── Flights ─────────────────────────────────────────────────────────────────
export async function fetchFlights(filters: FlightFilters): Promise<ApiResponse<FlightResult>> {
    const url = `${BASE_URL}/search/flights${buildParams(filters as Record<string, string>)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    return res.json();
}

// ─── Hotels ──────────────────────────────────────────────────────────────────
export async function fetchHotels(filters: HotelFilters): Promise<ApiResponse<HotelResult>> {
    const url = `${BASE_URL}/search/hotels${buildParams(filters as Record<string, string>)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    return res.json();
}

// ─── Trains ──────────────────────────────────────────────────────────────────
export async function fetchTrains(filters: TrainFilters): Promise<ApiResponse<TrainResult>> {
    const url = `${BASE_URL}/search/trains${buildParams(filters as Record<string, string>)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    return res.json();
}

// ─── Experiences ─────────────────────────────────────────────────────────────
export async function fetchExperiences(filters: ExperienceFilters): Promise<ApiResponse<ExperienceResult>> {
    const url = `${BASE_URL}/search/experiences${buildParams(filters as Record<string, string>)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    return res.json();
}
