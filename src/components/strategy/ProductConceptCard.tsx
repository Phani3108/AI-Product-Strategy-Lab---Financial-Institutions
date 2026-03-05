'use client';
import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { ProductConcept, ProblemDefinition } from '@/lib/strategy/types';

interface ProductConceptCardProps {
  concept: ProductConcept;
  problemDef: ProblemDefinition;
}

export default function ProductConceptCard({ concept, problemDef }: ProductConceptCardProps) {
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
            background: 'linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(59,130,246,0.08) 100%)',
            border: '1px solid rgba(109,40,217,0.2)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#8B5CF6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
          >
            Product Concept
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
            {concept.name}
          </Typography>
          <Typography sx={{ color: '#2DD4BF', fontSize: '1rem', fontWeight: 500, mb: 2 }}>
            {concept.tagline}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7, maxWidth: 700 }}>
            {concept.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            <Chip
              label={concept.marketMaturity.replace(/_/g, ' ')}
              size="small"
              sx={{
                background: 'rgba(45,212,191,0.15)',
                color: '#2DD4BF',
                border: '1px solid rgba(45,212,191,0.3)',
                textTransform: 'capitalize',
              }}
            />
            <Chip
              label={`${concept.competitiveIntensity} competition`}
              size="small"
              sx={{
                background: concept.competitiveIntensity === 'high'
                  ? 'rgba(236,72,153,0.15)' : 'rgba(245,158,11,0.15)',
                color: concept.competitiveIntensity === 'high' ? '#EC4899' : '#F59E0B',
                border: `1px solid ${concept.competitiveIntensity === 'high'
                  ? 'rgba(236,72,153,0.3)' : 'rgba(245,158,11,0.3)'}`,
                textTransform: 'capitalize',
              }}
            />
            <Chip
              label={concept.deploymentPattern}
              size="small"
              sx={{
                background: 'rgba(59,130,246,0.15)',
                color: '#60A5FA',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Box
              className="glow-card"
              sx={{
                p: 3,
                borderRadius: 2.5,
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(109,40,217,0.1)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningAmberIcon sx={{ color: '#EC4899', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                  Problems Solved
                </Typography>
              </Box>
              {concept.problemSolved.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%', mt: 0.8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                  }} />
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{p}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Box
              className="glow-card"
              sx={{
                p: 3,
                borderRadius: 2.5,
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(109,40,217,0.1)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PsychologyIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                  AI Capabilities
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {concept.aiCapabilities.map((cap, i) => (
                  <Chip
                    key={i}
                    label={cap}
                    size="small"
                    sx={{
                      background: alpha('#3B82F6', 0.1),
                      color: '#60A5FA',
                      border: `1px solid ${alpha('#3B82F6', 0.2)}`,
                      fontSize: '0.72rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Box
              className="glow-card"
              sx={{
                p: 3,
                borderRadius: 2.5,
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(109,40,217,0.1)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <IntegrationInstructionsIcon sx={{ color: '#2DD4BF', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                  Integration Requirements
                </Typography>
              </Box>
              {concept.integrationRequirements.map((req, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%', mt: 0.8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #2DD4BF, #14B8A6)',
                  }} />
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{req}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Box
              className="glow-card"
              sx={{
                p: 3,
                borderRadius: 2.5,
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(109,40,217,0.1)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                  Timeline
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[
                  { label: 'Pilot', months: concept.typicalTimeline.pilot, color: '#2DD4BF' },
                  { label: 'Rollout', months: concept.typicalTimeline.rollout, color: '#3B82F6' },
                  { label: 'Scale', months: concept.typicalTimeline.scale, color: '#8B5CF6' },
                ].map(item => (
                  <Box key={item.label} sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>
                      {item.months}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.label} (mo)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2.5,
            background: 'rgba(30,41,59,0.4)',
            border: '1px solid rgba(109,40,217,0.08)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#F1F5F9', mb: 1.5 }}>
            Target Persona: {problemDef.targetPersona.title}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                KPIs
              </Typography>
              {problemDef.targetPersona.kpis.map((kpi, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 0.5, fontSize: '0.8rem' }}>
                  • {kpi}
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: '#EC4899', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pain Points
              </Typography>
              {problemDef.targetPersona.painPoints.map((pp, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 0.5, fontSize: '0.8rem' }}>
                  • {pp}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
