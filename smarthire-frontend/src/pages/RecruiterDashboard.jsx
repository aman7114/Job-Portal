import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Loader';
import { FaClipboardList, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import EditProfileModal from '../components/ui/EditProfileModal';
import './Dashboard.css';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: jobs, loading } = useSelector((state) => state.jobs);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const myJobs = jobs.filter(job => job.createdBy === user?.name || job.createdBy === user?.email);
  const [totalApplicants, setTotalApplicants] = useState('--');

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    import('../services/api').then(({ default: api }) => {
      if (myJobs.length > 0) {
        const fetchApplicantsCount = async () => {
          try {
            let total = 0;
            await Promise.all(myJobs.map(async (job) => {
              const res = await api.get(`/applications/job/${job.id}`);
              total += res.data ? res.data.length : 0;
            }));
            setTotalApplicants(total);
          } catch (error) {
            console.error('Failed to fetch applicants count', error);
            setTotalApplicants(0);
          }
        };
        fetchApplicantsCount();
      } else if (!loading && myJobs.length === 0) {
        setTotalApplicants(0);
      }
    });
  }, [myJobs.length, loading]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  if (!user) {
    return <div className="page-wrapper"><div className="container"><p>User information not available</p></div></div>;
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        
        <div className="dashboard-stats-grid" style={{ marginBottom: '32px' }}>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{myJobs.length}</div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Active Job Postings</div>
          </Card>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--success)', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalApplicants}</div>
            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Total Applicants</div>
          </Card>
          <Card hover={true} style={{ padding: '24px', textAlign: 'center', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '100%' }}>
               <Link to="/post-job" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>+ Post New Job</Link>
            </div>
          </Card>
        </div>

        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
          
          <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>My Recent Postings</h3>
              
              {loading ? (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                   <Skeleton height="200px" />
                   <Skeleton height="200px" />
                 </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {myJobs.length === 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <EmptyState 
                        icon={FaClipboardList} 
                        title="No Postings Yet" 
                        message="You haven't posted any jobs yet. Create a listing to start hiring."
                        action={<Link to="/post-job" className="btn btn-primary">Post a Job</Link>}
                      />
                    </div>
                  )}
                  {myJobs.map(job => (
                    <Card key={job.id} hover={true} style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-light)' }}>{job.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>{job.location}</p>
                      <p style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '16px' }}>{job.salary || 'Salary not specified'}</p>
                      
                      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                        <Link to={`/jobs/${job.id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>View Job</Link>
                        <Link to={`/applications?jobId=${job.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Applicants</Link>
                      </div>
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
              <Badge variant="applied" className="mb-3" style={{ display: 'inline-block', marginBottom: '16px' }}>{user.role}</Badge>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  <FaEnvelope style={{ color: 'var(--primary)' }} />
                  <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
                </div>
              </div>

              <button onClick={() => setIsEditModalOpen(true)} className="btn btn-outline" style={{ width: '100%', marginTop: '24px', fontSize: '0.9rem' }}>Edit Profile</button>
            </Card>

          </div>

        </div>
      </div>
      
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default RecruiterDashboard;
