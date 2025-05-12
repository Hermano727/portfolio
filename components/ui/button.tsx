import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  className,
  variant = 'default',
  size = 'md',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`rounded-md font-medium ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
