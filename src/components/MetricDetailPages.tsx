import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ShieldAlert, 
  Info, 
  LineChart, 
  Layers, 
  Globe2, 
  Scale, 
  CheckCircle,
  HelpCircle,
  Zap,
  Percent,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { EvaluationData } from '../types';

interface MetricDetailPagesProps {
  activeTab: 'revenue' | 'valuation' | 'debt' | 'cashflow';
  onClose: () => void;
  onSelectTab: (tab: 'revenue' | 'valuation' | 'debt' | 'cashflow') => void;
  data: EvaluationData;
  t_rev1y: number;
  t_rev3y: number;
  t_rev5y: number;
  t_pe: number;
  t_fpe: number;
  t_ps: number;
  t_evEbitda: number;
  t_de: number;
  t_interestCoverage: number;
  t_netDebt: number;
  t_ocf: number;
  t_capex: number;
  t_fcfGrowth: number;
  t_qualitative: number;
  t_beta: number;
  t_baseGrowth: number;
}

export default function MetricDetailPages({
  activeTab,
  onClose,
  onSelectTab,
  data,
  t_rev1y,
  t_rev3y,
  t_rev5y,
  t_pe,
  t_fpe,
  t_ps,
  t_evEbitda,
  t_de,
  t_interestCoverage,
  t_netDebt,
  t_ocf,
  t_capex,
  t_fcfGrowth,
  t_qualitative,
  t_beta,
  t_baseGrowth
}: MetricDetailPagesProps) {

  // Dynamic values based on overridden sliders for realistic outputs
  const derivedMetrics = useMemo(() => {
    // 1. Core scale index based on OCF or nominal scale
    const rawValScale = Math.max(10, Math.round(data.operatingCashFlow * 4)); 
    
    // 2. Revenue trend construction
    const currentRev = parseFloat((rawValScale).toFixed(1));
    const gr1 = t_rev1y / 100;
    const gr3 = t_rev3y / 100;
    const gr5 = t_rev5y / 100;

    const revY5 = currentRev / Math.pow(1 + gr5, 4);
    const revY4 = revY5 * (1 + gr5);
    const revY3 = revY5 * Math.pow(1 + gr5, 2);
    const revY2 = currentRev / (1 + gr1);
    const revY1 = currentRev;

    const revTrend = [revY5, revY4, revY3, revY2, revY1].map(v => Math.max(0.5, parseFloat(v.toFixed(1))));

    // Future cases: bull, base, bear revenue
    const baseProj = [1, 2, 3].map(y => currentRev * Math.pow(1 + gr3, y));
    const bullProj = [1, 2, 3].map(y => currentRev * Math.pow(1 + (gr3 * 1.35 + 0.04), y));
    const bearProj = [1, 2, 3].map(y => currentRev * Math.pow(1 + (gr3 * 0.4 - 0.02), y));

    // 3. Segment revenue based on sector
    let segments: { name: string; share: number }[] = [];
    const secLower = (data.sector || '').toLowerCase();
    
    if (secLower.includes('semiconductor') || data.ticker === 'NVDA') {
      segments = [
        { name: "AI Compute Platform & Blackwell Hardware", share: 82 },
        { name: "GeForce Graphics & Gaming GPUs", share: 12 },
        { name: "Enterprise Visual Cloud Licenses", share: 4 },
        { name: "Automotive Advanced Driver Systems", share: 2 }
      ];
    } else if (secLower.includes('consumer electronics') || data.ticker === 'AAPL') {
      segments = [
        { name: "iPhone hardware & premium devices", share: 50 },
        { name: "Recurring App Store, iCloud & Paid Subscriptions", share: 24 },
        { name: "Wearables, Watch & Audio Accessories", share: 11 },
        { name: "Mac computing lines", share: 8 },
        { name: "iPad multi-role lines", share: 7 }
      ];
    } else if (secLower.includes('automotive') || secLower.includes('energy') && data.ticker === 'TSLA') {
      segments = [
        { name: "Automotive vehicle manufacturing deliveries", share: 80 },
        { name: "Megapack & Powerwall Grid Batteries", share: 11 },
        { name: "Software licensing, FSD & Superchargers", share: 6 },
        { name: "Automotive Carbon Regulatory Credits", share: 3 }
      ];
    } else if (secLower.includes('energy') || secLower.includes('power') || data.ticker === 'RELIANCE') {
      segments = [
        { name: "Refining & Oil-to-Chemicals (O2C)", share: 58 },
        { name: "Broad Retail & consumer chains", share: 18 },
        { name: "Jio Digital telecom subscribers network", share: 18 },
        { name: "Upstream Oil & alternative energy projects", share: 6 }
      ];
    } else if (secLower.includes('bank') || secLower.includes('financ') || data.ticker === 'HDFC' || data.ticker === 'ICICI') {
      segments = [
        { name: "Retail Banking Products (Home/Car Loans)", share: 55 },
        { name: "Wholesale & Business lending facilities", share: 28 },
        { name: "Investment banking, Brokerage & Mutual Funds", share: 12 },
        { name: "Private Equity & Treasury Operations", share: 5 }
      ];
    } else if (secLower.includes('consult') || secLower.includes('service') || secLower.includes('it') || data.ticker === 'TCS' || data.ticker === 'INFY') {
      segments = [
        { name: "Global Application Support & Services", share: 62 },
        { name: "Enterprise Cloud & AI Migration systems", share: 25 },
        { name: "Consulting & organizational transformation", share: 10 },
        { name: "Platforms, Proprietary IP & Software", share: 3 }
      ];
    } else {
      segments = [
        { name: "Core Business Segments", share: 55 },
        { name: "Premium Products Offering", share: 25 },
        { name: "International Supply Division", share: 15 },
        { name: "Ancillary royalty licensing", share: 5 }
      ];
    }

    // 4. Geographic segment
    let geography: { name: string; share: number }[] = [];
    if (data.country === 'India' || (data.name || '').includes('Tata') || (data.name || '').includes('Reliance') || (data.name || '').includes('Bank')) {
      geography = [
        { name: "Domestic (India Union)", share: 65 },
        { name: "North Americas Region", share: 20 },
        { name: "Europe & UK", share: 10 },
        { name: "Middle East & APAC Others", share: 5 }
      ];
    } else if (data.country === 'United States' || ['AAPL', 'NVDA', 'TSLA'].includes(data.ticker)) {
      geography = [
        { name: "North Americas Union", share: 44 },
        { name: "Europe, ME & Africa (EMEA)", share: 28 },
        { name: "Greater China Zone", share: 18 },
        { name: "APAC & Japan Region", share: 10 }
      ];
    } else {
      geography = [
        { name: "Primary domestic market", share: 50 },
        { name: "Secondary key regional corridor", share: 30 },
        { name: "Emerging markets & rest of world", share: 20 }
      ];
    }

    // 5. Valuation Multiple analysis comparing with sector average and peers
    let dynamicSectorAvgPE = 18.5;
    let dynamicPeers: { name: string; pe: number }[] = [];

    if (secLower.includes('semiconductor') || data.ticker === 'NVDA') {
      dynamicSectorAvgPE = 34.5;
      dynamicPeers = [
        { name: "Advanced Micro Devices (AMD)", pe: 48.2 },
        { name: "Broadcom Inc (AVGO)", pe: 30.5 },
        { name: "Intel Corporation (INTC)", pe: 24.8 }
      ];
    } else if (secLower.includes('consumer electronics') || data.ticker === 'AAPL') {
      dynamicSectorAvgPE = 26.2;
      dynamicPeers = [
        { name: "Microsoft Corp (MSFT)", pe: 33.8 },
        { name: "Alphabet Inc (GOOGL)", pe: 24.2 },
        { name: "Meta Platforms (META)", pe: 23.5 }
      ];
    } else if (secLower.includes('automotive') || data.ticker === 'TSLA') {
      dynamicSectorAvgPE = 15.4;
      dynamicPeers = [
        { name: "BYD Ltd Co (BYD)", pe: 19.5 },
        { name: "Toyota Motor Corp (TM)", pe: 11.2 },
        { name: "General Motors Co (GM)", pe: 5.4 }
      ];
    } else if (secLower.includes('bank') || secLower.includes('financ')) {
      dynamicSectorAvgPE = 12.8;
      dynamicPeers = [
        { name: "JPMorgan Chase & Co", pe: 12.2 },
        { name: "ICICI Bank Ltd ADR", pe: 16.8 },
        { name: "State Bank of India", pe: 10.5 }
      ];
    } else {
      dynamicSectorAvgPE = parseFloat((Math.max(12, t_pe * 0.75)).toFixed(1));
      dynamicPeers = [
        { name: "Industry Peer A", pe: parseFloat((t_pe * 1.15).toFixed(1)) },
        { name: "Industry Peer B", pe: parseFloat((t_pe * 0.85).toFixed(1)) },
        { name: "Sector Average Baseline", pe: dynamicSectorAvgPE }
      ];
    }

    // Dynamic Valuation Status
    const peg = t_pe / Math.max(1, t_rev3y);
    let valStatus: 'Undervalued' | 'Fair Value' | 'Overvalued' = 'Fair Value';
    let valStatusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    let valStatusExplanation = '';

    if (peg < 1.0) {
      valStatus = 'Undervalued';
      valStatusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      valStatusExplanation = `Evaluating ${data.name} at a PE of ${t_pe}x against a strong historical 3-year CAGR of ${t_rev3y}% results in a PEG index of ${peg.toFixed(2)}x. This is comfortably below the classic institutional benchmark (1.0x), indicating that current equity pricing represents a discount relative to its earnings growth potential.`;
    } else if (peg > 2.2) {
      valStatus = 'Overvalued';
      valStatusColor = 'text-rose-700 bg-rose-50 border-rose-200';
      valStatusExplanation = `The PEG metric sits exceptionally high at ${peg.toFixed(2)}x, with a PE multiple of ${t_pe}x and an overridden 3-year CAGR core target of ${t_rev3y}%. Valuation is extended relative to active underlying growth rates. Premium levels imply high exposure if upcoming strategic upgrades or product supercycles face timeline delays.`;
    } else {
      valStatus = 'Fair Value';
      valStatusExplanation = `A dynamic PEG quotient of ${peg.toFixed(2)}x indicates that ${data.name}'s current valuation multiple is well-matched with sector average multipliers and its nominal operating projections of ${t_rev3y}% CAGR. While not an extreme value bargain, the stock is fairly valued given its competitive moat and business operations baseline.`;
    }

    // 6. Balance sheet trend
    const currentDebtVal = parseFloat((rawValScale * t_de * 1.1).toFixed(1));
    const debtY5 = currentDebtVal * 1.25;
    const debtY4 = currentDebtVal * 1.15;
    const debtY3 = currentDebtVal * 1.08;
    const debtY2 = currentDebtVal * 0.95;
    const debtY1 = currentDebtVal;
    
    const debtTrend = [debtY5, debtY4, debtY3, debtY2, debtY1].map(v => Math.max(0.1, parseFloat(v.toFixed(1))));

    // Sustainability answers
    const isIncreasing = debtTrend[4] > debtTrend[2];
    const isSustainable = t_interestCoverage > 10;
    const hasFlexibility = t_de < 1.0 && t_interestCoverage > 8;

    return {
      currentRev,
      revTrend,
      baseProj,
      bullProj,
      bearProj,
      segments,
      geography,
      dynamicSectorAvgPE,
      dynamicPeers,
      valStatus,
      valStatusColor,
      valStatusExplanation,
      peg,
      currentDebtVal,
      debtTrend,
      isIncreasing,
      isSustainable,
      hasFlexibility
    };

  }, [data, t_rev1y, t_rev3y, t_rev5y, t_pe, t_de, t_ocf, t_capex, t_interestCoverage]);

  // Max value in revenue trend helper for SVG heights
  const maxTrendVal = Math.max(...derivedMetrics.revTrend, ...derivedMetrics.bullProj) * 1.1;
  const maxDebtVal = Math.max(...derivedMetrics.debtTrend) * 1.1;

  return (
    <div className="bg-white border border-slate-300 shadow-lg flex flex-col w-full text-[#1a1c1e] min-h-[500px]" id="metric-deep-panel-shell">
      
      {/* Detail Bar Headband */}
      <div className="bg-[#1a1c1e] text-white p-3.5 flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-slate-900 gap-3" id="metric-detail-header">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition duration-150 font-extrabold uppercase text-[10px] tracking-wider"
          id="btn-back-to-dashboard"
        >
          <ArrowLeft size={14} className="text-emerald-400" /> Back to Dashboard
        </button>

        <div className="flex flex-wrap gap-1.5" id="metric-tab-navigator">
          {[
            { id: 'revenue', label: 'A) Revenue Growth', icon: TrendingUp },
            { id: 'valuation', label: 'B) Valuation Metrics', icon: Scale },
            { id: 'debt', label: 'C) Debt & Solvency', icon: Activity },
            { id: 'cashflow', label: 'D) Cash Flow Trends', icon: DollarSign }
          ].map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => onSelectTab(tabItem.id as any)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${activeTab === tabItem.id ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' : 'bg-white/10 border-white/15 hover:bg-white/15 text-slate-200'}`}
              id={`tab-select-${tabItem.id}`}
            >
              <tabItem.icon size={11} />
              {tabItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Core Content Body */}
      <div className="p-4 lg:p-6 space-y-6 flex-1" id="metric-detail-body">
        
        {/* REVENUE ROW DETAILS */}
        {activeTab === 'revenue' && (
          <div className="space-y-6" id="revenue-growth-detail-panel">
            
            {/* Intro Header */}
            <div>
              <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 uppercase font-black px-2 py-0.5 inline-block mb-1.5">Executive Module A</span>
              <h2 className="text-xl lg:text-2xl font-black text-[#1a1c1e] tracking-tight uppercase flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-600" /> Revenue Growth Deep Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-3xl">
                A quantitative assessment of <strong>{data.name}</strong>'s historical revenue compound rates alongside future multi-case trajectory models. CAGR parameters are live-linked to the left score tuning sliders.
              </p>
            </div>

            {/* CAGRs & Key Cards Block */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">1-Year Rate (FY24)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">+{t_rev1y.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Annual expansion velocity</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">3-Year CAGR (Targeted)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">+{t_rev3y.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Medium-term strategic run-rate</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">5-Year CAGR (Historical)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">+{t_rev5y.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Long-term systemic compounding</span>
              </div>
              <div className="p-3.5 bg-[#1a1c1e] text-white flex flex-col justify-between">
                <span className="text-[10px] uppercase font-extrabold text-slate-400">Estimated Current Scale</span>
                <span className="text-3xl font-black font-mono text-emerald-400 mt-2">${derivedMetrics.currentRev.toFixed(1)}B</span>
                <span className="text-[9px] text-emerald-400 mt-1 uppercase font-extrabold">Scaled operational receipts</span>
              </div>
            </div>

            {/* Charts & Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 5Y Historical Trend Line */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <LineChart size={13} className="text-emerald-600" /> 5-Year Historical Revenue Trend ($B)
                </h3>
                
                {/* Custom Responsive SVG line trend chart */}
                <div className="h-56 relative pt-4 flex flex-col justify-between">
                  {/* Grid Lines mockup */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                  </div>

                  {/* Graph Canvas */}
                  <svg className="w-full h-full z-10 overflow-visible" viewBox="0 0 500 180">
                    <defs>
                      <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>

                    {/* Shaded Area */}
                    <path
                      d={`M10,${160 - (derivedMetrics.revTrend[0]/maxTrendVal)*150} 
                          L120,${160 - (derivedMetrics.revTrend[1]/maxTrendVal)*150} 
                          L240,${160 - (derivedMetrics.revTrend[2]/maxTrendVal)*150} 
                          L360,${160 - (derivedMetrics.revTrend[3]/maxTrendVal)*150} 
                          L480,${160 - (derivedMetrics.revTrend[4]/maxTrendVal)*150} 
                          L480,170 L10,170 Z`}
                      fill="url(#revArea)"
                    />

                    {/* Line path */}
                    <path 
                      d={`M10,${160 - (derivedMetrics.revTrend[0]/maxTrendVal)*150} 
                          L120,${160 - (derivedMetrics.revTrend[1]/maxTrendVal)*150} 
                          L240,${160 - (derivedMetrics.revTrend[2]/maxTrendVal)*150} 
                          L360,${160 - (derivedMetrics.revTrend[3]/maxTrendVal)*150} 
                          L480,${160 - (derivedMetrics.revTrend[4]/maxTrendVal)*150}`} 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />

                    {/* Nodes and Values labels */}
                    {derivedMetrics.revTrend.map((val, idx) => {
                      const cx = 10 + idx * 117.5;
                      const cy = 160 - (val / maxTrendVal) * 150;
                      return (
                        <g key={idx} className="group-hover:opacity-100">
                          <circle cx={cx} cy={cy} r="5.5" fill="#1a1c1e" stroke="#10b981" strokeWidth="2.5" />
                          <rect x={cx - 18} y={cy - 22} width="36" height="15" rx="2" fill="#1a1c1e" />
                          <text x={cx} y={cy - 12} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            ${val}B
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Horizontal Labels */}
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 border-t border-slate-100 pt-1 px-1 font-mono">
                    <span>FY20 (A)</span>
                    <span>FY21 (A)</span>
                    <span>FY22 (A)</span>
                    <span>FY23 (A)</span>
                    <span>FY24 (LATEST)</span>
                  </div>
                </div>
              </div>

              {/* future case multi projections */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#1a1c1e]" /> 3-Year Future Revenue Outlook Matrix ($B)
                </h3>

                <div className="h-56 relative pt-4 flex flex-col justify-between">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                  </div>

                  <svg className="w-full h-full z-10 overflow-visible" viewBox="0 0 500 180">
                    {/* Bull Case: Green Line */}
                    <path 
                      d={`M10,${150 - (derivedMetrics.currentRev/maxTrendVal)*130} 
                          L160,${150 - (derivedMetrics.bullProj[0]/maxTrendVal)*130} 
                          L320,${150 - (derivedMetrics.bullProj[1]/maxTrendVal)*130} 
                          L480,${150 - (derivedMetrics.bullProj[2]/maxTrendVal)*130}`} 
                      fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="3" strokeLinecap="round"
                    />

                    {/* Base Case: Black/Slate line */}
                    <path 
                      d={`M10,${150 - (derivedMetrics.currentRev/maxTrendVal)*130} 
                          L160,${150 - (derivedMetrics.baseProj[0]/maxTrendVal)*130} 
                          L320,${150 - (derivedMetrics.baseProj[1]/maxTrendVal)*130} 
                          L480,${150 - (derivedMetrics.baseProj[2]/maxTrendVal)*130}`} 
                      fill="none" stroke="#1a1c1e" strokeWidth="3" strokeLinecap="round"
                    />

                    {/* Bear Case: Red line */}
                    <path 
                      d={`M10,${150 - (derivedMetrics.currentRev/maxTrendVal)*130} 
                          L160,${150 - (derivedMetrics.bearProj[0]/maxTrendVal)*130} 
                          L320,${150 - (derivedMetrics.bearProj[1]/maxTrendVal)*130} 
                          L480,${150 - (derivedMetrics.bearProj[2]/maxTrendVal)*130}`} 
                      fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4" strokeLinecap="round"
                    />

                    {/* Labels and markers */}
                    <circle cx="480" cy={150 - (derivedMetrics.bullProj[2]/maxTrendVal)*130} r="4" fill="#22c55e" />
                    <text x="490" y={150 - (derivedMetrics.bullProj[2]/maxTrendVal)*130 + 3} fill="#22c55e" fontSize="8.5" fontWeight="bold" fontFamily="monospace">Bull: ${derivedMetrics.bullProj[2].toFixed(1)}B</text>

                    <circle cx="480" cy={150 - (derivedMetrics.baseProj[2]/maxTrendVal)*130} r="4.5" fill="#1a1c1e" />
                    <text x="490" y={150 - (derivedMetrics.baseProj[2]/maxTrendVal)*130 + 3} fill="#1a1c1e" fontSize="8.5" fontWeight="black" fontFamily="monospace">Base: ${derivedMetrics.baseProj[2].toFixed(1)}B</text>

                    <circle cx="480" cy={150 - (derivedMetrics.bearProj[2]/maxTrendVal)*130} r="4" fill="#ef4444" />
                    <text x="490" y={150 - (derivedMetrics.bearProj[2]/maxTrendVal)*130 + 3} fill="#ef4444" fontSize="8.5" fontWeight="bold" fontFamily="monospace">Bear: ${derivedMetrics.bearProj[2].toFixed(1)}B</text>
                  </svg>

                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 border-t border-slate-100 pt-1 px-1 font-mono">
                    <span>LATEST (FY24)</span>
                    <span>FY25 (EST)</span>
                    <span>FY26 (EST)</span>
                    <span>FY27 (EST)</span>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Segment and Geographic Share Table Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Segment-wise Revenue table */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Layers size={13} className="text-slate-600" /> Revenue Contribution (Segment-wise)
                </h4>
                <div className="space-y-2.5">
                  {derivedMetrics.segments.map((seg, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{seg.name}</span>
                        <span className="font-mono font-black">{seg.share}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-[#1a1c1e] h-full" style={{ width: `${seg.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic revenue split */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Globe2 size={13} className="text-slate-600" /> Geographic Footprint Split
                </h4>
                <div className="space-y-2.5">
                  {derivedMetrics.geography.map((geo, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{geo.name}</span>
                        <span className="font-mono font-black">{geo.share}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200">
                        <div className="bg-emerald-600 h-full" style={{ width: `${geo.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Operational Growth Drivers */}
            <div className="p-4 border border-slate-200 bg-emerald-50 bg-opacity-30 space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-emerald-700" /> Top Analyst Qualitative Growth Drivers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <div className="bg-white p-2.5 border border-emerald-100">
                  <strong className="block text-emerald-800 text-[10px] uppercase font-bold mb-1">1. Product Innovation</strong>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">Continuous launch cycles and premium tier upgrade velocities (e.g. specialized custom AI silicon clusters or next-gen software services ecosystem lock-in) driving elevated average sales values.</p>
                </div>
                <div className="bg-white p-2.5 border border-emerald-100">
                  <strong className="block text-emerald-800 text-[10px] uppercase font-bold mb-1">2. Market Expansion</strong>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">Entering secondary geographic zones (such as scaling India regional infrastructure or EMEA enterprise contracts) unlocking multi-year, low-competition recurring pipelines.</p>
                </div>
                <div className="bg-white p-2.5 border border-emerald-100">
                  <strong className="block text-emerald-800 text-[10px] uppercase font-bold mb-1">3. Pricing Power</strong>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">Proprietary switching barriers and strong brand equity allowing the company to transfer macro raw input inflation costs down to the end contractors easily.</p>
                </div>
                <div className="bg-white p-2.5 border border-emerald-100">
                  <strong className="block text-emerald-800 text-[10px] uppercase font-bold mb-1">4. Customer Lock-In</strong>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">Aggressive retention rates with software subscriptions, loyalty architectures or family plan setups, driving down acquisition costs over time.</p>
                </div>
                <div className="bg-white p-2.5 border border-emerald-100">
                  <strong className="block text-emerald-800 text-[10px] uppercase font-bold mb-1">5. Macro Industry Tailwind</strong>
                  <p className="text-slate-600 text-[11px] leading-snug font-medium">Securing early dominant shares in broader macro waves such as global cloud virtualization, semiconductor cycles, clean energy, and AI platforms.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VALUATION ROW DETAILS */}
        {activeTab === 'valuation' && (
          <div className="space-y-6" id="valuation-detail-panel">
            
            {/* Intro Header */}
            <div>
              <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 uppercase font-black px-2 py-0.5 inline-block mb-1.5">Executive Module B</span>
              <h2 className="text-xl lg:text-2xl font-black text-[#1a1c1e] tracking-tight uppercase flex items-center gap-2">
                <Scale size={20} className="text-emerald-600" /> Valuation & Pricing Attractiveness Deep Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-3xl">
                Fundamental ratios and pricing indices constructed to assess valuation quality. Metric parameters dynamically adjust as score levers update on the panel.
              </p>
            </div>

            {/* Status Alert */}
            <div className={`p-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${derivedMetrics.valStatusColor}`}>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#1a1c1e] block">Valuation Status Rating</span>
                <span className="text-xl font-extrabold uppercase block tracking-tight">{derivedMetrics.valStatus}</span>
                <p className="text-xs leading-relaxed max-w-4xl text-[#1a1c1e]/85 pr-2 pt-1 font-medium">{derivedMetrics.valStatusExplanation}</p>
              </div>
              <div className="p-3 bg-white/70 rounded-none border border-[#1a1c1e]/10 text-center shrink-0 w-full md:w-36">
                <span className="text-[8px] uppercase font-bold text-slate-500 block">Calculated PEG</span>
                <span className="text-2xl font-black font-mono text-[#1a1c1e]">{derivedMetrics.peg.toFixed(2)}x</span>
                <span className="text-[7.5px] uppercase font-bold text-slate-400 block mt-0.5">&lt; 1.0x is Undervalued</span>
              </div>
            </div>

            {/* Valuation Multiples bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
              
              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">Current P/E Ratio</span>
                <span className="text-3xl font-black font-mono mt-1 text-[#1a1c1e] block">{t_pe}x</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Historical Avg: 24.5x</p>
              </div>
              
              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">Forward P/E</span>
                <span className="text-3xl font-black font-mono mt-1 text-[#1a1c1e] block">{t_fpe}x</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Estimated next 12M</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">PEG Ratio</span>
                <span className="text-3xl font-black font-mono mt-1 text-[#1a1c1e] block">{derivedMetrics.peg.toFixed(2)}x</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Growth adjusted multiple</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">EV/EBITDA</span>
                <span className="text-3xl font-black font-mono mt-1 text-[#1a1c1e] block">{t_evEbitda}x</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Enterprise Cash Multiple</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">Price/Sales (P/S)</span>
                <span className="text-3xl font-black font-mono mt-1 text-[#1a1c1e] block">{t_ps}x</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Revenue valuation multiple</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 block">FCF Yield %</span>
                <span className="text-3xl font-black font-mono mt-1 text-emerald-600 block">{(((t_ocf - t_capex) / data.currentPrice) * 10).toFixed(1)}%</span>
                <p className="text-[8px] text-slate-400 font-bold border-t border-slate-100 pt-1 mt-1 bg-white/40 pb-0.5">Share premium cash flow</p>
              </div>

            </div>

            {/* Relative peer comparison layout */}
            <div className="p-4 border border-slate-200 bg-white">
              <h3 className="text-xs font-black uppercase text-slate-700 border-b border-slate-100 pb-2 mb-3.5 flex items-center gap-1.5 leading-none">
                <Scale size={13} className="text-slate-600" /> Relative Valuation Peer Comparison (Current P/E Ratio)
              </h3>
              
              <div className="space-y-4">
                
                {/* Active company row */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-extrabold text-[#1a1c1e] uppercase">
                    <span>{data.name} ({data.ticker}) (Target Active Unit)</span>
                    <span className="font-mono">{t_pe}x PE</span>
                  </div>
                  <div className="w-full bg-slate-150 h-5 relative border border-slate-350 bg-slate-100 overflow-hidden">
                    <div className="bg-emerald-600 h-full flex items-center pl-2" style={{ width: `${Math.min(100, (t_pe / 65) * 100)}%` }}>
                      <span className="text-[9px] text-white font-mono font-bold font-sans">Active Target</span>
                    </div>
                  </div>
                </div>

                {/* Peer rows */}
                {derivedMetrics.dynamicPeers.map((peerVal, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{peerVal.name}</span>
                      <span className="font-mono font-bold text-slate-700">{peerVal.pe}x PE</span>
                    </div>
                    <div className="w-full bg-slate-50 h-4 relative border border-slate-200 bg-slate-50 overflow-hidden">
                      <div className="bg-[#1a1c1e]/65 h-full flex items-center pl-2" style={{ width: `${Math.min(100, (peerVal.pe / 65) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}

                {/* Sector average lines */}
                <div className="flex justify-between items-center bg-slate-50 p-2.5 border border-slate-200 mt-2 font-mono text-[10px] text-slate-500">
                  <span className="font-sans font-bold uppercase tracking-tight text-slate-600">Dynamic Sector Average multiple:</span>
                  <strong className="text-slate-800 font-extrabold">{derivedMetrics.dynamicSectorAvgPE}x PE</strong>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* DEBT & BALANCE SHEET DETAILS */}
        {activeTab === 'debt' && (
          <div className="space-y-6" id="debt-solvency-detail-panel">
            
            {/* Intro Header */}
            <div>
              <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 uppercase font-black px-2 py-0.5 inline-block mb-1.5">Executive Module C</span>
              <h2 className="text-xl lg:text-2xl font-black text-[#1a1c1e] tracking-tight uppercase flex items-center gap-2">
                <Activity size={20} className="text-emerald-600" /> Debt Solvency & Balance Sheet Deep Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-3xl">
                A granular assessment of <strong>{data.name}</strong>'s capital structures, leverage indicators, and long-term interest coverage buffers. Metric levels update from side tuners.
              </p>
            </div>

            {/* Core multiples grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Leverage (D/E)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">{t_de.toFixed(2)}x</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Debt to Equity ratio</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Interest Coverage ratio</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">{t_interestCoverage.toFixed(1)}x</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Obligations payment safety margin</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Solvency Debt ($B)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">${t_netDebt.toFixed(1)}B</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Negative implies net asset cash surplus</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Liquidity Ratio</span>
                <span className="text-3xl font-black font-mono text-[#1a1c1e] mt-2">{(Math.min(4.5, Math.max(0.6, 2.5 - (t_de * 0.85)))).toFixed(2)}x</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Sufficient near term liquidity buffer</span>
              </div>
            </div>

            {/* Graph: 5Y Debt levels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Graphic Debt SVG Chart */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-4 lg:col-span-2">
                <h3 className="text-xs font-black uppercase text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5 leading-none">
                  <LineChart size={13} className="text-slate-600" /> 5-Year Total Outstanding Debt Trend ($B)
                </h3>

                <div className="h-56 relative pt-4 flex flex-col justify-between">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                    <div className="border-b border-slate-200 w-full h-[1px]"></div>
                  </div>

                  <svg className="w-full h-full z-10 overflow-visible" viewBox="0 0 500 180">
                    <path 
                      d={`M10,${160 - (derivedMetrics.debtTrend[0]/maxDebtVal)*140} 
                          L120,${160 - (derivedMetrics.debtTrend[1]/maxDebtVal)*140} 
                          L240,${160 - (derivedMetrics.debtTrend[2]/maxDebtVal)*140} 
                          L360,${160 - (derivedMetrics.debtTrend[3]/maxDebtVal)*140} 
                          L480,${160 - (derivedMetrics.debtTrend[4]/maxDebtVal)*140}`} 
                      fill="none" 
                      stroke="#d97706" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />

                    {derivedMetrics.debtTrend.map((val, idx) => {
                      const cx = 10 + idx * 117.5;
                      const cy = 160 - (val / maxDebtVal) * 140;
                      return (
                        <g key={idx}>
                          <circle cx={cx} cy={cy} r="5" fill="#1a1c1e" stroke="#d97706" strokeWidth="2" />
                          <text x={cx} y={cy - 12} textAnchor="middle" fill="#d97706" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                            ${val}B
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 border-t border-slate-100 pt-1 px-1 font-mono">
                    <span>FY20 (A)</span>
                    <span>FY21 (A)</span>
                    <span>FY22 (A)</span>
                    <span>FY23 (A)</span>
                    <span>FY24 (LATEST)</span>
                  </div>
                </div>
              </div>

              {/* Debt sustainability analyst statements */}
              <div className="p-4 border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5 leading-none">
                  <ShieldAlert size={14} className="text-slate-600" /> Analyst Solvency Audit
                </h3>
                
                <div className="space-y-4 text-xs font-medium text-slate-600">
                  <div className="space-y-1 bg-slate-50 p-2.5 border-l-2 border-slate-750">
                    <span className="font-extrabold uppercase text-[10px] text-[#1a1c1e] block">1. Debt Trajectory Status</span>
                    <p className="leading-relaxed">
                      {derivedMetrics.isIncreasing 
                        ? "Total leverage has expanded slightly over the prior multi-year timeline to support intensive operations scale-ups, though short-term maturities remain well-negotiated under favorable fixed interest structures."
                        : "Outstanding global debt has systematically declined or stabilized. High cash conversion has allowed continuous debt redemptions, bolstering structural liquidity index points."}
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-2.5 border-l-2 border-slate-750">
                    <span className="font-extrabold uppercase text-[10px] text-[#1a1c1e] block">2. Solvency Sustainability Audit</span>
                    <p className="leading-relaxed">
                      {derivedMetrics.isSustainable 
                        ? `The outstanding debt level represents low risk. An interest coverage multiple of ${t_interestCoverage.toFixed(1)}x sits comfortably in institutional safety limits as EBIT margins easily offset annual interest obligations.`
                        : `Levegrade concerns are heightened. With low interest coverage multipliers, minor cash cycle squeezes could limit corporate margins or mandate equity issuance dilution.`}
                    </p>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-2.5 border-l-2 border-slate-750">
                    <span className="font-extrabold uppercase text-[10px] text-[#1a1c1e] block">3. Capital Flexibility Offset</span>
                    <p className="leading-relaxed">
                      {derivedMetrics.hasFlexibility 
                        ? "Excellent flexibility. Low leverage and solid credit scores ensure the company can tap commercial credit lines immediately at minimal cost bases for rapid mergers or R&D expansions."
                        : "Constricted operational flexibility. High existing debt covenants limit additional borrowing capacity, constraining the board to internally-funded cash flows for minor capital returns."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* CASH FLOW DETAILS */}
        {activeTab === 'cashflow' && (
          <div className="space-y-6" id="cashflow-detail-panel">
            
            {/* Intro Header */}
            <div>
              <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 uppercase font-black px-2 py-0.5 inline-block mb-1.5">Executive Module D</span>
              <h2 className="text-xl lg:text-2xl font-black text-[#1a1c1e] tracking-tight uppercase flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-600" /> Cash Flow Conversion & Profit Integrity
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-3xl">
                Liquidity audits checking whether net revenue translates cleanly into real free cash flows. Dials dynamically update metric balances.
              </p>
            </div>

            {/* Core cash flow blocks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Operating Cash Flow (OCF)</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-2">${t_ocf.toFixed(1)}B</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Total inflow from basic operations</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Capital Expenditure (CapEx)</span>
                <span className="text-3xl font-black font-mono text-[#1a1c1e] mt-2">${t_capex.toFixed(1)}B</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Investment in plant, hardware & tech</span>
              </div>
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 flex flex-col justify-between shadow-sm">
                <span className="text-[11px] uppercase font-black text-emerald-800">Free Cash Flow (FCF)</span>
                <span className="text-4xl font-black font-mono text-emerald-700 mt-2">${(t_ocf - t_capex).toFixed(1)}B</span>
                <span className="text-[9px] text-emerald-800 mt-1 uppercase font-extrabold flex items-center gap-1"><CheckCircle size={10} /> Discretionary capital generation</span>
              </div>
              <div className="p-3.5 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cash Conversion Ratio</span>
                <span className="text-3xl font-black font-mono text-[#1a1c1e] mt-2">{(data.conversionRatio || 1.05).toFixed(2)}x</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Ratio of OCF to nominal net income</span>
              </div>
            </div>

            {/* Analysis columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Cash generation ability */}
              <div className="p-4 border border-slate-200 bg-white space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <TrendingUp size={16} className="text-emerald-700" />
                </div>
                <h4 className="text-xs font-black uppercase text-[#1a1c1e] border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[10px] tracking-wide">
                  1. Profit Quality Audit
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {data.conversionRatio >= 1.0 
                    ? "Incredible quality of earnings. The cash conversion ratio exceeds 1.0x, verifying that reported net net profits are backed fully by liquid asset receipts. There are no massive 'non-cash' adjustments bloating the accounting income sheets."
                    : "Standard profit quality. A typical portion of earnings resides in slower receivables or seasonal inventory prepayments. However, underlying operating conversion loops remain healthy and positive."}
                </p>
              </div>

              {/* Cash generation ability */}
              <div className="p-4 border border-slate-200 bg-white space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1a1c1e]/10 flex items-center justify-center mb-2">
                  <Activity size={16} className="text-slate-800" />
                </div>
                <h4 className="text-xs font-black uppercase text-[#1a1c1e] border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[10px] tracking-wide">
                  2. Cash Generation Ability
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  With discretionary Free Cash Flow sitting healthy at <strong>${(t_ocf - t_capex).toFixed(1)}B</strong>, the corporate group exhibits robust cash self-funding capabilities. It does not rely on local bank credit cycles or shareholder dilution to run its active operations or scale out newer regional projects.
                </p>
              </div>

              {/* Cash generation sustainability */}
              <div className="p-4 border border-slate-200 bg-white space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  <Layers size={16} className="text-slate-600" />
                </div>
                <h4 className="text-xs font-black uppercase text-[#1a1c1e] border-b border-slate-100 pb-1.5 flex items-center gap-1 text-[10px] tracking-wide">
                  3. Sustainable Capital Returns
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  This level of cash compounding supports incredibly sustainable value redistribution. Operating cash flows can comfortably service the board's ongoing share repurchases, support quarterly cash dividends, pay tax bills, and pay off scheduled maturities without trimming essential R&D.
                </p>
              </div>

            </div>

            {/* FCF formula banner */}
            <div className="p-3 bg-slate-50 text-slate-500 font-mono text-[10px] border border-slate-200 text-center uppercase tracking-tight">
              Institutional Equation: Operating Cash Flow (${t_ocf.toFixed(1)}B) - Capital Expenditures (${t_capex.toFixed(1)}B) = Intrinsic Free Cash Flow (${(t_ocf - t_capex).toFixed(1)}B)
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
