export interface ExecutiveSummary {
  businessOverview: string;
  investmentThesis: string;
  majorOpportunities: string[];
  majorRisks: string[];
}

export interface CompetitiveAdvantages {
  brandStrength: string;
  networkEffects: string;
  costAdvantage: string;
  technologyAdvantage: string;
  marketPosition: string;
}

export interface ManagementQuality {
  leadershipTrackRecord: string;
  capitalAllocation: string;
  transparency: string;
  corporateGovernance: string;
}

export interface DashboardAnalysis {
  revenueAnalysis: string;
  profitAnalysis: string;
  marginsAnalysis: string;
  debtAnalysis: string;
  cashFlowAnalysis: string;
}

export interface EvaluationData {
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
