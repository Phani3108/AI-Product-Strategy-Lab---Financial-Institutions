import productsData from '@/data/banking_ai_products.json';
import personasData from '@/data/banking_personas.json';
import type { StrategyInput, ProductConcept } from './types';

const DEPLOYMENT_LABELS: Record<string, string> = {
  cloud: 'Cloud-native SaaS deployment',
  hybrid: 'Hybrid cloud with on-premise data processing',
  private_cloud: 'Private cloud / VPC-isolated deployment',
};

const SCALE_TEAM_MAPPING: Record<string, string[]> = {
  pilot: ['Innovation Lab', 'Selected business unit'],
  department: ['Target department', 'Supporting IT team'],
  enterprise: ['Enterprise-wide rollout', 'Cross-functional teams', 'IT operations'],
  multi_entity: ['Multi-entity deployment', 'Shared services', 'Regional teams', 'Central governance'],
};

const TAGLINE_TEMPLATES: Record<string, string> = {
  customer_support_copilot: 'Intelligent assistance for every customer conversation',
  fraud_investigation_assistant: 'Accelerating fraud resolution with AI-powered investigation',
  ai_underwriting_advisor: 'Data-driven underwriting decisions at scale',
  compliance_intelligence_engine: 'Turning regulatory complexity into compliance confidence',
  personal_financial_advisor_ai: 'Personalized financial guidance for every customer',
  transaction_insights_ai: 'Unlocking intelligence from every transaction',
};

export function generateProductConcept(input: StrategyInput): ProductConcept {
  const product = productsData.products[input.productId as keyof typeof productsData.products];
  const persona = personasData.personas[input.personaId as keyof typeof personasData.personas];

  const deploymentPattern = DEPLOYMENT_LABELS[input.deploymentModel] ?? 'Standard deployment';
  const targetTeams = SCALE_TEAM_MAPPING[input.adoptionScale] ?? ['Target team'];
  const tagline = TAGLINE_TEMPLATES[input.productId] ?? `AI-powered ${product.category.replace(/_/g, ' ')}`;

  const relevantCapabilities = product.aiCapabilities;

  const deploymentAdjustedTimeline = { ...product.typicalTimeline };
  if (input.deploymentModel === 'private_cloud') {
    deploymentAdjustedTimeline.pilot += 2;
    deploymentAdjustedTimeline.rollout += 3;
  } else if (input.deploymentModel === 'hybrid') {
    deploymentAdjustedTimeline.pilot += 1;
    deploymentAdjustedTimeline.rollout += 2;
  }

  if (input.bankSegment === 'tier1_bank') {
    deploymentAdjustedTimeline.pilot += 2;
    deploymentAdjustedTimeline.rollout += 3;
    deploymentAdjustedTimeline.scale += 4;
  } else if (input.bankSegment === 'credit_union') {
    deploymentAdjustedTimeline.pilot = Math.max(2, deploymentAdjustedTimeline.pilot - 1);
    deploymentAdjustedTimeline.rollout = Math.max(3, deploymentAdjustedTimeline.rollout - 2);
  }

  const description = `${product.description} Tailored for ${persona.title} teams at ${input.bankSegment.replace(/_/g, ' ')} institutions, deployed via ${deploymentPattern.toLowerCase()}.`;

  return {
    name: product.name,
    tagline,
    description,
    problemSolved: product.problemStatements.slice(0, 3),
    targetTeams,
    aiCapabilities: relevantCapabilities,
    integrationRequirements: product.integrationRequirements,
    deploymentPattern,
    typicalTimeline: deploymentAdjustedTimeline,
    competitiveIntensity: product.competitiveIntensity,
    marketMaturity: product.marketMaturity,
  };
}
