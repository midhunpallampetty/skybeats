import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '@/interfaces/flight';
import { BookDetailState, PassengerDetails } from '@/interfaces/BookDetailState';

const initialState: BookDetailState = {
  selectedFlight: null,
  passengerDetails: [], // Initialize with an empty array
};

const bookdetailSlice = createSlice({
  name: 'bookdetail',
  initialState,
  reducers: {
    setBookDetail(state, action: PayloadAction<Flight>) {
      state.selectedFlight = action.payload;
    },
    setPassengerDetails: (state, action: PayloadAction<PassengerDetails>) => {
      state.passengerDetails = [...state.passengerDetails, action.payload];
    },
  
    clearBookDetail(state) {
      state.selectedFlight = null;
      state.passengerDetails = []; // Clear passenger details as well
    },
  },
});

export const { setBookDetail, clearBookDetail,setPassengerDetails } = bookdetailSlice.actions;

export default bookdetailSlice.reducer;
