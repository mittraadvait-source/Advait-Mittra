import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lazy-initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// Fallback high-quality institutional datasets for popular tickers in case no API key or to load instantly
const POPULAR_TICKERS: Record<string, any> = {
  AAPL: {
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
      transparency: "High execution transparency with clear quarterly guidance updates and segment disclosures.",
      corporateGovernance: "Excellent independent board oversight, metrics-based executive compensation alignment."
    },
    dashboardAnalysis: {
      revenueAnalysis: "Revenue growth has slowed down in the core hardware segment, but Services segments and Wearables provide stable underlying growth vectors.",
      profitAnalysis: "Operating margins remain robust above 30%, bolstered by the software-heavy services mix and high margin hardware tier.",
      marginsAnalysis: "Gross margin continues to climb (now near 46%) driven by chip cost savings from in-house Apple Silicon and digital mix expansion.",
      debtAnalysis: "Negligible credit risk. Total debt of $100B+ is completely backed by massive cash reserves and extremely generous operating receipts.",
      cashFlowAnalysis: "Operating Cash Flow conversion is flawless. FCF yield remains highly sustainable, consistently yielding $95B+ annually."
    }
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    country: "United States",
    sector: "Technology / Semiconductors",
    currentPrice: 122.50,
    revenueGrowth1y: 215.3,
    revenueGrowth3yCAGR: 98.4,
    revenueGrowth5yCAGR: 62.5,
    peRatio: 65.2,
    forwardPeRatio: 32.5,
    psRatio: 26.4,
    pbRatio: 42.1,
    evEbitda: 45.3,
    debtToEquity: 0.15,
    interestCoverage: 125.0,
    netDebtBillions: -32.4, // Net cash
    operatingCashFlow: 48.5,
    capEx: 1.8,
    fcfGrowth: 185.0,
    conversionRatio: 1.05,
    beta: 1.85,
    baseGrowthRate: 20.0,
    wacc: 10.5,
    qualitativeScore: 9.8,
    executiveSummary: {
      businessOverview: "NVIDIA Corporation is the pioneer of GPU-accelerated computing. It specializes in products and software for deep learning, artificial intelligence, scientific computing, and autonomous driving. Nvidia has transitioned from a graphics card manufacturer into a full-stack data center platform company, capturing an estimated 85-90% market share in training and inference AI accelerators.",
      investmentThesis: "Nvidia represents the shovel maker in the global Artificial Intelligence gold rush. The proprietary CUDA software ecosystem creates a massive competitive advantage, making physical semiconductor switches highly complex and expensive for developers. While near-term growth is staggering, the stock carries high volatility and cyclical risk, priced for execution perfection.",
      majorOpportunities: [
        "Generative AI demand expansion: Cloud hyperscalers, sovereign nations, and corporations building massive compute clusters.",
        "Software Monetization (Nvidia AI Enterprise): Transitioning high margin hardware sales into perpetual developer licensing models.",
        "Robotics and Omniverse: Expansion of digital twin simulation models and autonomous factory software packages."
      ],
      majorRisks: [
        "Severe chip cyclicality: Hyperscaler capital expenditure breathing room cycles could trigger sharp demand digestion phases.",
        "Geopolitical export curbs: Restrictions on chip sales to key East Asian markets directly limiting top-line reach.",
        "Hyperscalers (Amazon, Google, Meta, Microsoft) developing custom, in-house ASICs to mitigate Nvidia reliance."
      ]
    },
    strengths: [
      "Insurmountable CUDA software moat: 4M+ developers locked into Nvidia's proprietary libraries and software stacks.",
      "Unmatched technological lead: Rapid, annual release cycle of architectures (Hopper, Blackwell, Rubin) outpacing peers.",
      "Industry-leading margins: Operating margins near 60% are historically unprecedented for a hardware-heavy company.",
      "Massive cash positioning: Net cash balance has ballooned, allowing immediate share buybacks and robust supply pre-payments.",
      "Dominant ecosystem positioning in all major high-performance computing centers."
    ],
    risks: [
      "Extreme valuation multiple: Highly vulnerable to minor earnings beats that do not exceed extreme whisper estimates.",
      "Supply chain concentration: Complete reliance on TSMC for advanced packaging represents a single-point failure danger.",
      "Severe competition from AMD (MI300 series) and low cost customizable ASIC platforms.",
      "Regulatory antitrust probes investigating market practices and developer tie-ins.",
      "Slowing generative AI commercial return rates causing buyers to temporarily freeze infrastructure capacity."
    ],
    competitiveAdvantages: {
      brandStrength: "Gold standard in computing systems; highly favored by research departments and data engineering nodes.",
      networkEffects: "More developers writing for CUDA leads to more software customized for GPU clusters, cementing Nvidia hardware superiority.",
      costAdvantage: "Substantial margin advantages derived from premium software monetization and massive wafers pricing power.",
      technologyAdvantage: "Pioneered tensor core GPUs, advanced high-bandwidth memory packaging networks, and NVLink cluster solutions.",
      marketPosition: "Near-total monopoly in hyperscale AI training processors and extremely strong graphics computing baseline representation."
    },
    managementQuality: {
      leadershipTrackRecord: "Founded by visionary Jensen Huang, whose long-term investments in GPU general-purpose computing paved the era of deep learning.",
      capitalAllocation: "Disciplined R&D-first reinvestment, scaling server-scale manufacturing partners, and substantial equity buybacks.",
      transparency: "Clear platform disclosure, granular segment revenue categories, and detailed compute infrastructure roadmap sharing.",
      corporateGovernance: "Active board, robust management retention, clear operational metric alignment."
    },
    dashboardAnalysis: {
      revenueAnalysis: "Unprecedented hyper-growth phase. Data center segment sales have exploded, carrying total revenue to historic heights.",
      profitAnalysis: "Unparalleled net profits. Operating profit margins have surged past 50%, transforming physical production into massive cash assets.",
      marginsAnalysis: "Gross margin above 75%, an elite benchmark driven by premium hardware-software bundle pricing and extreme product demand.",
      debtAnalysis: "Astonishing credit profile. Practically debt-free, backed by massive asset capitalization and billions in cash reserves.",
      cashFlowAnalysis: "Incredible. Free Cash Flow conversion is near identical to net profit, allowing rapid equity buybacks."
    }
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla Inc.",
    country: "United States",
    sector: "Automotive / Clean Energy",
    currentPrice: 178.40,
    revenueGrowth1y: 18.2,
    revenueGrowth3yCAGR: 29.5,
    revenueGrowth5yCAGR: 38.6,
    peRatio: 52.8,
    forwardPeRatio: 45.2,
    psRatio: 5.8,
    pbRatio: 11.2,
    evEbitda: 31.4,
    debtToEquity: 0.08,
    interestCoverage: 65.0,
    netDebtBillions: -21.4, // Net cash
    operatingCashFlow: 13.2,
    capEx: 8.5,
    fcfGrowth: -15.2,
    conversionRatio: 0.95,
    beta: 1.65,
    baseGrowthRate: 15.0,
    wacc: 9.8,
    qualitativeScore: 8.5,
    executiveSummary: {
      businessOverview: "Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation systems, and storage facilities. Tesla operates as a vertically integrated clean energy manufacturer with additional high-growth software divisions targeted at autonomous transport (Full Self-Driving), AI robotics (Optimus), and charging infrastructures.",
      investmentThesis: "Tesla is valued as a high-multiple technology company rather than a traditional car manufacturer. Its premium valuation relies on the successful execution of robotaxi fleets, FSD subscription recurring revenues, and high density home/utility clean power grids. Near term auto margins face cyclical headwind due to EV competition, making progress in autonomous AI the vital growth lever.",
      majorOpportunities: [
        "FSD Autonomy & Robotaxi Network: Licensing Full Self-Driving (FSD) software to third-party auto makers and initiating a proprietary ride-hailing network.",
        "Energy Storage Expansion: Megapack utility grid deployments grow at high triple-digit percentage sequences carrying high operating margins.",
        "Optimus humanoid robots: Creating next-gen productivity tools targeting factory automation and domestic services."
      ],
      majorRisks: [
        "Intense pricing headwind: Persistent price discounting in EV segments to maintain volume targets depressing margins.",
        "Regulatory approvals: Delays in obtaining fully driverless taxi approvals across major regional jurisdictions.",
        "Key person risk regarding Elon Musk's intense portfolio of startups and public execution attention divisions."
      ]
    },
    strengths: [
      "Cost Leadership: Giga-factory manufacturing principles and cast framing processes enable lowest EV production cost-per-unit.",
      "Dominant Charging Infrastructure: Supercharger network operates as the absolute refueling standard in North America.",
      "Energy Storage Momentum: High growth Megapack grid batteries scaling rapidly worldwide with durable margin curves.",
      "Flawless Balance Sheet: Outstanding cash reserve cushion ($25B+) and virtually zero traditional net interest-bearing debt.",
      "Pioneering brand equity driving zero advertising expenditure reliance."
    ],
    risks: [
      "Highly cyclical global vehicle market vulnerable to high-interest financing rates.",
      "Intensifying Chinese competitor profiles (BYD, Xiaomi) scaling low-cost global variants.",
      "Automotive gross margins (ex-credits) declining below historical peak levels.",
      "Delayed software deployment deadlines for Level 4/5 full driving autonomy.",
      "Heavy political and tariff exposures on key importing/exporting corridors."
    ],
    competitiveAdvantages: {
      brandStrength: "Extremely strong, iconic status associated with advanced engineering, sustainability, and technological lifestyle representation.",
      networkEffects: "Billions of real-world vehicle testing miles collected wirelessly, creating an massive dataset edge to train AI driver networks.",
      costAdvantage: "Unmatched scaling advantage; massive vertical integration including structural battery packing and structural metal castings.",
      technologyAdvantage: "State-of-the-art synthetic AI training clusters, in-house developed FSD chip processors, and efficient thermal control configurations.",
      marketPosition: "Undisputed leader in electric vehicle adoption and battery storage deployment scales."
    },
    managementQuality: {
      leadershipTrackRecord: "Propelled by Elon Musk, who turned a niche electric automotive producer into the most valuable manufacturing firm in history.",
      capitalAllocation: "Aggressive cash redirection into physical manufacturing capacity, gigafactories, and massive AI GPU learning configurations.",
      transparency: "Occasional volatile guidance patterns but highly detailed technical disclosure presentations during event keynotes.",
      corporateGovernance: "Active internal debate; historically tied compensation models linked heavily to significant market cap milestones."
    },
    dashboardAnalysis: {
      revenueAnalysis: "Revenue continues to grow, though automotive segments observe moderation as clean energy storage steps up to carry total metrics.",
      profitAnalysis: "Operating profits are highly variable based on price adjustment schedules. Services and regulatory credits provide solid buffers.",
      marginsAnalysis: "Gross margins remain superior to domestic auto peers of ~18%, though retracted from the historic 25%+ level because of auto price competition.",
      debtAnalysis: "Impeccable. Negative net debt implies cash levels exceed total long-term liabilities, providing total financial flexible control.",
      cashFlowAnalysis: "Operating cash flows remain positive. Intensive GPU server and assembly plant capital expenditure trims net free cash volumes."
    }
  }
};

// Evaluate actual metrics into standard visual analysis + mathematical scores
function calculateFinancialScores(data: any): any {
  // 1. Revenue Growth Score / 25
  const avgGrowth = (Number(data.revenueGrowth1y) + Number(data.revenueGrowth3yCAGR) + Number(data.revenueGrowth5yCAGR)) / 3;
  let revScore = 0;
  if (avgGrowth >= 25) revScore = 24 + Math.min(1, (avgGrowth - 25) / 50);
  else if (avgGrowth >= 15) revScore = 20 + ((avgGrowth - 15) / 10) * 4;
  else if (avgGrowth >= 8) revScore = 15 + ((avgGrowth - 8) / 7) * 5;
  else if (avgGrowth >= 2) revScore = 10 + ((avgGrowth - 2) / 6) * 5;
  else revScore = Math.max(2, ((avgGrowth + 5) / 7) * 10);
  
  revScore = Math.min(25, Math.max(0, parseFloat(revScore.toFixed(1))));

  // 2. Valuation Score / 25
  // Lower is better, but compare with peers.
  const pe = Number(data.peRatio);
  const fpe = Number(data.forwardPeRatio);
  const ps = Number(data.psRatio);
  
  let valScore = 25;
  if (pe > 60) valScore = 10 - Math.min(5, (pe - 60) / 10);
  else if (pe > 40) valScore = 14 - ((pe - 40) / 20) * 4;
  else if (pe > 25) valScore = 18 - ((pe - 25) / 15) * 4;
  else if (pe > 12) valScore = 22 - ((pe - 12) / 13) * 4;
  else valScore = 23 + Math.min(2, (12 - pe) / 4);

  // Growth adjustment to valuation: High growth companies deserve higher PE without score penalty
  if (avgGrowth > 20) valScore += 4;
  if (avgGrowth > 40) valScore += 4;
  
  valScore = Math.min(25, Math.max(0, parseFloat(valScore.toFixed(1))));

  // 3. Debt Score / 20
  const de = Number(data.debtToEquity);
  const cov = Number(data.interestCoverage);
  let debtScore = 20;

  if (de < 0.2 && cov > 30) debtScore = 19 + Math.min(1, cov / 100);
  else if (de < 0.5 && cov > 15) debtScore = 17 + ((cov - 15) / 15) * 2;
  else if (de < 1.0 && cov > 5) debtScore = 13 + ((cov - 5) / 10) * 4;
  else if (de < 2.0 && cov > 2) debtScore = 9 + ((cov - 2) / 3) * 4;
  else debtScore = Math.max(2, 8 - (de - 2.0) * 2);

  debtScore = Math.min(20, Math.max(0, parseFloat(debtScore.toFixed(1))));

  // 4. Cash Flow Score / 20
  const ocf = Number(data.operatingCashFlow);
  const capex = Number(data.capEx);
  const fcf = ocf - capex;
  const fcf_margin = ocf > 0 ? fcf / ocf : -0.1;
  
  let cfScore = 15;
  if (fcf_margin > 0.4) cfScore = 18 + Math.min(2, (fcf_margin - 0.4) * 4);
  else if (fcf_margin > 0.15) cfScore = 14 + ((fcf_margin - 0.15) / 0.25) * 4;
  else if (fcf_margin > 0) cfScore = 10 + (fcf_margin / 0.15) * 4;
  else cfScore = Math.max(1, 10 + fcf_margin * 10);

  cfScore = Math.min(20, Math.max(0, parseFloat(cfScore.toFixed(1))));

  // 5. Quality Score / 10
  const qualScore = Math.min(10, Math.max(0, Number(data.qualitativeScore || 7)));

  const finalScore = parseFloat((revScore + valScore + debtScore + cfScore + qualScore).toFixed(1));

  let category = "HOLD";
  if (finalScore >= 90) category = "BUY";
  else if (finalScore >= 75) category = "WATCHLIST";
  else if (finalScore >= 60) category = "WATCHLIST";
  else category = "AVOID";

  return {
    ...data,
    revenueGrowthScore: revScore,
    valuationScore: valScore,
    debtScore,
    cashFlowScore: cfScore,
    qualitativeScore: qualScore,
    finalScore,
    category
  };
}

// 1. POST /api/evaluate endpoint to trigger evaluation
app.post('/api/evaluate', async (req, res) => {
  const { company, ticker, country, sector } = req.body;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required' });
  }

  const normalizedTicker = ticker.toUpperCase().trim();
  const ai = getGeminiClient();

  // If the user searches a pre-populated popular ticker and NO Gemini API key is configured
  // we immediately serve the high-quality database. Or even if they do, it's nice to have a fast fallback.
  if (!ai && POPULAR_TICKERS[normalizedTicker]) {
    const scoredData = calculateFinancialScores(POPULAR_TICKERS[normalizedTicker]);
    return res.json({
      data: scoredData,
      isFallback: true,
      reason: "No GEMINI_API_KEY detected in secrets. Serving static institutional profile."
    });
  }

  // If no API Key and not popular, generate high-quality mocked metrics based on a generic default
  // so the user has an immediate working prototype and can see how custom data looks.
  if (!ai) {
    const genericFallback = {
      ticker: normalizedTicker,
      name: company || `${normalizedTicker} Corp`,
      country: country || "United States",
      sector: sector || "General Materials & Logistics",
      currentPrice: 105.00,
      revenueGrowth1y: 4.5,
      revenueGrowth3yCAGR: 5.2,
      revenueGrowth5yCAGR: 6.1,
      peRatio: 18.5,
      forwardPeRatio: 16.8,
      psRatio: 2.2,
      pbRatio: 2.8,
      evEbitda: 11.2,
      debtToEquity: 0.65,
      interestCoverage: 8.5,
      netDebtBillions: 12.4,
      operatingCashFlow: 4.5,
      capEx: 2.1,
      fcfGrowth: 3.1,
      conversionRatio: 0.92,
      beta: 1.05,
      baseGrowthRate: 5.0,
      wacc: 8.5,
      qualitativeScore: 7.0,
      executiveSummary: {
        businessOverview: `${company || normalizedTicker} is a publicly traded entity operating within the global industry space. The company serves regional commercial clusters and holds a diversified asset base. Growth has maintained a stable baseline, matching standard nominal GDP outputs over recent economic timelines.`,
        investmentThesis: `This evaluated firm operates as an average-tier industrial corporation. It holds moderate entry moats backed by standard service footprints. Current valuations represent fair market rates. It maintains average leverage but exhibits exposure to cyclical consumer volumes and global pricing variables. This watchlist profile warrants close cost metrics tracking.`,
        majorOpportunities: [
          "Operational automation: Integrating digital workflow systems to prune local logistics overheads by 150Bps.",
          "Secondary regional market entry: Capitalizing on growing infrastructure spend pipelines in developing corridors.",
          "Modular products expansion: Launching custom, high-density variants to capture premium tier contractors."
        ],
        majorRisks: [
          "Inflationary pricing friction: Severe supply inputs costs escalation eating operating margin reserves.",
          "Cost of Capital variables: Higher persistent interest rates making refinancing lines of credit increasingly costly.",
          "Technological decay: Standardized legacy systems risk obsolescence in the face of rapid custom AI SaaS updates."
        ]
      },
      strengths: [
        "Consistent steady customer base with long-term commercial retainers providing cash predictability.",
        "Experienced local management focused on strict operational discipline and structural cost pruning.",
        "Diversified operational assets insulating against singular product or supply cluster crashes.",
        "Sensible, non-speculative acquisition strategy targeting nearby synergistic operations.",
        "Adequate interest payment coverage under current monetary rate benchmarks."
      ],
      risks: [
        "Moderate exposure to broader cyclical resource contractions and inventory build gluts.",
        "Significant hardware upgrade cost sequence over the coming 3-year timeline.",
        "Low core technology pricing power limiting capacity to push input costs down to clients.",
        "Regional labor constraints complicating growth schedules.",
        "Persistent working capital consumption due to slow receivables turn."
      ],
      competitiveAdvantages: {
        brandStrength: "Moderate brand retention locked primarily in B2B supply channels with high retention contract rates.",
        networkEffects: "Limited direct network effects but benefit from solid logistics inter-dependence.",
        costAdvantage: "Scale based cost advantages in regional zones preventing outer peer entries.",
        technologyAdvantage: "Utilize state-of-the-art commercial software integrations for automated inventory logistics.",
        marketPosition: "Stands as a Top-5 regional participant with healthy recurring contract structures."
      },
      managementQuality: {
        leadershipTrackRecord: "Conservative, highly experienced local executives with decades of combined corporate operations history.",
        capitalAllocation: "Focus on capital preservation, supporting the baseline dividend payouts, and debt reduction goals.",
        transparency: "Acceptable reporting practices with accurate standard compliance metrics.",
        corporateGovernance: "Satisfactory structure with structured incentive plans tied directly to operating margin metrics."
      },
      dashboardAnalysis: {
        revenueAnalysis: "Revenue expansion remains bound broadly to nominal sector GDP growth rates without significant outlier events.",
        profitAnalysis: "Operating margins remain stable in the 12-15% zone, indicating predictable output but limited scaling advantages.",
        marginsAnalysis: "Stable gross margins backed by regular supplier renegotiations, though vulnerable to local commodity flares.",
        debtAnalysis: "Healthy baseline debt ratios are serviceable under current capital costs without pressing dilution risks.",
        cashFlowAnalysis: "Operating cash flow remains positive, enabling consistent minor capex funding and stable capital retention."
      }
    };
    const scoredData = calculateFinancialScores(genericFallback);
    return res.json({
      data: scoredData,
      isFallback: true,
      reason: "No GEMINI_API_KEY detected in secrets. Serving simulated corporate evaluation metrics to showcase model features."
    });
  }

  // Real-time AI evaluation using Gemini API with Search Grounding
  try {
    const prompt = `
      You are a world-class Senior Equity Research Analyst and Portfolio Manager at BlackRock with 25+ years of experience.
      Evaluate the target stock ticker: [${normalizedTicker}] (${company || 'Company name unknown'}) in [${country || 'any appropriate region'}] operating in [${sector || 'any industry'}].
      Use the Google Search tool to find real, current financial benchmarks. Specifically retrieve:
      1. Its current stock price, market cap, and primary country & sector.
      2. Its latest 1-year revenue growth (%), 3-year CAGR (%), 5-year CAGR (%).
      3. Traditional valuation metrics: P/E, Forward P/E, P/S, P/B, EV/EBITDA. Compare this with industry peer rates.
      4. Debt & financial metrics: Debt-to-Equity, Net Debt (in Billions), and Interest Coverage Ratio.
      5. Cash Flow metrics: Operating Cash Flow (in Billions), Capital Expenditures (CapEx in Billions), free cash flows overall, and latest FCF growth trend.
      6. Stock Volatility Beta.
      7. An overall analyst qualitative score out of 10 representing brand, leadership and capital deployment elite metrics.

      Generate a deep, highly professional, realistic response conforming EXACTLY to the following typescript interface:
      
      interface ResponseSchema {
        ticker: string;
        name: string;
        country: string;
        sector: string;
        currentPrice: number; // e.g. 150.35
        revenueGrowth1y: number; // as percentage, e.g. 12.5
        revenueGrowth3yCAGR: number; // as percentage e.g. 15.2
        revenueGrowth5yCAGR: number; // as percentage e.g. 18.1
        peRatio: number; // e.g. 24.5
        forwardPeRatio: number; // e.g. 21.0
        psRatio: number; // e.g. 4.5
        pbRatio: number; // e.g. 6.2
        evEbitda: number; // e.g. 15.4
        debtToEquity: number; // e.g. 0.85
        interestCoverage: number; // e.g. 12.5
        netDebtBillions: number; // e.g. 25.4, can be negative if net cash
        operatingCashFlow: number; // in billions, e.g. 12.8
        capEx: number; // in billions, e.g. 3.2
        fcfGrowth: number; // as percentage, e.g. 8.4
        conversionRatio: number; // ratio of OCF to net profit, e.g. 1.05
        beta: number; // stock beta e.g. 1.25
        baseGrowthRate: number; // conservative cash flow growth forecast for valuation sensitivity, e.g. 7.5
        wacc: number; // estimated Cost of Capital / WACC e.g. 8.5
        qualitativeScore: number; // out of 10, e.g. 8.5
        executiveSummary: {
          businessOverview: string; // 2-3 deep, professional analyst sentences on business profile
          investmentThesis: string; // 2-3 deep sentences on investment thesis
          majorOpportunities: string[]; // exactly 3 entries summarizing core future catalysts
          majorRisks: string[]; // exactly 3 entries summarizing core risks
        };
        strengths: string[]; // exactly 5 distinct, highly professional analysts bullepoints
        risks: string[]; // exactly 5 distinct, highly professional analysts risk bulletpoints
        competitiveAdvantages: {
          brandStrength: string; // robust moat explanation
          networkEffects: string; // moat explanation
          costAdvantage: string; // moat explanation
          technologyAdvantage: string; // moat explanation
          marketPosition: string; // moat explanation
        };
        managementQuality: {
          leadershipTrackRecord: string; // management track record explanation
          capitalAllocation: string; // capital allocation discipline explanation
          transparency: string; // reporting transparency explanation
          corporateGovernance: string; // board & governance explanation
        };
        dashboardAnalysis: {
          revenueAnalysis: string; // 1 professional sentence analyzing revenue metrics
          profitAnalysis: string; // 1 professional sentence analyzing net earnings
          marginsAnalysis: string; // 1 professional sentence analyzing margins
          debtAnalysis: string; // 1 professional sentence analyzing balance sheet solvency
          cashFlowAnalysis: string; // 1 professional sentence analyzing cash generation profile
        };
      }

      CRITICAL RESTRICTION:
      Your output must be structured, pure JSON and contain realistic numbers representing the REAL company details retrieved. Do not invent symbols. Ensure numbers are numbers, not string formats. Check that Net Debt is correct (cash less total debt, or total debt less cash; net cash is negative). Return purely the JSON object matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ticker: { type: Type.STRING },
            name: { type: Type.STRING },
            country: { type: Type.STRING },
            sector: { type: Type.STRING },
            currentPrice: { type: Type.NUMBER },
            revenueGrowth1y: { type: Type.NUMBER },
            revenueGrowth3yCAGR: { type: Type.NUMBER },
            revenueGrowth5yCAGR: { type: Type.NUMBER },
            peRatio: { type: Type.NUMBER },
            forwardPeRatio: { type: Type.NUMBER },
            psRatio: { type: Type.NUMBER },
            pbRatio: { type: Type.NUMBER },
            evEbitda: { type: Type.NUMBER },
            debtToEquity: { type: Type.NUMBER },
            interestCoverage: { type: Type.NUMBER },
            netDebtBillions: { type: Type.NUMBER },
            operatingCashFlow: { type: Type.NUMBER },
            capEx: { type: Type.NUMBER },
            fcfGrowth: { type: Type.NUMBER },
            conversionRatio: { type: Type.NUMBER },
            beta: { type: Type.NUMBER },
            baseGrowthRate: { type: Type.NUMBER },
            wacc: { type: Type.NUMBER },
            qualitativeScore: { type: Type.NUMBER },
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                businessOverview: { type: Type.STRING },
                investmentThesis: { type: Type.STRING },
                majorOpportunities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                majorRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["businessOverview", "investmentThesis", "majorOpportunities", "majorRisks"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            competitiveAdvantages: {
              type: Type.OBJECT,
              properties: {
                brandStrength: { type: Type.STRING },
                networkEffects: { type: Type.STRING },
                costAdvantage: { type: Type.STRING },
                technologyAdvantage: { type: Type.STRING },
                marketPosition: { type: Type.STRING }
              },
              required: ["brandStrength", "networkEffects", "costAdvantage", "technologyAdvantage", "marketPosition"]
            },
            managementQuality: {
              type: Type.OBJECT,
              properties: {
                leadershipTrackRecord: { type: Type.STRING },
                capitalAllocation: { type: Type.STRING },
                transparency: { type: Type.STRING },
                corporateGovernance: { type: Type.STRING }
              },
              required: ["leadershipTrackRecord", "capitalAllocation", "transparency", "corporateGovernance"]
            },
            dashboardAnalysis: {
              type: Type.OBJECT,
              properties: {
                revenueAnalysis: { type: Type.STRING },
                profitAnalysis: { type: Type.STRING },
                marginsAnalysis: { type: Type.STRING },
                debtAnalysis: { type: Type.STRING },
                cashFlowAnalysis: { type: Type.STRING }
              },
              required: ["revenueAnalysis", "profitAnalysis", "marginsAnalysis", "debtAnalysis", "cashFlowAnalysis"]
            }
          },
          required: [
            "ticker", "name", "country", "sector", "currentPrice",
            "revenueGrowth1y", "revenueGrowth3yCAGR", "revenueGrowth5yCAGR",
            "peRatio", "forwardPeRatio", "psRatio", "pbRatio", "evEbitda",
            "debtToEquity", "interestCoverage", "netDebtBillions",
            "operatingCashFlow", "capEx", "fcfGrowth", "conversionRatio",
            "beta", "baseGrowthRate", "wacc", "qualitativeScore",
            "executiveSummary", "strengths", "risks", "competitiveAdvantages",
            "managementQuality", "dashboardAnalysis"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    const scoredData = calculateFinancialScores(parsedData);
    res.json({ data: scoredData, isFallback: false });

  } catch (error: any) {
    console.error("Gemini Evaluation error:", error);
    // If anything fails with Gemini, fall back gracefully to a nice generated profile
    res.status(500).json({ 
      error: "AI Evaluation encountered an error", 
      details: error.message || error 
    });
  }
});

// Serve frontend build static files in production
if (process.env.NODE_ENV === 'production' || process.env.VITE_PROD === 'true') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, handle Vite dev server middleware
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
