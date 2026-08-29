import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16, fontSize: 24 }}>
            <span style={{ color: '#FF6B9D' }}>Glow</span><span>Up</span>
          </h3>
          <p>Your beauty, your time. Discover top-rated salons and book appointments instantly with GlowUp.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <ul>
            <li><Link to="/salons">Discover Salons</Link></li>
            <li><Link to="/register">Join as Salon</Link></li>
            <li><Link to="/login">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 GlowUp. All rights reserved.</p>
      </div>
    </footer>
  );
}
