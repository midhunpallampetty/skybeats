// redux/foodSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: number;
  name: string;
  price: number;
}

interface FoodState {
  selectedItems: Item[];
}

const initialState: FoodState = {
  selectedItems: [],
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.selectedItems.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.selectedItems = state.selectedItems.filter(item => item.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = foodSlice.actions;
export default foodSlice.reducer;
