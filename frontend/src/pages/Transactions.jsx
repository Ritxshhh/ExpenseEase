import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
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
  }, [page, filter, sortBy, order]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, type: filter, sortBy, order }
      });
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
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
      date: new Date(transaction.date).toISOString().split('T')[0],
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
    return transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.note.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Transactions</h1>
          <p className="text-gray-300">View and manage your financial records</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 bg-black border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-black text-gray-200 hover:bg-gray-700'}`}
                  onClick={() => { setFilter('all'); setPage(1); }}
                >
                  All
                </button>
                <button 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'income' ? 'bg-green-500 text-white' : 'bg-black text-gray-200 hover:bg-gray-700'}`}
                  onClick={() => { setFilter('income'); setPage(1); }}
                >
                  Income
                </button>
                <button 
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'expense' ? 'bg-red-500 text-white' : 'bg-black text-gray-200 hover:bg-gray-700'}`}
                  onClick={() => { setFilter('expense'); setPage(1); }}
                >
                  Expense
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex gap-2 items-center">
                <span className="text-gray-300 text-sm">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 bg-black border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
                <button 
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-black border border-gray-700 rounded-lg text-gray-100 hover:bg-gray-700 transition-all"
                >
                  {order === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              <div className="text-gray-300 text-sm ml-auto">
                Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)} of {pagination.total}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800  rounded-2xl border border-gray-700 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Note</th>
                  <th className="px-6 py-4 text-left text-gray-200 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-gray-700 hover:bg-black transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.type === 'income' ? 'bg-green-500 text-green-400' : 'bg-red-500 text-red-400'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-100">{transaction.category}</td>
                    <td className={`px-6 py-4 font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-gray-200">{new Date(transaction.date).toISOString().split('T')[0]}</td>
                    <td className="px-6 py-4 text-gray-200">{transaction.note}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(transaction)} className="text-blue-400 hover:text-blue-300 transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDelete(transaction.id)} className="text-red-400 hover:text-red-300 transition-colors"><FaTrash /></button>
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
            <p className="text-gray-300 text-lg">No transactions found matching your criteria.</p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-300">
              Page {page} of {pagination.totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              Next
            </button>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black  flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Edit Transaction</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all">Update</button>
                  <button type="button" className="flex-1 p-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-700 transition-all" onClick={() => setShowEditModal(false)}>Cancel</button>
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
