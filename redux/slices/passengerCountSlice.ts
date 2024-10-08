import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the passenger interface
interface Passenger {
  adults: number;
  seniors: number;
  children: number;
  infants: number;
}

// Define the passengerOptions interface, with the selectedPassenger state
interface PassengerOptions {
  selectedPassenger: Passenger | null;
}

const initialState: PassengerOptions = {
  selectedPassenger: null,
};

// Create the slice
const flightPassengerSlice = createSlice({
  name: "passengerCount",
  initialState,
  reducers: {
    setSelectedPassengers:(state, action: PayloadAction<Passenger>)=> {
      state.selectedPassenger = action.payload;
    },
  },
});

// Export the action and reducer
export const { setSelectedPassengers } = flightPassengerSlice.actions;
export default flightPassengerSlice.reducer;





