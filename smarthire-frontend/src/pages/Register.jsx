import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(showToast({ message: 'Registration successful!', type: 'success'}));
      navigate(user.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate');
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="glass auth-card-premium">
        <h2 className="text-gradient">Create Account</h2>
        <p className="auth-subtitle">Join SmartHire and accelerate your career</p>
        
        <div className="role-toggle">
          <button 
            type="button" 
            className={`role-btn ${formData.role === 'CANDIDATE' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
          >
            Candidate
          </button>
          <button 
            type="button" 
            className={`role-btn ${formData.role === 'RECRUITER' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <input 
            type="text" 
            className="input-control" 
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />
          <input 
            type="email" 
            className="input-control" 
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required 
          />
          <input 
            type="password" 
            className="input-control" 
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required 
          />
          <button type="submit" className="btn btn-primary" style={{marginTop: '8px'}} disabled={loading}>
            {loading ? <span className="loader-spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}></span> : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
