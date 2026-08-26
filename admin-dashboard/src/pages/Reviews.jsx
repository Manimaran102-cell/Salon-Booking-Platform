import { useState, useEffect } from 'react';
import API from '../utils/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/reviews').then(res => setReviews(res.data.reviews)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Reviews</h1>
      <p className="page-subtitle">All platform reviews and ratings</p>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Customer</th><th>Salon</th><th>Rating</th><th>Comment</th><th>Date</th></tr></thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r._id}>
                    <td>{r.customer?.name}</td>
                    <td>{r.salon?.name}</td>
                    <td><span style={{ color: '#FBBF24' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span> {r.rating}/5</td>
                    <td style={{ maxWidth: 300 }}>{r.comment || '-'}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
