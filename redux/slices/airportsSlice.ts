import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Flight {
  value: string;
  label: string;
}

interface AirportsState {
  airports: Flight[];
  filteredAirports: Flight[];
}

const initialState: AirportsState = {
  airports: [],
  filteredAirports: [],
};

const airportsSlice = createSlice({
  name: 'airports',
  initialState,
  reducers: {
    setAirports: (state, action: PayloadAction<Flight[]>) => {
      state.airports = action.payload;
    },
    setFilteredAirports: (state, action: PayloadAction<Flight[]>) => {
      state.filteredAirports = action.payload;
    },
  },
});

export const { setAirports, setFilteredAirports } = airportsSlice.actions;
export default airportsSlice.reducer;
