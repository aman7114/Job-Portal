import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [search, setSearch] = useState('');
  const [loc, setLoc] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?title=${search}&location=${loc}`);
  };

  return (
    <div className="landing-wrapper animate-fade-in">
      <div className="container">
        <div className="hero-section text-center">
          <h1 className="hero-title">
            Find Your <span className="text-gradient">Dream Job</span> Today
          </h1>
          <p className="hero-subtitle">
            SmartHire connects top talents with the best companies. Search opportunities, build your profile, and fast-track your career.
          </p>

          <form className="hero-search glass" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="search-input-clear" 
              placeholder="Job title, keywords, or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="search-divider"></div>
            <input 
              type="text" 
              className="search-input-clear" 
              placeholder="City, state, or Remote"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">Find Jobs</button>
          </form>

          <div className="hero-cta-group">
            <span>Are you hiring?</span>
            <Link to="/register" className="btn btn-outline">Post Job For Free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
