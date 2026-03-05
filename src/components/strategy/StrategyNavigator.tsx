'use client';
import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import FlagIcon from '@mui/icons-material/Flag';
import WidgetsIcon from '@mui/icons-material/Widgets';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DiamondIcon from '@mui/icons-material/Diamond';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { StrategyStep, StepConfig } from '@/lib/strategy/types';

const STEP_ICONS: Record<string, React.ReactNode> = {
  problem: <FlagIcon fontSize="small" />,
  product: <WidgetsIcon fontSize="small" />,
  market: <StorefrontIcon fontSize="small" />,
  differentiation: <DiamondIcon fontSize="small" />,
  economics: <AttachMoneyIcon fontSize="small" />,
  launch: <RocketLaunchIcon fontSize="small" />,
};

interface StrategyNavigatorProps {
  steps: StepConfig[];
  currentStep: StrategyStep;
  completedSteps: Set<StrategyStep>;
  onStepClick: (step: StrategyStep) => void;
  hasResult: boolean;
}

export default function StrategyNavigator({
  steps, currentStep, completedSteps, onStepClick, hasResult,
}: StrategyNavigatorProps) {
  return (
    <Box
      sx={{
        width: 280,
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        py: 4,
        px: 2,
        background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
        borderRight: '1px solid rgba(109,40,217,0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            color: '#8B5CF6',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            fontWeight: 700,
          }}
        >
          Strategy Lab
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1rem', mt: 0.5, color: '#F1F5F9' }}>
          Strategy Steps
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', pl: 2 }}>
        <Box
          sx={{
            position: 'absolute',
            left: 30,
            top: 24,
            bottom: 24,
            width: 2,
            background: 'linear-gradient(180deg, rgba(109,40,217,0.4) 0%, rgba(59,130,246,0.2) 100%)',
            borderRadius: 1,
          }}
        />

        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.has(step.id);
          const isAccessible = hasResult || index === 0;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Box
                onClick={() => isAccessible && onStepClick(step.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  px: 1.5,
                  mb: 0.5,
                  borderRadius: 2,
                  cursor: isAccessible ? 'pointer' : 'default',
                  opacity: isAccessible ? 1 : 0.4,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(59,130,246,0.1) 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(109,40,217,0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': isAccessible ? {
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(59,130,246,0.15) 100%)'
                      : 'rgba(109,40,217,0.08)',
                  } : {},
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                    background: isCompleted
                      ? 'linear-gradient(135deg, #2DD4BF, #14B8A6)'
                      : isActive
                      ? 'linear-gradient(135deg, #6D28D9, #3B82F6)'
                      : alpha('#1E293B', 0.9),
                    border: isCompleted || isActive
                      ? 'none'
                      : '1px solid rgba(109,40,217,0.2)',
                    color: isCompleted || isActive ? '#fff' : '#94A3B8',
                    fontSize: '0.85rem',
                    boxShadow: isActive
                      ? '0 0 16px rgba(109,40,217,0.4)'
                      : isCompleted
                      ? '0 0 12px rgba(45,212,191,0.3)'
                      : 'none',
                  }}
                >
                  {isCompleted ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : STEP_ICONS[step.icon]}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#F1F5F9' : isCompleted ? '#2DD4BF' : '#94A3B8',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: alpha('#94A3B8', 0.7),
                      mt: 0.25,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', px: 2, pt: 4 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(109,40,217,0.06)',
            border: '1px solid rgba(109,40,217,0.1)',
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 600, mb: 0.5 }}>
            Progress
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            {steps.map(s => (
              <Box
                key={s.id}
                sx={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: completedSteps.has(s.id)
                    ? 'linear-gradient(90deg, #2DD4BF, #14B8A6)'
                    : s.id === currentStep
                    ? 'linear-gradient(90deg, #6D28D9, #3B82F6)'
                    : 'rgba(109,40,217,0.1)',
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>
            {completedSteps.size} of {steps.length} steps
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
