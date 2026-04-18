import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const dashboardLink = user?.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate';

  return (
    <nav className="navbar-glass">
      <div className="container nav-container">
        <div className="nav-brand">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Smart<span className="text-gradient">Hire</span></Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/jobs" className={location.pathname === '/jobs' ? 'active' : ''}>Jobs</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to={dashboardLink} className={location.pathname.includes('dashboard') ? 'active' : ''}>Dashboard</Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', marginRight: '12px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>Register</Link>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
