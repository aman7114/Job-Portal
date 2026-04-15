import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const myJobs = jobs.filter(job => job.createdBy === user?.name);

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        <div className="dashboard-header glass-pane" style={{padding: '32px', marginBottom: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2rem', marginBottom: '8px'}}>Recruiter Dashboard</h2>
              <p style={{color: 'rgba(255,255,255,0.6)'}}>Manage your listings and incoming applications.</p>
            </div>
            <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
          </div>
        </div>
        
        <div className="dashboard-stats-grid">
          <div className="glass stat-card-premium">
            <div className="stat-value text-gradient">{myJobs.length}</div>
            <div className="stat-label">Active Job Postings</div>
          </div>
          <div className="glass stat-card-premium">
            <div className="stat-value" style={{color: 'var(--success)'}}>--</div>
            <div className="stat-label">Total Applicants</div>
          </div>
          <div className="glass stat-card-premium">
            <div className="stat-value" style={{color: 'var(--primary)'}}>{user?.name}</div>
            <div className="stat-label">Account</div>
          </div>
        </div>

        <div className="section-block">
          <h3 className="section-title">My Recent Postings</h3>
          {loading ? <div className="loader-spinner"></div> : (
            <div className="job-grid-mini" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
              {myJobs.length === 0 && <div className="glass empty-state" style={{gridColumn: '1 / -1'}}>You haven't posted any jobs yet.</div>}
              {myJobs.map(job => (
                <div key={job.id} className="glass job-card-mini" style={{transition: 'transform 0.2s', padding: '24px'}}>
                  <h3 style={{fontSize: '1.3rem', marginBottom: '8px'}}>{job.title}</h3>
                  <p className="company-text" style={{marginBottom: '16px'}}>{job.location}</p>
                  <p style={{color: 'var(--success)', fontWeight: '600', marginBottom: '16px'}}>{job.salary || 'Salary not specified'}</p>
                  
                  <div style={{marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '12px'}}>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline" style={{flex: 1}}>View Job</Link>
                    <Link to={`/applications?jobId=${job.id}`} className="btn btn-primary" style={{flex: 1}}>View Applicants</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
