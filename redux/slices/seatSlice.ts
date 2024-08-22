// store/seatsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Seat {
  aircraftID: string;
  class: string;
  col: string;
  isBooked: boolean;
  row: number;
  x: number;
  y: number;
}

interface SeatsState {
  seats: Seat[];
}

const initialState: SeatsState = {
  seats: [],
};

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    setSeats: (state, action: PayloadAction<Seat[]>) => {
      state.seats = action.payload;
    },
  },
});

export const { setSeats } = seatsSlice.actions;
export default seatsSlice.reducer;
