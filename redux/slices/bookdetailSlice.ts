import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '@/interfaces/flight';
import { BookDetailState, PassengerDetails } from '@/interfaces/BookDetailState';

const initialState: BookDetailState = {
  selectedFlight: null,
  passengerDetails: [], 
  guestDetails: [],
};

const bookdetailSlice = createSlice({
  name: 'bookdetail',
  initialState,
  reducers: {
    // Set selected flight details
    setBookDetail(state, action: PayloadAction<Flight>) {
      state.selectedFlight = action.payload;
    },

    // Set passenger details, allowing batch updates for multiple passengers
    setPassengerDetails: (state, action: PayloadAction<PassengerDetails[]>) => {
      state.passengerDetails = action.payload;
    },

    // Add or update a single passenger by index
    updatePassengerDetails: (
      state,
      action: PayloadAction<{ index: number; details: PassengerDetails }>
    ) => {
      const { index, details } = action.payload;
      if (index >= 0 && index < state.passengerDetails.length) {
        state.passengerDetails[index] = details;
      }
    },

    // Set guest details, allowing batch updates for multiple guests
    setGuestDetails: (state, action: PayloadAction<PassengerDetails[]>) => {
      state.guestDetails = action.payload;
    },

    // Add or update a single guest by index
    updateGuestDetails: (
      state,
      action: PayloadAction<{ index: number; details: PassengerDetails }>
    ) => {
      const { index, details } = action.payload;
      if (index >= 0 && index < state.guestDetails.length) {
        state.guestDetails[index] = details;
      }
    },

    // Clear both passenger and flight details when booking is reset
    clearBookDetail(state) {
      state.selectedFlight = null;
      state.passengerDetails = [];
      state.guestDetails = [];
    },
  },
});

export const {
  setBookDetail,
  clearBookDetail,
  setGuestDetails,
  setPassengerDetails,
  updatePassengerDetails,
  updateGuestDetails,
} = bookdetailSlice.actions;

export default bookdetailSlice.reducer;
