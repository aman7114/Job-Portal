import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

          {/* 404 Fallback Route */}
          <Route path="*" element={
            <div className="page-wrapper animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="glass empty-state" style={{ textAlign: 'center', padding: '60px' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }}>404</h1>
                <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '32px' }}>The page you are looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn btn-primary">Return Home</Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
