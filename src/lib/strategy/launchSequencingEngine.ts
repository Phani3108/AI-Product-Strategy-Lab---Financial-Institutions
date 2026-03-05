import gtmData from '@/data/banking_gtm_framework.json';
import productsData from '@/data/banking_ai_products.json';
import personasData from '@/data/banking_personas.json';
import type { StrategyInput, LaunchStrategy, LaunchPhase, AdoptionFrictionMap, FrictionFactor, FrictionSeverity } from './types';

const SEVERITY_SCORES: Record<FrictionSeverity, number> = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 95,
};

const DEPLOYMENT_FRICTION: Record<string, Record<string, number>> = {
  cloud: { integration_complexity: -10, data_residency: 10, security_review: -5 },
  hybrid: { integration_complexity: 15, data_residency: -10, security_review: 10 },
  private_cloud: { integration_complexity: 20, data_residency: -20, security_review: 15 },
};

const SEGMENT_FRICTION: Record<string, Record<string, number>> = {
  tier1_bank: { vendor_assessment: 20, budget_approval: 15, model_validation: 15, change_management: 10 },
  regional_bank: { budget_approval: 10, employee_resistance: 5 },
  digital_bank: { vendor_assessment: -10, budget_approval: -10, employee_resistance: -15 },
  credit_union: { budget_approval: 15, employee_resistance: 10, data_quality: 15 },
};

const REGULATORY_FRICTION: Record<string, Record<string, number>> = {
  us_federal: { model_validation: 15, data_residency: 5 },
  eu_dora: { data_residency: 20, model_validation: 10, security_review: 10 },
  uk_fca: { model_explainability: 10, model_validation: 10 },
  apac_mas: { data_residency: 15, model_explainability: 5 },
};

const FRICTION_MITIGATIONS: Record<string, string> = {
  model_explainability: 'Implement SHAP/LIME explainability layers and decision audit trails',
  data_residency: 'Deploy regional data processing nodes with sovereign data controls',
  integration_complexity: 'Use standardized APIs and pre-built connectors for core banking systems',
  employee_resistance: 'Launch change management program with pilot champions and training',
  budget_approval: 'Structure pilot with clear ROI metrics and phased investment gates',
  vendor_assessment: 'Proactively complete SOC 2 Type II and banking-specific security certifications',
  model_validation: 'Provide pre-built model documentation aligned with SR 11-7 requirements',
  change_management: 'Establish executive sponsorship and cross-functional governance committee',
  data_quality: 'Run data readiness assessment and implement data quality improvement roadmap',
  security_review: 'Conduct third-party penetration testing and provide detailed architecture review',
};

const FRICTION_IMPACT_AREAS: Record<string, string> = {
  model_explainability: 'Regulatory approval & trust',
  data_residency: 'Architecture & compliance',
  integration_complexity: 'Implementation timeline',
  employee_resistance: 'Adoption & utilization',
  budget_approval: 'Sales cycle length',
  vendor_assessment: 'Procurement timeline',
  model_validation: 'Regulatory approval',
  change_management: 'Organization readiness',
  data_quality: 'Model performance',
  security_review: 'Architecture approval',
};

export function generateAdoptionFriction(input: StrategyInput): AdoptionFrictionMap {
  const frictionFactors = gtmData.adoptionFrictionFactors;
  const product = productsData.products[input.productId as keyof typeof productsData.products];
  const deploymentAdj = DEPLOYMENT_FRICTION[input.deploymentModel] ?? {};
  const segmentAdj = SEGMENT_FRICTION[input.bankSegment] ?? {};
  const regulatoryAdj = REGULATORY_FRICTION[input.regulatoryEnvironment] ?? {};

  const factors: FrictionFactor[] = frictionFactors.map(f => {
    let baseScore = SEVERITY_SCORES[f.defaultSeverity as FrictionSeverity] ?? 50;
    baseScore += (deploymentAdj[f.id] ?? 0);
    baseScore += (segmentAdj[f.id] ?? 0);
    baseScore += (regulatoryAdj[f.id] ?? 0);

    const productRisks = product.riskFactors;
    const hasRelevantRisk = productRisks.some(r =>
      r.risk.toLowerCase().includes(f.label.toLowerCase().split(' ')[0])
    );
    if (hasRelevantRisk) baseScore += 10;

    baseScore = Math.min(100, Math.max(0, baseScore));
    const severity: FrictionSeverity =
      baseScore >= 85 ? 'critical' :
      baseScore >= 65 ? 'high' :
      baseScore >= 40 ? 'medium' : 'low';

    return {
      id: f.id,
      label: f.label,
      category: f.category as FrictionFactor['category'],
      severity,
      severityScore: baseScore,
      mitigation: FRICTION_MITIGATIONS[f.id] ?? 'Develop mitigation strategy',
      impactArea: FRICTION_IMPACT_AREAS[f.id] ?? 'General',
    };
  });

  factors.sort((a, b) => b.severityScore - a.severityScore);

  const overallFrictionScore = Math.round(
    factors.reduce((sum, f) => sum + f.severityScore, 0) / factors.length
  );

  const topBlockers = factors
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 4)
    .map(f => f.label);

  const mitigationPriorities = factors
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .slice(0, 3)
    .map(f => f.mitigation);

  return { factors, overallFrictionScore, topBlockers, mitigationPriorities };
}

export function generateLaunchStrategy(input: StrategyInput): LaunchStrategy {
  const product = productsData.products[input.productId as keyof typeof productsData.products];
  const persona = personasData.personas[input.personaId as keyof typeof personasData.personas];

  const phases: LaunchPhase[] = Object.values(gtmData.launchPhases).map((phase, index) => {
    const adjustedDuration = { ...phase.durationMonths };
    if (input.bankSegment === 'tier1_bank') {
      adjustedDuration.min += 2;
      adjustedDuration.max += 3;
    } else if (input.bankSegment === 'digital_bank') {
      adjustedDuration.min = Math.max(1, adjustedDuration.min - 1);
      adjustedDuration.max = Math.max(2, adjustedDuration.max - 2);
    }

    if (input.deploymentModel === 'private_cloud') {
      adjustedDuration.min += 1;
      adjustedDuration.max += 2;
    }

    return {
      phase: index + 1,
      name: phase.name,
      duration: `${adjustedDuration.min}–${adjustedDuration.max} months`,
      durationMonths: adjustedDuration,
      objective: phase.objective,
      activities: phase.activities,
      successCriteria: phase.successCriteria,
      risks: phase.risks,
      investmentLevel: phase.investmentLevel,
      revenueExpectation: phase.revenueExpectation,
    };
  });

  const salesMotionKey = input.bankSegment === 'digital_bank' || input.bankSegment === 'credit_union'
    ? 'product_led' : 'enterprise_direct';
  const salesMotion = gtmData.salesMotions[salesMotionKey as keyof typeof gtmData.salesMotions];

  const categoryPartners: string[] = [];
  categoryPartners.push(...gtmData.ecosystemPartners.system_integrators.slice(0, 3));
  categoryPartners.push(...gtmData.ecosystemPartners.cloud_providers.slice(0, 2));
  if (['compliance_intelligence_engine'].includes(input.productId)) {
    categoryPartners.push(...gtmData.ecosystemPartners.compliance_platforms.slice(0, 2));
  }
  categoryPartners.push(...gtmData.ecosystemPartners.core_banking_vendors.slice(0, 2));

  const totalMinMonths = phases.reduce((sum, p) => sum + p.durationMonths.min, 0);
  const totalMaxMonths = phases.reduce((sum, p) => sum + p.durationMonths.max, 0);

  let runningMonth = 0;
  const keyMilestones = phases.flatMap(p => {
    const mid = runningMonth + Math.round((p.durationMonths.min + p.durationMonths.max) / 2);
    runningMonth += p.durationMonths.max;
    return [
      { month: mid, milestone: `${p.name}: ${p.successCriteria[0]}` },
    ];
  });

  return {
    phases,
    salesMotion: {
      name: salesMotion.name,
      description: salesMotion.description,
      typicalCycle: salesMotion.typicalCycle,
      winRate: salesMotion.winRate,
    },
    ecosystemPartners: categoryPartners,
    totalTimeToScale: `${totalMinMonths}–${totalMaxMonths} months`,
    keyMilestones,
  };
}
