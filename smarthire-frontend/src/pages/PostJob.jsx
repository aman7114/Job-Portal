import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postJob } from '../redux/jobSlice';
import { showToast } from '../redux/uiSlice';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';

const PostJob = () => {
  const [formData, setFormData] = useState({ title: '', company: '', location: '', salary: '', description: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(postJob(formData)).unwrap();
      dispatch(showToast({ message: 'Job successfully published!', type: 'success' }));
      navigate('/dashboard/recruiter');
    } catch (err) {
      dispatch(showToast({ message: 'Failed to post job. Please try again.', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ maxWidth: '800px', padding: '40px 24px' }}>
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', textAlign: 'center' }}>
          Post a <span className="text-gradient">New Job</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '32px' }}>
          Fill out the details below to reach thousands of candidates.
        </p>

        <Card hover={false} style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Job Title *</label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="e.g. Senior Software Engineer"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 250px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Company Name *</label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="e.g. Acme Corp"
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ flex: '1 1 250px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Location *</label>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="e.g. New York, NY or Remote"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Salary Range (Optional)</label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="e.g. $100k - $120k"
                value={formData.salary} 
                onChange={e => setFormData({...formData, salary: e.target.value})} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Job Description *</label>
              <textarea 
                className="input-control" 
                style={{ minHeight: '180px', resize: 'vertical', lineHeight: '1.6' }}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', padding: '16px' }} disabled={loading}>
              {loading ? <span className="loader-spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}></span> : 'Publish Job'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
