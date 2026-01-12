export enum FlightStatus {
    ON_TIME = 'ON_TIME',
    DELAYED = 'DELAYED',
    CANCELLED = 'CANCELLED'
  }
  
  export interface FlightDetails {
    flightNumber: string;
    date: string;
    airline: string;
    departure: string;
    arrival: string;
    status: FlightStatus;
    delayDurationMinutes: number;
    distanceKm: number;
    // New enhanced fields
    scheduledDepartureTime?: string;
    scheduledArrivalTime?: string;
    delayReason?: string;
  }
  
  export interface PassengerDetails {
    firstName: string;
    lastName: string;
    bookingReference: string;
    email: string;
  }
  
  export interface ClaimEstimate {
    eligible: boolean;
    amount: number;
    currency: string;
    regulation: string; // "EU 261/2004" or "UK 261"
  }
  
  export enum AppStep {
    SEARCH = 'SEARCH',
    VERIFY = 'VERIFY',
    ELIGIBILITY = 'ELIGIBILITY',
    PAYMENT = 'PAYMENT',
    GENERATING = 'GENERATING',
    SUCCESS = 'SUCCESS'
  }