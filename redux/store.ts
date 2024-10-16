import {configureStore} from  '@reduxjs/toolkit';
import airportsReducer from './slices/airportsSlice';
import flightsReducer from './slices/flightsSlice';
import seatReducer from './slices/seatSlice';
import bookdetailReducer from './slices/bookdetailSlice';
import bookHotelReducer from './slices/bookHotelSlice';
import hotelBookDetailReducer from './slices/hotelBookDetailSlice';
import hotelUserReducer from './slices/hotelUserSlice';
import hotelGuestReducer from './slices/hotelGuestSlice';
import selectedSeatsReducer from './slices/selectedSeat';
import jobReducer from './slices/jobSlice'
import bookDateReducer from './slices/bookDate'
import returnDateReducer from './slices/returnDate'
import  passengerCountReducer  from './slices/passengerCountSlice'
import aircraftModelReducer from './slices/aircraftModelSlice';
export const store=configureStore({
    reducer:{
        airports:airportsReducer,
        flights:flightsReducer,
        seats:seatReducer,
        bookdetail: bookdetailReducer,
        selectedSeats: selectedSeatsReducer,
        hotelOptions:bookHotelReducer,
        hotelBookDetail:hotelBookDetailReducer,
        hotelBookUserData:hotelUserReducer,
        hotelGuestData:hotelGuestReducer,
        job: jobReducer,
        bookDate:bookDateReducer,
        returnDate:returnDateReducer,
        passengerCount:passengerCountReducer,
        aircraftModel: aircraftModelReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;