import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const applyForJob = createAsyncThunk('applications/apply', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
  }
});

export const fetchUserApplications = createAsyncThunk('applications/fetchUserApps', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/applications/user');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user applications');
  }
});

export const fetchJobApplications = createAsyncThunk('applications/fetchJobApps', async (jobId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch job applications');
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchUserApplications.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchUserApplications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchJobApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchJobApplications.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchJobApplications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(applyForJob.fulfilled, (state, action) => { state.list.push(action.payload); });
  },
});

export default applicationSlice.reducer;
