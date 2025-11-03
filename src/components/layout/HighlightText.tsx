import React, { ReactNode } from 'react';

interface HighlightTextProps {
  children: ReactNode;
  variant?: 'slant' | 'oval' | 'underline' | 'highlight' | 'dotted' | 'border' | 'glow' | 'double-underline' | 'fancy-slant';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gradient' | 'orange';
  className?: string;
}

const HighlightText = ({ 
  children, 
  variant = 'slant', 
  color = 'primary',
  className = ''
}: HighlightTextProps) => {
  // Définition des schémas de couleurs
  const colorSchemes = {
    primary: {
      bg: 'bg-blue-500',
      text: 'text-blue-800',
      light: 'bg-blue-100',
      border: 'border-blue-300',
      gradient: 'from-blue-500 to-blue-600',
      fullGradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    secondary: {
      bg: 'bg-purple-500',
      text: 'text-purple-800',
      light: 'bg-purple-100',
      border: 'border-purple-300',
      gradient: 'from-purple-500 to-purple-600',
      fullGradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    success: {
      bg: 'bg-green-500',
      text: 'text-green-800',
      light: 'bg-green-100',
      border: 'border-green-300',
      gradient: 'from-green-500 to-green-600',
      fullGradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    danger: {
      bg: 'bg-red-500',
      text: 'text-red-800',
      light: 'bg-red-100',
      border: 'border-red-300',
      gradient: 'from-red-500 to-red-600',
      fullGradient: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-800',
      light: 'bg-yellow-100',
      border: 'border-yellow-300',
      gradient: 'from-yellow-500 to-yellow-600',
      fullGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    },
    orange:{
        bg: 'bg-orange-500',
        text: 'text-orange-800',
        light: 'bg-orange-100',
        border: 'border-orange-300',
        gradient: 'from-orange-500 to-orange-600',
        fullGradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    gradient: {
      bg: 'bg-gradient-to-r from-[#ffa08f] to-[#ff6f61]',
      text: 'text-transparent bg-clip-text',
      light: 'bg-gradient-to-r from-[#ffa08f] to-[#ff6f61]',
      border: 'border-transparent',
      gradient: 'from-[#ffa08f] to-[#ff6f61]',
      fullGradient: 'bg-gradient-to-r from-[#ffa08f] to-[#ff6f61]'
    }
  };

  const colors = colorSchemes[color];

  // Définition des styles de base
  const baseStyles = {
    slant: `relative inline-block before:absolute before:-bottom-1 before:left-0 before:w-full before:h-3 ${colors.bg} before:transform before:-skew-y-2 before:z-0 before:rounded-sm`,
    oval: `px-2 py-1 ${colors.light} ${colors.text} rounded-full ${colors.border}`,
    underline: `underline decoration-${colors.gradient.split(' ')[0]} decoration-wavy decoration-2 underline-offset-4`,
    highlight: `px-1 ${colors.light} ${colors.text} rounded-sm`,
    dotted: `border-b-2 ${colors.border} border-dotted pb-1`,
    border: `px-2 py-1 ${colors.border} border-2 rounded-lg ${colors.text}`,
    glow: `px-2 py-1 ${colors.text} drop-shadow-[0_2px_4px_${colors.gradient.split(' ')[0].replace('from-', '')}]`,
    'double-underline': `relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 ${colors.bg} after:transform after:scale-x-100 after:origin-bottom-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-0`,
    'fancy-slant': 'relative inline-block'
  };

  return (
    <span className={`${baseStyles[variant]} ${className}`}>
      <span className="relative z-20">{children}</span>
      {variant === 'fancy-slant' && (
        <span 
          className={`absolute -bottom-2 left-0 w-full h-2 ${colors.fullGradient} transform -skew-y-2 rounded-md z-10`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

export default HighlightText;