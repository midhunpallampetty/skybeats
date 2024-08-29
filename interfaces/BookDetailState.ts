import { Flight } from "./flight";

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
