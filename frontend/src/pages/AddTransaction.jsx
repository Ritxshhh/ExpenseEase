import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTransaction() {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Transaction added successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Add Transaction</h1>
          <p className="text-slate-400">Record your income and expenses</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-2 text-slate-300 font-medium text-sm">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-slate-300 font-medium text-sm">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-slate-300 font-medium text-sm">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                placeholder="e.g., Food, Transport, Salary"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-slate-300 font-medium text-sm">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-slate-300 font-medium text-sm">Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="p-3.5 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 transition-all focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Optional description..."
                rows="3"
              />
            </div>

            <button type="submit" className="mt-2 p-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold cursor-pointer transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;