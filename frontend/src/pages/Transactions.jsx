import { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    note: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      note: transaction.note
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/transactions/${editingTransaction.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTransactions();
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.note.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && transaction.type === filter;
  });

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Transactions</h1>
          <p className="text-slate-400">View and manage your financial records</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            
            <div className="flex gap-2">
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'income' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => setFilter('income')}
              >
                Income
              </button>
              <button 
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => setFilter('expense')}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Note</th>
                  <th className="px-6 py-4 text-left text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-100">{transaction.category}</td>
                    <td className={`px-6 py-4 font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{transaction.date}</td>
                    <td className="px-6 py-4 text-slate-300">{transaction.note}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(transaction)} className="text-lg hover:scale-110 transition-transform">✏️</button>
                        <button onClick={() => handleDelete(transaction.id)} className="text-lg hover:scale-110 transition-transform">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No transactions found matching your criteria.</p>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Edit Transaction</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all">Update</button>
                  <button type="button" className="flex-1 p-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
