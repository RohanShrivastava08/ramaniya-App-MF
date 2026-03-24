import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Landmark, Smartphone, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from './Button';

export function MockRazorpay({ isOpen, onClose, amount, fundName, onSuccess }) {
  const [status, setStatus] = useState('idle'); // idle, method_selected, processing, success
  const [method, setMethod] = useState(null); // 'upi', 'card', 'netbanking'
  
  // Custom Input hooks logically mocked
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    // Basic authentic user-feel validations
    if (method === 'upi' && upiId.length < 5) return alert("Security Error: Invalid UPI ID structure.");
    if (method === 'card') {
       if (cardNumber.replace(/\s/g, '').length !== 16) return alert("Security Error: Card Number must be exactly 16 digits.");
       if (cvv.length !== 3) return alert("Security Error: CVV must be exactly 3 digits.");
       if (expiry.length !== 5) return alert("Security Error: Expiry must match MM/YY format.");
    }

    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        setTimeout(() => {
           setStatus('idle');
           setMethod(null);
           setUpiId('');
           setCardNumber('');
        }, 500);
      }, 1500); 
    }, 2500); 
  };

  const handleMethodSelect = (m) => {
    setMethod(m);
    setStatus('method_selected');
  };

  const goBack = () => {
    setMethod(null);
    setStatus('idle');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          onClick={(status === 'idle' || status === 'method_selected') ? onClose : undefined} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-[420px] overflow-hidden flex flex-col border border-slate-100"
        >
          {status === 'success' ? (
             <div className="p-16 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 bg-white">
               <div className="w-24 h-24 bg-fintech-green-50 text-fintech-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-fintech-green-50/50">
                 <CheckCircle2 size={48} strokeWidth={3} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Payment Successful</h2>
               <p className="text-slate-500 font-medium text-lg">Authorizing secure mandate securely...</p>
             </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-[#0c1c38] p-6 text-white relative shadow-md z-10">
                <button 
                  onClick={onClose}
                  className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
                  disabled={status === 'processing'}
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                  {status === 'method_selected' && (
                    <button onClick={goBack} className="mr-1 hover:bg-white/10 p-1.5 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                  )}
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-black tracking-tighter shadow-md border border-blue-400/50 text-xl">R</div>
                  <div className="font-bold text-xl tracking-wide">Razorpay <span className="text-white/30 font-medium ml-1">| Demo</span></div>
                </div>
                
                <div className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2 bg-blue-900/50 inline-block px-3 py-1 rounded-full border border-blue-400/20">{fundName}</div>
                <div className="text-4xl font-black flex items-center gap-1.5 tracking-tight mt-1">
                  <span className="text-white/40 text-3xl font-normal">₹</span> {Number(amount).toLocaleString()}
                </div>
              </div>

              {/* Methods Body */}
              <div className="bg-slate-50 p-6 flex-1 relative min-h-[340px]">
                {status === 'processing' && (
                  <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in">
                    <Loader2 size={56} className="text-blue-600 animate-spin mb-6" />
                    <p className="text-slate-900 font-black text-2xl tracking-tight mb-2">Processing Securely</p>
                    <p className="text-slate-500 text-sm font-bold bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mt-2">Do not close this window</p>
                  </div>
                )}

                {status === 'idle' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Supported Payment Networks</p>
                    
                    <div className="space-y-3">
                      <button onClick={() => handleMethodSelect('upi')} className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm"><Smartphone size={24}/></div>
                        <div className="text-left">
                          <p className="font-black text-slate-900 text-base">UPI / QR Scan</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </button>
                      
                      <button onClick={() => handleMethodSelect('card')} className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm"><CreditCard size={24}/></div>
                        <div className="text-left">
                          <p className="font-black text-slate-900 text-base">Credit / Debit Card</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">Visa, MasterCard, RuPay</p>
                        </div>
                      </button>

                      <button onClick={() => handleMethodSelect('netbanking')} className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm"><Landmark size={24}/></div>
                        <div className="text-left">
                          <p className="font-black text-slate-900 text-base">Netbanking</p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">All Indian banks supported</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {status === 'method_selected' && method === 'upi' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <p className="text-base font-black text-slate-900 mb-6 flex items-center gap-2"><Smartphone size={20} className="text-blue-600"/> Pay with UPI Gateway</p>
                     <div className="mb-8">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-1">Target VPA / UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. yourname@okhdfcbank" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-lg shadow-sm placeholder-slate-300 transition-all" 
                        />
                     </div>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-16 shadow-lg shadow-blue-600/20 rounded-2xl text-lg hover:-translate-y-1 transition-all" onClick={handlePay}>Pay securely ₹{Number(amount).toLocaleString()}</Button>
                  </div>
                )}

                {status === 'method_selected' && method === 'card' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <p className="text-base font-black text-slate-900 mb-6 flex items-center gap-2"><CreditCard size={20} className="text-blue-600"/> Add New Card Payload</p>
                     <div className="space-y-5 mb-8">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444" 
                            value={cardNumber}
                            maxLength={16}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-black text-lg font-mono tracking-widest shadow-sm placeholder-slate-200 transition-all" 
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Expiry</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              value={expiry}
                              maxLength={5}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-lg shadow-sm placeholder-slate-200 transition-all text-center" 
                            />
                          </div>
                          <div className="flex-[0.8]">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">CVV</label>
                            <input 
                              type="password" 
                              placeholder="***" 
                              maxLength={4}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-lg font-mono tracking-[0.3em] shadow-sm placeholder-slate-200 text-center transition-all" 
                            />
                          </div>
                        </div>
                     </div>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-16 shadow-lg shadow-blue-600/20 rounded-2xl text-lg hover:-translate-y-1 transition-all" onClick={handlePay}>Pay securely ₹{Number(amount).toLocaleString()}</Button>
                  </div>
                )}

                {status === 'method_selected' && method === 'netbanking' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
                     <Landmark size={56} className="text-slate-300 mx-auto mb-6" />
                     <p className="text-base font-bold text-slate-700 mb-8 max-w-xs mx-auto">Redirecting to banking portal is securely mocked for this structural frontend demo.</p>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-16 shadow-lg shadow-blue-600/20 rounded-2xl text-lg hover:-translate-y-1 transition-all" onClick={handlePay}>Simulate Validation ₹{Number(amount).toLocaleString()}</Button>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] rounded-b-2xl">
                <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-blue-500" /> SECURED BY RAZORPAY</span>
                <span>PCI DSS Compliant</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
