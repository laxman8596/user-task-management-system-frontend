import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosConfig';

const getAuthConfig = () => {
  return {
    withCredentials: true
  };
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/tasks', getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/tasks', taskData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tasks/${id}`, taskData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tasks/${id}`, getAuthConfig());
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

export const getAllTasks = createAsyncThunk('tasks/getAllTasks', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching all tasks for admin...');
    const response = await axios.get('/api/tasks/admin/all', getAuthConfig());
    console.log('All tasks response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch all tasks');
  }
});

export const assignTask = createAsyncThunk('tasks/assignTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/tasks/assign', taskData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to assign task');
  }
});

export const adminUpdateTask = createAsyncThunk('tasks/adminUpdateTask', async ({ id, taskData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tasks/admin/${id}`, taskData, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const adminDeleteTask = createAsyncThunk('tasks/adminDeleteTask', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tasks/admin/${id}`, getAuthConfig());
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    allTasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        toast.success('Task created successfully!');
        if (action.payload.task) {
          state.tasks.unshift(action.payload.task);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to create task');
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        toast.success('Task updated successfully!');
        const updatedTask = action.payload.task;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update task');
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        toast.success('Task deleted successfully!');
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete task');
      })
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTasks = action.payload;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminUpdateTask.fulfilled, (state, action) => {
        toast.success('Task updated successfully!');
        const updatedTask = action.payload.task;
        const index = state.allTasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.allTasks[index] = updatedTask;
        }
      })
      .addCase(adminUpdateTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update task');
      })
      .addCase(adminDeleteTask.fulfilled, (state, action) => {
        toast.success('Task deleted successfully!');
        state.allTasks = state.allTasks.filter(task => task._id !== action.payload);
      })
      .addCase(adminDeleteTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete task');
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        toast.success('Task assigned successfully!');
      })
      .addCase(assignTask.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to assign task');
      });
  },
});

export const { clearMessages } = taskSlice.actions;
export default taskSlice.reducer;