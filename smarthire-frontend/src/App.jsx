import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

function App() {
  return (
    <Router>
      <Navbar />
      <Toast />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER']} />}>
            <Route path="/applications" element={<Applications />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
            <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
