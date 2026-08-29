import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { FiMapPin, FiPhone, FiClock, FiStar } from 'react-icons/fi';

export default function SalonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    API.get(`/salons/${id}`).then(res => { setSalon(res.data.salon); setLoading(false); });
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!salon) return <div className="container"><div className="empty-state"><h3>Salon not found</h3></div></div>;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div>
      <div className="salon-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 40, marginBottom: 8 }}>{salon.name}</h1>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', opacity: 0.9, fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMapPin /> {salon.address?.street}, {salon.address?.city}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiStar style={{ color: '#FBBF24' }} /> {salon.rating} ({salon.totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="salon-detail-grid">
          <div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{salon.description}</p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {salon.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}><FiPhone /> {salon.phone}</div>}
            </div>

            <div className="tabs">
              <button className={`tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services ({salon.serviceList?.length || 0})</button>
              <button className={`tab ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>Stylists ({salon.staffList?.length || 0})</button>
              <button className={`tab ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Hours</button>
            </div>

            {activeTab === 'services' && (
              <div className="service-list">
                {salon.serviceList?.map(service => (
                  <div className="service-item" key={service._id}>
                    <div className="info">
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                    </div>
                    <div className="meta">
                      <div className="price">${service.price}</div>
                      <div className="duration">{service.duration} min</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="staff-grid">
                {salon.staffList?.map(s => (
                  <div className="staff-card" key={s._id}>
                    <div className="avatar">{s.user?.name?.charAt(0)}</div>
                    <h4>{s.user?.name}</h4>
                    <div className="title">{s.title}</div>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 13 }}>
                      <FiStar style={{ color: '#FBBF24' }} /> {s.rating}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'hours' && (
              <div style={{ maxWidth: 400 }}>
                {days.map(day => {
                  const h = salon.openingHours?.[day];
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)', textTransform: 'capitalize', fontSize: 14 }}>
                      <span style={{ fontWeight: 500 }}>{day}</span>
                      <span style={{ color: h?.isClosed ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {h?.isClosed ? 'Closed' : `${h?.open} - ${h?.close}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="booking-summary">
              <h3>Book Appointment</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Select your services and preferred stylist</p>
              {user ? (
                <Link to={`/book/${salon._id}`} className="btn btn-primary btn-full btn-lg">Book Now</Link>
              ) : (
                <Link to="/login" className="btn btn-primary btn-full btn-lg">Sign In to Book</Link>
              )}

              <div style={{ marginTop: 24, padding: 16, background: 'var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><FiClock /> Hours</div>
                {days.slice(0, 5).map(day => {
                  const h = salon.openingHours?.[day];
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', textTransform: 'capitalize' }}>
                      <span>{day.slice(0, 3)}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{h?.isClosed ? 'Closed' : `${h?.open}-${h?.close}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
