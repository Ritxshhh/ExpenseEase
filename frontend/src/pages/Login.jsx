import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage(`Welcome back, ${data.user.name}!`);
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage(data.error || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">ExpenseEase</h1>
          <h2 className="auth-title">Hey, Welcome Back!</h2>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-link">
          New User? <Link to="/signup">Sign Up now!</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;