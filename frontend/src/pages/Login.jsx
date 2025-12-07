import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="bg-gray-800  p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 tracking-tight">ExpenseEase</h1>
          <h2 className="text-2xl text-gray-100 font-semibold">Hey, Welcome Back!</h2>
        </div>
        
        {message && (
          <div className={`p-3.5 rounded-lg mb-6 text-center text-sm font-medium ${
            messageType === 'success' 
              ? 'bg-green-500 text-green-400 border border-green-500' 
              : 'bg-red-500 text-red-400 border border-red-500'
          }`}>
            {message}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-200 font-medium text-sm">Your email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-gray-800 focus:ring-4 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-200 font-medium text-sm">Your Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-gray-800 focus:ring-4 focus:ring-blue-500"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="mt-2 p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold cursor-pointer transition-all shadow-lg shadow-blue-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500">
            Login
          </button>
        </form>

        <div className="text-center mt-6 text-gray-300 text-sm">
          New User? <Link to="/signup" className="text-blue-400 font-medium hover:text-blue-500 hover:underline transition-colors">Sign Up now!</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;