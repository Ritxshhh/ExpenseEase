import { useState, useEffect } from 'react';
import axios from 'axios';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
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
      name: goal.name,
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
    setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
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
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Savings Goals</h1>
            <p className="text-slate-400">Track and achieve your financial objectives</p>
          </div>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            onClick={() => setShowForm(true)}
          >
            Add New Goal
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Goal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Target Amount</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Current Saved Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={formData.currentAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                  <button type="button" className="flex-1 p-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-100">{goal.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(goal)} className="text-lg hover:scale-110 transition-transform">✏️</button>
                  <button onClick={() => handleDelete(goal.id)} className="text-lg hover:scale-110 transition-transform">🗑️</button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Target:</span>
                  <span className="text-slate-100 font-semibold">${goal.targetAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Saved:</span>
                  <span className="text-slate-100 font-semibold">${goal.currentAmount}</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-400 mt-2 block text-center">
                  {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-slate-400 text-center">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-slate-300 mb-4">No goals yet</h3>
            <p className="text-slate-400 mb-6">Start by creating your first savings goal</p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all" onClick={() => setShowForm(true)}>
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;
