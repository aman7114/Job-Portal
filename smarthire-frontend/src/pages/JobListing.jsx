import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { Link, useSearchParams } from 'react-router-dom';
import './Jobs.css';

const JobListing = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialTitle = searchParams.get('title') || '';
  const initialLoc = searchParams.get('location') || '';

  const { list, loading, error } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState(initialTitle);

  useEffect(() => {
    // If the landing page passed 'location', we could filter on frontend since our backend search handles title/location universally
    const query = [initialTitle, initialLoc].filter(Boolean).join(' ');
    if (query) setSearch(query);
    dispatch(fetchJobs(query));
  }, [dispatch, initialTitle, initialLoc]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchJobs(search));
  };

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    setSavedJobs(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  }, []);

  const toggleSave = (jobId) => {
    const currentList = [...savedJobs];
    if (currentList.includes(jobId)) {
      const idx = currentList.indexOf(jobId);
      currentList.splice(idx, 1);
    } else {
      currentList.push(jobId);
    }
    setSavedJobs(currentList);
    localStorage.setItem('savedJobs', JSON.stringify(currentList));
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        <div className="jobs-header glass-pane" style={{padding: '40px'}}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '8px'}}>Explore <span className="text-gradient">Opportunities</span></h2>
          <p style={{color: 'rgba(255,255,255,0.6)'}}>Discover your next career move among top companies.</p>
          
          <form className="jobs-search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="input-control" 
              placeholder="Search jobs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {loading && <div style={{textAlign: 'center', marginTop: '40px'}}><div className="loader-spinner"></div></div>}
        {error && <div className="glass empty-state" style={{marginTop: '20px', color: 'var(--danger)'}}>Error: {error}</div>}

        <div className="job-grid-mini" style={{marginTop: '32px'}}>
          {!loading && list.length === 0 && <div className="glass empty-state" style={{gridColumn: '1 / -1'}}>No jobs match your criteria.</div>}
          
          {list.map(job => (
            <div key={job.id} className="glass job-card-premium">
              <h3>{job.title}</h3>
              <p className="company-meta">{job.company} • {job.location}</p>
              {job.salary && <span className="salary-tag">{job.salary}</span>}
              <p className="job-snippet">{job.description.substring(0, 120)}...</p>
              
              <div className="job-card-actions">
                <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{padding: '8px 24px'}}>Details</Link>
                <button 
                  onClick={() => toggleSave(job.id)} 
                  className={`btn ${savedJobs.includes(job.id) ? 'btn-primary' : 'btn-outline'}`}
                  style={{padding: '8px 16px'}}
                >
                  {savedJobs.includes(job.id) ? 'Saved ★' : 'Save ☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
