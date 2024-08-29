import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/interfaces/hotelOptions";
interface hotelOptions{
selectedUser:User | null
}

const initialState:hotelOptions={
    selectedUser:null,
}
const hotelGuestSlice=createSlice({
    name:'hotelguestdetail',
    initialState,
    reducers:{
        setSelectedUser(state,action:PayloadAction<User>){
            state.selectedUser=action.payload;
        },
    }
})
export const {setSelectedUser}=hotelGuestSlice.actions;
export default hotelGuestSlice.reducer;