import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/salons?isFeatured=true&limit=6').then(res => setFeatured(res.data.salons));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/salons?search=${search}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect <span className="highlight">Beauty Experience</span></h1>
          <p>Discover top-rated salons, explore services, and book appointments in seconds. Your journey to looking and feeling amazing starts here.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <FiSearch style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, alignSelf: 'center', marginLeft: 12 }} />
            <input placeholder="Search salons, services, or locations..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-accent">Search</button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="number">500+</div>
              <div className="label">Salons</div>
            </div>
            <div className="hero-stat">
              <div className="number">10K+</div>
              <div className="label">Happy Clients</div>
            </div>
            <div className="hero-stat">
              <div className="number">50K+</div>
              <div className="label">Bookings Made</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Salons</h2>
            <p>Hand-picked salons known for exceptional service and quality</p>
          </div>
          <div className="salon-grid">
            {featured.map(salon => (
              <Link to={`/salons/${salon._id}`} key={salon._id} className="salon-card">
                <div className="salon-card-image">
                  <div className="placeholder-icon">&#10024;</div>
                  {salon.isFeatured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="salon-card-body">
                  <h3>{salon.name}</h3>
                  <div className="location">
                    <FiMapPin /> {salon.address?.city}, {salon.address?.state}
                  </div>
                  <div className="categories">
                    {(salon.categories || []).slice(0, 3).map(c => (
                      <span className="tag" key={c}>{c}</span>
                    ))}
                  </div>
                  <div className="salon-card-footer">
                    <div className="rating">
                      <FiStar style={{ color: '#FBBF24' }} /> {salon.rating} ({salon.totalReviews})
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/salons" className="btn btn-outline">View All Salons</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Book your perfect appointment in three easy steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
            {[
              { step: '01', title: 'Discover', desc: 'Browse through hundreds of top-rated salons and discover the perfect one for your needs.' },
              { step: '02', title: 'Choose', desc: 'Pick your service, select your preferred stylist, and find a time that works for you.' },
              { step: '03', title: 'Book', desc: 'Confirm your appointment instantly. No phone calls, no waiting. It\'s that simple.' }
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'white', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontFamily: "'Playfair Display', serif"
                }}>{item.step}</div>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
