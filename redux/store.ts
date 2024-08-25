import {configureStore} from  '@reduxjs/toolkit';
import airportsReducer from './slices/airportsSlice';
import flightsReducer from './slices/flightsSlice';
import seatReducer from './slices/seatSlice';
import bookdetailReducer from './slices/bookdetailSlice';
import bookHotelReducer from './slices/bookHotelSlice';
export const store=configureStore({
    reducer:{
        airports:airportsReducer,
        flights:flightsReducer,
        seats:seatReducer,
        bookdetail: bookdetailReducer,
        hotels:bookHotelReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;