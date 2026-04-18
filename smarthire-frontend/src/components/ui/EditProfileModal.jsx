import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileLocal } from '../../redux/authSlice';
import { showToast } from '../../redux/uiSlice';
import Card from './Card';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay for smoothness
    setTimeout(() => {
      dispatch(updateProfileLocal({ name: formData.name }));
      dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 24px', animation: 'slideUp 0.3s ease-out' }}>
        <Card hover={false} style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Edit Profile</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Update your personal information.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
              <input 
                type="text" 
                className="input-control"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Email Address</label>
              <input 
                type="email" 
                className="input-control"
                value={formData.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                title="Email cannot be changed"
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
                {loading ? <span className="loader-spinner" style={{width:'20px', height:'20px', borderWidth:'2px'}}></span> : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfileModal;
