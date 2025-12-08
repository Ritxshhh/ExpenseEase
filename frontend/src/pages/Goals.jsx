import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', sortBy: 'createdAt', order: 'desc' });

  useEffect(() => {
    fetchGoals();
  }, [pagination.page, filters]);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        order: filters.order,
        ...(filters.status && { status: filters.status })
      });
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data.goals);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingGoal) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/goals/${editingGoal.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/goals`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
    setShowForm(false);
    setEditingGoal(null);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Savings Goals</h1>
            <p className="text-gray-300">Track and achieve your financial objectives</p>
          </div>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all"
            onClick={() => setShowForm(true)}
          >
            Add New Goal
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
          <select 
            className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select 
            className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="createdAt">Created Date</option>
            <option value="deadline">Deadline</option>
            <option value="targetAmount">Target Amount</option>
            <option value="title">Title</option>
          </select>
          
          <button 
            className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-gray-100 hover:bg-gray-700 transition-all"
            onClick={() => setFilters(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
          >
            {filters.order === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black  flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Goal Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Target Amount</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Current Saved Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={formData.currentAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm mb-2">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all">
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                  <button type="button" className="flex-1 p-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-700 transition-all" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  goal.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {goal.status}
                </span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-100">{goal.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(goal)} className="text-blue-400 hover:text-blue-300 transition-colors"><FaEdit /></button>
                  <button onClick={() => handleDelete(goal.id)} className="text-red-400 hover:text-red-300 transition-colors"><FaTrash /></button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Target:</span>
                  <span className="text-gray-100 font-semibold">${goal.targetAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Saved:</span>
                  <span className="text-gray-100 font-semibold">${goal.currentAmount}</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-black rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300 mt-2 block text-center">
                  {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-300 text-center">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">No goals found</h3>
            <p className="text-gray-300 mb-6">Try adjusting your filters or create a new goal</p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500 transition-all" onClick={() => setShowForm(true)}>
              Create Your First Goal
            </button>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button 
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;
