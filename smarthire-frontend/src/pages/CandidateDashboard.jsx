import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../redux/applicationSlice';
import { fetchJobs } from '../redux/jobSlice';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: applications, loading: appLoading } = useSelector((state) => state.applications);
  const { list: jobs, loading: jobLoading } = useSelector((state) => state.jobs);
  
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    dispatch(fetchUserApplications());
    dispatch(fetchJobs());
    
    // Load mock saved jobs from local storage
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, [dispatch]);

  const recommendedJobs = jobs.slice(0, 3); // Simple mock for recommended
  const savedJobDetails = jobs.filter(job => savedJobs.includes(job.id));

  // Profile completion mock logic
  const profileCompletion = user?.name ? 85 : 40;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        
        <div className="dashboard-header glass-pane" style={{padding: '32px', marginBottom: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2rem', marginBottom: '8px'}}>Welcome back, {user?.name}</h2>
              <p style={{color: 'rgba(255,255,255,0.6)'}}>Here is what's happening with your job search today.</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{marginBottom: '8px', fontSize: '0.9rem'}}>Profile Completion: {profileCompletion}%</p>
              <div style={{width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}>
                <div style={{width: `${profileCompletion}%`, height: '100%', background: 'var(--success)', borderRadius: '4px'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          <div className="glass stat-card-premium">
            <div className="stat-value text-gradient">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="glass stat-card-premium">
            <div className="stat-value" style={{color: 'var(--success)'}}>
              {applications.filter(a => a.status === 'ACCEPTED').length}
            </div>
            <div className="stat-label">Accepted Offers</div>
          </div>
          <div className="glass stat-card-premium">
            <div className="stat-value" style={{color: 'var(--warning)'}}>
              {applications.filter(a => a.status === 'REVIEWED').length}
            </div>
            <div className="stat-label">In Review</div>
          </div>
          <div className="glass stat-card-premium">
            <div className="stat-value" style={{color: 'var(--info)'}}>
              {savedJobs.length}
            </div>
            <div className="stat-label">Saved Jobs</div>
          </div>
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-main flex-2">
            <div className="section-block">
              <h3 className="section-title">Recent Applications</h3>
              {appLoading ? <div className="loader-spinner"></div> : (
                <div className="list-group">
                  {applications.length === 0 && <div className="glass empty-state">No applications found.</div>}
                  {applications.slice(0, 5).map(app => (
                    <div key={app.id} className="glass list-item">
                      <div className="item-info">
                        <h4>{app.jobTitle}</h4>
                        <span className="item-meta">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`badge-status ${app.status.toLowerCase()}`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="section-block" style={{marginTop: '32px'}}>
              <h3 className="section-title">Recommended For You</h3>
              <div className="job-grid-mini">
                {recommendedJobs.map(job => (
                  <div key={job.id} className="glass job-card-mini">
                    <h4>{job.title}</h4>
                    <p className="company-text">{job.company} • {job.location}</p>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline" style={{marginTop: '16px', width: '100%'}}>View</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar flex-1">
            <div className="glass-pane section-block" style={{padding: '24px'}}>
              <h3 className="section-title">Saved Jobs</h3>
              {savedJobDetails.length === 0 ? (
                <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem'}}>No jobs saved yet.</p>
              ) : (
                <div className="list-group-small">
                  {savedJobDetails.map(job => (
                    <div key={job.id} className="list-item-small" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px'}}>
                      <Link to={`/jobs/${job.id}`} style={{color: 'var(--primary)', fontWeight: '600'}}>{job.title}</Link>
                      <p style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)'}}>{job.company}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateDashboard;
