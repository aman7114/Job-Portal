import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications, fetchJobApplications } from '../redux/applicationSlice';
import { useSearchParams, Navigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Loader, Skeleton } from '../components/ui/Loader';
import { FaUsers, FaUserGraduate } from 'react-icons/fa'; // Ensure react-icons is installed

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

  const isCandidate = user.role === 'CANDIDATE';

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>
            {isCandidate ? 'My Applications' : `Applicants Dashboard`}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}>
            {isCandidate ? "Track the status of roles you've applied for." : `Review and manage incoming candidates.`}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {list.length === 0 ? (
              <EmptyState 
                icon={isCandidate ? FaUserGraduate : FaUsers}
                title={isCandidate ? "No applications yet" : "No applicants yet"}
                message={isCandidate ? "You haven't applied to any jobs yet." : "Applications will appear here once candidates apply"}
              />
            ) : (
              list.map(app => (
                <Card key={app.id} hover={true} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: '1 1 250px' }}>
                    {isCandidate ? (
                      <>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '8px' }}>{app.jobTitle || 'Unknown Job Title'}</h3>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                           <span style={{opacity: 0.5}}>Applied on:</span> {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '8px' }}>{app.userName || 'Applicant Name'}</h3>
                        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                           Email: {app.userEmail || 'N/A'}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
                           Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Status</p>
                      <Badge variant={app.status}>{app.status}</Badge>
                    </div>

                    {!isCandidate && (
                      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                        <a href={`http://localhost:8080${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;

