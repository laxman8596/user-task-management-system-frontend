import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import taskSlice from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    users: userSlice,
    tasks: taskSlice,
  },
});

export default store;