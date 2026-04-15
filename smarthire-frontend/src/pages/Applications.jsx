import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications, fetchJobApplications } from '../redux/applicationSlice';
import { useSearchParams, Navigate } from 'react-router-dom';

const Applications = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { user } = useSelector((state) => state.auth);
  const { list, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    if (user.role === 'CANDIDATE') {
      dispatch(fetchUserApplications());
    } else if (user.role === 'RECRUITER' && jobId) {
      dispatch(fetchJobApplications(jobId));
    }
  }, [dispatch, user.role, jobId]);

  if (user.role === 'RECRUITER' && !jobId) {
    return <Navigate to="/dashboard/recruiter" />;
  }

  return (
    <div className="page-container">
      <h2 style={{marginBottom: '32px'}}>
        {user.role === 'CANDIDATE' ? 'My Applications' : `Applicants for Job ID: ${jobId}`}
      </h2>

      {loading ? <div className="loader-spiner"></div> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {list.length === 0 && <p className="no-data">No applications found.</p>}
          {list.map(app => (
            <div key={app.id} className="glass-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                {user.role === 'CANDIDATE' ? (
                  <>
                    <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>{app.jobTitle}</h3>
                    <p>Status: <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span></p>
                  </>
                ) : (
                  <>
                    <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>{app.userName}</h3>
                    <p style={{marginBottom: '8px'}}>Status: <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span></p>
                    <a href={`http://localhost:8080${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
                      View Resume
                    </a>
                  </>
                )}
                <p style={{marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-light)'}}>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
