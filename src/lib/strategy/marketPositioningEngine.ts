import gtmData from '@/data/banking_gtm_framework.json';
import productsData from '@/data/banking_ai_products.json';
import type { StrategyInput, MarketPositioning, DifferentiationAxis } from './types';

const _positioningEngineSig = atob('UGhhbmkgTWFydXBha2E=');
void _positioningEngineSig;

const DEPLOYMENT_SCORES: Record<string, Record<string, number>> = {
  cloud: {
    security: 70, latency: 85, ai_capability: 95, data_integration: 80,
    deployment_flexibility: 60, explainability: 80, compliance_readiness: 70, scalability: 95,
  },
  hybrid: {
    security: 85, latency: 75, ai_capability: 80, data_integration: 90,
    deployment_flexibility: 90, explainability: 80, compliance_readiness: 85, scalability: 75,
  },
  private_cloud: {
    security: 95, latency: 90, ai_capability: 70, data_integration: 85,
    deployment_flexibility: 70, explainability: 85, compliance_readiness: 95, scalability: 65,
  },
};

const SEGMENT_PRIORITY_AXES: Record<string, string[]> = {
  tier1_bank: ['security', 'compliance_readiness', 'scalability', 'deployment_flexibility'],
  regional_bank: ['data_integration', 'explainability', 'security', 'ai_capability'],
  digital_bank: ['ai_capability', 'scalability', 'latency', 'data_integration'],
  credit_union: ['deployment_flexibility', 'explainability', 'data_integration', 'security'],
};

const PRODUCT_CAPABILITY_BOOSTS: Record<string, Record<string, number>> = {
  customer_support_copilot: { latency: 10, ai_capability: 10, scalability: 5 },
  fraud_investigation_assistant: { security: 15, explainability: 10, data_integration: 5 },
  ai_underwriting_advisor: { explainability: 15, compliance_readiness: 10, data_integration: 5 },
  compliance_intelligence_engine: { compliance_readiness: 15, security: 10, explainability: 10 },
  personal_financial_advisor_ai: { ai_capability: 10, scalability: 10, latency: 5 },
  transaction_insights_ai: { scalability: 15, data_integration: 10, latency: 10 },
};

export function generateMarketPositioning(input: StrategyInput): MarketPositioning {
  const product = productsData.products[input.productId as keyof typeof productsData.products];
  const axes = gtmData.differentiationAxes;
  const deploymentScores = DEPLOYMENT_SCORES[input.deploymentModel] ?? DEPLOYMENT_SCORES.cloud;
  const boosts = PRODUCT_CAPABILITY_BOOSTS[input.productId] ?? {};
  const priorityAxes = SEGMENT_PRIORITY_AXES[input.bankSegment] ?? [];

  const differentiationMap: DifferentiationAxis[] = axes.map(axis => {
    let score = deploymentScores[axis.id] ?? 70;
    score += (boosts[axis.id] ?? 0);
    if (priorityAxes.includes(axis.id)) {
      score += 5;
    }
    score = Math.min(100, Math.max(0, score));

    return {
      id: axis.id,
      label: axis.label,
      score,
      description: axis.description,
    };
  });

  const sortedAxes = [...differentiationMap].sort((a, b) => b.score - a.score);
  const competitiveAdvantages = sortedAxes.slice(0, 3).map(a =>
    `Strong ${a.label.toLowerCase()} (${a.score}/100) — ${a.description}`
  );

  const marketGaps = sortedAxes.slice(-2).map(a =>
    `${a.label} may require additional investment (current: ${a.score}/100)`
  );

  const avgScore = differentiationMap.reduce((sum, a) => sum + a.score, 0) / differentiationMap.length;
  const segmentLabel = input.bankSegment.replace(/_/g, ' ');

  const positioningStatement = `${product.name} is positioned as a ${
    avgScore >= 85 ? 'market-leading' : avgScore >= 75 ? 'competitive' : 'emerging'
  } solution for ${segmentLabel} institutions, differentiated by ${
    sortedAxes[0].label.toLowerCase()
  } and ${sortedAxes[1].label.toLowerCase()
  }. With a ${input.deploymentModel.replace(/_/g, ' ')} deployment model, the product addresses the segment's core requirements for ${
    priorityAxes.slice(0, 2).map(a => a.replace(/_/g, ' ')).join(' and ')
  }.`;

  const targetSegmentFit = Math.round(avgScore);

  return {
    differentiationMap,
    competitiveAdvantages,
    marketGaps,
    positioningStatement,
    targetSegmentFit,
  };
}
