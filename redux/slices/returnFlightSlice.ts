import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from "@/interfaces/flight";

interface ReturnFlightsState {
  selectedReturnFlight: Flight | null;
}

const initialState: ReturnFlightsState = {
  selectedReturnFlight: null,
};

const returnFlightsSlice = createSlice({
  name: 'returnFlights',
  initialState,
  reducers: {
    selectReturnFlight: (state, action: PayloadAction<Flight>) => {
      state.selectedReturnFlight = action.payload;
    },
    clearSelectedReturnFlight: (state) => {
      state.selectedReturnFlight = null;
    }
  }
});

export const { selectReturnFlight, clearSelectedReturnFlight } = returnFlightsSlice.actions;
export default returnFlightsSlice.reducer;
