import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="glass auth-card-premium">
        <h2 className="text-gradient">Welcome Back</h2>
        <p className="auth-subtitle">Log in to continue to SmartHire</p>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
            {loading ? <span className="loader-spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}></span> : 'Login'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
