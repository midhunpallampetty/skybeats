import { createSlice ,PayloadAction} from '@reduxjs/toolkit';
import { JobState } from '@/interfaces/JobState';
const initialState :JobState= {
  selectedJob: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
});

export const { setSelectedJob, clearSelectedJob } = jobSlice.actions;

export default jobSlice.reducer;
