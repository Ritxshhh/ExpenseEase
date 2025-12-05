import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
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

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Oops! Please fill in all the fields 😅');
      setMessageType('error');
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage('That email looks a bit off. Mind double-checking? 📧');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage("You're in! Welcome aboard 🎉");
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage(data.error || 'Something went wrong. Give it another shot? 🤔');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Connection hiccup! Check your internet and try again ');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 tracking-tight">ExpenseEase</h1>
          <h2 className="text-2xl text-slate-100 font-semibold">Join the Club!</h2>
        </div>
        
        {message && (
          <div className={`p-3.5 rounded-lg mb-6 text-center text-sm font-medium ${
            messageType === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-2 text-slate-300 font-medium text-sm"> Your Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
              placeholder="Your name here"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-slate-300 font-medium text-sm">Your email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-slate-300 font-medium text-sm">Pick a Strong Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
              placeholder="Password (min. 6 characters)"
              required
            />
          </div>

          <button type="submit" className="mt-2 p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold cursor-pointer transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-slate-400 text-sm">
          Already a User?  <Link to="/login" className="text-blue-400 font-medium hover:text-blue-500 hover:underline transition-colors"> Login Now!</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;