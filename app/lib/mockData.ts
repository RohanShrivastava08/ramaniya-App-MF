/* mockData.js */
const generateChart = (base: number) => {
  return [
    { name: 'Jan', val: base * 0.9 },
    { name: 'Feb', val: base * 0.95 },
    { name: 'Mar', val: base * 0.92 },
    { name: 'Apr', val: base * 1.05 },
    { name: 'May', val: base * 1.02 },
    { name: 'Jun', val: base }
  ];
};

export const MOCK_FUNDS = [
  // EQUITY
  { id: "e1", name: "Parag Parikh Flexi Cap Fund", category: "Equity", risk: "Very High", cagr3Y: "19.5", nav: "74.25", fundSize: "₹ 55,000 Cr", expenseRatio: "0.65%", fundManager: "Rajeev Thakkar", inceptionDate: "May 2013", currentReturn: 0.045, topHoldings: ["HDFC Bank", "ITC Ltd", "Alphabet Inc"], chartData: generateChart(74.25) },
  { id: "e2", name: "Axis Small Cap Fund", category: "Equity", risk: "Very High", cagr3Y: "24.1", nav: "85.30", fundSize: "₹ 14,000 Cr", expenseRatio: "0.52%", fundManager: "Shreyash Devalkar", inceptionDate: "Nov 2013", currentReturn: -0.015, topHoldings: ["Narayana Hrudayalaya", "Galaxy Surfactants"], chartData: generateChart(85.30) },
  { id: "e3", name: "Nippon India Small Cap", category: "Equity", risk: "Very High", cagr3Y: "38.2", nav: "145.20", fundSize: "₹ 42,000 Cr", expenseRatio: "0.68%", fundManager: "Samir Rachh", inceptionDate: "Sep 2010", currentReturn: 0.075, topHoldings: ["Tube Investments", "HDFC Bank"], chartData: generateChart(145.2) },
  { id: "e4", name: "HDFC Mid-Cap Opportunities", category: "Equity", risk: "High", cagr3Y: "22.5", nav: "128.90", fundSize: "₹ 55,000 Cr", expenseRatio: "0.85%", fundManager: "Chirag Setalvad", inceptionDate: "Jun 2007", currentReturn: 0.035, topHoldings: ["Indian Hotels", "Tata Comm"], chartData: generateChart(128.9) },
  { id: "e5", name: "Mirae Asset Large Cap", category: "Equity", risk: "High", cagr3Y: "15.8", nav: "95.40", fundSize: "₹ 35,000 Cr", expenseRatio: "0.54%", fundManager: "Gaurav Misra", inceptionDate: "Apr 2008", currentReturn: 0.021, topHoldings: ["Reliance Ind", "ICICI Bank"], chartData: generateChart(95.4) },
  { id: "e6", name: "Quant Active Fund", category: "Equity", risk: "Very High", cagr3Y: "28.4", nav: "60.10", fundSize: "₹ 8,000 Cr", expenseRatio: "0.77%", fundManager: "Sanjeev Sharma", inceptionDate: "Apr 2001", currentReturn: 0.055, topHoldings: ["ITC", "State Bank of India"], chartData: generateChart(60.1) },
  { id: "e7", name: "SBI Bluechip Fund", category: "Equity", risk: "High", cagr3Y: "14.2", nav: "78.50", fundSize: "₹ 38,000 Cr", expenseRatio: "0.80%", fundManager: "Sohini Andani", inceptionDate: "Feb 2006", currentReturn: 0.018, topHoldings: ["HDFC Bank", "Larsen & Toubro"], chartData: generateChart(78.5) },
  { id: "e8", name: "Kotak Emerging Equity", category: "Equity", risk: "Very High", cagr3Y: "25.6", nav: "105.80", fundSize: "₹ 32,000 Cr", expenseRatio: "0.65%", fundManager: "Pankaj Tibrewal", inceptionDate: "Mar 2007", currentReturn: 0.042, topHoldings: ["Supreme Ind", "Schaeffler India"], chartData: generateChart(105.8) },

  // DEBT
  { id: "d1", name: "SBI Magnum Gilt Fund", category: "Debt", risk: "Moderate", cagr3Y: "7.2", nav: "58.10", fundSize: "₹ 8,400 Cr", expenseRatio: "0.45%", fundManager: "Dinesh Ahuja", inceptionDate: "Dec 2000", currentReturn: 0.012, topHoldings: ["GOI 2033", "GOI 2028"], chartData: generateChart(58.1) },
  { id: "d2", name: "HDFC Short Term Debt", category: "Debt", risk: "Low", cagr3Y: "6.5", nav: "28.40", fundSize: "₹ 18,000 Cr", expenseRatio: "0.30%", fundManager: "Anil Bamboli", inceptionDate: "Jun 2010", currentReturn: 0.008, topHoldings: ["GOI 2026", "NABARD Bonds"], chartData: generateChart(28.4) },
  { id: "d3", name: "ICICI Pru Corporate Bond", category: "Debt", risk: "Low", cagr3Y: "7.8", nav: "42.15", fundSize: "₹ 24,000 Cr", expenseRatio: "0.28%", fundManager: "Rahul Goswami", inceptionDate: "Jul 2018", currentReturn: 0.011, topHoldings: ["HDFC Bank Bonds", "REC Ltd"], chartData: generateChart(42.15) },
  { id: "d4", name: "Kotak Liquid Fund", category: "Debt", risk: "Low", cagr3Y: "5.9", nav: "4450.20", fundSize: "₹ 45,000 Cr", expenseRatio: "0.15%", fundManager: "Deepak Agrawal", inceptionDate: "Nov 2003", currentReturn: 0.005, topHoldings: ["Treasury Bills", "RBI Bonds"], chartData: generateChart(4450.2) },
  { id: "d5", name: "Nippon India Liquid Fund", category: "Debt", risk: "Low", cagr3Y: "6.0", nav: "5600.80", fundSize: "₹ 38,000 Cr", expenseRatio: "0.16%", fundManager: "Anju Chhajer", inceptionDate: "Jan 2004", currentReturn: 0.004, topHoldings: ["T-Bills 91D", "Canara Bank CD"], chartData: generateChart(5600.8) },

  // HYBRID
  { id: "h1", name: "ICICI Prudential Equity & Debt", category: "Hybrid", risk: "High", cagr3Y: "14.8", nav: "310.45", fundSize: "₹ 28,000 Cr", expenseRatio: "1.10%", fundManager: "Sankaran Naren", inceptionDate: "Nov 1999", currentReturn: 0.028, topHoldings: ["NTPC", "ICICI Bank", "GOI 2032"], chartData: generateChart(310.45) },
  { id: "h2", name: "SBI Equity Hybrid", category: "Hybrid", risk: "High", cagr3Y: "13.5", nav: "245.80", fundSize: "₹ 62,000 Cr", expenseRatio: "0.75%", fundManager: "R Srinivasan", inceptionDate: "Dec 1995", currentReturn: 0.022, topHoldings: ["HDFC Bank", "Infosys", "GOI 2028"], chartData: generateChart(245.8) },
  { id: "h3", name: "HDFC Balanced Advantage", category: "Hybrid", risk: "High", cagr3Y: "18.2", nav: "410.20", fundSize: "₹ 70,000 Cr", expenseRatio: "0.85%", fundManager: "Gopal Agrawal", inceptionDate: "Sep 2000", currentReturn: 0.031, topHoldings: ["SBI", "Reliance Ind", "GOI Sec"], chartData: generateChart(410.2) },
  { id: "h4", name: "Kotak Equity Arbitrage", category: "Hybrid", risk: "Low", cagr3Y: "6.8", nav: "34.50", fundSize: "₹ 28,000 Cr", expenseRatio: "0.35%", fundManager: "Deepak Gupta", inceptionDate: "Aug 2005", currentReturn: 0.009, topHoldings: ["HDFC Bank Futures", "Reliance Futures"], chartData: generateChart(34.5) },
  { id: "h5", name: "Tata Balanced Advantage", category: "Hybrid", risk: "Moderate", cagr3Y: "12.4", nav: "88.90", fundSize: "₹ 8,500 Cr", expenseRatio: "0.65%", fundManager: "Rahul Singh", inceptionDate: "Jan 2019", currentReturn: 0.015, topHoldings: ["TCS", "HDFC Bank", "Treasury Bills"], chartData: generateChart(88.9) }
];
