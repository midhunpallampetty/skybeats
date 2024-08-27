import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
 import { hotelOptionsState } from "@/interfaces/hotelInterfaces";
import { Hotel } from "@/interfaces/hotelInterfaces";
const initialState:hotelOptionsState={
    hotelOptions :[],
}
const bookHotelSlice=createSlice({
name:'hotelOptions',
initialState,
reducers:{
    setHotelOptions:(state,action:PayloadAction<Hotel[]>)=>{
        state.hotelOptions=action.payload;
    },
    clearHotelOptions:(state)=>{
    state.hotelOptions=[];
    },
    
}
});
export const {setHotelOptions,clearHotelOptions}=bookHotelSlice.actions;
export default bookHotelSlice.reducer;
