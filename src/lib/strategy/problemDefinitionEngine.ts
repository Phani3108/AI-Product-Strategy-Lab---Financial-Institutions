import productsData from '@/data/banking_ai_products.json';
import personasData from '@/data/banking_personas.json';
import type { StrategyInput, ProblemDefinition } from './types';

const SEGMENT_URGENCY: Record<string, number> = {
  tier1_bank: 0.9,
  regional_bank: 0.7,
  digital_bank: 0.85,
  credit_union: 0.5,
};

const REGULATORY_PRESSURE: Record<string, number> = {
  us_federal: 0.85,
  eu_dora: 0.95,
  uk_fca: 0.8,
  apac_mas: 0.75,
};

const MARKET_MATURITY_CONTEXT: Record<string, string> = {
  early: 'an emerging market with limited competition and high first-mover advantage potential',
  early_growth: 'an early-growth market where early adopters are seeing results and broader demand is building',
  growth: 'a growth-stage market with increasing competition and rising customer expectations',
  mature: 'a mature market where differentiation and platform depth drive competitive advantage',
};

export function generateProblemDefinition(input: StrategyInput): ProblemDefinition {
  const product = productsData.products[input.productId as keyof typeof productsData.products];
  const persona = personasData.personas[input.personaId as keyof typeof personasData.personas];

  const segmentUrgency = SEGMENT_URGENCY[input.bankSegment] ?? 0.7;
  const regulatoryPressure = REGULATORY_PRESSURE[input.regulatoryEnvironment] ?? 0.8;

  const baseProblems = product.problemStatements;
  const personaPains = persona.painPoints.slice(0, 3);
  const combined = [...baseProblems, ...personaPains];
  const primaryProblems = [...new Set(combined)].slice(0, 5);

  const urgencyScore = (segmentUrgency + regulatoryPressure) / 2;
  const urgencyLevel: ProblemDefinition['urgencyLevel'] =
    urgencyScore >= 0.85 ? 'critical' :
    urgencyScore >= 0.7 ? 'high' :
    urgencyScore >= 0.5 ? 'medium' : 'low';

  const competitiveMultiplier = product.competitiveIntensity === 'high' ? 1.2 :
    product.competitiveIntensity === 'medium' ? 1.0 : 0.8;

  const problemScore = Math.min(100, Math.round(
    (urgencyScore * 40 + competitiveMultiplier * 25 + (primaryProblems.length / 5) * 35)
  ));

  const maturityContext = MARKET_MATURITY_CONTEXT[product.marketMaturity] ?? 'a developing market';
  const category = productsData.categories[product.category as keyof typeof productsData.categories];

  return {
    productName: product.name,
    category: category?.label ?? product.category,
    primaryProblems,
    targetPersona: {
      title: persona.title,
      kpis: persona.kpis.slice(0, 4),
      painPoints: persona.painPoints.slice(0, 4),
    },
    marketContext: `${product.name} operates in ${maturityContext}. For ${input.bankSegment.replace(/_/g, ' ')} institutions under ${input.regulatoryEnvironment.replace(/_/g, ' ').toUpperCase()} regulatory frameworks, the urgency to deploy AI solutions in ${category?.label.toLowerCase() ?? product.category} is ${urgencyLevel}.`,
    urgencyLevel,
    problemScore,
  };
}
