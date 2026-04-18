import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../redux/applicationSlice';
import { fetchJobs } from '../redux/jobSlice';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Loader';
import { FaUserGraduate, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import EditProfileModal from '../components/ui/EditProfileModal';
import './Dashboard.css';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: applications, loading: appLoading } = useSelector((state) => state.applications);
  const { list: jobs, loading: jobLoading } = useSelector((state) => state.jobs);
  
  const [savedJobs, setSavedJobs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserApplications());
    dispatch(fetchJobs());
    
    // Load mock saved jobs from local storage
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, [dispatch]);

  const recommendedJobs = jobs.slice(0, 3); // Simple mock for recommended
  const savedJobDetails = jobs.filter(job => savedJobs.includes(job.id));

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  if (!user) {
    return <div className="page-wrapper"><div className="container"><p>User information not available</p></div></div>;
  }

  // Profile completion mock logic
  const profileCompletion = user?.name ? 85 : 40;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        
        <div className="dashboard-stats-grid" style={{ marginBottom: '32px' }}>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{applications.length}</div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Total Applications</div>
          </Card>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--success)', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {applications.filter(a => a.status === 'ACCEPTED').length}
            </div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Accepted Offers</div>
          </Card>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--warning)', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {applications.filter(a => a.status === 'REVIEWED').length}
            </div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>In Review</div>
          </Card>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--info)', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {savedJobs.length}
            </div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Saved Jobs</div>
          </Card>
        </div>

        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
          
          <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Recent Applications</h3>
              {appLoading ? <Skeleton height="200px" /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applications.length === 0 ? <EmptyState icon={FaUserGraduate} title="No Activity" message="You haven't applied to any jobs yet." /> : (
                    applications.slice(0, 5).map(app => (
                      <Card key={app.id} hover={true} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{app.jobTitle}</h4>
                          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <Badge variant={app.status}>{app.status}</Badge>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Recommended For You</h3>
              {jobLoading ? <Skeleton height="200px" /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                  {recommendedJobs.map(job => (
                    <Card key={job.id} hover={true} style={{ padding: '24px' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{job.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>{job.company} • {job.location}</p>
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline" style={{ width: '100%' }}>View</Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Immersive Profile Card */}
            <Card hover={false} style={{ padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.4), rgba(79, 70, 229, 0))' }}></div>
              <div className="avatar-glow" style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
                margin: '0 auto 16px auto',
                position: 'relative',
                zIndex: 1,
                cursor: 'pointer'
              }}>
                {getInitials(user.name)}
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-light)', marginBottom: '4px' }}>{user.name}</h3>
              <Badge variant="current" className="mb-3" style={{ display: 'inline-block', marginBottom: '16px' }}>{user.role}</Badge>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  <FaEnvelope style={{ color: 'var(--primary)' }} />
                  <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <p style={{ marginBottom: '8px', fontSize: '0.85rem', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>Profile Completion: {profileCompletion}%</p>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                  <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'var(--success)', borderRadius: '4px' }}></div>
                </div>
              </div>

              <button onClick={() => setIsEditModalOpen(true)} className="btn btn-outline" style={{ width: '100%', marginTop: '24px', fontSize: '0.9rem' }}>Edit Profile</button>
            </Card>

            {/* Saved Jobs Card */}
            <Card hover={false} style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>Saved Jobs</h3>
              {savedJobDetails.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>No jobs saved yet. Click the heart icon on a job to save it here.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {savedJobDetails.map((job, index) => (
                    <div key={job.id} style={{ borderBottom: index < savedJobDetails.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: index < savedJobDetails.length - 1 ? '16px' : '0' }}>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{job.title}</Link>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{job.company}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
      
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default CandidateDashboard;
