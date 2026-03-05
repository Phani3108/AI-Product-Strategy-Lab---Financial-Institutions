'use client';
import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import ProductConceptCard from './ProductConceptCard';
import PersonaExplorer from './PersonaExplorer';
import DifferentiationRadar from './DifferentiationRadar';
import FrictionHeatmap from './FrictionHeatmap';
import PricingPanel from './PricingPanel';
import LaunchTimeline from './LaunchTimeline';
import StrategyCanvas from './StrategyCanvas';
import ExecutiveSummary from './ExecutiveSummary';
import type { StrategyStep, FullStrategyResult } from '@/lib/strategy/types';

interface StrategyWorkspaceProps {
  currentStep: StrategyStep;
  result: FullStrategyResult | null;
}

export default function StrategyWorkspace({ currentStep, result }: StrategyWorkspaceProps) {
  if (!result) {
    return (
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Configure parameters and generate strategy to see results
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: 4, maxWidth: 960 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          {currentStep === 'problem' && (
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#EC4899', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 1
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
                  Problem Definition
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 600, lineHeight: 1.7 }}>
                  {result.problemDefinition.marketContext}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  px: 2.5, py: 1.5, borderRadius: 2,
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(236,72,153,0.15)',
                }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>Problem Score</Typography>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: '#EC4899' }}>
                    {result.problemDefinition.problemScore}
                  </Typography>
                </Box>
                <Box sx={{
                  px: 2.5, py: 1.5, borderRadius: 2,
                  background: 'rgba(30,41,59,0.6)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>Urgency</Typography>
                  <Typography sx={{
                    fontSize: '1.1rem', fontWeight: 700, textTransform: 'capitalize',
                    color: result.problemDefinition.urgencyLevel === 'critical' ? '#EF4444'
                      : result.problemDefinition.urgencyLevel === 'high' ? '#F59E0B' : '#3B82F6',
                  }}>
                    {result.problemDefinition.urgencyLevel}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                p: 3, borderRadius: 2.5, mb: 3,
                background: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(109,40,217,0.1)',
              }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Primary Problems
                </Typography>
                {result.problemDefinition.primaryProblems.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, borderRadius: 2, background: 'rgba(109,40,217,0.03)' }}>
                      <Box sx={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${alpha('#EC4899', 0.2)}, ${alpha('#8B5CF6', 0.1)})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(236,72,153,0.2)',
                      }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#EC4899' }}>
                          {i + 1}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                        {p}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              <PersonaExplorer activePersonaId={result.input.personaId} />
            </Box>
          )}

          {currentStep === 'product' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#3B82F6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 2
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  Product Concept
                </Typography>
              </Box>
              <ProductConceptCard
                concept={result.productConcept}
                problemDef={result.problemDefinition}
              />
            </Box>
          )}

          {currentStep === 'market' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#8B5CF6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 3
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  Market Positioning
                </Typography>
              </Box>
              <DifferentiationRadar positioning={result.marketPositioning} />
            </Box>
          )}

          {currentStep === 'differentiation' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#EC4899', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 4
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  Adoption Friction & Differentiation
                </Typography>
              </Box>
              <FrictionHeatmap friction={result.adoptionFriction} />
            </Box>
          )}

          {currentStep === 'economics' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#2DD4BF', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 5
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  Pricing & Revenue Economics
                </Typography>
              </Box>
              <PricingPanel pricing={result.pricing} />
            </Box>
          )}

          {currentStep === 'launch' && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#3B82F6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  Step 6
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  Launch Strategy
                </Typography>
              </Box>
              <LaunchTimeline strategy={result.launchStrategy} />
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
