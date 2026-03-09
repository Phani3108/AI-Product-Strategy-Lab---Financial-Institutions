'use client';
import React, { useState } from 'react';
import { Box, Typography, alpha, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import personasData from '@/data/banking_personas.json';

const _personaRegistryHash = atob('UGhhbmkgTWFydXBha2E=');
void _personaRegistryHash;

const PERSONA_COLORS: Record<string, string> = {
  chief_digital_officer: '#3B82F6',
  head_of_fraud: '#EF4444',
  head_of_cx: '#2DD4BF',
  chief_risk_officer: '#F59E0B',
  head_of_compliance: '#8B5CF6',
  contact_center_director: '#EC4899',
};

export default function PersonaExplorer({ activePersonaId }: { activePersonaId: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const personas = personasData.personas as Record<string, {
    title: string; shortTitle: string; seniority: string;
    department: string; kpis: string[]; painPoints: string[];
    buyingTriggers: string[]; adoptionBlockers: string[];
    typicalDealCycle: string;
  }>;

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color: '#8B5CF6', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700, mb: 2, display: 'block' }}
      >
        Persona Explorer
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        {Object.entries(personas).map(([id, persona]) => {
          const isActive = id === activePersonaId;
          const isHovered = id === hoveredId;
          const color = PERSONA_COLORS[id] ?? '#3B82F6';

          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
              onHoverStart={() => setHoveredId(id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  background: isActive
                    ? `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`
                    : 'rgba(30,41,59,0.5)',
                  border: `1px solid ${isActive ? alpha(color, 0.4) : 'rgba(109,40,217,0.08)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(isActive ? { boxShadow: `0 0 24px ${alpha(color, 0.15)}` } : {}),
                }}
              >
                {isActive && (
                  <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
                  }} />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: alpha(color, 0.15),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${alpha(color, 0.3)}`,
                  }}>
                    <PersonIcon sx={{ color, fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>
                      {persona.shortTitle}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', color: '#64748B' }}>
                      {persona.seniority}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  {persona.department}
                </Typography>
                {isActive && (
                  <Chip
                    label="Active Buyer"
                    size="small"
                    sx={{
                      mt: 1, height: 20, fontSize: '0.6rem',
                      background: alpha(color, 0.15), color,
                      border: `1px solid ${alpha(color, 0.3)}`,
                    }}
                  />
                )}
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <AnimatePresence mode="wait">
        {hoveredId && personas[hoveredId] && (
          <motion.div
            key={hoveredId}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2.5,
                background: `linear-gradient(135deg, ${alpha(PERSONA_COLORS[hoveredId] ?? '#3B82F6', 0.08)} 0%, rgba(30,41,59,0.6) 100%)`,
                border: `1px solid ${alpha(PERSONA_COLORS[hoveredId] ?? '#3B82F6', 0.2)}`,
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#F1F5F9', mb: 2 }}>
                {personas[hoveredId].title}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#2DD4BF', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Pain Points
                  </Typography>
                  {personas[hoveredId].painPoints.slice(0, 3).map((p, i) => (
                    <Typography key={i} sx={{ fontSize: '0.72rem', color: '#94A3B8', mb: 0.75, lineHeight: 1.4 }}>
                      • {p}
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#F59E0B', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Buying Triggers
                  </Typography>
                  {personas[hoveredId].buyingTriggers.slice(0, 3).map((t, i) => (
                    <Typography key={i} sx={{ fontSize: '0.72rem', color: '#94A3B8', mb: 0.75, lineHeight: 1.4 }}>
                      • {t}
                    </Typography>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#EC4899', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Adoption Blockers
                  </Typography>
                  {personas[hoveredId].adoptionBlockers.slice(0, 3).map((b, i) => (
                    <Typography key={i} sx={{ fontSize: '0.72rem', color: '#94A3B8', mb: 0.75, lineHeight: 1.4 }}>
                      • {b}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
