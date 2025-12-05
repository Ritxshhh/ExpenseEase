import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [barData, setBarData] = useState([]);
  const [calcDisplay, setCalcDisplay] = useState('');
  const [rupees, setRupees] = useState('');
  const [dollars, setDollars] = useState('');
  const exchangeRate = 90.23;

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        
        const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        setSummaryData({
          income,
          expense,
          balance: income - expense
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchMonthlySpending = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monthly-spending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBarData(data);
      }
    } catch (error) {
      console.error('Error fetching monthly spending:', error);
    }
  };

  const pieData = [
    { name: 'Income', value: summaryData.income, color: '#28a745' },
    { name: 'Expense', value: summaryData.expense, color: '#dc3545' }
  ];

  const recentTransactions = transactions.slice(0, 5).map(t => ({
    id: t.id,
    description: t.category,
    amount: t.type === 'income' ? t.amount : -t.amount,
    type: t.type,
    date: t.date
  }));

  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
    fetchMonthlySpending();
  }, []);

  const handleCalcClick = (value) => {
    if (value === 'C') {
      setCalcDisplay('');
    } else if (value === '=') {
      try {
        setCalcDisplay(eval(calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')).toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(calcDisplay + value);
    }
  };

  const handleRupeesChange = (e) => {
    const value = e.target.value;
    setRupees(value);
    setDollars(value ? (parseFloat(value) / exchangeRate).toFixed(2) : '');
  };

  const handleDollarsChange = (e) => {
    const value = e.target.value;
    setDollars(value);
    setRupees(value ? (parseFloat(value) * exchangeRate).toFixed(2) : '');
  };

  const [sipAmount, setSipAmount] = useState('');
  const [sipRate, setSipRate] = useState('');
  const [sipYears, setSipYears] = useState('');
  const [sipResults, setSipResults] = useState({ invested: 0, returns: 0, total: 0 });

  const calculateSIP = () => {
    const amount = parseFloat(sipAmount) || 0;
    const rate = parseFloat(sipRate) || 0;
    const years = parseFloat(sipYears) || 0;
    
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const invested = amount * months;
    
    const futureValue = amount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const returns = futureValue - invested;
    
    setSipResults({ invested, returns, total: futureValue });
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-100 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Hey {user?.name || 'there'}! 👋</h1>
              <p className="text-slate-400 text-sm">Here's what's happening with your money</p>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-4">
                <Link to="/add-transaction" className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Add Transaction</Link>
                <Link to="/transactions" className="px-4 py-2 text-slate-300 hover:text-white transition-colors">View Transactions</Link>
                <Link to="/goals" className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Goals</Link>
              </nav>
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getInitial(user?.name)}
                    </div>
                  )}
                  <span className="text-slate-100 hidden md:inline">{user?.name || 'User'}</span>
                  <span className="text-slate-400">▼</span>
                </div>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-slate-700 py-2">
                    <Link to="/profile" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors">View Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500/10 backdrop-blur-xl p-6 rounded-xl border border-green-500/30">
            <div className="text-green-400 text-sm font-medium mb-2">Money In</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">₹{summaryData.income.toLocaleString('en-IN')}</div>
            <div className="text-green-400/70 text-sm">The good stuff 💰</div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-xl p-6 rounded-xl border border-red-500/30">
            <div className="text-red-400 text-sm font-medium mb-2">Money Out</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">₹{summaryData.expense.toLocaleString('en-IN')}</div>
            <div className="text-red-400/70 text-sm">Where it all goes 🛒</div>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-xl p-6 rounded-xl border border-blue-500/30">
            <div className="text-blue-400 text-sm font-medium mb-2">What's Left</div>
            <div className="text-3xl font-bold text-slate-100 mb-2">₹{summaryData.balance.toLocaleString('en-IN')}</div>
            <div className="text-blue-400/70 text-sm">{summaryData.balance > 0 ? 'Looking good! 📈' : 'Time to budget 📊'}</div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="amount" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Financial Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Currency Converter</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="number" value={rupees} onChange={handleRupeesChange} placeholder="Rupees" className="flex-1 p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500" />
                  <span className="text-slate-400">₹</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={dollars} onChange={handleDollarsChange} placeholder="Dollars" className="flex-1 p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500" />
                  <span className="text-slate-400">$</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-3 text-center">1 USD = ₹90.23</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Calculator</h3>
              <input type="text" value={calcDisplay} className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 text-right mb-3" readOnly />
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleCalcClick('C')} className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">C</button>
                <button onClick={() => handleCalcClick('±')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">±</button>
                <button onClick={() => handleCalcClick('%')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">%</button>
                <button onClick={() => handleCalcClick('÷')} className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">÷</button>
                <button onClick={() => handleCalcClick('7')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">7</button>
                <button onClick={() => handleCalcClick('8')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">8</button>
                <button onClick={() => handleCalcClick('9')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">9</button>
                <button onClick={() => handleCalcClick('×')} className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">×</button>
                <button onClick={() => handleCalcClick('4')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">4</button>
                <button onClick={() => handleCalcClick('5')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">5</button>
                <button onClick={() => handleCalcClick('6')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">6</button>
                <button onClick={() => handleCalcClick('-')} className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">-</button>
                <button onClick={() => handleCalcClick('1')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">1</button>
                <button onClick={() => handleCalcClick('2')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">2</button>
                <button onClick={() => handleCalcClick('3')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">3</button>
                <button onClick={() => handleCalcClick('+')} className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">+</button>
                <button onClick={() => handleCalcClick('0')} className="col-span-2 p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">0</button>
                <button onClick={() => handleCalcClick('.')} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">.</button>
                <button onClick={() => handleCalcClick('=')} className="p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">=</button>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">SIP Calculator</h3>
              <div className="space-y-3">
                <input type="number" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} placeholder="Monthly Investment" className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500" />
                <input type="number" value={sipRate} onChange={(e) => setSipRate(e.target.value)} placeholder="Annual Return (%)" className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500" />
                <input type="number" value={sipYears} onChange={(e) => setSipYears(e.target.value)} placeholder="Years" className="w-full p-3 bg-slate-900/60 border border-slate-700/20 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500" />
                <button onClick={calculateSIP} className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Calculate</button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex justify-between text-slate-300"><span>Invested:</span> <span className="font-semibold">₹{sipResults.invested.toLocaleString('en-IN')}</span></p>
                <p className="flex justify-between text-slate-300"><span>Returns:</span> <span className="font-semibold">₹{sipResults.returns.toLocaleString('en-IN')}</span></p>
                <p className="flex justify-between text-slate-100 font-semibold"><span>Total:</span> <span>₹{sipResults.total.toLocaleString('en-IN')}</span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Recent Transactions</h2>
            <div className="flex gap-3">
              <Link to="/add-transaction" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">Add Transaction</Link>
              <Link to="/transactions" className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all">View All</Link>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <ul className="space-y-3">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className="flex justify-between items-center p-4 bg-slate-900/40 backdrop-blur-sm rounded-lg hover:bg-slate-900/60 transition-colors">
                  <div>
                    <h4 className="text-slate-100 font-medium">{transaction.description}</h4>
                    <p className="text-slate-400 text-sm">{transaction.date}</p>
                  </div>
                  <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No transactions yet</p>
              <Link to="/add-transaction" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">Add Your First Transaction</Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
