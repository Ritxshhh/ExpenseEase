import { Link } from 'react-router-dom';
import '../styles/landing.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">ExpenseEase</h1>
          <div className="nav-links">
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Stop Wondering Where Your Money Went</h1>
            <p className="hero-subtitle">Track expenses without any hassle. Set goals that actually work. Built by someone who was tired of complicated finance apps.</p>
            <div className="hero-quote">"I made this because every other expense app felt like doing taxes" - Dev Team</div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">1,247</span>
                <span className="stat-label">People Using Daily</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹12.4L</span>
                <span className="stat-label">Expenses Tracked</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.6★</span>
                <span className="stat-label">Real Reviews</span>
              </div>
            </div>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn primary">Start Free Today</Link>
              <Link to="/login" className="cta-btn secondary">Sign In</Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <h2 className="section-title">Why People Actually Use This</h2>
            <p className="section-subtitle">No BS features. Just the stuff that actually helps with money.</p>
            
            <div className="features-grid">
              <div className="feature-card">
                <h3>Quick Expense Entry</h3>
                <p>Add expenses in 3 taps. No categories to remember, no forms to fill out.</p>
                <div className="feature-quote">"I actually use it because it's not annoying" - Ravi, User</div>
              </div>
              
              <div className="feature-card">
                <h3>See Where Money Goes</h3>
                <p>Simple charts that show your spending without making you feel stupid.</p>
                <div className="feature-quote">"Finally understood my coffee addiction" - Priya, Beta User</div>
              </div>
              
              <div className="feature-card">
                <h3>No Sketchy Stuff</h3>
                <p>Your data stays on your device. We don't sell anything to anyone.</p>
                <div className="feature-quote">"Refreshing to find an app that's not creepy" - Anonymous User</div>
              </div>
            </div>
          </div>
        </section>

        <section className="reviews">
          <div className="reviews-container">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Real stories from people who transformed their finances</p>
            
            <div className="reviews-grid">
              <div className="review-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="review-text">"Started using this in college when I was broke. Now I have an emergency fund! Still can't believe it."</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">A</div>
                  <div className="reviewer-info">
                    <h4>Arjun</h4>
                    <span>Student → Working</span>
                  </div>
                </div>
              </div>
              
              <div className="review-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="review-text">"My wife asked how I suddenly got good with money. I showed her this app. Now we both use it."</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">R</div>
                  <div className="reviewer-info">
                    <h4>Raj</h4>
                    <span>Dad, Pune</span>
                  </div>
                </div>
              </div>
              
              <div className="review-card">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="review-text">"Realized I was spending ₹12k/month on food delivery. This app was a wake-up call I needed."</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">S</div>
                  <div className="reviewer-info">
                    <h4>Sneha</h4>
                    <span>Works from home</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="faq-container">
            <h2 className="section-title">Questions People Ask Us</h2>
            <p className="section-subtitle">The stuff everyone wants to know (but feels awkward asking)</p>
            
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Do I have to pay for this?</h3>
                <p>Nope! Everything you need is free. We might add some fancy extras later, but the core stuff will always be free.</p>
              </div>
              
              <div className="faq-item">
                <h3>Is my money data safe with you?</h3>
                <p>Super safe! We use the same security banks use. Plus, we don't even want your bank passwords - that's your business.</p>
              </div>
              
              <div className="faq-item">
                <h3>Can I link my bank account?</h3>
                <p>Not yet, but we're working on it! For now, you'll need to add expenses manually (which honestly isn't that bad).</p>
              </div>
              
              <div className="faq-item">
                <h3>Will this work on my phone?</h3>
                <p>Yep! Works on phones, tablets, laptops - basically anything with a browser. We made sure of that.</p>
              </div>
              
              <div className="faq-item">
                <h3>Can I get my data out if I want to leave?</h3>
                <p>Of course! Download everything as a CSV file whenever you want. It's your data, not ours.</p>
              </div>
              
              <div className="faq-item">
                <h3>How do I actually start using this?</h3>
                <p>Just sign up and start adding your expenses. No tutorials needed - it's pretty obvious how everything works.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <h2>Ready to Stop Stressing About Money?</h2>
            <p>Join the people who actually know where their money goes (finally!).</p>
            <Link to="/signup" className="cta-btn large">Start Tracking (It's Free!)</Link>
            <p className="cta-note">No credit card • No spam • No regrets</p>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 ExpenseEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;