'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Button, alpha, Select, MenuItem, FormControl,
  InputLabel, Chip, IconButton, Tooltip, Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import StrategyNavigator from '@/components/strategy/StrategyNavigator';
import StrategyWorkspace from '@/components/strategy/StrategyWorkspace';
import StrategyCanvas from '@/components/strategy/StrategyCanvas';
import ExecutiveSummary from '@/components/strategy/ExecutiveSummary';

import { generateProblemDefinition } from '@/lib/strategy/problemDefinitionEngine';
import { generateProductConcept } from '@/lib/strategy/productConceptEngine';
import { generateMarketPositioning } from '@/lib/strategy/marketPositioningEngine';
import { generatePricingStrategy } from '@/lib/strategy/pricingStrategyEngine';
import { generateAdoptionFriction, generateLaunchStrategy } from '@/lib/strategy/launchSequencingEngine';
import {
  STRATEGY_STEPS,
  type StrategyInput,
  type StrategyStep,
  type FullStrategyResult,
  type ProductId,
  type PersonaId,
  type BankSegment,
  type DeploymentModel,
  type RegulatoryEnvironment,
  type AdoptionScale,
} from '@/lib/strategy/types';

import personasData from '@/data/banking_personas.json';
import productsData from '@/data/banking_ai_products.json';

const PRODUCT_OPTIONS: { value: ProductId; label: string }[] = [
  { value: 'customer_support_copilot', label: 'Customer Support Copilot' },
  { value: 'fraud_investigation_assistant', label: 'Fraud Investigation Assistant' },
  { value: 'ai_underwriting_advisor', label: 'AI Underwriting Advisor' },
  { value: 'compliance_intelligence_engine', label: 'Compliance Intelligence Engine' },
  { value: 'personal_financial_advisor_ai', label: 'Personal Financial Advisor AI' },
  { value: 'transaction_insights_ai', label: 'Transaction Insights AI' },
];

const PERSONA_OPTIONS: { value: PersonaId; label: string }[] = [
  { value: 'chief_digital_officer', label: 'Chief Digital Officer' },
  { value: 'head_of_fraud', label: 'Head of Fraud Operations' },
  { value: 'head_of_cx', label: 'Head of Customer Experience' },
  { value: 'chief_risk_officer', label: 'Chief Risk Officer' },
  { value: 'head_of_compliance', label: 'Head of Compliance' },
  { value: 'contact_center_director', label: 'Contact Center Director' },
];

const SEGMENT_OPTIONS: { value: BankSegment; label: string }[] = [
  { value: 'tier1_bank', label: 'Tier-1 Bank' },
  { value: 'regional_bank', label: 'Regional Bank' },
  { value: 'digital_bank', label: 'Digital Bank' },
  { value: 'credit_union', label: 'Credit Union' },
];

const DEPLOYMENT_OPTIONS: { value: DeploymentModel; label: string }[] = [
  { value: 'cloud', label: 'Cloud' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'private_cloud', label: 'Private Cloud' },
];

const REGULATORY_OPTIONS: { value: RegulatoryEnvironment; label: string }[] = [
  { value: 'us_federal', label: 'US Federal (OCC/Fed)' },
  { value: 'eu_dora', label: 'EU DORA' },
  { value: 'uk_fca', label: 'UK FCA' },
  { value: 'apac_mas', label: 'APAC MAS' },
];

const SCALE_OPTIONS: { value: AdoptionScale; label: string }[] = [
  { value: 'pilot', label: 'Pilot' },
  { value: 'department', label: 'Department' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'multi_entity', label: 'Multi-Entity' },
];

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

function buildExecutiveSummary(
  input: StrategyInput,
  result: Omit<FullStrategyResult, 'executiveSummary' | 'input' | 'generatedAt'>,
): FullStrategyResult['executiveSummary'] {
  const persona = personasData.personas[input.personaId as keyof typeof personasData.personas];
  const topDiffAxes = [...result.marketPositioning.differentiationMap]
    .sort((a, b) => b.score - a.score);

  const compositeScore = Math.round(
    (result.problemDefinition.problemScore * 0.15) +
    (result.marketPositioning.targetSegmentFit * 0.25) +
    ((100 - result.adoptionFriction.overallFrictionScore) * 0.2) +
    (Math.min(100, (result.pricing.estimatedDealSize.typical / 10000)) * 0.2) +
    (result.marketPositioning.differentiationMap.reduce((s, a) => s + a.score, 0)
      / result.marketPositioning.differentiationMap.length * 0.2)
  );

  return {
    productName: result.productConcept.name,
    targetBuyer: persona.title,
    bankSegment: input.bankSegment.replace(/_/g, ' '),
    revenueModel: result.pricing.modelName,
    expectedDealSize: `${formatCurrency(result.pricing.estimatedDealSize.min)}–${formatCurrency(result.pricing.estimatedDealSize.max)}`,
    launchStrategy: result.launchStrategy.phases[0].name,
    timeToRevenue: result.launchStrategy.phases[0].duration,
    keyRisks: result.adoptionFriction.topBlockers.slice(0, 4),
    competitiveEdge: `${topDiffAxes[0].label} and ${topDiffAxes[1].label}`,
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
  };
}

export default function AIProductStrategyLabPage() {
  const router = useRouter();

  const [input, setInput] = useState<StrategyInput>({
    productId: 'customer_support_copilot',
    personaId: 'head_of_cx',
    bankSegment: 'regional_bank',
    deploymentModel: 'cloud',
    regulatoryEnvironment: 'us_federal',
    adoptionScale: 'department',
  });

  const [result, setResult] = useState<FullStrategyResult | null>(null);
  const [currentStep, setCurrentStep] = useState<StrategyStep>('problem');
  const [completedSteps, setCompletedSteps] = useState<Set<StrategyStep>>(new Set());
  const [view, setView] = useState<'steps' | 'canvas' | 'summary'>('steps');

  const handleGenerate = useCallback(() => {
    const problemDefinition = generateProblemDefinition(input);
    const productConcept = generateProductConcept(input);
    const marketPositioning = generateMarketPositioning(input);
    const pricing = generatePricingStrategy(input);
    const adoptionFriction = generateAdoptionFriction(input);
    const launchStrategy = generateLaunchStrategy(input);

    const partialResult = {
      problemDefinition,
      productConcept,
      marketPositioning,
      adoptionFriction,
      pricing,
      launchStrategy,
    };

    const executiveSummary = buildExecutiveSummary(input, partialResult);

    const fullResult: FullStrategyResult = {
      input,
      ...partialResult,
      executiveSummary,
      generatedAt: Date.now(),
    };

    setResult(fullResult);
    setCurrentStep('problem');
    setCompletedSteps(new Set(STRATEGY_STEPS.map(s => s.id)));
    setView('steps');
  }, [input]);

  const handleReset = useCallback(() => {
    setResult(null);
    setCompletedSteps(new Set());
    setCurrentStep('problem');
    setView('steps');
  }, []);

  const handleStepClick = useCallback((step: StrategyStep) => {
    setCurrentStep(step);
    setView('steps');
  }, []);

  const currentStepIndex = STRATEGY_STEPS.findIndex(s => s.id === currentStep);
  const canGoNext = currentStepIndex < STRATEGY_STEPS.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const handleNext = useCallback(() => {
    if (canGoNext) setCurrentStep(STRATEGY_STEPS[currentStepIndex + 1].id);
  }, [canGoNext, currentStepIndex]);

  const handlePrev = useCallback(() => {
    if (canGoPrev) setCurrentStep(STRATEGY_STEPS[currentStepIndex - 1].id);
  }, [canGoPrev, currentStepIndex]);

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(30,41,59,0.6)',
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(109,40,217,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(109,40,217,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#6D28D9' },
    },
    '& .MuiInputLabel-root': { color: '#64748B', fontSize: '0.8rem' },
    '& .MuiSelect-select': { color: '#E2E8F0', fontSize: '0.85rem' },
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0F172A 0%, #111827 100%)' }}>
      {/* Top Bar */}
      <Box
        sx={{
          px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'rgba(15,23,42,0.95)',
          borderBottom: '1px solid rgba(109,40,217,0.1)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 100,
        }}
      >
        <Tooltip title="Home">
          <IconButton onClick={() => router.push('/')} sx={{ color: '#94A3B8' }}>
            <HomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <ScienceIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#F1F5F9' }}>
          AI Product Strategy Lab
        </Typography>
        {result && (
          <Chip
            label={result.productConcept.name}
            size="small"
            sx={{
              background: 'rgba(109,40,217,0.12)',
              color: '#A78BFA',
              border: '1px solid rgba(109,40,217,0.2)',
              fontSize: '0.7rem',
            }}
          />
        )}

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          {result && (
            <>
              <Button
                size="small"
                variant={view === 'steps' ? 'contained' : 'outlined'}
                onClick={() => setView('steps')}
                sx={{
                  fontSize: '0.7rem', py: 0.5,
                  ...(view === 'steps' ? {} : {
                    borderColor: 'rgba(109,40,217,0.2)', color: '#94A3B8',
                  }),
                }}
              >
                Steps
              </Button>
              <Button
                size="small"
                variant={view === 'canvas' ? 'contained' : 'outlined'}
                onClick={() => setView('canvas')}
                startIcon={<ViewQuiltIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: '0.7rem', py: 0.5,
                  ...(view === 'canvas' ? {} : {
                    borderColor: 'rgba(109,40,217,0.2)', color: '#94A3B8',
                  }),
                }}
              >
                Canvas
              </Button>
              <Button
                size="small"
                variant={view === 'summary' ? 'contained' : 'outlined'}
                onClick={() => setView('summary')}
                startIcon={<SummarizeIcon sx={{ fontSize: 14 }} />}
                sx={{
                  fontSize: '0.7rem', py: 0.5,
                  ...(view === 'summary' ? {} : {
                    borderColor: 'rgba(109,40,217,0.2)', color: '#94A3B8',
                  }),
                }}
              >
                Summary
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {/* Left Navigator */}
        <StrategyNavigator
          steps={STRATEGY_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          hasResult={!!result}
        />

        {/* Center Workspace */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px)' }}>
          <AnimatePresence mode="wait">
            {view === 'steps' && !result && (
              <motion.div
                key="config"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="overline"
                      sx={{ color: '#8B5CF6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                    >
                      Configuration
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
                      Define Your AI Product Strategy
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                      Configure the parameters below to generate a comprehensive product strategy.
                      Each selection shapes the analysis across all six strategy dimensions.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5, mb: 4 }}>
                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>AI Use Case</InputLabel>
                      <Select
                        value={input.productId}
                        label="AI Use Case"
                        onChange={e => setInput(p => ({ ...p, productId: e.target.value as ProductId }))}
                      >
                        {PRODUCT_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>Target Persona</InputLabel>
                      <Select
                        value={input.personaId}
                        label="Target Persona"
                        onChange={e => setInput(p => ({ ...p, personaId: e.target.value as PersonaId }))}
                      >
                        {PERSONA_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>Bank Segment</InputLabel>
                      <Select
                        value={input.bankSegment}
                        label="Bank Segment"
                        onChange={e => setInput(p => ({ ...p, bankSegment: e.target.value as BankSegment }))}
                      >
                        {SEGMENT_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>Deployment Model</InputLabel>
                      <Select
                        value={input.deploymentModel}
                        label="Deployment Model"
                        onChange={e => setInput(p => ({ ...p, deploymentModel: e.target.value as DeploymentModel }))}
                      >
                        {DEPLOYMENT_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>Regulatory Environment</InputLabel>
                      <Select
                        value={input.regulatoryEnvironment}
                        label="Regulatory Environment"
                        onChange={e => setInput(p => ({ ...p, regulatoryEnvironment: e.target.value as RegulatoryEnvironment }))}
                      >
                        {REGULATORY_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={selectSx}>
                      <InputLabel>Adoption Scale</InputLabel>
                      <Select
                        value={input.adoptionScale}
                        label="Adoption Scale"
                        onChange={e => setInput(p => ({ ...p, adoptionScale: e.target.value as AdoptionScale }))}
                      >
                        {SCALE_OPTIONS.map(o => (
                          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGenerate}
                      startIcon={<AutoAwesomeIcon />}
                      sx={{
                        px: 6, py: 1.5,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 100%)',
                        boxShadow: '0 4px 24px rgba(109,40,217,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7C3AED 0%, #60A5FA 100%)',
                          boxShadow: '0 8px 32px rgba(109,40,217,0.4)',
                        },
                      }}
                    >
                      Generate Strategy
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {view === 'steps' && result && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1 }}
              >
                <StrategyWorkspace currentStep={currentStep} result={result} />
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  px: 4, py: 2,
                  borderTop: '1px solid rgba(109,40,217,0.08)',
                }}>
                  <Button
                    size="small"
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    startIcon={<NavigateBeforeIcon />}
                    sx={{ color: '#94A3B8', '&.Mui-disabled': { color: '#334155' } }}
                  >
                    Previous
                  </Button>
                  <Typography sx={{ fontSize: '0.7rem', color: '#475569' }}>
                    Step {currentStepIndex + 1} of {STRATEGY_STEPS.length}
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    endIcon={<NavigateNextIcon />}
                    sx={{ color: '#94A3B8', '&.Mui-disabled': { color: '#334155' } }}
                  >
                    Next
                  </Button>
                </Box>
              </motion.div>
            )}

            {view === 'canvas' && result && (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ p: 4, maxWidth: 1100, mx: 'auto' }}>
                  <StrategyCanvas result={result} />
                </Box>
              </motion.div>
            )}

            {view === 'summary' && result && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
                  <ExecutiveSummary result={result} />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Right Panel - AI Insights */}
        <Box
          sx={{
            width: 300,
            minHeight: 'calc(100vh - 56px)',
            p: 3,
            background: 'rgba(15,23,42,0.6)',
            borderLeft: '1px solid rgba(109,40,217,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#8B5CF6', fontSize: 18 }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9' }}>
                AI Insights
              </Typography>
            </Box>

            {!result ? (
              <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(109,40,217,0.05)', border: '1px solid rgba(109,40,217,0.1)' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.5 }}>
                  Configure your parameters and generate a strategy to see AI-powered insights and recommendations.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <InsightCard
                  title="Strategy Score"
                  color="#2DD4BF"
                  content={
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#2DD4BF' }}>
                        {result.executiveSummary.compositeScore}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>out of 100</Typography>
                    </Box>
                  }
                />

                <InsightCard
                  title="Quick Stats"
                  color="#3B82F6"
                  content={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[
                        { label: 'Deal Size', value: result.executiveSummary.expectedDealSize },
                        { label: 'Revenue Model', value: result.pricing.modelName },
                        { label: 'Segment Fit', value: `${result.marketPositioning.targetSegmentFit}%` },
                        { label: 'Friction', value: `${result.adoptionFriction.overallFrictionScore}/100` },
                      ].map(s => (
                        <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{s.label}</Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: '#E2E8F0', fontWeight: 600 }}>{s.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  }
                />

                <InsightCard
                  title="Top Risks"
                  color="#EF4444"
                  content={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {result.adoptionFriction.topBlockers.slice(0, 3).map((b, i) => (
                        <Typography key={i} sx={{ fontSize: '0.68rem', color: '#CBD5E1', lineHeight: 1.3 }}>
                          • {b}
                        </Typography>
                      ))}
                    </Box>
                  }
                />

                <InsightCard
                  title="Recommended Actions"
                  color="#8B5CF6"
                  content={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {result.adoptionFriction.mitigationPriorities.slice(0, 3).map((m, i) => (
                        <Typography key={i} sx={{ fontSize: '0.68rem', color: '#CBD5E1', lineHeight: 1.3 }}>
                          {i + 1}. {m}
                        </Typography>
                      ))}
                    </Box>
                  }
                />

                <Divider sx={{ borderColor: 'rgba(109,40,217,0.08)' }} />

                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '0.7rem',
                    borderColor: 'rgba(109,40,217,0.2)',
                    color: '#94A3B8',
                    '&:hover': {
                      borderColor: 'rgba(109,40,217,0.4)',
                      background: 'rgba(109,40,217,0.05)',
                    },
                  }}
                >
                  New Strategy
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function InsightCard({
  title, color, content,
}: {
  title: string;
  color: string;
  content: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(color, 0.06)} 0%, rgba(30,41,59,0.4) 100%)`,
        border: `1px solid ${alpha(color, 0.12)}`,
      }}
    >
      <Typography sx={{
        fontSize: '0.6rem', fontWeight: 700, color,
        textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1,
      }}>
        {title}
      </Typography>
      {content}
    </Box>
  );
}
