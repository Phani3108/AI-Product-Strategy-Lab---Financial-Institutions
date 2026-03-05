'use client';
import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ScienceIcon from '@mui/icons-material/Science';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ShieldIcon from '@mui/icons-material/Shield';

const FEATURES = [
  { icon: <WidgetsIcon />, title: 'Product Concept Engine', description: 'Define AI product archetypes tailored for banking use cases with deployment-aware timelines' },
  { icon: <DiamondIcon />, title: 'Differentiation Radar', description: 'Visualize competitive positioning across security, latency, AI capability, and compliance axes' },
  { icon: <ShieldIcon />, title: 'Friction Heatmap', description: 'Map adoption risks by severity across technical, regulatory, and organizational dimensions' },
  { icon: <TrendingUpIcon />, title: 'Revenue Modeling', description: 'Generate pricing strategies and 3-year revenue projections calibrated by bank segment' },
  { icon: <RocketLaunchIcon />, title: 'Launch Sequencing', description: 'Plan phased GTM strategy from design partners to enterprise scale with milestone tracking' },
  { icon: <ScienceIcon />, title: 'Strategy Canvas', description: 'Visual board synthesizing problem, customer, solution, differentiation, revenue, and launch' },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <Box className="mesh-gradient-dark" sx={{ minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: 0.75, borderRadius: 2, mb: 3,
              background: 'rgba(109,40,217,0.1)',
              border: '1px solid rgba(109,40,217,0.2)',
            }}>
              <ScienceIcon sx={{ color: '#8B5CF6', fontSize: 16 }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Enterprise GenAI Strategy Console
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              <Box component="span" className="gradient-text">
                AI Product Strategy Lab
              </Box>
              <br />
              <Box component="span" sx={{ color: '#94A3B8', fontSize: '0.6em', fontWeight: 500 }}>
                for Financial Institutions
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 650,
                mx: 'auto',
                color: '#94A3B8',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              Design, evaluate, and launch AI products for banking.
              Work through a structured strategy lab that produces defensible
              product definitions, differentiation strategies, and go-to-market plans.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/ai-product-strategy-lab')}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 100%)',
                boxShadow: '0 4px 24px rgba(109,40,217,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #60A5FA 100%)',
                  boxShadow: '0 8px 32px rgba(109,40,217,0.4)',
                },
              }}
              endIcon={<RocketLaunchIcon />}
            >
              Open Strategy Lab
            </Button>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 8,
          }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Box
                className="glow-card"
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  height: '100%',
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(109,40,217,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '1px solid rgba(109,40,217,0.25)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(109,40,217,0.15), rgba(59,130,246,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 2,
                  color: '#8B5CF6',
                }}>
                  {React.cloneElement(feature.icon as React.ReactElement<{ fontSize?: string }>, { fontSize: 'small' })}
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#F1F5F9' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Part of the Enterprise GenAI Strategy Console for Financial Institutions
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
