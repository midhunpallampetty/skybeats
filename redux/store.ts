import {configureStore} from  '@reduxjs/toolkit';
import airportsReducer from './slices/airportsSlice';
import flightsReducer from './slices/flightsSlice';
export const store=configureStore({
    reducer:{
        airports:airportsReducer,
        flights:flightsReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;