import React, { useState, useEffect, useMemo } from 'react';
import MetricDetailPages from './components/MetricDetailPages';
import { 
  TrendingUp, 
  BarChart3, 
  Search, 
  Building2, 
  Globe2, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  LineChart, 
  Percent, 
  Star, 
  CheckCircle2, 
  UserCheck, 
  Compass, 
  FileText, 
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  ChevronRight,
  Clock,
  Scale
} from 'lucide-react';

// Types matching the server schema
interface ExecutiveSummary {
  businessOverview: string;
  investmentThesis: string;
  majorOpportunities: string[];
  majorRisks: string[];
}

interface CompetitiveAdvantages {
  brandStrength: string;
  networkEffects: string;
  costAdvantage: string;
  technologyAdvantage: string;
  marketPosition: string;
}

interface ManagementQuality {
  leadershipTrackRecord: string;
  capitalAllocation: string;
  transparency: string;
  corporateGovernance: string;
}

interface DashboardAnalysis {
  revenueAnalysis: string;
  profitAnalysis: string;
  marginsAnalysis: string;
  debtAnalysis: string;
  cashFlowAnalysis: string;
}

interface EvaluationData {
  ticker: string;
  name: string;
  country: string;
  sector: string;
  currentPrice: number;
  revenueGrowth1y: number;
  revenueGrowth3yCAGR: number;
  revenueGrowth5yCAGR: number;
  peRatio: number;
  forwardPeRatio: number;
  psRatio: number;
  pbRatio: number;
  evEbitda: number;
  debtToEquity: number;
  interestCoverage: number;
  netDebtBillions: number;
  operatingCashFlow: number;
  capEx: number;
  fcfGrowth: number;
  conversionRatio: number;
  beta: number;
  baseGrowthRate: number;
  wacc: number;
  qualitativeScore: number;
  executiveSummary: ExecutiveSummary;
  strengths: string[];
  risks: string[];
  competitiveAdvantages: CompetitiveAdvantages;
  managementQuality: ManagementQuality;
  dashboardAnalysis: DashboardAnalysis;
}

// Initial state (defaults to AAPL evaluation data to load instantly)
const INITIAL_APP_DATA: EvaluationData = {
  ticker: "AAPL",
  name: "Apple Inc.",
  country: "United States",
  sector: "Technology / Consumer Electronics",
  currentPrice: 185.35,
  revenueGrowth1y: 2.1,
  revenueGrowth3yCAGR: 8.4,
  revenueGrowth5yCAGR: 11.2,
  peRatio: 29.4,
  forwardPeRatio: 26.8,
  psRatio: 7.2,
  pbRatio: 38.4,
  evEbitda: 22.1,
  debtToEquity: 1.45,
  interestCoverage: 41.2,
  netDebtBillions: 65.5,
  operatingCashFlow: 110.5,
  capEx: 10.8,
  fcfGrowth: 9.3,
  conversionRatio: 1.12,
  beta: 1.15,
  baseGrowthRate: 8.5,
  wacc: 8.2,
  qualitativeScore: 9.5,
  executiveSummary: {
    businessOverview: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company's ecosystem consists of iOS, macOS, iPadOS, watchOS, and highly lucrative services like the App Store, Apple Music, Apple Pay, and iCloud. Apple's brand loyalty and ecosystem switching costs represent one of the strongest economic moats in corporate history.",
    investmentThesis: "Apple is a premier long-term wealth compounder. While hardware growth is mature, the services division continues to expand at double-digit rates with 70%+ gross margins. The cash flow engine represents an unmatched safety net, fuel to return ~$100B annually via share buybacks and dividends. Valuation is elevated relative to history, requiring solid execution in AI monetization (Apple Intelligence).",
    majorOpportunities: [
      "Apple Intelligence & AI monetization: Driving an accelerated supercycle of device upgrades across iPhone, iPad, and Mac.",
      "High-margin Services Expansion: Growing monetization of the 2.2B active installed base via subscriptions and advertising.",
      "Spatial Computing / Wearables: Next-generation growth products like Vision Pro and health-oriented Apple Watch features."
    ],
    majorRisks: [
      "Antitrust and regulatory crackdowns globally, specifically targeting App Store margins and default search arrangements.",
      "Supply chain concentration in mainland China and geopolitical friction impacting manufacturing/hardware margins.",
      "Longer hardware upgrade cycles as marginal smartphone innovations slow down."
    ]
  },
  strengths: [
    "Incredible ecosystem lock-in: High customer retention rates and seamless software inter-dependence create a powerful moat.",
    "High-Margin Services segment shifting the business mix toward structural recurring revenue streams.",
    "Elite capital allocation with ROIC exceeding 50% and $100B+ annual buybacks providing strong EPS downside support.",
    "Pricing power: Apple consistently extracts industry-leading premium prices and retains high smartphone profit pool share.",
    "Pristine balance sheet despite massive net shareholder payout capability."
  ],
  risks: [
    "High reliance on premium consumer discretionary spend which is sensitive to severe global recessions.",
    "Heavy geopolitical exposure to US-China tensions and regulatory barriers.",
    "Regulatory mandates forcing sideloading on iOS, threatening App Store's highly profitable take-rate model.",
    "AI disruption: If competitor cloud-based AI assistants bypass traditional app installations or device reliance.",
    "Hardware innovation stagnation extending replacement cycles."
  ],
  competitiveAdvantages: {
    brandStrength: "Exceptional brand equity allowing luxury-tier pricing and driving low customer acquisition costs.",
    networkEffects: "Strong ecosystem synergy where owning multiple devices and sharing family services increases lock-in.",
    costAdvantage: "Unmatched scale enables significant supplier volume discounts and custom proprietary silicon design advantages (M-series, A-series).",
    technologyAdvantage: "Vertically integrated hardware, custom silicon, and software design optimization.",
    marketPosition: "Dominant globally in premium smartphone category and computing segment, commanding highest value margins."
  },
  managementQuality: {
    leadershipTrackRecord: "Led by Tim Cook, who has executed masterclass operational expansion, growing Apple's market cap by trillions.",
    capitalAllocation: "World-class buyback program and selective, high-return R&D spending rather than overpriced acquisitions.",
    transparency: "High execution transparency with clear quarterly guidance updates and disclosures.",
    corporateGovernance: "Excellent independent board oversight, metrics-based executive compensation alignment."
  },
  dashboardAnalysis: {
    revenueAnalysis: "Revenue growth has slowed down in the hardware segment, but Services provides stable underlying growth vectors.",
    profitAnalysis: "Operating margins remain robust above 30%, bolstered by the software-heavy services mix and premium pricing.",
    marginsAnalysis: "Gross margin continues to climb (~46%) driven by chip cost savings from custom silicon and services shift.",
    debtAnalysis: "Negligible credit risk. Highly liquid balance sheet with total cash resources buffering existing debt structures.",
    cashFlowAnalysis: "Exceptional conversion metrics. Free Cash Flow output matches operational flows cleanly for deep payouts."
  }
};

export default function App() {
  // Input state
  const [searchTicker, setSearchTicker] = useState("AAPL");
  const [companyName, setCompanyName] = useState("Apple Inc.");
  const [country, setCountry] = useState("United States");
  const [sector, setSector] = useState("Technology");
  
  // Active evaluation data
  const [data, setData] = useState<EvaluationData>(INITIAL_APP_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isAiLoaded, setIsAiLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Manual tuning parameters state, pre-populated by active data
  const [t_rev1y, setTRev1y] = useState<number>(INITIAL_APP_DATA.revenueGrowth1y);
  const [t_rev3y, setTRev3y] = useState<number>(INITIAL_APP_DATA.revenueGrowth3yCAGR);
  const [t_rev5y, setTRev5y] = useState<number>(INITIAL_APP_DATA.revenueGrowth5yCAGR);
  const [t_pe, setTPE] = useState<number>(INITIAL_APP_DATA.peRatio);
  const [t_fpe, setTFPE] = useState<number>(INITIAL_APP_DATA.forwardPeRatio);
  const [t_ps, setTPS] = useState<number>(INITIAL_APP_DATA.psRatio);
  const [t_evEbitda, setTEvEbitda] = useState<number>(INITIAL_APP_DATA.evEbitda);
  const [t_de, setTDE] = useState<number>(INITIAL_APP_DATA.debtToEquity);
  const [t_interestCoverage, setTInterestCoverage] = useState<number>(INITIAL_APP_DATA.interestCoverage);
  const [t_netDebt, setTNetDebt] = useState<number>(INITIAL_APP_DATA.netDebtBillions);
  const [t_ocf, setTOCF] = useState<number>(INITIAL_APP_DATA.operatingCashFlow);
  const [t_capex, setTCapex] = useState<number>(INITIAL_APP_DATA.capEx);
  const [t_fcfGrowth, setTFCFGrowth] = useState<number>(INITIAL_APP_DATA.fcfGrowth);
  const [t_qualitative, setTQualitative] = useState<number>(INITIAL_APP_DATA.qualitativeScore);
  const [t_beta, setTBeta] = useState<number>(INITIAL_APP_DATA.beta);
  const [t_baseGrowth, setTBaseGrowth] = useState<number>(INITIAL_APP_DATA.baseGrowthRate);
  const [activeMetricDetail, setActiveMetricDetail] = useState<'revenue' | 'valuation' | 'debt' | 'cashflow' | null>(null);

  // Synchronize tuner state when target company data updates
  useEffect(() => {
    setTRev1y(data.revenueGrowth1y);
    setTRev3y(data.revenueGrowth3yCAGR);
    setTRev5y(data.revenueGrowth5yCAGR);
    setTPE(data.peRatio);
    setTFPE(data.forwardPeRatio);
    setTPS(data.psRatio);
    setTEvEbitda(data.evEbitda);
    setTDE(data.debtToEquity);
    setTNetDebt(data.netDebtBillions);
    setTInterestCoverage(data.interestCoverage);
    setTOCF(data.operatingCashFlow);
    setTCapex(data.capEx);
    setTFCFGrowth(data.fcfGrowth);
    setTQualitative(data.qualitativeScore);
    setTBeta(data.beta);
    setTBaseGrowth(data.baseGrowthRate);
  }, [data]);

  // Loading indicator simulator
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep(s => (s < 3 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Quick Select tickers
  const selectQuickTicker = (tickerSymbol: string) => {
    setSearchTicker(tickerSymbol);
    const mockMap: Record<string, string> = {
      AAPL: "Apple Inc.",
      NVDA: "NVIDIA Corporation",
      TSLA: "Tesla Inc."
    };
    setCompanyName(mockMap[tickerSymbol] || "");
    triggerEvaluation(tickerSymbol, mockMap[tickerSymbol] || "");
  };

  // REST API request to Server which handles Gemini API calling
  const triggerEvaluation = async (overrideTicker?: string, overrideCompany?: string) => {
    const activeTicker = (overrideTicker || searchTicker || 'AAPL').toUpperCase().trim();
    const activeCompany = overrideCompany || companyName;

    setIsLoading(true);
    setHasError(null);
    setLoadingStep(0);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: activeTicker,
          company: activeCompany,
          country,
          sector
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned evaluation error status: ${response.status}`);
      }

      const result = await response.json();
      if (result.data) {
        setData(result.data);
        setIsAiLoaded(true);
      } else {
        throw new Error("Invalid response format received from evaluation agent.");
      }
    } catch (err: any) {
      console.error(err);
      setHasError(err.message || 'Error occurred during institutional valuation analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic point calculations linked directly to manual sliders
  const scoredMetrics = useMemo(() => {
    // 1. Growth Score /25
    const avgGrowth = (t_rev1y + t_rev3y + t_rev5y) / 3;
    let revScore = 0;
    if (avgGrowth >= 25) revScore = 24 + Math.min(1, (avgGrowth - 25) / 50);
    else if (avgGrowth >= 15) revScore = 20 + ((avgGrowth - 15) / 10) * 4;
    else if (avgGrowth >= 8) revScore = 15 + ((avgGrowth - 8) / 7) * 5;
    else if (avgGrowth >= 2) revScore = 10 + ((avgGrowth - 2) / 6) * 5;
    else revScore = Math.max(2, ((avgGrowth + 5) / 7) * 10);
    revScore = parseFloat(Math.min(25, Math.max(0, revScore)).toFixed(1));

    // 2. Valuation Score /25
    let valScore = 25;
    if (t_pe > 60) valScore = 10 - Math.min(5, (t_pe - 60) / 10);
    else if (t_pe > 40) valScore = 14 - ((t_pe - 40) / 20) * 4;
    else if (t_pe > 25) valScore = 18 - ((t_pe - 25) / 15) * 4;
    else if (t_pe > 12) valScore = 22 - ((t_pe - 12) / 13) * 4;
    else valScore = 23 + Math.min(2, (12 - t_pe) / 4);

    if (avgGrowth > 20) valScore += 4;
    if (avgGrowth > 40) valScore += 4;
    valScore = parseFloat(Math.min(25, Math.max(0, valScore)).toFixed(1));

    // 3. Debt Score /20
    let debtScore = 20;
    if (t_de < 0.2 && t_interestCoverage > 30) debtScore = 19 + Math.min(1, t_interestCoverage / 100);
    else if (t_de < 0.5 && t_interestCoverage > 15) debtScore = 17 + ((t_interestCoverage - 15) / 15) * 2;
    else if (t_de < 1.0 && t_interestCoverage > 5) debtScore = 13 + ((t_interestCoverage - 5) / 10) * 4;
    else if (t_de < 2.0 && t_interestCoverage > 2) debtScore = 9 + ((t_interestCoverage - 2) / 3) * 4;
    else debtScore = Math.max(2, 8 - (t_de - 2.0) * 2);
    debtScore = parseFloat(Math.min(20, Math.max(0, debtScore)).toFixed(1));

    // 4. Cash Flow Score /20
    const netFCF = t_ocf - t_capex;
    const fcfMargin = t_ocf > 0 ? netFCF / t_ocf : -0.1;
    let cfScore = 15;
    if (fcfMargin > 0.4) cfScore = 18 + Math.min(2, (fcfMargin - 0.4) * 4);
    else if (fcfMargin > 0.15) cfScore = 14 + ((fcfMargin - 0.15) / 0.25) * 4;
    else if (fcfMargin > 0) cfScore = 10 + (fcfMargin / 0.15) * 4;
    else cfScore = Math.max(1, 10 + fcfMargin * 10);
    cfScore = parseFloat(Math.min(20, Math.max(0, cfScore)).toFixed(1));

    // Total points calculation
    const totalScore = parseFloat((revScore + valScore + debtScore + cfScore + t_qualitative).toFixed(1));

    // Recommended actions & stars mapping
    let recommendation = "WATCHLIST";
    let colorTheme = "text-amber-600 bg-amber-50 border-amber-200";
    let starCount = 3;
    let ratingLabel = "Hold / Monitor Closely";

    if (totalScore >= 90) {
      recommendation = "PORTFOLIO ALLOCATION";
      colorTheme = "text-[#854d0e] bg-yellow-50 border-yellow-200";
      starCount = 5;
      ratingLabel = "Exceptional - Active Buy Target";
    } else if (totalScore >= 75) {
      recommendation = "RESEARCH DEEPER (BUY / WATCH)";
      colorTheme = "text-emerald-700 bg-emerald-50 border-emerald-100";
      starCount = 4;
      ratingLabel = "High Quality Case - Await Entry Points";
    } else if (totalScore >= 60) {
      recommendation = "WATCHLIST ONLY";
      colorTheme = "text-blue-700 bg-blue-50 border-blue-100";
      starCount = 3;
      ratingLabel = "Average Moat - Monitor System Risks";
    } else {
      recommendation = "AVOID / HEAVY COV RISK";
      colorTheme = "text-rose-700 bg-rose-50 border-rose-100";
      starCount = 2;
      ratingLabel = "High Risk - Unsustainable Setup";
    }

    return {
      growthPoints: revScore,
      valuationPoints: valScore,
      debtPoints: debtScore,
      cashFlowPoints: cfScore,
      totalScore,
      recommendation,
      colorTheme,
      starCount,
      ratingLabel
    };
  }, [t_rev1y, t_rev3y, t_rev5y, t_pe, t_de, t_ocf, t_capex, t_qualitative, t_interestCoverage]);

  // Market Volatility Sensitivity Matrix Calculation (Beta vs Terminal Growth Rate)
  const sensitivityMatrix = useMemo(() => {
    // We adjust WACC & Growth rate over a 5x5 matrix
    // WACC = RiskFreeRate (4.0) + Beta * Equity Risk Premium (5.5)
    // Cell value represents the intrinsic multiple valuation multiplier derived from Gordon Growth Model:
    // Multiplier = (1 + G) / (WACC - G)
    // We display this multiple as a percentage change relative to the current stock valuation baseline:
    // This perfectly demonstrates valuation sensitivity to market volatility (WACC/Beta) and terminal growth.
    const riskFreeRate = 4.0;
    const marketPremium = 5.5;

    const baseBeta = t_beta;
    const baseG = t_baseGrowth; // e.g. 8.0 %

    // Growth deviations (Rows): -2%, -1%, Base%, +1%, +2%
    const growthRates = [
      Math.max(0.5, baseG - 4.0),
      Math.max(1.0, baseG - 2.0),
      baseG,
      baseG + 2.0,
      baseG + 4.0
    ];

    // Beta deviations due to market volatility (Columns): -0.4, -0.2, Base, +0.2, +0.4
    const betaRatios = [
      Math.max(0.2, baseBeta - 0.4),
      Math.max(0.4, baseBeta - 0.2),
      baseBeta,
      baseBeta + 0.2,
      baseBeta + 0.4
    ];

    const grid = growthRates.map(gVal => {
      return betaRatios.map(betaVal => {
        // Calculate WACC
        const currentWacc = riskFreeRate + (betaVal * marketPremium);
        // Normalized multiple = 1 / (WACC% - G%)
        // Ensure denominator is positive
        const den = Math.max(1.5, currentWacc - (gVal / 2));
        const multiple = 100 / den;
        
        // Calculate deviation from base cell multiplier
        const baseWacc = riskFreeRate + (baseBeta * marketPremium);
        const baseDen = Math.max(1.5, baseWacc - (baseG / 2));
        const baseMultiple = 100 / baseDen;

        const pctChange = ((multiple - baseMultiple) / baseMultiple) * 100;
        const targetValue = data.currentPrice * (1 + pctChange / 100);

        return {
          beta: betaVal,
          growth: gVal,
          targetValue: Math.round(targetValue * 100) / 100,
          pctChange: Math.round(pctChange * 10) / 10
        };
      });
    });

    return {
      betas: betaRatios,
      growths: growthRates,
      grid
    };
  }, [t_beta, t_baseGrowth, data.currentPrice]);

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-[#1a1c1e] flex flex-col font-sans p-4 space-y-4 select-none" id="stock-evaluator-app">
      {/* Premium Institutional Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-2 border-[#1a1c1e] pb-3 mb-1 px-1" id="header-container">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full inline-block"></span>
            Institutional Equity Research | Global Asset Management Model
          </span>
          <h1 className="text-3xl font-black tracking-tighter uppercase mt-1 text-[#1a1c1e] leading-none">
            {data.name} ({data.ticker})
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono mt-2 text-slate-600">
            <span>NASDAQ: {data.ticker}</span>
            <span className="border-l border-slate-300 pl-4">{data.country || 'United States'}</span>
            <span className="border-l border-slate-300 pl-4">Sector: {data.sector || 'Information Technology'}</span>
            <span className="border-l border-slate-300 pl-4 flex items-center gap-1"><Clock size={11} /> Live Terminal 2026</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          <div className="flex items-center gap-3">
            <div id="quick-links" className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-tight mr-1 font-bold">Quick Tickers:</span>
              {["AAPL", "NVDA", "TSLA"].map(sym => (
                <button
                  key={sym} 
                  id={`quick-${sym}`}
                  onClick={() => selectQuickTicker(sym)}
                  className={`px-2 py-1 border transition-all duration-150 cursor-pointer text-[10px] font-black uppercase ${data.ticker === sym ? 'bg-[#1a1c1e] text-white border-[#1a1c1e]' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}
                >
                  {sym === 'AAPL' ? 'Apple' : sym === 'NVDA' ? 'Nvidia' : 'Tesla'}
                </button>
              ))}
            </div>
            
            <div className="text-right border-l border-slate-300 pl-3">
              <div className="text-3xl font-black text-emerald-600 leading-none">
                {scoredMetrics.totalScore}<span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-[9px] font-extrabold uppercase tracking-tighter text-slate-500 mt-0.5">Rating: Exceptional</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 lg:flex flex-col lg:flex-row w-full gap-4" id="main-content">
        
        {/* Left Side: Control Panel (Symbol input + Sliders Tuning) */}
        <aside className="w-full lg:w-[380px] flex flex-col shrink-0 gap-4 overflow-y-auto max-h-none lg:max-h-[calc(100vh-100px)]" id="controls-panel">
          <div className="space-y-4">
            
            {/* Search Card */}
            <div className="bg-white p-3 border border-slate-200 shadow-sm" id="search-card">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1e] flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-3">
                <Search size={13} className="text-slate-600" /> Ticker Discovery Engine
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Ticker Symbol</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="input-ticker-search"
                      value={searchTicker}
                      onChange={(e) => setSearchTicker(e.target.value)}
                      placeholder="e.g. AMZN, AAPL, NVDA"
                      className="w-full p-2 pl-8 pr-4 bg-slate-50 border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#1a1c1e] uppercase font-bold text-[#1a1c1e]"
                    />
                    <Building2 size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name (Optional)</label>
                    <input 
                      type="text" 
                      id="input-company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Amazon Inc"
                      className="w-full p-1.5 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#1a1c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sector (Optional)</label>
                    <input 
                      type="text" 
                      id="input-company-sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="e.g. Technology"
                      className="w-full p-1.5 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#1a1c1e]"
                    />
                  </div>
                </div>

                <button
                  id="btn-evaluate"
                  onClick={() => triggerEvaluation()}
                  disabled={isLoading}
                  className="w-full py-2 bg-[#1a1c1e] border border-[#1a1c1e] hover:bg-slate-800 disabled:bg-slate-300 disabled:border-slate-300 text-white font-extrabold uppercase shadow-sm text-[11px] tracking-wider transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                      Analyst Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-yellow-400" /> Run Institutional evaluation
                    </span>
                  )}
                </button>
                <p className="text-[9px] text-slate-400 text-center leading-normal italic">
                  Utilizes real-time Google Search grounding to retrieve current balance sheet figures and multiple ratios.
                </p>
              </div>
            </div>

            {/* Manual Parameter Tuning Sliders */}
            <div className="bg-white p-3 border border-slate-200 shadow-sm space-y-4" id="tuning-panel">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1e] flex items-center gap-1.5">
                  <Sliders size={13} className="text-slate-600" /> Interactive Score Tuner
                </h2>
                <span className="text-[8px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 border border-slate-200">Manual Override</span>
              </div>

              {/* SECTION 1: BUSINESS GROWTH */}
              <div id="growth-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>1. Business Growth Rate</span>
                  <span className="text-slate-500 font-mono tracking-tight text-[10px]">Points: {scoredMetrics.growthPoints}/25</span>
                </h3>
                <div className="space-y-2.5 px-0.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>1-Year Growth Rate:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_rev1y}%</span>
                    </div>
                    <input 
                      type="range" min="-15" max="100" step="0.5" value={t_rev1y}
                      onChange={(e) => setTRev1y(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>3-Year CAGR Rate:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_rev3y}%</span>
                    </div>
                    <input 
                      type="range" min="-5" max="60" step="0.5" value={t_rev3y}
                      onChange={(e) => setTRev3y(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>5-Year CAGR Rate:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_rev5y}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="0.5" value={t_rev5y}
                      onChange={(e) => setTRev5y(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VALUATION MULTIPLES */}
              <div id="valuation-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>2. Valuation Attractiveness</span>
                  <span className="text-slate-500 font-mono tracking-tight text-[10px]">Points: {scoredMetrics.valuationPoints}/25</span>
                </h3>
                <div className="space-y-2.5 px-0.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>P/E Ratio (Current):</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_pe}x</span>
                    </div>
                    <input 
                      type="range" min="3" max="120" step="0.5" value={t_pe}
                      onChange={(e) => setTPE(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Forward P/E</span>
                      <input 
                        type="number" step="0.1" value={t_fpe}
                        onChange={(e) => setTFPE(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-slate-50 border border-slate-300 font-mono text-xs text-center focus:outline-none focus:border-[#1a1c1e]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Price/Sales (P/S)</span>
                      <input 
                        type="number" step="0.1" value={t_ps}
                        onChange={(e) => setTPS(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-slate-50 border border-slate-300 font-mono text-xs text-center focus:outline-none focus:border-[#1a1c1e]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: BALANCE SHEET & DEBT */}
              <div id="debt-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>3. Balance Sheet Solvency</span>
                  <span className="text-slate-500 font-mono tracking-tight text-[10px]">Points: {scoredMetrics.debtPoints}/20</span>
                </h3>
                <div className="space-y-2.5 px-0.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Debt-to-Equity Ratio:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_de}x</span>
                    </div>
                    <input 
                      type="range" min="0" max="4.5" step="0.05" value={t_de}
                      onChange={(e) => setTDE(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Interest Coverage Ratio:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_interestCoverage}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="150" step="0.5" value={t_interestCoverage}
                      onChange={(e) => setTInterestCoverage(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Net Debt ($B, negative is net cash)</span>
                    <input 
                      type="number" step="0.1" value={t_netDebt}
                      onChange={(e) => setTNetDebt(parseFloat(e.target.value) || 0)}
                      className="w-full p-1 bg-slate-50 border border-slate-300 font-mono text-xs text-center focus:outline-none focus:border-[#1a1c1e]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CASH FLOW */}
              <div id="cashflow-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>4. Cash Flow Integrity</span>
                  <span className="text-slate-500 font-mono tracking-tight text-[10px]">Points: {scoredMetrics.cashFlowPoints}/20</span>
                </h3>
                <div className="space-y-2.5 px-0.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Operating Cash Flow:</span>
                      <span className="font-mono text-[#1a1c1e] font-black">${t_ocf}B</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="150" step="0.5" value={t_ocf}
                      onChange={(e) => setTOCF(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Capital Expenditures (Capex):</span>
                      <span className="font-mono text-[#1a1c1e] font-black">${t_capex}B</span>
                    </div>
                    <input 
                      type="range" min="0" max="60" step="0.5" value={t_capex}
                      onChange={(e) => setTCapex(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1 bg-slate-50 p-2 border border-slate-100 font-sans">
                    <span className="font-semibold text-slate-500">Calculated Free Cash Flow:</span>
                    <span className="font-mono font-black text-[#1a1c1e]">${(t_ocf - t_capex).toFixed(2)}B</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: QUALITATIVE ADJUSTMENT */}
              <div id="qualitative-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>5. Qualitative Offset</span>
                  <span className="text-slate-500 font-mono tracking-tight text-[10px]">Points: {t_qualitative}/10</span>
                </h3>
                <div className="px-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                    <span>Moat/Leadership Strength:</span>
                    <span className="font-mono text-[#1a1c1e] font-black">{t_qualitative} / 10</span>
                  </div>
                  <input 
                     type="range" min="0" max="10" step="0.1" value={t_qualitative}
                     onChange={(e) => setTQualitative(parseFloat(e.target.value))}
                     className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 italic">
                    Intangible premiums (switching costs, brand, governance and structural alignment).
                  </p>
                </div>
              </div>

              {/* SENSITIVITY CALCULATION CONTROLS */}
              <div id="volatility-tuner-section">
                <h3 className="text-[10px] font-extrabold uppercase border-b border-slate-200 text-[#1a1c1e] pb-1 flex justify-between items-center mb-2">
                  <span>6. Valuation Volatility Anchors</span>
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-tight">Sensitivity matrix</span>
                </h3>
                <div className="space-y-2.5 px-0.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Stock Volatility (Beta):</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_beta}x</span>
                    </div>
                    <input 
                      type="range" min="0.3" max="3.0" step="0.05" value={t_beta}
                      onChange={(e) => setTBeta(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                      <span>Valuation Growth Anchor (g):</span>
                      <span className="font-mono text-[#1a1c1e] font-black">{t_baseGrowth}%</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="25" step="0.5" value={t_baseGrowth}
                      onChange={(e) => setTBaseGrowth(parseFloat(e.target.value))}
                      className="w-full accent-[#1a1c1e] cursor-ew-resize h-1"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </aside>

        {/* Right Side: Primary Investment Dashboard Content */}
        <section className="flex-1 p-2 lg:p-4 space-y-4 overflow-y-auto max-h-none lg:max-h-[calc(100vh-100px)]" id="dashboard-content">
          
          {/* AI Loading state */}
          {isLoading && (
            <div className="bg-white border border-slate-300 p-6 shadow-sm text-center flex flex-col items-center justify-center space-y-3" id="loading-overlay">
              <span className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-[#1a1c1e]"></span>
              </span>
              <div className="max-w-md">
                <h3 className="font-extrabold text-[#1a1c1e] uppercase tracking-wide text-xs">BlackRock Portfolio Client Model Under Review</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {loadingStep === 0 && "Initiating Real-time Google Search Crawler..."}
                  {loadingStep === 1 && "Retrieving balance sheets, cash flows, and peer relative valuation metrics..."}
                  {loadingStep === 2 && "Synthesizing fundamental scoring arrays and beta sensitivity matrices..."}
                  {loadingStep === 3 && "Polishing final institutional research summary views..."}
                </p>
                <div className="w-full bg-slate-100 h-1 mt-3 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-1000" 
                    style={{ width: `${(loadingStep + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {hasError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 text-xs" id="error-banner">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="shrink-0 text-rose-600" size={14} />
                <div>
                  <span className="font-extrabold uppercase">System Notification:</span> {hasError}
                  <button 
                    onClick={() => triggerEvaluation()} 
                    className="block mt-1 font-bold underline cursor-pointer text-slate-900"
                  >
                    Retry analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMetricDetail ? (
            <MetricDetailPages
              activeTab={activeMetricDetail}
              onClose={() => setActiveMetricDetail(null)}
              onSelectTab={(tab) => setActiveMetricDetail(tab)}
              data={data}
              t_rev1y={t_rev1y}
              t_rev3y={t_rev3y}
              t_rev5y={t_rev5y}
              t_pe={t_pe}
              t_fpe={t_fpe}
              t_ps={t_ps}
              t_evEbitda={t_evEbitda}
              t_de={t_de}
              t_interestCoverage={t_interestCoverage}
              t_netDebt={t_netDebt}
              t_ocf={t_ocf}
              t_capex={t_capex}
              t_fcfGrowth={t_fcfGrowth}
              t_qualitative={t_qualitative}
              t_beta={t_beta}
              t_baseGrowth={t_baseGrowth}
            />
          ) : (
            <>
              {/* 1. Header Card: Institutional Evaluation Summary Metrics */}
          <div className="bg-[#1a1c1e] text-white p-4 border border-[#1a1c1e] shadow-md flex flex-col lg:flex-row justify-between gap-4" id="overview-header-card">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 bg-white text-[#1a1c1e] text-[10px] font-black uppercase tracking-widest leading-none">
                  {data.ticker} ACTIVE UNIT
                </span>
                <span className="text-slate-300 text-xs font-semibold flex items-center gap-1">
                  <Globe2 size={12} className="text-slate-400" /> {country || data.country}
                </span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 font-mono">
                  {sector || data.sector}
                </span>
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-black tracking-tight uppercase text-white leading-none">
                  {data.name} Research Matrix
                </h2>
                <p className="text-[11px] text-slate-400 max-w-xl mt-1 leading-normal">
                  Evaluated Stock Multiples. Current share benchmark: <span className="font-mono text-emerald-400 font-extrabold">${data.currentPrice.toFixed(2)}</span>. Financial calculations dynamically update as metrics are adjusted from input dials.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[11px] border-t border-white/10">
                <span className="text-slate-400">Beta volatility: <strong className="font-mono text-white">{t_beta}x</strong></span>
                <span className="text-slate-400">Yield FCF: <strong className="font-mono text-white">{(((t_ocf - t_capex) / data.currentPrice) * 100).toFixed(1)}%</strong></span>
                <span className="text-slate-400">Margin target: <strong className="font-mono text-white">{(t_pe / t_ps).toFixed(1)}%</strong></span>
              </div>
            </div>

            {/* Scorecard visualization */}
            <div className="flex items-center gap-4 lg:border-l lg:border-white/10 lg:pl-4 shrink-0" id="scorecard-summary-bubble">
              <div className="text-center relative">
                <div className="relative flex items-center justify-center h-16 w-16">
                  {/* Gauge Arc Background SVG */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#2a2e33" strokeWidth="6" fill="none" />
                    <circle 
                      cx="32" cy="32" r="26" 
                      stroke="#10b981" strokeWidth="6" fill="none" 
                      strokeDasharray="163.3" 
                      strokeDashoffset={163.3 - (163.3 * scoredMetrics.totalScore) / 100}
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-xl font-black text-white tracking-tighter" id="scorecard-total-val">
                      {scoredMetrics.totalScore}
                    </span>
                    <span className="block text-[7px] uppercase text-slate-400 tracking-wider">PTS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-400">Allocation Target Guidance</span>
                <p className="text-sm font-black text-white uppercase tracking-tight leading-none">
                  {scoredMetrics.recommendation}
                </p>
                <div className="flex items-center gap-1 mt-0.5" id="stars-display">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index} 
                      size={11} 
                      fill={index < scoredMetrics.starCount ? "#10b981" : "none"} 
                      className={index < scoredMetrics.starCount ? "text-emerald-500" : "text-slate-600"} 
                    />
                  ))}
                  <span className="text-[10px] text-slate-300 ml-1 font-bold">{scoredMetrics.ratingLabel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Executive Summary Card */}
          <div className="bg-white p-3 border border-slate-200 shadow-sm space-y-3" id="executive-summary-container">
            <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 text-[#1a1c1e]">
              <span className="w-2 h-2 bg-slate-800 rounded-full inline-block"></span> 1. Executive Research Thesis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed md:divide-x md:divide-slate-200">
              <div className="space-y-1 pr-0 md:pr-3">
                <h3 className="font-extrabold text-[#1a1c1e] uppercase flex items-center gap-1 text-[10px] tracking-wide">
                  Business Overview
                </h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">{data.executiveSummary?.businessOverview}</p>
              </div>
              <div className="space-y-1 pl-0 md:pl-3">
                <h3 className="font-extrabold text-[#1a1c1e] uppercase flex items-center gap-1 text-[10px] tracking-wide">
                  Investment Thesis
                </h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">{data.executiveSummary?.investmentThesis}</p>
              </div>
            </div>

            {/* Opportunities and Risks Lists - styled as Strengths/Risks callout banners of theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 space-y-1">
                <h4 className="text-[9px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                  <Layers size={9} /> Core Strengths & Opportunities
                </h4>
                <ul className="space-y-0.5 text-[10px] text-emerald-950 pl-3 list-decimal font-medium">
                  {data.executiveSummary?.majorOpportunities?.map((opp, idx) => (
                    <li key={idx} className="leading-snug pl-0.5">{opp}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 p-2.5 space-y-1">
                <h4 className="text-[9px] font-black uppercase text-red-800 tracking-wider flex items-center gap-1">
                  <AlertTriangle size={9} /> Critical Investment Risks
                </h4>
                <ul className="space-y-0.5 text-[10px] text-red-950 pl-3 list-decimal font-medium">
                  {data.executiveSummary?.majorRisks?.map((risk, idx) => (
                    <li key={idx} className="leading-snug pl-0.5">{risk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Real-time Point Scorecard Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="scorecard-dashboard">
            
            {/* Scorecard Breakdown Panel */}
            <div className="bg-white text-[#1a1c1e] p-3 border border-slate-200 lg:col-span-2 shadow-sm" id="points-breakdown-card">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1e] border-b border-slate-100 pb-1.5 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-slate-800 rounded-full inline-block"></span> 2. Fundamental Score Matrix Breakdown
              </h2>
              
              <div className="space-y-2.5">
                
                {/* Score bar item: Revenue growth */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span className="text-slate-700">1. Revenue Growth Profile (Weight: 25)</span>
                    <span className="font-extrabold text-emerald-600">{scoredMetrics.growthPoints} / 25</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-sm" style={{ width: `${(scoredMetrics.growthPoints / 25) * 100}%` }}></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">{data.dashboardAnalysis?.revenueAnalysis}</p>
                </div>

                {/* Score bar item: Valuation Moat */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span className="text-slate-700">2. Valuation Moat & Multiples Rating (Weight: 25)</span>
                    <span className="font-extrabold text-emerald-600">{scoredMetrics.valuationPoints} / 25</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-sm" style={{ width: `${(scoredMetrics.valuationPoints / 25) * 100}%` }}></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">PE multiplier: {t_pe}x sits in adjusted growth bounds relative to cash yields.</p>
                </div>

                {/* Score bar item: Debt Solvency */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span className="text-slate-700">3. Debt Solvency & Capital Health (Weight: 20)</span>
                    <span className="font-extrabold text-emerald-600">{scoredMetrics.debtPoints} / 20</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-sm" style={{ width: `${(scoredMetrics.debtPoints / 20) * 100}%` }}></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">{data.dashboardAnalysis?.debtAnalysis}</p>
                </div>

                {/* Score bar item: Cash Flow Integrity */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span className="text-slate-700">4. Cash Flow Conversion Dynamics (Weight: 20)</span>
                    <span className="font-extrabold text-emerald-600">{scoredMetrics.cashFlowPoints} / 20</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-sm" style={{ width: `${(scoredMetrics.cashFlowPoints / 20) * 100}%` }}></div>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-tight mt-0.5">{data.dashboardAnalysis?.cashFlowAnalysis}</p>
                </div>

                {/* Score bar item: Qualitative Offset */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-bold">
                    <span className="text-slate-700">5. Management & Quality Adjuster (Weight: 10)</span>
                    <span className="font-extrabold text-emerald-600">{t_qualitative} / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full rounded-sm" style={{ width: `${(t_qualitative / 10) * 100}%` }}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Metrics KPI Ring on dark slate style */}
            <div className="bg-[#1a1c1e] text-white p-3.5 shadow-md flex flex-col justify-between" id="key-metrics-kpi">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1.5 mb-2.5 flex items-center gap-1.5">
                  <BarChart3 size={11} /> Solvency KPI Anchors
                </h2>
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">P/E Premium:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-white/5 p-0.5 px-1.5 border border-white/10 text-[10.5px]">{t_pe}x</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Revenue CAGR:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-white/5 p-0.5 px-1.5 border border-white/10 text-[10.5px]">+{t_rev3y}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Portfolio Beta:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-white/5 p-0.5 px-1.5 border border-white/10 text-[10.5px]">{t_beta}x</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Leverage (D/E):</span>
                    <span className="font-mono font-bold text-emerald-400 bg-white/5 p-0.5 px-1.5 border border-white/10 text-[10.5px]">{t_de}x</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">WACC Cost Basis:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-white/5 p-0.5 px-1.5 border border-white/10 text-[10.5px]">{(4.0 + (t_beta * 5.5)).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[9px] text-slate-400 flex items-center gap-1 leading-normal bg-white/5 p-1.5">
                <Info size={11} className="text-slate-500 shrink-0" />
                <span>Override valuation dials on the left sidebar in real-time.</span>
              </div>
            </div>

          </div>

          {/* Bento interactive clickable dashboard summaries */}
          <div className="space-y-2 mt-2">
            <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 leading-none">
              <Sparkles size={11} className="text-emerald-500 animate-pulse" /> Click any metric card below to expand institutional deep analysis sheets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" id="interactive-clickable-bento">
              
              {/* Bento Card A: Revenue Growth */}
              <div 
                onClick={() => setActiveMetricDetail('revenue')}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3.5 transition-all duration-150 cursor-pointer shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-[9px] uppercase font-bold tracking-wider">A) Revenue Growth Profile</span>
                    <TrendingUp size={13} className="text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="text-xl font-mono font-black text-[#1a1c1e] mt-2">
                    +{t_rev3y}% CAGR
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2.5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">1Y: +{t_rev1y}% | 5Y: +{t_rev5y}%</span>
                  <span className="text-emerald-700 font-extrabold uppercase text-[8px] tracking-wider bg-emerald-50 px-1.5 py-0.5">Analysis &rarr;</span>
                </div>
              </div>

              {/* Bento Card B: Valuation Multiples */}
              <div 
                onClick={() => setActiveMetricDetail('valuation')}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3.5 transition-all duration-150 cursor-pointer shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-[9px] uppercase font-bold tracking-wider">B) Valuation Multiples</span>
                    <Scale size={13} className="text-[#1a1c1e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="text-xl font-mono font-black text-[#1a1c1e] mt-2">
                    {t_pe}x Current PE
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2.5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Fwd PE: {t_fpe}x | P/S: {t_ps}x</span>
                  <span className="text-emerald-700 font-extrabold uppercase text-[8px] tracking-wider bg-emerald-50 px-1.5 py-0.5">Analysis &rarr;</span>
                </div>
              </div>

              {/* Bento Card C: Debt Solvency */}
              <div 
                onClick={() => setActiveMetricDetail('debt')}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3.5 transition-all duration-150 cursor-pointer shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-[9px] uppercase font-bold tracking-wider">C) Debt & Capital Health</span>
                    <Activity size={13} className="text-amber-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="text-xl font-mono font-black text-[#1a1c1e] mt-2">
                    {t_de}x Debt/Equity
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2.5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">COV: {t_interestCoverage}x | Net Debt: ${t_netDebt}B</span>
                  <span className="text-emerald-700 font-extrabold uppercase text-[8px] tracking-wider bg-emerald-50 px-1.5 py-0.5">Analysis &rarr;</span>
                </div>
              </div>

              {/* Bento Card D: Cash Flow Trends */}
              <div 
                onClick={() => setActiveMetricDetail('cashflow')}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3.5 transition-all duration-150 cursor-pointer shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-[9px] uppercase font-bold tracking-wider">D) Cash Flow Trends</span>
                    <DollarSign size={13} className="text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="text-xl font-mono font-black text-[#1a1c1e] mt-2">
                    ${(t_ocf - t_capex).toFixed(1)}B FCF
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2.5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">OCF: ${t_ocf}B | CapEx: ${t_capex}B</span>
                  <span className="text-emerald-700 font-extrabold uppercase text-[8px] tracking-wider bg-emerald-50 px-1.5 py-0.5">Analysis &rarr;</span>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Financial Performance Benchmark Table */}
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden" id="financial-dashboard-table">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} className="text-slate-700" /> 3. Financial Performance Dashboard
              </h2>
              <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 border border-slate-300 uppercase tracking-tight">{data.ticker} Trend Indexes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse leading-tight">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-black text-[9.5px] border-b border-slate-200">
                    <th className="p-2.5 pl-4 w-1/4">Metric Category</th>
                    <th className="p-2.5 text-center w-24">Current (FY24)</th>
                    <th className="p-2.5 text-center w-28">5Y Trend</th>
                    <th className="p-2.5 pl-4">Strategic Analysis Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  
                  {/* Row: Revenue Growth */}
                  <tr 
                    onClick={() => setActiveMetricDetail('revenue')}
                    className="hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <td className="p-2.5 pl-4 font-extrabold text-[#1a1c1e] group-hover:text-emerald-700 flex items-center gap-1">
                      Revenue Growth Profile <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Deep &rarr;</span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-900 bg-slate-50/20">
                      <span className="text-emerald-700 underline font-black">+{t_rev3y}% CAGR</span>
                    </td>
                    <td className="p-2.5 text-center">
                      <svg className="w-20 h-5 mx-auto" viewBox="0 0 100 20">
                        <path 
                          d={`M0,15 Q25,${15 - t_rev1y/3} 50,${15 - t_rev3y/2} L100,${Math.max(2, 18 - t_rev5y)}`} 
                          fill="none" stroke="#1a1c1e" strokeWidth="2" strokeLinecap="round" 
                        />
                        <circle cx="100" cy={Math.max(2, 18 - t_rev5y)} r="2" fill="#10b981" />
                      </svg>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600 pl-4">{data.dashboardAnalysis?.revenueAnalysis}</td>
                  </tr>

                  {/* Row: EPS Valuation Multiple */}
                  <tr 
                    onClick={() => setActiveMetricDetail('valuation')}
                    className="hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <td className="p-2.5 pl-4 font-extrabold text-[#1a1c1e] group-hover:text-emerald-700 flex items-center gap-1">
                      Valuation Multiples <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Deep &rarr;</span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-900 bg-slate-50/20 font-sans">
                      <span>{t_pe}x PE</span>
                    </td>
                    <td className="p-2.5 text-center">
                      <svg className="w-20 h-5 mx-auto" viewBox="0 0 100 20">
                        <path 
                          d={`M0,${20 - (t_pe/6)} Q35,${20 - (t_pe/5.2)} 70,${20 - (t_pe/4)} L100,${20 - (t_fpe/4)}`} 
                          fill="none" stroke="#1a1c1e" strokeWidth="1.5" strokeLinecap="round" 
                        />
                        <circle cx="100" cy={20 - (t_fpe/4)} r="1.5" fill="#10b981" />
                      </svg>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600 pl-4">{data.dashboardAnalysis?.profitAnalysis || 'P/E multiple evaluates target capitalization premiums.'}</td>
                  </tr>

                  {/* Row: Operating Cash Flows */}
                  <tr 
                    onClick={() => setActiveMetricDetail('cashflow')}
                    className="hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <td className="p-2.5 pl-4 font-extrabold text-[#1a1c1e] group-hover:text-emerald-700 flex items-center gap-1">
                      Free Cash Flow Generator <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Deep &rarr;</span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-900 bg-slate-50/20">
                      <span>${(t_ocf - t_capex).toFixed(1)}B FCF</span>
                    </td>
                    <td className="p-2.5 text-center">
                      <svg className="w-20 h-5 mx-auto" viewBox="0 0 100 20">
                        <path d="M0,15 Q30,12 60,11 L100,5" fill="none" stroke="#1a1c1e" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="100" cy="5" r="1.5" fill="#10b981" />
                      </svg>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600 pl-4">{data.dashboardAnalysis?.cashFlowAnalysis}</td>
                  </tr>

                  {/* Row: Solvency Debt Coverage */}
                  <tr 
                    onClick={() => setActiveMetricDetail('debt')}
                    className="hover:bg-slate-100 transition-colors cursor-pointer group"
                  >
                    <td className="p-2.5 pl-4 font-extrabold text-[#1a1c1e] group-hover:text-emerald-700 flex items-center gap-1">
                      Debt/Equity Solvency <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Deep &rarr;</span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-900 bg-slate-50/20">
                      <span>{t_de}x Debt/Eq</span>
                    </td>
                    <td className="p-2.5 text-center">
                      <svg className="w-20 h-5 mx-auto" viewBox="0 0 100 20">
                        <path d="M0,16 L35,13 L70,12 L100,10" fill="none" stroke="#1a1c1e" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="100" cy="10" r="1.5" fill="#10b981" />
                      </svg>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600 pl-4">{data.dashboardAnalysis?.debtAnalysis}</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Intrinsic Sensitivity Heatmap on Volatility (Beta vs Growth Anchor) */}
          <div className="bg-white p-3.5 border border-slate-200 shadow-sm space-y-3" id="sensitivity-heatmap-container">
            <div>
              <h2 className="text-[#1a1c1e] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-800 rounded-full inline-block"></span> 4. Valuation Volatility Sensitivity Matrix
              </h2>
              <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                This matrix is calculating the sensitivity of <strong>{data.name}</strong> intrinsic valuation to market volatility (represented by fluctuating Beta multipliers WACC cost bases) against varying terminal growth rate anchors (g). WACC of equity uses a 4.0% Risk Free base + Beta * 5.5% Equity Risk Premium. Matrix cells represent calculated share valuation targets.
              </p>
            </div>

            <div className="overflow-x-auto pt-1" id="heatmap-mesh">
              <table className="w-full text-center border-collapse">
                <thead>
                  {/* Top Header: Increasing Stock Beta Volatility */}
                  <tr className="bg-slate-150 text-[#1a1c1e] font-black text-[9px] uppercase border-y border-slate-200 bg-slate-50">
                    <th className="p-2.5 text-left w-32 border-r border-slate-200 text-slate-500">Terminal g \ Beta</th>
                    {sensitivityMatrix.betas.map((betaVal, idx) => (
                      <th key={idx} className="p-2.5 text-center border-r border-slate-200 bg-slate-50">
                        <span className="block font-mono text-[10.5px] font-extrabold text-[#1a1c1e]">
                          {betaVal.toFixed(2)}x Beta
                        </span>
                        <span className="block text-[7.5px] uppercase tracking-normal text-slate-500 font-bold mt-0.5">
                          WACC: {(4.0 + (betaVal * 5.5)).toFixed(1)}%
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {sensitivityMatrix.grid.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-200/60">
                      {/* Left Header - Terminal Growth Rate */}
                      <td className="p-2.5 w-32 border-r border-slate-200 bg-slate-50 text-left font-black text-[#1a1c1e] uppercase text-[9px]">
                        {sensitivityMatrix.growths[rowIdx].toFixed(1)}% Terminal g
                      </td>
                      {row.map((cell, colIdx) => {
                        // Base cell is at row 2, col 2 indexes
                        const isBase = rowIdx === 2 && colIdx === 2;
                        // Color intensity based on positive or negative pctChange deviation
                        let bgColor = "bg-white text-[#1a1c1e]";
                        if (isBase) {
                          bgColor = "bg-amber-100 text-amber-950 font-black border-2 border-amber-400";
                        } else if (cell.pctChange > 15) {
                          bgColor = "bg-emerald-50 text-emerald-900 border border-emerald-100/60";
                        } else if (cell.pctChange > 0) {
                          bgColor = "bg-emerald-50/50 text-emerald-800 border border-emerald-100/30";
                        } else if (cell.pctChange < -15) {
                          bgColor = "bg-rose-50 text-rose-950 border border-rose-100/60";
                        } else if (cell.pctChange < 0) {
                          bgColor = "bg-rose-50/50 text-rose-800 border border-rose-100/30";
                        }

                        return (
                          <td key={colIdx} className={`p-3 transition-all ${bgColor} border-r border-slate-200 font-mono text-center`}>
                            <span className="block font-black text-xs">${cell.targetValue.toFixed(2)}</span>
                            <span className="block text-[8px] font-bold text-slate-400 mt-0.5">
                              {cell.pctChange >= 0 ? `+${cell.pctChange}%` : `${cell.pctChange}%`}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex flex-wrap text-[9px] text-slate-500 justify-between items-center bg-slate-50 p-2 border border-slate-200 rounded-none gap-2">
              <span className="font-extrabold text-slate-600 flex items-center gap-1 uppercase tracking-tight text-[8px]">
                <Info size={10} className="text-slate-400" /> Matrix Guide:
              </span>
              <span>Green zones indicate low beta volatility, expanding discounted intrinsic value targets.</span>
              <span>Red zones indicate heavy volatility triggers, shrinking future multiplier targets.</span>
            </div>
          </div>

          {/* 6. Strengths & Risks Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="strengths-risks-columns">
            {/* Strengths List Card */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 shadow-sm" id="strengths-section">
              <h3 className="text-xs font-black uppercase text-emerald-800 pb-1.5 border-b border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-700" /> 5. Core Operational Strengths
              </h3>
              <ul className="space-y-2 mt-3">
                {data.strengths?.map((str, index) => (
                  <li key={index} className="flex gap-2 text-xs text-emerald-950 leading-relaxed items-start font-medium">
                    <span className="h-4 w-4 bg-emerald-600 text-white font-extrabold shrink-0 flex items-center justify-center text-[8px] border border-emerald-500 mt-0.5">
                      ✓
                    </span>
                    <p className="text-[11px] leading-relaxed">{str}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks List Card */}
            <div className="bg-red-50 border border-red-200 p-3.5 shadow-sm" id="risks-section">
              <h3 className="text-xs font-black uppercase text-red-800 pb-1.5 border-b border-red-200 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-red-700" /> 6. Key Strategic Risks & Threats
              </h3>
              <ul className="space-y-2 mt-3">
                {data.risks?.map((risk, index) => (
                  <li key={index} className="flex gap-2 text-xs text-red-950 leading-relaxed items-start font-medium">
                    <span className="h-4 w-4 bg-red-600 text-white font-extrabold shrink-0 flex items-center justify-center text-[8px] border border-red-500 mt-0.5">
                      !
                    </span>
                    <p className="text-[11px] leading-relaxed">{risk}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. Economic Moat Competitive Advantage Analysis */}
          <div className="bg-white p-3.5 border border-slate-200 shadow-sm" id="moat-section">
            <h2 className="text-[#1a1c1e] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-3">
              <span className="w-2 h-2 bg-slate-800 rounded-full inline-block"></span> 7. Economic Moat Strength Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3" id="moat-grid">
              
              <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1" id="brand-moat-card">
                <h4 className="font-extrabold text-[#1a1c1e] text-[9.5px] uppercase tracking-wider border-b border-slate-200 pb-1">Brand Strength</h4>
                <p className="text-[10.5px] text-slate-600 leading-snug font-medium">{data.competitiveAdvantages?.brandStrength}</p>
              </div>

              <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1" id="network-moat-card">
                <h4 className="font-extrabold text-[#1a1c1e] text-[9.5px] uppercase tracking-wider border-b border-slate-200 pb-1">Network Effects</h4>
                <p className="text-[10.5px] text-slate-600 leading-snug font-medium">{data.competitiveAdvantages?.networkEffects}</p>
              </div>

              <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1" id="cost-moat-card">
                <h4 className="font-extrabold text-[#1a1c1e] text-[9.5px] uppercase tracking-wider border-b border-slate-200 pb-1">Cost Advantages</h4>
                <p className="text-[10.5px] text-slate-600 leading-snug font-medium">{data.competitiveAdvantages?.costAdvantage}</p>
              </div>

              <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1" id="tech-moat-card">
                <h4 className="font-extrabold text-[#1a1c1e] text-[9.5px] uppercase tracking-wider border-b border-slate-200 pb-1">Technology Edge</h4>
                <p className="text-[10.5px] text-slate-600 leading-snug font-medium">{data.competitiveAdvantages?.technologyAdvantage}</p>
              </div>

              <div className="bg-slate-50 p-2.5 border border-slate-200 space-y-1" id="market-moat-card">
                <h4 className="font-extrabold text-[#1a1c1e] text-[9.5px] uppercase tracking-wider border-b border-slate-200 pb-1">Market Position</h4>
                <p className="text-[10.5px] text-slate-600 leading-snug font-medium">{data.competitiveAdvantages?.marketPosition}</p>
              </div>

            </div>
          </div>

          {/* 8. Management Quality Assessment */}
          <div className="bg-white p-3.5 border border-slate-200 shadow-sm" id="management-section">
            <h2 className="text-[#1a1c1e] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-3">
              <span className="w-2 h-2 bg-slate-800 rounded-full inline-block"></span> 8. Management Quality & Capital Deployment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3" id="management-grid">
              
              <div className="bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs text-slate-600 font-medium">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-[#1a1c1e] block border-b border-slate-200 pb-1">Leadership Track Record</span>
                <p className="leading-snug pt-1 text-[10.5px]">{data.managementQuality?.leadershipTrackRecord}</p>
              </div>

              <div className="bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs text-slate-600 font-medium">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-[#1a1c1e] block border-b border-slate-200 pb-1">Capital Deployment</span>
                <p className="leading-snug pt-1 text-[10.5px]">{data.managementQuality?.capitalAllocation}</p>
              </div>

              <div className="bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs text-slate-600 font-medium">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-[#1a1c1e] block border-b border-slate-200 pb-1">Reporting Transparency</span>
                <p className="leading-snug pt-1 text-[10.5px]">{data.managementQuality?.transparency}</p>
              </div>

              <div className="bg-slate-50 p-3 border border-slate-200 space-y-1 text-xs text-[#1a1c1e] font-medium">
                <span className="font-extrabold text-[9px] uppercase tracking-wider text-[#1a1c1e] block border-b border-slate-200 pb-1">Corporate Governance</span>
                <p className="leading-snug pt-1 text-[10.5px] text-slate-600">{data.managementQuality?.corporateGovernance}</p>
              </div>

            </div>
          </div>

          {/* 9. Final View & Disclaimer */}
          <div className="bg-[#1a1c1e] text-slate-300 p-4 border border-[#1a1c1e] shadow space-y-2" id="disclaimer-section">
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#10b981]">Institutional Compliance Guidelines</span>
              <span className="text-[9px] text-[#eab308] font-mono font-bold uppercase tracking-tight">Confidential Model Disclosure</span>
            </div>
            <p className="text-[10.5px] leading-relaxed">
              <strong>Capital allocation disclosure notice:</strong> The synthesized equity models served here represent research evaluations only. Intrinsic target projections, WACC cost bases, and growth arrays are sensitive simulation models. Realised financial growth depends on dynamic market developments, liquidity risks, and sector allocation factors. Independent financial audits are highly advised prior to active client funding allocations.
            </p>
          </div>

          {/* Institutional Slate Footer */}
          <footer className="mt-4 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-500 uppercase tracking-widest border-t border-slate-200 pt-3 gap-2">
            <div>Confidential: Prepared by Global Portfolio Analytics group. For Institutional Use Only.</div>
            <div className="flex gap-4 font-mono font-bold">
              <span>REF NO: AM-EVAL-MODEL-2026</span>
              <span>DATE: JUNE 2026</span>
            </div>
          </footer>
        </>
      )}

    </section>

      </main>
    </div>
  );
}
