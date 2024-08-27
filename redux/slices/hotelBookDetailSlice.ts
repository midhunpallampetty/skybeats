import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Hotel } from "@/interfaces/hotelInterfaces";
export interface hotelBookDetailState {
    selectedHotel: Hotel | null;
  }
const initialState:hotelBookDetailState={
    selectedHotel:null,
};
const hotelBookDetailSlice=createSlice({
    name:'hotelbookdetail',
    initialState,
    reducers:{
        setHotelBookDetail(state,action:PayloadAction<Hotel>){
            state.selectedHotel=action.payload;
        },
        
    }
})
export const {setHotelBookDetail}=hotelBookDetailSlice.actions;
export default hotelBookDetailSlice.reducer;