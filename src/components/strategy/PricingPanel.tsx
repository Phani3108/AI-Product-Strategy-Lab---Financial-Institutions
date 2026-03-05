'use client';
import React from 'react';
import { Box, Typography, alpha, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { PricingRecommendation } from '@/lib/strategy/types';

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount}`;
}

interface PricingPanelProps {
  pricing: PricingRecommendation;
}

export default function PricingPanel({ pricing }: PricingPanelProps) {
  const revenueData = [
    { year: 'Year 1', revenue: pricing.revenueProjection.year1 },
    { year: 'Year 2', revenue: pricing.revenueProjection.year2 },
    { year: 'Year 3', revenue: pricing.revenueProjection.year3 },
  ];

  const barColors = ['#6D28D9', '#3B82F6', '#2DD4BF'];

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
            background: 'linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(109,40,217,0.05) 100%)',
            border: '1px solid rgba(45,212,191,0.15)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#2DD4BF', letterSpacing: '0.12em', fontSize: '0.65rem', fontWeight: 700 }}
          >
            Revenue Model
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
            {pricing.modelName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7, maxWidth: 650 }}>
            {pricing.rationale}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { label: 'Min Deal', value: formatCurrency(pricing.estimatedDealSize.min), color: '#3B82F6' },
            { label: 'Typical Deal', value: formatCurrency(pricing.estimatedDealSize.typical), color: '#2DD4BF' },
            { label: 'Max Deal', value: formatCurrency(pricing.estimatedDealSize.max), color: '#8B5CF6' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  background: 'rgba(30,41,59,0.6)',
                  border: `1px solid ${alpha(item.color, 0.15)}`,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(30,41,59,0.5)',
            border: '1px solid rgba(109,40,217,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: '#2DD4BF', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: '#F1F5F9' }}>
              Revenue Projection
            </Typography>
          </Box>
          <Box sx={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,40,217,0.1)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  stroke="rgba(109,40,217,0.15)"
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  stroke="rgba(109,40,217,0.15)"
                  tickFormatter={(v: number) => formatCurrency(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1E293B',
                    border: '1px solid rgba(109,40,217,0.3)',
                    borderRadius: 8,
                    color: '#F1F5F9',
                    fontSize: 12,
                  }}
                  formatter={(value?: number) => [formatCurrency(value ?? 0), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {revenueData.map((_, index) => (
                    <Cell key={index} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          className="glow-card"
          sx={{
            p: 3,
            borderRadius: 2.5,
            background: 'rgba(30,41,59,0.5)',
            border: '1px solid rgba(109,40,217,0.1)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#F1F5F9', mb: 2 }}>
            Pricing Structure
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#8B5CF6', fontWeight: 700, mb: 0.5, textTransform: 'uppercase' }}>
                Base Price
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                {pricing.pricingDetails.basePrice}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: '#3B82F6', fontWeight: 700, mb: 0.5, textTransform: 'uppercase' }}>
                Usage Component
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                {pricing.pricingDetails.usageComponent}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '0.65rem', color: '#2DD4BF', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
              Add-ons
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {pricing.pricingDetails.addOns.map((addon, i) => (
                <Chip
                  key={i}
                  label={addon}
                  size="small"
                  sx={{
                    background: 'rgba(45,212,191,0.08)',
                    color: '#2DD4BF',
                    border: '1px solid rgba(45,212,191,0.2)',
                    fontSize: '0.7rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {pricing.alternativeModels.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              background: 'rgba(30,41,59,0.3)',
              border: '1px solid rgba(109,40,217,0.06)',
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Alternative Models
            </Typography>
            {pricing.alternativeModels.map((alt, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(109,40,217,0.03)' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>
                    {alt.modelName}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', mt: 0.25 }}>
                    {alt.tradeoff}
                  </Typography>
                </Box>
                <Box sx={{
                  px: 1.5, py: 0.5, borderRadius: 1.5,
                  background: alpha('#3B82F6', 0.1),
                  border: `1px solid ${alpha('#3B82F6', 0.2)}`,
                }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#60A5FA' }}>
                    {alt.fit}% fit
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
