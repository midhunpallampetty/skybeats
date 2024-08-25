import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
 import { hotelState } from "@/interfaces/hotelInterfaces";
import { Hotel } from "@/interfaces/hotelInterfaces";
const initialState:hotelState={
    hotels :[],
}
const bookHotelSlice=createSlice({
name:'hotels',
initialState,
reducers:{
    setHotels:(state,action:PayloadAction<Hotel[]>)=>{
        state.hotels=action.payload;
    }
}
});
export const {setHotels}=bookHotelSlice.actions;
export default bookHotelSlice.reducer;
