import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface hotelUser{
    checkin:string
    checkout:string
    guests:number
}
interface hotelUserState{
    userData:hotelUser | null
}
const initialState:hotelUserState={
    userData:null
}

const hotelUserSlice=createSlice({
name:'hoteluserdata',
initialState,
reducers:{
    setuserData(state,action:PayloadAction<hotelUser>){
    state.userData=action.payload;
    },
},
})

export const {setuserData}=hotelUserSlice.actions;
export default hotelUserSlice.reducer;
