import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Seat {
  row: number;
  col: number;
  class: string;
  _id:String;
}

interface SelectedSeatsState {
  selectedSeat: Seat | null;  // Change to a single seat instead of an array
}

const initialState: SelectedSeatsState = {
  selectedSeat: null,  // Only one seat can be selected
};

const selectedSeatsSlice = createSlice({
  name: 'selectedSeats',
  initialState,
  reducers: {
    setSelectedSeat: (state, action: PayloadAction<Seat>) => {
      state.selectedSeat = action.payload;  // Replace any previously selected seat
    },
    
    clearSelectedSeat: (state) => {
      state.selectedSeat = null;  // Clear the selected seat
    },
  },
});

export const { setSelectedSeat, clearSelectedSeat } = selectedSeatsSlice.actions;
export default selectedSeatsSlice.reducer;
