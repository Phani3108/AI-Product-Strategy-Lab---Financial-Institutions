export type ProductId =
  | 'customer_support_copilot'
  | 'fraud_investigation_assistant'
  | 'ai_underwriting_advisor'
  | 'compliance_intelligence_engine'
  | 'personal_financial_advisor_ai'
  | 'transaction_insights_ai';

export type PersonaId =
  | 'chief_digital_officer'
  | 'head_of_fraud'
  | 'head_of_cx'
  | 'chief_risk_officer'
  | 'head_of_compliance'
  | 'contact_center_director';

export type BankSegment = 'tier1_bank' | 'regional_bank' | 'digital_bank' | 'credit_union';

export type DeploymentModel = 'cloud' | 'hybrid' | 'private_cloud';

export type RegulatoryEnvironment = 'us_federal' | 'eu_dora' | 'uk_fca' | 'apac_mas';

export type AdoptionScale = 'pilot' | 'department' | 'enterprise' | 'multi_entity';

export type PricingModelId =
  | 'platform_license'
  | 'usage_based'
  | 'seat_based'
  | 'revenue_share'
  | 'transaction_based';

export type FrictionSeverity = 'low' | 'medium' | 'high' | 'critical';

export type FrictionCategory = 'technical' | 'regulatory' | 'organizational' | 'procurement';

export interface StrategyInput {
  productId: ProductId;
  personaId: PersonaId;
  bankSegment: BankSegment;
  deploymentModel: DeploymentModel;
  regulatoryEnvironment: RegulatoryEnvironment;
  adoptionScale: AdoptionScale;
}

export interface ProblemDefinition {
  productName: string;
  category: string;
  primaryProblems: string[];
  targetPersona: {
    title: string;
    kpis: string[];
    painPoints: string[];
  };
  marketContext: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  problemScore: number;
}

export interface ProductConcept {
  name: string;
  tagline: string;
  description: string;
  problemSolved: string[];
  targetTeams: string[];
  aiCapabilities: string[];
  integrationRequirements: string[];
  deploymentPattern: string;
  typicalTimeline: { pilot: number; rollout: number; scale: number };
  competitiveIntensity: string;
  marketMaturity: string;
}

export interface DifferentiationAxis {
  id: string;
  label: string;
  score: number;
  description: string;
}

export interface MarketPositioning {
  differentiationMap: DifferentiationAxis[];
  competitiveAdvantages: string[];
  marketGaps: string[];
  positioningStatement: string;
  targetSegmentFit: number;
}

export interface FrictionFactor {
  id: string;
  label: string;
  category: FrictionCategory;
  severity: FrictionSeverity;
  severityScore: number;
  mitigation: string;
  impactArea: string;
}

export interface AdoptionFrictionMap {
  factors: FrictionFactor[];
  overallFrictionScore: number;
  topBlockers: string[];
  mitigationPriorities: string[];
}

export interface PricingRecommendation {
  recommendedModel: PricingModelId;
  modelName: string;
  rationale: string;
  estimatedDealSize: { min: number; max: number; typical: number };
  revenueProjection: {
    year1: number;
    year2: number;
    year3: number;
  };
  pricingDetails: {
    basePrice: string;
    usageComponent: string;
    addOns: string[];
  };
  alternativeModels: {
    modelId: PricingModelId;
    modelName: string;
    fit: number;
    tradeoff: string;
  }[];
}

export interface LaunchPhase {
  phase: number;
  name: string;
  duration: string;
  durationMonths: { min: number; max: number };
  objective: string;
  activities: string[];
  successCriteria: string[];
  risks: string[];
  investmentLevel: string;
  revenueExpectation: string;
}

export interface LaunchStrategy {
  phases: LaunchPhase[];
  salesMotion: {
    name: string;
    description: string;
    typicalCycle: string;
    winRate: string;
  };
  ecosystemPartners: string[];
  totalTimeToScale: string;
  keyMilestones: { month: number; milestone: string }[];
}

export interface ExecutiveSummaryOutput {
  productName: string;
  targetBuyer: string;
  bankSegment: string;
  revenueModel: string;
  expectedDealSize: string;
  launchStrategy: string;
  timeToRevenue: string;
  keyRisks: string[];
  competitiveEdge: string;
  compositeScore: number;
}

export interface FullStrategyResult {
  input: StrategyInput;
  problemDefinition: ProblemDefinition;
  productConcept: ProductConcept;
  marketPositioning: MarketPositioning;
  adoptionFriction: AdoptionFrictionMap;
  pricing: PricingRecommendation;
  launchStrategy: LaunchStrategy;
  executiveSummary: ExecutiveSummaryOutput;
  generatedAt: number;
}

export type StrategyStep =
  | 'problem'
  | 'product'
  | 'market'
  | 'differentiation'
  | 'economics'
  | 'launch';

export interface StepConfig {
  id: StrategyStep;
  label: string;
  description: string;
  icon: string;
  number: number;
}

export const STRATEGY_STEPS: StepConfig[] = [
  { id: 'problem', label: 'Define Problem', description: 'Identify the core banking challenge to solve', icon: 'problem', number: 1 },
  { id: 'product', label: 'Define Product', description: 'Shape the AI product concept and capabilities', icon: 'product', number: 2 },
  { id: 'market', label: 'Define Market', description: 'Analyze target market and competitive landscape', icon: 'market', number: 3 },
  { id: 'differentiation', label: 'Define Differentiation', description: 'Map competitive advantages and adoption friction', icon: 'differentiation', number: 4 },
  { id: 'economics', label: 'Define Economics', description: 'Model pricing strategy and revenue projections', icon: 'economics', number: 5 },
  { id: 'launch', label: 'Define Launch Plan', description: 'Sequence the go-to-market strategy', icon: 'launch', number: 6 },
];
