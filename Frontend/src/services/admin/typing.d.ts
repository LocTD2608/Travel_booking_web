export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seats: number;
  status: 'active' | 'cancelled' | 'delayed';
}

export interface Room {
  id: string;
  roomNumber: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Executive Suite' | 'Presidential';
  status: 'available' | 'occupied' | 'maintenance';
  pricePerNight: number;
  capacity: number;
}

export interface Accommodation {
  id: string;
  name: string;
  location: string;
  type: string;
  rating: number;
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
  status: 'active' | 'inactive';
  imageUrl?: string;
  description?: string;
  rooms?: Room[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  type: 'flight' | 'hotel';
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface CancellationRequest {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  bookingType: 'flight' | 'hotel' | 'tour';
  bookingDetail: string;
  bookingClass?: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface OverviewStats {
  totalRevenue: number;
  totalBookings: number;
  activeFlights: number;
  pendingRequests: number;
  revenueChange: number;
  bookingsChange: number;
}
