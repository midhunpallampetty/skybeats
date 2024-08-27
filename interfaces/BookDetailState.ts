import { Flight } from "./flight";

// Represents the overall state for booking details
export interface BookDetailState {
  selectedFlight: Flight | null;
  passengerDetails: PassengerDetails[]; 
  guestDetails:PassengerDetails[] // Stores the detailed passenger information
}



export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
