import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, PieChart, Info, Settings, FileText, CheckCircle2, ChevronDown, Activity, X, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_FUNDS } from '../lib/mockData';
import { getFundDB } from '../lib/liveData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MockRazorpay } from '../components/ui/MockRazorpay';

export function InvestFlow() {
  const { fundId } = useParams();
  const navigate = useNavigate();
  
  const FUND_DB = getFundDB();
  const fund = FUND_DB.find(f => f.id === fundId);
  
  const [type, setType] = useState('SIP');
  const [amount, setAmount] = useState('5000');
  const [years, setYears] = useState(10);
  
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!fund) return <div className="p-10 font-bold text-xl text-center">Fund not found. Redirecting...</div>;

  const handleInvest = () => {
    const userStr = localStorage.getItem('ramaniya_user');
    if (!userStr) {
      alert("Session expired. Please log in again.");
      return navigate('/');
    }
    
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 500) {
      alert("Security Error: Minimum investment amount is ₹500.");
      return;
    }
    if (numAmount > 10000000) {
      alert("Security Error: Maximum single-tranche investment capped at ₹1,00,00,000.");
      return;
    }
    
    // Launch Razorpay Mock Payment Gateway instead of raw processing
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsRazorpayOpen(false);
    
    // Process local structural investments mapping securely
    const investments = JSON.parse(localStorage.getItem('ramaniya_investments') || '[]');
    investments.push({ 
      id: crypto.randomUUID(), 
      fundName: fund.name, 
      amount: Number(amount), 
      type, 
      date: new Date().toISOString() 
    });
    localStorage.setItem('ramaniya_investments', JSON.stringify(investments));
    
    // Show local module confirmation
    setIsSuccess(true);
  };

  // Calculator Logic
  const cagr = Number(fund.cagr3Y) / 100;
  const p = Number(amount) || 0;
  let estimatedTotal = 0;
  let investedTotal = 0;

  if (type === 'SIP') {
    const r = cagr / 12;
    const n = years * 12;
    investedTotal = p * n;
    estimatedTotal = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  } else {
    investedTotal = p;
    estimatedTotal = p * Math.pow(1 + cagr, years);
  }
  
  const wealthGained = estimatedTotal - investedTotal;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-12 flex flex-col items-center shadow-lg border-slate-200">
          <div className="w-24 h-24 bg-fintech-green-100 text-fintech-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner border-[6px] border-white ring-1 ring-slate-100">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
            You successfully initiated a {type} mandate of <strong className="text-slate-900">₹{p.toLocaleString()}</strong> in <br/>
            <span className="font-bold text-fintech-blue-600 mt-2 block">{fund.name}</span>
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full font-bold shadow-md rounded-xl transition-all hover:-translate-y-1" size="lg">Go to Dashboard Portfolio</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft size={16} /> Back to Selection
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
          <TrendingUp className="text-fintech-green-600" /> Fund Overview & Invest
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Calculation Engine and Chart */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-slate-200 overflow-hidden shadow-sm rounded-3xl p-8 bg-white h-fit">
              <div className="mb-6 border-b border-slate-100 pb-5">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{fund.name}</h2>
                <div className="flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">{fund.category}</span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">{fund.risk} Risk</span>
                  <span className="bg-fintech-green-50 text-fintech-green-700 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold">+{fund.cagr3Y}% CAGR (3Y)</span>
                </div>
              </div>

              {/* LIVE GRAPH EMBED */}
              <div className="h-64 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 relative">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-xs font-bold text-slate-400 tracking-wider">HISTORICAL NAV SIMULATION</span>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm">₹{fund.nav} NAV</span>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={fund.chartData}>
                    <Line type="monotone" dataKey="val" stroke="#16a34a" strokeWidth={3} dot={{r:3, strokeWidth:1, fill:"#fff"}} activeDot={{r: 6, fill: '#16a34a'}} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      itemStyle={{ color: '#15803d' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
                <button 
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'SIP' ? 'bg-white shadow text-slate-900 transform scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setType('SIP')}
                >
                  Start SIP (Monthly)
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'ONETIME' ? 'bg-white shadow text-slate-900 transform scale-100' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setType('ONETIME')}
                >
                  Lump Sum (One-Time)
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest pl-1">Investment Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-3xl font-black pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-fintech-green-500/20 focus:border-fintech-green-500 outline-none bg-slate-50 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Time Period</label>
                  <div className="text-lg font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{years} Years</div>
                </div>
                <input 
                  type="range" 
                  min="1" max="30" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-green-600"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              <div className="bg-fintech-blue-50/50 border border-fintech-blue-100 rounded-2xl p-6 mb-8">
                <h3 className="text-[10px] font-bold text-fintech-blue-800 uppercase tracking-widest mb-4 border-b border-fintech-blue-200/50 pb-2">Projection Results</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-fintech-blue-900">
                    <span className="font-semibold">Total Invested</span>
                    <span className="font-bold tracking-wider">₹{investedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-fintech-blue-900">
                    <span className="font-semibold">Estimated Wealth Gain</span>
                    <span className="font-bold text-fintech-green-600 tracking-wider">+ ₹{wealthGained.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="border-t border-fintech-blue-200/50 pt-4 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Expected Total Value</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">₹{estimatedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-fintech-blue-600/70 mt-2 font-medium bg-fintech-blue-100/30 p-2 rounded-md uppercase tracking-wider">
                    *Returns are strictly calculated based on historical 3Y CAGR of {fund.cagr3Y}% dynamically and are purely illustrative.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleInvest} 
                size="lg" 
                className="w-full text-lg h-16 rounded-2xl shadow-lg font-bold tracking-wide transition-all hover:-translate-y-1 bg-slate-900 text-white hover:bg-slate-800"
              >
                Confirm Setup & Invest ₹{amount}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">
                 <ShieldCheck size={16} /> Encrypted Bank Demo Mandate
              </div>
            </Card>
          </div>

          {/* Fund Details Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-slate-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Info size={18} className="text-fintech-blue-600" /> About the Fund
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Fund Size</p>
                  <p className="text-sm font-bold text-slate-900 tracking-wide">{fund.fundSize}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Expense Ratio</p>
                  <p className="text-sm font-bold text-slate-900 tracking-wide">{fund.expenseRatio}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Inception</p>
                  <p className="text-sm font-bold text-slate-900 tracking-wide">{fund.inceptionDate}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Manager</p>
                  <p className="text-sm font-bold text-slate-900 tracking-wide">{fund.fundManager}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-slate-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Top Holdings Mapping</h3>
              <div className="flex flex-wrap gap-2">
                {fund.topHoldings.map((h, i) => (
                  <span key={i} className="px-3 py-1.5 bg-fintech-green-50/50 border border-fintech-green-100 text-fintech-green-800 text-xs font-bold tracking-wide rounded-lg shadow-sm">
                    {h}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dynamic Checkout Overlay Gateway */}
      <MockRazorpay 
        isOpen={isRazorpayOpen} 
        onClose={() => setIsRazorpayOpen(false)} 
        amount={amount}
        fundName={fund.name}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
