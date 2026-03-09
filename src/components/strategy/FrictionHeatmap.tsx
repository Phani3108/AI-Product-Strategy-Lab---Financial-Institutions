'use client';
import React, { useState } from 'react';
import { Box, Typography, alpha, Chip, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShieldIcon from '@mui/icons-material/Shield';
import type { AdoptionFrictionMap, FrictionFactor, FrictionSeverity } from '@/lib/strategy/types';

const _heatmapIntegrityToken = '\x50\x68\x61\x6e\x69\x20\x4d\x61\x72\x75\x70\x61\x6b\x61';
void _heatmapIntegrityToken;

const SEVERITY_COLORS: Record<FrictionSeverity, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#2DD4BF',
};

const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical',
  regulatory: 'Regulatory',
  organizational: 'Organizational',
  procurement: 'Procurement',
};

interface FrictionHeatmapProps {
  friction: AdoptionFrictionMap;
}

export default function FrictionHeatmap({ friction }: FrictionHeatmapProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped = friction.factors.reduce<Record<string, FrictionFactor[]>>((acc, f) => {
    (acc[f.category] = acc[f.category] || []).push(f);
    return acc;
  }, {});

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
            background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(109,40,217,0.05) 100%)',
            border: '1px solid rgba(236,72,153,0.15)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#EC4899', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
          >
            Adoption Friction Analysis
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
            Friction Heatmap
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Box sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(30,41,59,0.6)' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>Overall Friction</Typography>
              <Typography sx={{
                fontSize: '1.5rem', fontWeight: 700,
                color: friction.overallFrictionScore >= 70 ? '#EF4444'
                  : friction.overallFrictionScore >= 50 ? '#F59E0B' : '#2DD4BF',
              }}>
                {friction.overallFrictionScore}/100
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {(['critical', 'high', 'medium', 'low'] as FrictionSeverity[]).map(s => (
                <Chip
                  key={s}
                  label={`${s}: ${friction.factors.filter(f => f.severity === s).length}`}
                  size="small"
                  sx={{
                    background: alpha(SEVERITY_COLORS[s], 0.12),
                    color: SEVERITY_COLORS[s],
                    border: `1px solid ${alpha(SEVERITY_COLORS[s], 0.3)}`,
                    fontSize: '0.65rem',
                    textTransform: 'capitalize',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(30,41,59,0.5)',
            border: '1px solid rgba(109,40,217,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            {friction.factors.map((factor, i) => {
              const color = SEVERITY_COLORS[factor.severity];
              const size = 40 + (factor.severityScore / 100) * 40;
              return (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setExpandedId(expandedId === factor.id ? null : factor.id)}
                >
                  <Box
                    sx={{
                      width: size,
                      height: size,
                      borderRadius: 2,
                      background: alpha(color, 0.15),
                      border: `2px solid ${alpha(color, 0.4)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: expandedId === factor.id
                        ? `0 0 20px ${alpha(color, 0.3)}` : 'none',
                      '&:hover': {
                        boxShadow: `0 0 16px ${alpha(color, 0.25)}`,
                      },
                    }}
                    title={`${factor.label}: ${factor.severity}`}
                  >
                    <Typography sx={{ fontSize: '0.55rem', color, fontWeight: 700, textAlign: 'center', px: 0.5, lineHeight: 1.1 }}>
                      {factor.severityScore}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 2, justifyContent: 'center' }}>
            {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
              <Box key={sev} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 1, background: SEVERITY_COLORS[sev] }} />
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'capitalize' }}>
                  {sev}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {Object.entries(grouped).map(([category, factors]) => (
          <Box
            key={category}
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.4)',
              border: '1px solid rgba(109,40,217,0.08)',
            }}
          >
            <Typography sx={{
              fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700, mb: 2,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {CATEGORY_LABELS[category] ?? category} Friction
            </Typography>
            {factors.map((factor) => (
              <Box key={factor.id} sx={{ mb: 1.5 }}>
                <Box
                  onClick={() => setExpandedId(expandedId === factor.id ? null : factor.id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                    p: 1.5, borderRadius: 2,
                    '&:hover': { background: 'rgba(109,40,217,0.05)' },
                  }}
                >
                  <Box sx={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: SEVERITY_COLORS[factor.severity],
                    boxShadow: `0 0 8px ${alpha(SEVERITY_COLORS[factor.severity], 0.4)}`,
                    flexShrink: 0,
                  }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>
                      {factor.label}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 80, height: 6, borderRadius: 3,
                    background: 'rgba(109,40,217,0.1)', overflow: 'hidden',
                  }}>
                    <Box sx={{
                      width: `${factor.severityScore}%`, height: '100%', borderRadius: 3,
                      background: `linear-gradient(90deg, ${SEVERITY_COLORS[factor.severity]}, ${alpha(SEVERITY_COLORS[factor.severity], 0.5)})`,
                    }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: SEVERITY_COLORS[factor.severity], fontWeight: 600, width: 24, textAlign: 'right' }}>
                    {factor.severityScore}
                  </Typography>
                  <ExpandMoreIcon sx={{
                    color: '#64748B', fontSize: 18,
                    transform: expandedId === factor.id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }} />
                </Box>
                <Collapse in={expandedId === factor.id}>
                  <Box sx={{ pl: 4.5, pr: 2, pb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip label={factor.impactArea} size="small" sx={{
                        fontSize: '0.6rem', height: 20,
                        background: 'rgba(59,130,246,0.1)', color: '#60A5FA',
                      }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <ShieldIcon sx={{ color: '#2DD4BF', fontSize: 16, mt: 0.2 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.5 }}>
                        {factor.mitigation}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </motion.div>
  );
}
