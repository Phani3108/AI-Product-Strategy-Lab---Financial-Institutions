'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6D28D9', light: '#8B5CF6', dark: '#4C1D95' },
    secondary: { main: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8' },
    background: { default: '#0F172A', paper: '#1E293B' },
    text: { primary: '#F1F5F9', secondary: '#94A3B8' },
    success: { main: '#2DD4BF' },
    warning: { main: '#F59E0B' },
    error: { main: '#EC4899' },
    info: { main: '#3B82F6' },
  },
  typography: {
    fontFamily: '"Google Sans", "Inter", "Roboto", "Helvetica Neue", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9' },
    h4: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em', color: '#F1F5F9' },
    h5: { fontWeight: 600, fontSize: '1.25rem', color: '#F1F5F9' },
    h6: { fontWeight: 600, fontSize: '1.1rem', color: '#F1F5F9' },
    subtitle1: { fontWeight: 600, color: '#E2E8F0' },
    body1: { color: '#CBD5E1' },
    body2: { color: '#94A3B8' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          borderRadius: 16,
          border: '1px solid rgba(109,40,217,0.15)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6D28D9 0%, #3B82F6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED 0%, #60A5FA 100%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
