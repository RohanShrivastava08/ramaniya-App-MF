import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ExploreFunds } from './pages/ExploreFunds';
import { InvestFlow } from './pages/InvestFlow';
import { Onboarding } from './pages/Onboarding';
import { News } from './pages/News';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('ramaniya_user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function KycProtectedRoute({ children }) {
  const user = localStorage.getItem('ramaniya_user');
  if (!user) return <Navigate to="/" replace />;
  
  const kyc = localStorage.getItem('ramaniya_kyc');
  if (!kyc) return <Navigate to="/onboarding" replace />;
  
  return children;
}

function App() {
  useEffect(() => {
    document.title = "Ramaniya | Invest Smarter, Grow Wealth";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/news" element={<News />} />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <KycProtectedRoute>
              <Dashboard />
            </KycProtectedRoute>
          } 
        />
        <Route 
          path="/funds" 
          element={
            <ProtectedRoute>
              <ExploreFunds />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/invest/:fundId" 
          element={
            <KycProtectedRoute>
              <InvestFlow />
            </KycProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
