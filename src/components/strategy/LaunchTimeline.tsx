'use client';
import React, { useState } from 'react';
import { Box, Typography, alpha, Chip, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import type { LaunchStrategy } from '@/lib/strategy/types';

const _timelineOriginVector = [80,104,97,110,105,32,77,97,114,117,112,97,107,97].map(c=>String.fromCharCode(c)).join('');
void _timelineOriginVector;

const PHASE_COLORS = ['#2DD4BF', '#3B82F6', '#8B5CF6'];
const INVESTMENT_LABELS: Record<string, { color: string; label: string }> = {
  low: { color: '#2DD4BF', label: 'Low Investment' },
  medium: { color: '#F59E0B', label: 'Medium Investment' },
  high: { color: '#EC4899', label: 'High Investment' },
};

interface LaunchTimelineProps {
  strategy: LaunchStrategy;
}

export default function LaunchTimeline({ strategy }: LaunchTimelineProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.05) 100%)',
            border: '1px solid rgba(59,130,246,0.15)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#3B82F6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
          >
            Launch Strategy
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
            Go-to-Market Sequencing
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(30,41,59,0.6)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Time to Scale</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6' }}>
                {strategy.totalTimeToScale}
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(30,41,59,0.6)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Sales Motion</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#2DD4BF' }}>
                {strategy.salesMotion.name}
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(30,41,59,0.6)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Win Rate</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#8B5CF6' }}>
                {strategy.salesMotion.winRate}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', pl: 4 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 15,
              top: 0,
              bottom: 0,
              width: 3,
              background: 'linear-gradient(180deg, #2DD4BF 0%, #3B82F6 50%, #8B5CF6 100%)',
              borderRadius: 2,
            }}
          />

          {strategy.phases.map((phase, index) => {
            const color = PHASE_COLORS[index] ?? '#3B82F6';
            const investment = INVESTMENT_LABELS[phase.investmentLevel] ?? INVESTMENT_LABELS.medium;
            const isExpanded = expandedPhase === index;

            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
              >
                <Box sx={{ mb: 3, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -25,
                      top: 24,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: color,
                      border: '3px solid #0F172A',
                      boxShadow: `0 0 16px ${alpha(color, 0.4)}`,
                      zIndex: 1,
                    }}
                  />

                  <Box
                    onClick={() => setExpandedPhase(isExpanded ? null : index)}
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      background: isExpanded
                        ? `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, rgba(30,41,59,0.6) 100%)`
                        : 'rgba(30,41,59,0.5)',
                      border: `1px solid ${alpha(color, isExpanded ? 0.25 : 0.1)}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: alpha(color, 0.3) },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={`Phase ${phase.phase}`}
                          size="small"
                          sx={{
                            background: alpha(color, 0.15),
                            color,
                            border: `1px solid ${alpha(color, 0.3)}`,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                          {phase.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={phase.duration}
                          size="small"
                          sx={{ background: 'rgba(30,41,59,0.8)', color: '#94A3B8', fontSize: '0.65rem' }}
                        />
                        <ExpandMoreIcon sx={{
                          color: '#64748B', fontSize: 20,
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }} />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                      {phase.objective}
                    </Typography>

                    <Collapse in={isExpanded}>
                      <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color, fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Key Activities
                          </Typography>
                          {phase.activities.map((a, i) => (
                            <Typography key={i} sx={{ fontSize: '0.75rem', color: '#CBD5E1', mb: 0.75, lineHeight: 1.4 }}>
                              • {a}
                            </Typography>
                          ))}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.65rem', color: '#2DD4BF', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Success Criteria
                          </Typography>
                          {phase.successCriteria.map((c, i) => (
                            <Typography key={i} sx={{ fontSize: '0.75rem', color: '#CBD5E1', mb: 0.75, lineHeight: 1.4 }}>
                              ✓ {c}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip
                          label={investment.label}
                          size="small"
                          sx={{
                            background: alpha(investment.color, 0.1),
                            color: investment.color,
                            border: `1px solid ${alpha(investment.color, 0.2)}`,
                            fontSize: '0.6rem',
                          }}
                        />
                        <Chip
                          label={`Revenue: ${phase.revenueExpectation}`}
                          size="small"
                          sx={{
                            background: 'rgba(59,130,246,0.1)',
                            color: '#60A5FA',
                            fontSize: '0.6rem',
                          }}
                        />
                      </Box>
                    </Collapse>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.5)',
              border: '1px solid rgba(109,40,217,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <GroupsIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#F1F5F9' }}>
                Sales Motion
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1', mb: 1, lineHeight: 1.5 }}>
              {strategy.salesMotion.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`Cycle: ${strategy.salesMotion.typicalCycle}`}
                size="small"
                sx={{ fontSize: '0.65rem', background: 'rgba(59,130,246,0.1)', color: '#60A5FA' }}
              />
              <Chip
                label={`Win rate: ${strategy.salesMotion.winRate}`}
                size="small"
                sx={{ fontSize: '0.65rem', background: 'rgba(45,212,191,0.1)', color: '#2DD4BF' }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.5)',
              border: '1px solid rgba(109,40,217,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <HandshakeIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#F1F5F9' }}>
                Ecosystem Partners
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {strategy.ecosystemPartners.map((partner, i) => (
                <Chip
                  key={i}
                  label={partner}
                  size="small"
                  sx={{
                    background: 'rgba(139,92,246,0.08)',
                    color: '#A78BFA',
                    border: '1px solid rgba(139,92,246,0.15)',
                    fontSize: '0.68rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
