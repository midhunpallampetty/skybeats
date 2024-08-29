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
    setBookDetail(state, action: PayloadAction<Flight>) {
      state.selectedFlight = action.payload;
    },
    setPassengerDetails: (state, action: PayloadAction<PassengerDetails>) => {
      state.passengerDetails = [...state.passengerDetails, action.payload];
    },
    setGuestDetails: (state, action: PayloadAction<PassengerDetails>) => {
      state.guestDetails = [...state.passengerDetails, action.payload];
    },
  
    clearBookDetail(state) {
      state.selectedFlight = null;
      state.passengerDetails = []; 
    },
  },
});

export const { setBookDetail, clearBookDetail,setGuestDetails,setPassengerDetails } = bookdetailSlice.actions;

export default bookdetailSlice.reducer;
