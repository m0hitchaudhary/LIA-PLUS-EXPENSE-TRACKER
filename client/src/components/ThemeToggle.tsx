import React from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  sx?: object;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ sx = {} }) => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleTheme} 
      color="inherit"
      sx={{ 
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        },
        ...sx
      }}
    >
      {mode === 'dark' ? (
        <DarkModeIcon sx={{ color: '#90caf9', fontSize: '1.5rem' }} />
      ) : (
        <LightModeIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
      )}
    </IconButton>
  );
};

export default ThemeToggle; 