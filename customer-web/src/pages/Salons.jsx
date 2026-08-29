import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';

export default function Salons() {
  const [searchParams] = useSearchParams();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [categories] = useState(['Hair', 'Nails', 'Skincare', 'Makeup', 'Color', 'Treatments']);

  useEffect(() => {
    fetchSalons();
  }, [search, category]);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await API.get('/salons', { params });
      setSalons(data.salons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Discover Salons</h1>
        <p>Find the perfect salon for your next beauty appointment</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            style={{ width: '100%', padding: '14px 16px 14px 44px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <button className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategory('')}>All</button>
        {categories.map(c => (
          <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : salons.length === 0 ? (
        <div className="empty-state">
          <div className="icon">&#128269;</div>
          <h3>No salons found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="salon-grid">
          {salons.map(salon => (
            <Link to={`/salons/${salon._id}`} key={salon._id} className="salon-card">
              <div className="salon-card-image">
                <div className="placeholder-icon">&#10024;</div>
                {salon.isFeatured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="salon-card-body">
                <h3>{salon.name}</h3>
                <div className="location"><FiMapPin /> {salon.address?.city}, {salon.address?.state}</div>
                <div className="categories">
                  {(salon.categories || []).slice(0, 3).map(c => <span className="tag" key={c}>{c}</span>)}
                </div>
                <div className="salon-card-footer">
                  <div className="rating"><FiStar style={{ color: '#FBBF24' }} /> {salon.rating} ({salon.totalReviews})</div>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
