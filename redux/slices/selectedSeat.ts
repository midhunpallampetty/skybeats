import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Seat {
  row: number;
  col: number;
  class: string;
  _id: string;
  price:number;
}

interface SelectedSeatsState {
  selectedSeats: Seat[];  // Allow multiple seat selections
}

const initialState: SelectedSeatsState = {
  selectedSeats: [],  // Start with no seats selected
};

const selectedSeatsSlice = createSlice({
  name: 'selectedSeats',
  initialState,
  reducers: {
    setSelectedSeat: (state, action: PayloadAction<Seat>) => {
      // Check if the seat is already selected
      const seatExists = state.selectedSeats.find(seat => seat._id === action.payload._id);
      
      if (seatExists) {
        // If the seat is already selected, remove it (deselect)
        state.selectedSeats = state.selectedSeats.filter(seat => seat._id !== action.payload._id);
      } else {
        // Otherwise, add the seat to the selectedSeats array
        state.selectedSeats.push(action.payload);
      }
    },

    clearSelectedSeat: (state) => {
      // Clear all selected seats
      state.selectedSeats = [];
    },

    clearSpecificSeat: (state, action: PayloadAction<string>) => {
      // Remove the seat by its _id
      state.selectedSeats = state.selectedSeats.filter(seat => seat._id !== action.payload);
    },
  },
});

export const { setSelectedSeat, clearSelectedSeat, clearSpecificSeat } = selectedSeatsSlice.actions;
export default selectedSeatsSlice.reducer;
