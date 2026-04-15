import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (searchQuery = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/jobs${searchQuery ? `?search=${searchQuery}` : ''}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
  }
});

export const postJob = createAsyncThunk('jobs/postJob', async (jobData, { rejectWithValue }) => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to post job');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    selectedJob: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchJobById.pending, (state) => { state.loading = true; })
      .addCase(fetchJobById.fulfilled, (state, action) => { state.loading = false; state.selectedJob = action.payload; })
      .addCase(fetchJobById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(postJob.fulfilled, (state, action) => { state.list.push(action.payload); });
  },
});

export default jobSlice.reducer;
