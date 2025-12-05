import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">ExpenseEase</h1>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-6">Stop Wondering Where Your Money Went</h1>
            <p className="text-xl text-slate-300 mb-6">Track expenses without any hassle. Set goals that actually work. Built by someone who was tired of complicated finance apps.</p>
            <div className="text-blue-400 italic mb-12">"I made this because every other expense app felt like doing taxes" - Dev Team</div>
            
            <div className="flex justify-center gap-8 mb-12 flex-wrap">
              <div className="text-center">
                <span className="block text-4xl font-bold text-blue-400">1,247</span>
                <span className="text-slate-400">People Using Daily</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-blue-400">₹12.4L</span>
                <span className="text-slate-400">Expenses Tracked</span>
              </div>
              <div className="text-center">
                <span className="block text-4xl font-bold text-blue-400">4.6★</span>
                <span className="text-slate-400">Real Reviews</span>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all">Start Free Today</Link>
              <Link to="/login" className="px-8 py-4 bg-slate-700/50 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all">Sign In</Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Why People Actually Use This</h2>
            <p className="text-slate-400">No BS features. Just the stuff that actually helps with money.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-100 mb-4">Quick Expense Entry</h3>
              <p className="text-slate-300 mb-4">Add expenses in 3 taps. No categories to remember, no forms to fill out.</p>
              <div className="text-sm text-blue-400 italic">"I actually use it because it's not annoying" - Ravi, User</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-100 mb-4">See Where Money Goes</h3>
              <p className="text-slate-300 mb-4">Simple charts that show your spending without making you feel stupid.</p>
              <div className="text-sm text-blue-400 italic">"Finally understood my coffee addiction" - Priya, Beta User</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-100 mb-4">No Sketchy Stuff</h3>
              <p className="text-slate-300 mb-4">Your data stays on your device. We don't sell anything to anyone.</p>
              <div className="text-sm text-blue-400 italic">"Refreshing to find an app that's not creepy" - Anonymous User</div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">What Our Users Say</h2>
            <p className="text-slate-400">Real stories from people who transformed their finances</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-300 mb-6">"Started using this in college when I was broke. Now I have an emergency fund! Still can't believe it."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <h4 className="text-slate-100 font-semibold">Arjun</h4>
                  <span className="text-slate-400 text-sm">Student → Working</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-300 mb-6">"My wife asked how I suddenly got good with money. I showed her this app. Now we both use it."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                <div>
                  <h4 className="text-slate-100 font-semibold">Raj</h4>
                  <span className="text-slate-400 text-sm">Dad, Pune</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-300 mb-6">"Realized I was spending ₹12k/month on food delivery. This app was a wake-up call I needed."</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <h4 className="text-slate-100 font-semibold">Sneha</h4>
                  <span className="text-slate-400 text-sm">Works from home</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Questions People Ask Us</h2>
            <p className="text-slate-400">The stuff everyone wants to know (but feels awkward asking)</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Do I have to pay for this?</h3>
              <p className="text-slate-300">Nope! Everything you need is free. We might add some fancy extras later, but the core stuff will always be free.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Is my money data safe with you?</h3>
              <p className="text-slate-300">Super safe! We use the same security banks use. Plus, we don't even want your bank passwords - that's your business.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Can I link my bank account?</h3>
              <p className="text-slate-300">Not yet, but we're working on it! For now, you'll need to add expenses manually (which honestly isn't that bad).</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Will this work on my phone?</h3>
              <p className="text-slate-300">Yep! Works on phones, tablets, laptops - basically anything with a browser. We made sure of that.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Can I get my data out if I want to leave?</h3>
              <p className="text-slate-300">Of course! Download everything as a CSV file whenever you want. It's your data, not ours.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-100 mb-3">How do I actually start using this?</h3>
              <p className="text-slate-300">Just sign up and start adding your expenses. No tutorials needed - it's pretty obvious how everything works.</p>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-2xl border border-slate-700/50 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Ready to Stop Stressing About Money?</h2>
            <p className="text-slate-300 mb-8">Join the people who actually know where their money goes (finally!).</p>
            <Link to="/signup" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/40 transition-all mb-4">Start Tracking (It's Free!)</Link>
            <p className="text-slate-400 text-sm">No credit card • No spam • No regrets</p>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-700/50 py-8 text-center">
        <p className="text-slate-400">&copy; 2024 ExpenseEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
