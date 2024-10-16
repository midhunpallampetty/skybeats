import {createSlice} from '@reduxjs/toolkit';
const initialState={
returndate:''
};
const returnDate=createSlice({
name:'returndate',
initialState,
reducers:{
    setReturnDate:(state,action)=>{
        state.returndate=action.payload;
    },
   
},


})
export const {setReturnDate}=returnDate.actions;
export default returnDate.reducer;