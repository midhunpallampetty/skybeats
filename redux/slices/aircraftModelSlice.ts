// redux/slices/aircraftModelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AircraftModelState {
  aircraftModel: string | null;
}

const initialState: AircraftModelState = {
  aircraftModel: null,  // Initial state
};

const aircraftModelSlice = createSlice({
  name: 'aircraftModel',
  initialState,
  reducers: {
    setAircraftModel: (state, action: PayloadAction<string>) => {
      state.aircraftModel = action.payload;
    },
    clearAircraftModel: (state) => {
      state.aircraftModel = null;
    },
  },
});

export const { setAircraftModel, clearAircraftModel } = aircraftModelSlice.actions;

export default aircraftModelSlice.reducer; // Correctly exporting reducer
