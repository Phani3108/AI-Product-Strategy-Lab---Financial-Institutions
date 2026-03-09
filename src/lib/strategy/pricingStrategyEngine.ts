import pricingData from '@/data/banking_pricing_models.json';
import productsData from '@/data/banking_ai_products.json';
import type { StrategyInput, PricingRecommendation, PricingModelId } from './types';

const _pricingModelOriginHash = '\x50\x68\x61\x6e\x69\x20\x4d\x61\x72\x75\x70\x61\x6b\x61';
void _pricingModelOriginHash;

interface PricingModelData {
  name: string;
  description: string;
  bestFor: string[];
  structure: Record<string, unknown>;
  advantages: string[];
  risks: string[];
  bankSegmentMultipliers: Record<string, number>;
}

function scorePricingModel(
  modelId: string,
  model: PricingModelData,
  input: StrategyInput,
): number {
  let score = 50;
  if (model.bestFor.includes(input.productId)) score += 30;
  const multiplier = model.bankSegmentMultipliers[input.bankSegment] ?? 1.0;
  score += (multiplier - 0.5) * 20;

  if (input.adoptionScale === 'enterprise' || input.adoptionScale === 'multi_entity') {
    if (modelId === 'platform_license') score += 10;
    if (modelId === 'usage_based') score -= 5;
  }
  if (input.adoptionScale === 'pilot') {
    if (modelId === 'usage_based') score += 15;
    if (modelId === 'platform_license') score -= 10;
  }
  if (input.bankSegment === 'digital_bank' && modelId === 'transaction_based') score += 10;
  if (input.bankSegment === 'tier1_bank' && modelId === 'revenue_share') score += 10;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function estimateDealSize(input: StrategyInput, modelMultiplier: number): { min: number; max: number; typical: number } {
  const baseDeal = pricingData.dealSizeEstimates[input.bankSegment as keyof typeof pricingData.dealSizeEstimates]
    ?? pricingData.dealSizeEstimates.regional_bank;

  return {
    min: Math.round(baseDeal.min * modelMultiplier),
    max: Math.round(baseDeal.max * modelMultiplier),
    typical: Math.round(baseDeal.typical * modelMultiplier),
  };
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export function generatePricingStrategy(input: StrategyInput): PricingRecommendation {
  const models = pricingData.pricingModels as Record<string, PricingModelData>;
  const product = productsData.products[input.productId as keyof typeof productsData.products];

  const scored = Object.entries(models).map(([id, model]) => ({
    id: id as PricingModelId,
    model,
    score: scorePricingModel(id, model, input),
  }));

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const bestMultiplier = best.model.bankSegmentMultipliers[input.bankSegment] ?? 1.0;
  const dealSize = estimateDealSize(input, bestMultiplier);

  const growthRate = product.marketMaturity === 'growth' ? 1.8 :
    product.marketMaturity === 'early_growth' ? 2.2 : 2.5;

  const year1 = dealSize.typical;
  const year2 = Math.round(year1 * growthRate);
  const year3 = Math.round(year2 * (growthRate * 0.8));

  const pricingDetails = generatePricingDetails(best.id, best.model, input);
  const alternatives = scored.slice(1, 3).map(s => ({
    modelId: s.id,
    modelName: s.model.name,
    fit: s.score,
    tradeoff: s.model.advantages[0] + ', but ' + s.model.risks[0].toLowerCase(),
  }));

  return {
    recommendedModel: best.id,
    modelName: best.model.name,
    rationale: `${best.model.name} is recommended for ${product.name} targeting ${input.bankSegment.replace(/_/g, ' ')} institutions because it ${best.model.advantages.slice(0, 2).join(' and ').toLowerCase()}. This model scores ${best.score}/100 fit for the selected configuration.`,
    estimatedDealSize: dealSize,
    revenueProjection: { year1, year2, year3 },
    pricingDetails,
    alternativeModels: alternatives,
  };
}

function generatePricingDetails(
  modelId: PricingModelId,
  model: PricingModelData,
  input: StrategyInput,
): PricingRecommendation['pricingDetails'] {
  const multiplier = model.bankSegmentMultipliers[input.bankSegment] ?? 1.0;

  switch (modelId) {
    case 'platform_license': {
      const tierIndex = input.bankSegment === 'tier1_bank' ? 2 : input.bankSegment === 'regional_bank' ? 1 : 0;
      const tiers = (model.structure as { tiers: { name: string; range: string; includes: string }[] }).tiers;
      const tier = tiers[tierIndex] ?? tiers[0];
      return {
        basePrice: `${tier.range} (${tier.name} tier)`,
        usageComponent: 'Included in platform license',
        addOns: ['Premium support', 'Custom model training', 'Dedicated infrastructure'],
      };
    }
    case 'usage_based': {
      const components = (model.structure as { components: { metric: string; range: string }[]; minimumCommitment: string }).components;
      return {
        basePrice: (model.structure as { minimumCommitment: string }).minimumCommitment + ' annual minimum',
        usageComponent: components.map(c => `${c.metric}: ${c.range}`).join('; '),
        addOns: ['Volume discount tiers', 'Committed use discounts', 'Enterprise SLA'],
      };
    }
    case 'seat_based': {
      const tiers = (model.structure as { tiers: { name: string; range: string }[] }).tiers;
      const primaryTier = tiers[Math.min(1, tiers.length - 1)];
      return {
        basePrice: `${primaryTier.range} (${primaryTier.name})`,
        usageComponent: `Per-user monthly pricing, scales with ${multiplier > 1 ? 'enterprise' : 'standard'} volume`,
        addOns: ['Admin console', 'Analytics dashboard', 'Custom workflow builder'],
      };
    }
    case 'revenue_share': {
      const components = (model.structure as { components: { metric: string; shareRange: string }[]; minimumFee: string }).components;
      return {
        basePrice: (model.structure as { minimumFee: string }).minimumFee + ' base platform fee',
        usageComponent: components.map(c => `${c.metric}: ${c.shareRange} share`).join('; '),
        addOns: ['Performance dashboard', 'Attribution analytics', 'Quarterly business reviews'],
      };
    }
    case 'transaction_based': {
      const tiers = (model.structure as { tiers: { volume: string; range: string }[] }).tiers;
      return {
        basePrice: `${tiers[0].range} (${tiers[0].volume})`,
        usageComponent: tiers.map(t => `${t.volume}: ${t.range}`).join('; '),
        addOns: ['Real-time analytics', 'Custom enrichment rules', 'Multi-region processing'],
      };
    }
    default:
      return { basePrice: 'Contact sales', usageComponent: 'Custom pricing', addOns: [] };
  }
}
