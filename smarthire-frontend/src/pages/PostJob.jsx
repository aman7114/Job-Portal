import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postJob } from '../redux/jobSlice';
import { useNavigate } from 'react-router-dom';

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
      navigate('/dashboard/recruiter');
    } catch (err) {
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{maxWidth: '800px'}}>
      <div className="glass-card">
        <h2 style={{color: 'var(--primary-color)', marginBottom: '24px'}}>Post a New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div style={{display: 'flex', gap: '16px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>Company</label>
              <input type="text" className="input-field" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Location</label>
              <input type="text" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Salary (Optional)</label>
            <input type="text" className="input-field" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
