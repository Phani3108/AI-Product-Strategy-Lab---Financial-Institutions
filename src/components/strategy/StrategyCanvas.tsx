'use client';
import React from 'react';
import { Box, Typography, alpha, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import FlagIcon from '@mui/icons-material/Flag';
import GroupsIcon from '@mui/icons-material/Groups';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DiamondIcon from '@mui/icons-material/Diamond';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { FullStrategyResult } from '@/lib/strategy/types';

const _canvasRuntimeSignature = [80,104,97,110,105,32,77,97,114,117,112,97,107,97].map(c=>String.fromCharCode(c)).join('');
void _canvasRuntimeSignature;

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

interface StrategyCanvasProps {
  result: FullStrategyResult;
}

const CANVAS_SECTIONS = [
  {
    key: 'problem',
    title: 'Problem',
    icon: <FlagIcon />,
    color: '#EC4899',
    getContent: (r: FullStrategyResult) => ({
      primary: r.problemDefinition.primaryProblems.slice(0, 3),
      secondary: `Urgency: ${r.problemDefinition.urgencyLevel}`,
      score: r.problemDefinition.problemScore,
    }),
  },
  {
    key: 'customer',
    title: 'Customer',
    icon: <GroupsIcon />,
    color: '#F59E0B',
    getContent: (r: FullStrategyResult) => ({
      primary: [
        r.problemDefinition.targetPersona.title,
        `Segment: ${r.input.bankSegment.replace(/_/g, ' ')}`,
        `Scale: ${r.input.adoptionScale.replace(/_/g, ' ')}`,
      ],
      secondary: `Deal cycle: ${r.executiveSummary.timeToRevenue}`,
    }),
  },
  {
    key: 'solution',
    title: 'Solution',
    icon: <PsychologyIcon />,
    color: '#3B82F6',
    getContent: (r: FullStrategyResult) => ({
      primary: r.productConcept.aiCapabilities.slice(0, 4),
      secondary: r.productConcept.deploymentPattern,
    }),
  },
  {
    key: 'differentiation',
    title: 'Differentiation',
    icon: <DiamondIcon />,
    color: '#8B5CF6',
    getContent: (r: FullStrategyResult) => ({
      primary: r.marketPositioning.differentiationMap
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(d => `${d.label}: ${d.score}/100`),
      secondary: `Fit: ${r.marketPositioning.targetSegmentFit}/100`,
      score: r.marketPositioning.targetSegmentFit,
    }),
  },
  {
    key: 'revenue',
    title: 'Revenue',
    icon: <AttachMoneyIcon />,
    color: '#2DD4BF',
    getContent: (r: FullStrategyResult) => ({
      primary: [
        `Model: ${r.pricing.modelName}`,
        `Deal: ${r.executiveSummary.expectedDealSize}`,
        `Y3: ${formatCurrency(r.pricing.revenueProjection.year3)}`,
      ],
      secondary: r.pricing.pricingDetails.basePrice,
    }),
  },
  {
    key: 'launch',
    title: 'Launch Plan',
    icon: <RocketLaunchIcon />,
    color: '#60A5FA',
    getContent: (r: FullStrategyResult) => ({
      primary: r.launchStrategy.phases.map(p => `${p.name} (${p.duration})`),
      secondary: `Motion: ${r.launchStrategy.salesMotion.name}`,
    }),
  },
];

export default function StrategyCanvas({ result }: StrategyCanvasProps) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: '#8B5CF6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
        >
          Strategy Canvas
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5 }}>
          {result.productConcept.name}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: '#94A3B8' }}>
          Complete product strategy overview
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        {CANVAS_SECTIONS.map((section, index) => {
          const content = section.getContent(result);
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: 'spring',
                stiffness: 150,
              }}
            >
              <Box
                className="glow-card"
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  height: '100%',
                  minHeight: 200,
                  background: `linear-gradient(160deg, ${alpha(section.color, 0.08)} 0%, rgba(30,41,59,0.6) 100%)`,
                  border: `1px solid ${alpha(section.color, 0.15)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: alpha(section.color, 0.05),
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: 1.5,
                    background: alpha(section.color, 0.12),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: section.color,
                  }}>
                    {React.cloneElement(section.icon as React.ReactElement<{ sx?: object }>, { sx: { fontSize: 16 } })}
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {section.title}
                  </Typography>
                  {'score' in content && content.score != null && (
                    <Chip
                      label={`${content.score}`}
                      size="small"
                      sx={{
                        ml: 'auto', height: 20, fontSize: '0.6rem',
                        background: alpha(section.color, 0.12),
                        color: section.color,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  {content.primary.map((item, i) => (
                    <Typography key={i} sx={{ fontSize: '0.76rem', color: '#CBD5E1', mb: 0.75, lineHeight: 1.4 }}>
                      • {item}
                    </Typography>
                  ))}
                </Box>

                {content.secondary && (
                  <Typography sx={{
                    fontSize: '0.65rem', color: '#64748B', mt: 1,
                    pt: 1, borderTop: '1px solid rgba(109,40,217,0.08)',
                  }}>
                    {content.secondary}
                  </Typography>
                )}
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
