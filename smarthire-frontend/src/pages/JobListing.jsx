import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Loader';
import { FaBriefcase, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './Jobs.css';

const JobListing = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialTitle = searchParams.get('title') || '';
  const initialLoc = searchParams.get('location') || '';

  const { list, loading, error } = useSelector((state) => state.jobs);
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [searchLoc, setSearchLoc] = useState(initialLoc);

  useEffect(() => {
    const query = [initialTitle, initialLoc].filter(Boolean).join(' ');
    dispatch(fetchJobs(query));
  }, [dispatch, initialTitle, initialLoc]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = [searchTitle, searchLoc].filter(Boolean).join(' ');
    dispatch(fetchJobs(query));
  };

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    setSavedJobs(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  }, []);

  const toggleSave = (jobId) => {
    const currentList = [...savedJobs];
    if (currentList.includes(jobId)) {
      currentList.splice(currentList.indexOf(jobId), 1);
    } else {
      currentList.push(jobId);
    }
    setSavedJobs(currentList);
    localStorage.setItem('savedJobs', JSON.stringify(currentList));
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        
        {/* Header / Filter Section */}
        <div className="jobs-header glass-pane" style={{ padding: '60px 40px', borderRadius: 'var(--border-radius-lg)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Explore <span className="text-gradient">Opportunities</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '40px' }}>Find the perfect role that matches your skills.</p>
          
          <form className="jobs-filter-bar glass" onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', padding: '12px', background: 'rgba(0,0,0,0.3)', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-sm)', padding: '0 16px' }}>
              <FaSearch style={{ color: 'rgba(255,255,255,0.4)', marginRight: '12px' }} />
              <input 
                type="text" 
                style={{ background: 'transparent', border: 'none', color: 'white', padding: '16px 0', width: '100%', outline: 'none' }}
                placeholder="Job title, keywords..." 
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>
            
            <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-sm)', padding: '0 16px' }}>
              <FaMapMarkerAlt style={{ color: 'rgba(255,255,255,0.4)', marginRight: '12px' }} />
              <input 
                type="text" 
                style={{ background: 'transparent', border: 'none', color: 'white', padding: '16px 0', width: '100%', outline: 'none' }}
                placeholder="Location (City, State, Remote)..." 
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flex: '0 1 120px' }}>Search</button>
          </form>
        </div>

        {error && (
          <div style={{ marginTop: '20px' }}>
            <EmptyState 
              title="Failed to Load Jobs" 
              message={error} 
              icon={FaBriefcase} 
              isError={true}
              onRetry={() => dispatch(fetchJobs([searchTitle, searchLoc].filter(Boolean).join(' ')))}
            />
          </div>
        )}

        {/* Job Grid Area */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          
          {loading ? (
             Array.from({length: 6}).map((_, i) => <Skeleton key={i} height="280px" />)
          ) : (
            <>
              {list.length === 0 && !error && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState 
                    icon={FaBriefcase} 
                    title="No jobs found" 
                    message="We couldn't find any jobs matching your search criteria. Try adjusting your filters." 
                  />
                </div>
              )}
              
              {list.map(job => (
                <Card key={job.id} hover={true} style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>{job.title}</h3>
                  <p style={{ fontWeight: '500', color: 'var(--text-light)', marginBottom: '12px', fontSize: '0.95rem' }}>
                    {job.company} • {job.location}
                  </p>
                  
                  {job.salary && (
                    <span style={{ display: 'inline-block', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem', width: 'fit-content', marginBottom: '16px' }}>
                      {job.salary}
                    </span>
                  )}
                  
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', flexGrow: 1, marginBottom: '24px', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {job.description ? job.description.substring(0, 120) + '...' : 'No description provided.'}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ padding: '8px 24px' }}>Details</Link>
                    <button 
                      onClick={() => toggleSave(job.id)} 
                      className={`btn ${savedJobs.includes(job.id) ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px' }}
                    >
                      {savedJobs.includes(job.id) ? 'Saved ★' : 'Save ☆'}
                    </button>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
