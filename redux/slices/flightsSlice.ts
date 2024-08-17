import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Flight } from "@/interfaces/flight";
import { FlightsState } from "@/interfaces/flightState";
const initialState:FlightsState={
    flights:[],
};
const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
      setFlights: (state, action: PayloadAction<Flight[]>) => {
        state.flights = action.payload;
      },
      addFlight: (state, action: PayloadAction<Flight>) => {
        state.flights.push(action.payload);
      },
      clearFlights: (state) => {
        state.flights = [];
      },
    },
  });


  export const {setFlights,addFlight,clearFlights}=flightsSlice.actions;
  export default flightsSlice.reducer;
