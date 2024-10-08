import {createSlice} from '@reduxjs/toolkit';
const initialState={
date:''
};
const bookDate=createSlice({
name:'bookdate',
initialState,
reducers:{
    setDate:(state,action)=>{
        state.date=action.payload;
    },
   
},


})
export const {setDate}=bookDate.actions;
export default bookDate.reducer;