import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../redux/jobSlice';
import { applyForJob } from '../redux/applicationSlice';
import { showToast } from '../redux/uiSlice';
import { useParams, Link } from 'react-router-dom';
import './Jobs.css';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [resume, setResume] = useState(null);
  const [applyState, setApplyState] = useState('idle');

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(saved.includes(parseInt(id)));
  }, [dispatch, id]);

  const toggleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobId = parseInt(id);
    if (saved.includes(jobId)) {
      const idx = saved.indexOf(jobId);
      saved.splice(idx, 1);
      setIsSaved(false);
      dispatch(showToast({ message: 'Job removed from saved list.', type: 'info' }));
    } else {
      saved.push(jobId);
      setIsSaved(true);
      dispatch(showToast({ message: 'Job saved successfully!', type: 'success' }));
    }
    localStorage.setItem('savedJobs', JSON.stringify(saved));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      dispatch(showToast({ message: 'Please upload your resume.', type: 'error' }));
      return;
    }

    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('resume', resume);

    setApplyState('loading');
    try {
      await dispatch(applyForJob(formData)).unwrap();
      setApplyState('success');
      dispatch(showToast({ message: 'Application submitted successfully!', type: 'success' }));
    } catch (err) {
      setApplyState('error');
      dispatch(showToast({ message: err || 'Failed to submit application', type: 'error' }));
    }
  };

  if (loading || !selectedJob) return <div className="page-wrapper"><div className="loader-spinner" style={{margin:'40px auto', display:'block'}}></div></div>;

  return (
    <div className="page-wrapper animate-slide-up">
      <div className="container">
        <div className="job-details-grid">
          
          <div className="glass job-info-pane">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h2 className="text-gradient" style={{fontSize: '2.5rem', marginBottom: '8px'}}>{selectedJob.title}</h2>
              <button onClick={toggleSave} className={`btn ${isSaved ? 'btn-primary' : 'btn-outline'}`}>
                {isSaved ? 'Saved ★' : 'Save Job ☆'}
              </button>
            </div>
            
            <h3 style={{color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: '24px'}}>{selectedJob.company}</h3>
            
            <div style={{display: 'flex', gap: '12px', marginBottom: '32px'}}>
              <span className="badge-status applied">📍 {selectedJob.location}</span>
              {selectedJob.salary && <span className="badge-status accepted">💰 {selectedJob.salary}</span>}
            </div>

            <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px'}}>
              <h4 style={{fontSize: '1.2rem'}}>About the Role</h4>
              <p className="rich-description">{selectedJob.description}</p>
            </div>
            
            <p style={{marginTop: '40px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)'}}>
              Posted by {selectedJob.createdBy} on {new Date(selectedJob.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="glass apply-pane">
            <h3 style={{marginBottom: '24px'}}>Ready to Apply?</h3>
            {user ? (
              user.role === 'CANDIDATE' ? (
                applyState === 'success' ? (
                  <div style={{padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)'}}>
                    🎉 You have successfully applied for this position!
                  </div>
                ) : (
                  <form onSubmit={handleApply}>
                    <div style={{marginBottom: '20px'}}>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)'}}>Resume (PDF/DOCX)</label>
                      <input 
                        type="file" 
                        className="input-control" 
                        onChange={(e) => setResume(e.target.files[0])}
                        style={{padding: '10px'}}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={applyState === 'loading'}>
                      {applyState === 'loading' ? <span className="loader-spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}></span> : 'Submit Application'}
                    </button>
                  </form>
                )
              ) : (
                <div className="empty-state" style={{padding: '32px 24px'}}>Recruiters cannot apply for jobs.</div>
              )
            ) : (
              <div>
                <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '20px'}}>Create an account or login to apply seamlessly.</p>
                <Link to="/login" className="btn btn-primary" style={{width: '100%'}}>Log In to Apply</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;
