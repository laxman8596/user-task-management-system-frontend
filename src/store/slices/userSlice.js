import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosConfig';

const getAuthConfig = () => {
  return {
    withCredentials: true
  };
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/users', getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/users', userData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create user');
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/users/${id}`, userData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/users/${id}`, getAuthConfig());
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    stats: { totalUsers: 0, totalPages: 0, currentPage: 1 },
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.stats = {
          totalUsers: action.payload.totalUsers,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        toast.success('User created successfully!');
      })
      .addCase(createUser.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to create user');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        toast.success('User updated successfully!');
      })
      .addCase(updateUser.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update user');
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        toast.success('User deleted successfully!');
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete user');
      });
  },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;