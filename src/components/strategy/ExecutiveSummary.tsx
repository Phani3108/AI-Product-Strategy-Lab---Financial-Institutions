'use client';
import React from 'react';
import { Box, Typography, alpha, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import SummarizeIcon from '@mui/icons-material/Summarize';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StarIcon from '@mui/icons-material/Star';
import type { FullStrategyResult } from '@/lib/strategy/types';

const _summaryProvenanceKey = 'akapuraM inahP'.split('').reverse().join('');
void _summaryProvenanceKey;

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

interface ExecutiveSummaryProps {
  result: FullStrategyResult;
}

export default function ExecutiveSummary({ result }: ExecutiveSummaryProps) {
  const { executiveSummary: summary, pricing, launchStrategy, adoptionFriction } = result;

  const summaryItems = [
    { label: 'Product', value: summary.productName, color: '#8B5CF6' },
    { label: 'Target Buyer', value: summary.targetBuyer, color: '#3B82F6' },
    { label: 'Bank Segment', value: summary.bankSegment, color: '#2DD4BF' },
    { label: 'Revenue Model', value: summary.revenueModel, color: '#F59E0B' },
    { label: 'Expected Deal Size', value: summary.expectedDealSize, color: '#EC4899' },
    { label: 'Launch Strategy', value: summary.launchStrategy, color: '#60A5FA' },
    { label: 'Time to Revenue', value: summary.timeToRevenue, color: '#A78BFA' },
    { label: 'Competitive Edge', value: summary.competitiveEdge, color: '#2DD4BF' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(45,212,191,0.08) 100%)',
            border: '1px solid rgba(109,40,217,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{
            position: 'absolute', top: -40, right: -40,
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)',
          }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 2,
              background: 'linear-gradient(135deg, #6D28D9, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(109,40,217,0.3)',
            }}>
              <SummarizeIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Executive Summary
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {summary.productName} — Strategy Readout
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
                {summary.compositeScore}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>/100</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
            }}
          >
            {summaryItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(15,23,42,0.5)',
                    border: `1px solid ${alpha(item.color, 0.12)}`,
                  }}
                >
                  <Typography sx={{
                    fontSize: '0.6rem', color: item.color, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5,
                  }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', lineHeight: 1.3 }}>
                    {item.value}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2.5 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.5)',
              border: '1px solid rgba(45,212,191,0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUpIcon sx={{ color: '#2DD4BF', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#F1F5F9' }}>
                Revenue Trajectory
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {[
                { label: 'Year 1', value: pricing.revenueProjection.year1, color: '#6D28D9' },
                { label: 'Year 2', value: pricing.revenueProjection.year2, color: '#3B82F6' },
                { label: 'Year 3', value: pricing.revenueProjection.year3, color: '#2DD4BF' },
              ].map(y => (
                <Box key={y.label} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: y.color }}>
                    {formatCurrency(y.value)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>{y.label}</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(109,40,217,0.08)' }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748B', textTransform: 'uppercase' }}>Sales Motion</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 600 }}>
                  {launchStrategy.salesMotion.name}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748B', textTransform: 'uppercase' }}>Win Rate</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 600 }}>
                  {launchStrategy.salesMotion.winRate}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748B', textTransform: 'uppercase' }}>Time to Scale</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 600 }}>
                  {launchStrategy.totalTimeToScale}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.5)',
              border: '1px solid rgba(239,68,68,0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#F1F5F9' }}>
                Key Risks
              </Typography>
            </Box>
            {summary.keyRisks.map((risk, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%', mt: 0.7, flexShrink: 0,
                  background: '#EF4444',
                }} />
                <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                  {risk}
                </Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(109,40,217,0.08)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Friction Score</Typography>
              <Typography sx={{
                fontSize: '1.1rem', fontWeight: 700,
                color: adoptionFriction.overallFrictionScore >= 70 ? '#EF4444'
                  : adoptionFriction.overallFrictionScore >= 50 ? '#F59E0B' : '#2DD4BF',
              }}>
                {adoptionFriction.overallFrictionScore}/100
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2.5,
            background: 'rgba(30,41,59,0.4)',
            border: '1px solid rgba(109,40,217,0.08)',
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Key Milestones
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {launchStrategy.keyMilestones.map((ms, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Box
                  sx={{
                    minWidth: 220,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(109,40,217,0.05)',
                    border: '1px solid rgba(109,40,217,0.1)',
                  }}
                >
                  <Chip
                    label={`Month ${ms.month}`}
                    size="small"
                    sx={{
                      mb: 1, height: 20, fontSize: '0.6rem',
                      background: 'rgba(59,130,246,0.1)', color: '#60A5FA',
                    }}
                  />
                  <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                    {ms.milestone}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
